// api/chat.js - Vercel Serverless Function

const SYSTEM_PROMPT = `You are the AI portfolio assistant for Madhur Kumar.
Answer questions strictly and only using the portfolio information provided below.
If a user asks about anything that is not in this information, politely decline and respond: "I can only answer questions about Madhur Kumar's portfolio, background, skills, and projects."

=== MADHUR KUMAR PORTFOLIO INFORMATION ===
1. Name: Madhur Kumar
2. Education: JECRC University, Computer Science Engineering (CSE), Class of 2025.
3. Skills: Python, HTML, CSS, JavaScript, Git, GitHub, Cursor AI.
4. Projects:
   - Python Programs Collection: A collection of core Python programs implementing fundamental concepts like Factorial, Fibonacci sequence, and Structure-to-Dictionary mappings. (GitHub: https://github.com/madhurk781-arch/madhur_python-programs)
   - Messy Python Code Improvement: A refactoring project where unorganized, messy Python scripts were restructured and modernized using AI assistance. (GitHub: https://github.com/madhurk781-arch/madhur_messy-code-improvement)
   - Bug Fixing Using Cursor AI: A practical debugging project demonstrating efficient detection and resolution of program bugs using Cursor AI. (GitHub: https://github.com/madhurk781-arch/bug-fixing-cursor)
   - Interactive Quiz Application: An engaging web-based quiz application built with HTML, CSS, and JavaScript that features dynamic scoring and interactive questions. (GitHub: https://github.com/madhurk781-arch/quiz-app, Live: https://madhur-quiz-app.vercel.app/)
   - Book Reading List Application: A web application built with HTML, CSS, and JavaScript designed to help users track reading progress and organize their books. (GitHub: https://github.com/madhurk781-arch, Live: https://madhur-quiz-app.vercel.app/)
5. Bug Fixed:
 - In the "Bug Fixing Using Cursor AI" project, a student utilities script had three bugs. First, the average function divided by the number of marks minus one instead of the number of marks, so the average of 80, 90 and 100 came out as 135 instead of 90, and a single mark caused a division by zero error. Second, the pass check used a strict greater than comparison instead of greater than or equal to, so a mark of exactly 40 was wrongly treated as failing. Third, the grade conditions were in the wrong order, so a score of 95 returned First instead of Distinction. The bugs were found using unit tests that failed first and passed after the fixes (9 tests).
   switching (dark/light mode), and robust chatbot error handling.
6. How Reading List Works:
   - The Book Reading List Application allows users to manage their reading journey by adding books, tracking their current reading status (such as unread, reading, or completed), updating their reading progress, and organizing their personal library directly via an intuitive web interface built using vanilla JavaScript, HTML, and CSS.
7. GitHub & Contact:
   - GitHub Profile: https://github.com/madhurk781-arch
   - Email: madhurk781@gmail.com
=========================================

Instructions:
- Always answer concisely and professionally based strictly on the portfolio information above.
- Do NOT make up or hallucinate details.
- If asked about topics outside of this portfolio, politely reply that you can only answer questions regarding Madhur Kumar's portfolio.`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Reject non-POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed. Only POST requests are supported.' });
  }

  // Validate API_KEY existence
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY not set' });
  }

  try {
    // Parse message from request body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_) {
        // use body as is
      }
    }

    const { message } = body || {};

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const model = process.env.API_MODEL || 'llama-3.1-8b-instant';

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ]
      })
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error(`Groq API error status: ${groqResponse.status}`, errorBody);
      return res.status(500).json({ error: 'Chat request failed' });
    }

    const data = await groqResponse.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('Groq API returned choices without message content:', data);
      return res.status(500).json({ error: 'Chat request failed' });
    }

    return res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    console.error('Error handling chat request:', err);
    return res.status(500).json({ error: 'Chat request failed' });
  }
}
