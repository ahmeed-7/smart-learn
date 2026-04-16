// Use global fetch (Node 18+)

const chatWithAI = async (req, res) => {
  try {
    const { messages, context } = req.body;
    
    // Construct system prompt with context
    let contextStr = "Here is the user's current context:\n";
    if (context) {
        if (context.tasks) contextStr += `- Tasks: ${JSON.stringify(context.tasks)}\n`;
        if (context.exams) contextStr += `- Exams: ${JSON.stringify(context.exams)}\n`;
        if (context.plannerSessions) contextStr += `- Planner Sessions: ${JSON.stringify(context.plannerSessions)}\n`;
    }

    const systemPrompt = `You are "Student Assistant AI", an intelligent academic planning assistant for students.
${contextStr}
Help the student plan their studies, review tasks, manage time, and give advice based on their context.
Be concise, helpful, and encouraging. Answer directly and do not sound robotic.`;

    // Map roles: 'assistant' -> 'model', 'user' -> 'user'
    const apiMessages = (messages || []).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
       console.error("Missing GEMINI_API_KEY in .env");
       return res.status(500).json({ error: "Server is missing GEMINI_API_KEY in .env" });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: apiMessages,
        generationConfig: {
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
       const err = await response.json();
       console.error("Gemini Error:", err);
       return res.status(500).json({ error: "Failed to communicate with Gemini API" });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response generated.";
    
    return res.json({ reply: replyText });
  } catch (err) {
    console.error("Chat Controller Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { chatWithAI };
