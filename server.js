// Code Adapted from tutorial by intellisenseAI
// https://github.com/Abbas-Whoami/chatbot-openai
// Code Adapted from work by Margaret Zhou 

const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Replace 'your_openai_api_key' with your actual OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "Assets")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api", async (req, res) => {
  try {
    const { message} = req.body;
    const completion = await openai.chat.completions.create({
      
      // Replace with Chosen Open AI API Model
      model: "gpt-3.5-turbo-0125",
      
      // ChatGPT Settings [Replace with Custom Model]
      messages: [{
          role: "system",
          content: "You are a recipe generator that helps home cooks create recipes. Please format every recipe nicely like a recipe book.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
    
    const responseMessage = completion.choices[0].message.content;
    const jsonResponse = { response: responseMessage };

    res.json({ response: responseMessage});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
