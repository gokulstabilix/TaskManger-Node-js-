import api from "./api";

/**
 * Chat Service
 * Handles communication with the chatbot API endpoint.
 *
 * POST /api/tasks/chat
 * Request:  { message: "your question here" }
 * Response: { status: "success", data: { reply: "bot answer" } }
 */
export const chatService = {
  /**
   * Send a message to the AI chatbot and get a reply.
   * @param {string} message - The user's message
   * @returns {Promise<string>} - The bot's reply text
   */
  sendMessage: async (message) => {
    const response = await api.post("/tasks/chat", { message });
    // Extract the reply from the nested response structure
    return response.data?.data?.reply || "Sorry, I couldn't process that.";
  },
};
