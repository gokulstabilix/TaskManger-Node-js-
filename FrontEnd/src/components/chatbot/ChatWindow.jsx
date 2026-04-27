import React, { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { chatService } from "../../services/chatService";
import { ChatMessage } from "./ChatMessage";

/**
 * ChatWindow — The chat panel that slides up from the FAB.
 *
 * Features:
 *  - Chat history maintained in local state
 *  - Auto-scroll to latest message
 *  - Loading indicator (typing dots) while waiting for API
 *  - Error handling with retry
 *  - Quick-action suggestion chips
 *  - Welcome message on first open
 *
 * Props:
 *  - onClose: function to close the window
 */

// Quick-action suggestions the user can click instead of typing
const SUGGESTIONS = [
  "What should I prioritize today?",
  "Summarize my tasks",
  "Which tasks are overdue?",
];

// Helper: returns a short timestamp like "3:42 PM"
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export const ChatWindow = ({ onClose }) => {
  // Chat history: array of { id, role, text, timestamp }
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! 👋 I'm your TaskFlow assistant. Ask me anything about your tasks — like what to prioritize or a summary of your progress.",
      timestamp: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ref for auto-scrolling to the bottom
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Send a message to the chatbot API.
   * Adds the user message immediately, shows loading, then adds the bot reply.
   */
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // 1. Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call the API
      const reply = await chatService.sendMessage(trimmed);

      // 3. Add bot reply
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: reply,
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // 4. Handle API errors gracefully
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "⚠️ Sorry, I couldn't reach the server. Please check your connection and try again.",
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Show suggestions only when there's just the welcome message
  const showSuggestions = messages.length === 1;

  return (
    <div className="chat-window" role="dialog" aria-label="Chat with TaskFlow AI">
      {/* ── Header ── */}
      <div className="chat-window__header">
        <div className="chat-window__header-left">
          <div className="chat-window__avatar">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="chat-window__title">TaskFlow AI</h3>
            <span className="chat-window__status">
              {isLoading ? "Typing..." : "Online"}
            </span>
          </div>
        </div>
        <button
          className="chat-window__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="chat-window__messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            text={msg.text}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="chat-typing">
            <div className="chat-typing__dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Invisible element to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggestion Chips ── */}
      {showSuggestions && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="chat-suggestions__chip"
              onClick={() => sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <form className="chat-window__input-area" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chat-window__input"
          placeholder="Ask about your tasks..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Type a message"
        />
        <button
          type="submit"
          className="chat-window__send"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
