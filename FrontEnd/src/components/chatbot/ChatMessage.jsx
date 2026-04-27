import React from "react";
import { Bot, User } from "lucide-react";

/**
 * ChatMessage — A single chat bubble.
 *
 * Props:
 *  - role: "user" | "bot"   → determines alignment and color
 *  - text: string            → the message content
 *  - timestamp: string       → when the message was sent
 *
 * User messages appear on the right with a blue/purple gradient.
 * Bot messages appear on the left with a neutral background.
 */
export const ChatMessage = ({ role, text, timestamp }) => {
  const isUser = role === "user";

  return (
    <div className={`chat-message ${isUser ? "chat-message--user" : "chat-message--bot"}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="chat-avatar chat-avatar--bot">
          <Bot size={16} />
        </div>
      )}

      <div className={`chat-bubble ${isUser ? "chat-bubble--user" : "chat-bubble--bot"}`}>
        <p className="chat-bubble__text">{text}</p>
        {timestamp && (
          <span className="chat-bubble__time">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <div className="chat-avatar chat-avatar--user">
          <User size={16} />
        </div>
      )}
    </div>
  );
};
