const WeekendChallenge = require('../models/WeekendChallenge');

exports.getChallenges = async (req, res) => {
    try {
        let challenges = await WeekendChallenge.find({ user: req.user._id });
        
        // If no challenges found, initialize default ones for the user
        if (challenges.length === 0) {
            const defaults = [
                { title: 'Resume Update', description: 'Add your latest projects and skills to your CV.', xpPoints: 50 },
                { title: 'Connect with 3 Professionals', description: 'Reach out on LinkedIn to peers in your field.', xpPoints: 30 },
                { title: 'Portfolio Project', description: 'Spend 2 hours building something that showcases your skills.', xpPoints: 100 },
                { title: 'Read Industry Blog', description: 'Read at least 2 articles about current trends.', xpPoints: 20 },
            ];
            const toInsert = defaults.map(d => ({ ...d, user: req.user._id }));
            challenges = await WeekendChallenge.insertMany(toInsert);
        }
        
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weekend challenges' });
    }
};

exports.toggleChallenge = async (req, res) => {
    try {
        const challenge = await WeekendChallenge.findOne({ _id: req.params.id, user: req.user._id });
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
        
        challenge.isCompleted = !challenge.isCompleted;
        await challenge.save();
        res.json(challenge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
