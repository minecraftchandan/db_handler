const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { imageUrl } = JSON.parse(event.body);

    if (!imageUrl) {
      return { statusCode: 400, body: "Missing imageUrl" };
    }

    const openaiKey = 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;
    const prompt = `Look at this product image and respond ONLY with a JSON object like this: { "name": "...", "category": "..." }`;

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

    const data = await response.json();

    // Log full response for debugging
    console.log("OpenAI response:", JSON.stringify(data, null, 2));

    // Parse safely
    if (!data.choices || !data.choices[0]?.message?.content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid response from OpenAI" })
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(data.choices[0].message.content);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to parse AI response", raw: data.choices[0].message.content })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};

