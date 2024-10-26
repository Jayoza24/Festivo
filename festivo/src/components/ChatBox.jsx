import { useState } from "react";
import axios from "axios";
import "../styles/ChatboxStyle.css";
import icon from "../assets/chatbot_icon.png";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleChatbox = () => {
    setState(!state);
  };

  const handleSendMessage = async () => {
    if (inputValue === "") return;

    const userMessage = { name: "User", message: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: inputValue,
      });
      const botMessage = { name: "Sam", message: response.data.response };
      console.log(botMessage);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setInputValue("");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbox">
      <div className={`chatbox__support ${state ? "chatbox--active" : ""}`}>
        <div className="chatbox__header">
          <div className="chatbox__image--header">
            <img
              src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
              alt="chatbox avatar"
            />
          </div>
          <p className="chatbox__description--header">
            Hi. How can I help you?
          </p>
        </div>

        <div className="chatbox__messages">
          <div>
            {messages
              .slice()
              .reverse()
              .map((msg, index) => (
                <div
                  key={index}
                  className={`messages__item ${
                    msg.name === "Sam"
                      ? "messages__item--visitor"
                      : "messages__item--operator"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
          </div>
        </div>

        <div className="chatbox__footer">
          <input
            type="text"
            placeholder="Write a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button
            className="chatbox__send--footer send__button"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>

      <div className="chatbox__button">
        <button onClick={toggleChatbox}>
          <img src={icon} alt="chatbox icon" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
