import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import "./ChatBot.css";

/**
 * ChatBot — The top-level chatbot component.
 *
 * Renders:
 *  1. A floating action button (FAB) at the bottom-right corner.
 *  2. The ChatWindow when open (with slide-up animation).
 *
 * This component is placed inside Layout.jsx so it's visible on every page.
 */
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <div className="chatbot-container">
      {/* Chat Window — rendered conditionally with animation */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {/* Floating Action Button */}
      <button
        className={`chatbot-fab ${isOpen ? "chatbot-fab--active" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        id="chatbot-fab"
      >
        <span className={`chatbot-fab__icon ${isOpen ? "chatbot-fab__icon--close" : ""}`}>
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </span>

        {/* Pulse ring — visible only when chat is closed */}
        {!isOpen && <span className="chatbot-fab__pulse" aria-hidden="true" />}
      </button>
    </div>
  );
};
