const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

exports.summarizeTasks = async (tasks) => {
  // Convert our database tasks into a simple string for the AI to read
  const taskListString = tasks
    .map((t) => `- ${t.title} (Priority: ${t.priority}, Status: ${t.isCompleted ? "Completed" : "Pending"})`)
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

exports.chatWithTasks = async (tasks, userMessage) => {
  const taskListString = tasks.map(t => 
    `- ${t.title} (Priority: ${t.priority}, Status: ${t.isCompleted ? 'Done' : 'Pending'}, ID: ${t._id})`
  ).join('\n');

  const prompt = `
    You are an AI Task Assistant. You have access to the user's task list below.
    
    User's Tasks:
    ${taskListString}

    User's Question: "${userMessage}"

    Instructions:
    - Answer the question based on the tasks provided.
    - If they ask what to do, suggest a 'Pending' task.
    - Be concise and helpful.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};