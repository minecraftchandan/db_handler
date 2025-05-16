const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { imageUrl } = JSON.parse(event.body);

    const openaiKey = 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;
    const prompt = `Look at this product image and respond with a JSON object: { "name": "...", "category": "..." }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 100
      })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `OpenAI API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify(parsed)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};
