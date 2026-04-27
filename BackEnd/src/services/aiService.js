const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.summarizeTasks = async (tasks) => {
  // Convert our database tasks into a simple string for the AI to read
  const taskListString = tasks
    .map((t) => `- ${t.title} (${t.isCompleted ? "Completed" : "Pending"})`)
    .join("\n");

  const prompt = `
    You are a professional productivity assistant. 
    Below is a list of tasks from a user's database. 
    Please provide a short, encouraging summary of their progress. 
    Mention how many are done, what is left, and give one tip for staying focused.

    Tasks:
    ${taskListString}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
