const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'super-secret-key-for-study-assistant';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], subjects: [], logs: [] }, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const db = getDB();
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, university: '', specialty: '', goals: '' };
    db.users.push(newUser);
    saveDB(db);
    const token = jwt.sign({ id: newUser.id, email }, SECRET_KEY);
    res.json({ user: { id: newUser.id, name, email }, token });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email }, SECRET_KEY);
    res.json({ user: { id: user.id, name: user.name, email: user.email, university: user.university, specialty: user.specialty, goals: user.goals }, token });
});

app.get('/api/user/profile', authenticateToken, (req, res) => {
    const db = getDB();
    const user = db.users.find(u => u.id === req.user.id);
    res.json(user);
});

app.put('/api/user/profile', authenticateToken, (req, res) => {
    const db = getDB();
    const index = db.users.findIndex(u => u.id === req.user.id);
    db.users[index] = { ...db.users[index], ...req.body };
    saveDB(db);
    res.json(db.users[index]);
});

// Schedule
app.get('/api/schedule/subjects', authenticateToken, (req, res) => {
    const db = getDB();
    res.json(db.subjects.filter(s => s.userId === req.user.id));
});

app.post('/api/schedule/subjects', authenticateToken, (req, res) => {
    const db = getDB();
    const newSubject = { ...req.body, id: Date.now().toString(), userId: req.user.id };
    db.subjects.push(newSubject);
    saveDB(db);
    res.json(newSubject);
});

app.delete('/api/schedule/subjects/:id', authenticateToken, (req, res) => {
    const db = getDB();
    db.subjects = db.subjects.filter(s => s.id !== req.params.id);
    saveDB(db);
    res.sendStatus(200);
});

// Logs
app.get('/api/schedule/logs/:subjectId', authenticateToken, (req, res) => {
    const db = getDB();
    res.json(db.logs.filter(l => l.subjectId === req.params.subjectId));
});

app.post('/api/schedule/logs', authenticateToken, (req, res) => {
    const db = getDB();
    const newLog = { ...req.body, id: Date.now().toString(), userId: req.user.id };
    db.logs.push(newLog);
    saveDB(db);
    res.json(newLog);
});

// Weekend Tasks
app.get('/api/weekend/tasks', authenticateToken, (req, res) => {
    const db = getDB();
    const userTasks = db.weekendTasks?.filter(t => t.userId === req.user.id) || [];
    res.json(userTasks.length > 0 ? userTasks : [
        { id: '1', title: 'LinkedIn Profile Update', description: 'Add your latest projects and skills', xpPoints: 150, isCompleted: false, category: 'Career' },
        { id: '2', title: 'Technical Blog Post', description: 'Write about a challenge you solved', xpPoints: 200, isCompleted: false, category: 'Growth' },
        { id: '3', title: 'Networking', description: 'Connect with 5 professionals in your field', xpPoints: 100, isCompleted: false, category: 'Career' }
    ]);
});

app.post('/api/weekend/tasks/toggle', authenticateToken, (req, res) => {
    const { taskId } = req.body;
    const db = getDB();
    if (!db.weekendTasks) db.weekendTasks = [];
    let task = db.weekendTasks.find(t => t.id === taskId && t.userId === req.user.id);
    if (task) {
        task.isCompleted = !task.isCompleted;
    } else {
        // Mocking for now since we don't have a task creation UI
        db.weekendTasks.push({ id: taskId, userId: req.user.id, isCompleted: true });
    }
    saveDB(db);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Study Assistant Backend running on http://localhost:${PORT}`);
});
