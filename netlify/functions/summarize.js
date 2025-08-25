// This is the code for /netlify/functions/summarize.js

exports.handler = async function(event) {
  // Get the article text from the request sent by the frontend
  const { prompt } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY; // Get the secret key from Netlify's settings

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const summaryText = data.candidates[0]?.content?.parts[0]?.text;

    // Send the summary back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ summary: summaryText })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};