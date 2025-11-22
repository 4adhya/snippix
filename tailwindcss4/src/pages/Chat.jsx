import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: "user"
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="p-4 mt-20"> 
      <h1 className="text-xl font-semibold mb-4">Chat</h1>

      <div className="bg-gray-800 p-4 rounded-lg h-[60vh] overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400">Start the conversation</p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <div className="bg-gray-700 inline-block px-3 py-2 rounded-lg">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 bg-gray-700 rounded-lg outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
