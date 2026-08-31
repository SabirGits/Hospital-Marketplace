import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Modal from "./Modal";

const AUTO_REPLIES = [
  "Thanks for reaching out — could you share your symptoms or the reason for consultation?",
  "Got it. I'd recommend booking a slot so we can go over this in detail.",
  "You're welcome to book an appointment directly from my profile for a full consultation.",
];

export default function ChatModal({ open, onClose, doctor }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && doctor) {
      setMessages([{ from: "doctor", text: `Hi, this is ${doctor.name}'s assistant. How can I help you today?` }]);
    }
  }, [open, doctor]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const userMsg = { from: "patient", text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    const reply = AUTO_REPLIES[Math.min(messages.filter((m) => m.from === "patient").length, AUTO_REPLIES.length - 1)];
    setTimeout(() => setMessages((m) => [...m, { from: "doctor", text: reply }]), 600);
  };

  if (!doctor) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Chat with ${doctor.name}`}>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.from === "patient" ? "chat-bubble-me" : ""}`}>{m.text}</div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <input
            placeholder="Type a message…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="btn btn-primary btn-icon" onClick={send} aria-label="Send"><Send size={16} /></button>
        </div>
        <p className="text-muted" style={{ fontSize: "var(--fs-xs)", marginTop: 8 }}>Demo chat — connects to real messaging once the backend is live.</p>
      </div>
    </Modal>
  );
}
