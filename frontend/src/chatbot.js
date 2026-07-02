import React, { useState, useEffect } from 'react';
import blink from './images/blink.mp4';
import smile from './images/smile.mp4';
import tilt from './images/headtilt.mp4';
import tailsway from './images/tailswayloop.mp4';
import wiskerFix from './images/wiskerfix.mp4';

import './css/chatbot.css';
function ChatbotWidget() {

    const [isOpen, setIsOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const idleVideos = [blink, tailsway, wiskerFix];
    const hoverVideos = [smile, tilt];

    const [randomIdle, setRandomIdle] = useState(idleVideos[0]);

    useEffect(() => {
    const interval = setInterval(() => {
        setRandomIdle(idleVideos[Math.floor(Math.random() * idleVideos.length)]);
    }, 6000); 
    return () => clearInterval(interval);
    }, []);

    const [randomHover, setRandomHover] = useState(hoverVideos[0]);


    useEffect(() => {
    const interval = setInterval(() => {
        setRandomHover(hoverVideos[Math.floor(Math.random() * hoverVideos.length)]);
    }, 6000); 
    return () => clearInterval(interval);
    }, []);
    const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Bot Icon as video */}
      <div
        className="chatbot_icon"
        onClick={toggleChat}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video
          src={isHovering ? randomHover : randomIdle}
          autoPlay
          loop
          muted
          playsInline
          className="chatbot_video"
        />
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="chatbot_popup">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/LBn-jiAxX1zFQVnPDMYZ4"
            title="Chatbot"
            frameBorder="0"
            width="100%"
            height="100%"
          ></iframe>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
