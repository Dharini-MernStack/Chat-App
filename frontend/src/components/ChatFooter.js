import React, { useState, useRef } from 'react';

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'





const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const handleTyping = () => {
    // Emit 'typing' event through the WebSocket connection
    // to notify other users that the current user is typing
    socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
  };

  const handleBoldClick = () => {
    // get the current selection
    const selectionStart = inputRef.current.selectionStart;
    const selectionEnd = inputRef.current.selectionEnd;
    // wrap the selected text in **
    const newValue =
      message.slice(0, selectionStart) +
      '**' +
      message.slice(selectionStart, selectionEnd) +
      '**' +
      message.slice(selectionEnd);
    // update the message state
    setMessage(newValue);
  };

  const handleItalicClick = () => {
    // get the current selection
    const selectionStart = inputRef.current.selectionStart;
    const selectionEnd = inputRef.current.selectionEnd;
    // wrap the selected text in *
    const newValue =
      message.slice(0, selectionStart) +
      '*' +
      message.slice(selectionStart, selectionEnd) +
      '*' +
      message.slice(selectionEnd);
    // update the message state
    setMessage(newValue);
  };

  const handleStrikethroughClick = () => {
    // get the current selection
    const selectionStart = inputRef.current.selectionStart;
    const selectionEnd = inputRef.current.selectionEnd;
    // wrap the selected text in ~~
    const newValue =
      message.slice(0, selectionStart) +
      '~~' +
      message.slice(selectionStart, selectionEnd) +
      '~~' +
      message.slice(selectionEnd);
    // update the message state
    setMessage(newValue);
  };

  const handleHyperlinkClick = () => {
    // get the current selection
    const selectionStart = inputRef.current.selectionStart;
    const selectionEnd = inputRef.current.selectionEnd;
    // wrap the selected text in 
    const newValue =
      message.slice(0, selectionStart) +
      '' +
      message.slice(selectionStart, selectionEnd) +
      '' +
      message.slice(selectionEnd);
    // update the message state
    setMessage(newValue);
  }
  

  const handleEmojiClick = (emoji) => {
  // log the emoji object to the console
  console.log(emoji);

  // insert the selected emoji at the current cursor position
  const cursorPosition = inputRef.current.selectionStart;
  const newValue =
    message.slice(0, cursorPosition) + emoji.native + message.slice(cursorPosition);
  setMessage(newValue);
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    console.log(file)
  }
};


  const handleColorChange = (e) => {
    // wrap the selected text in <span style="color: #hex;"></span>
    const hexColor = e.target.value;
    const selectionStart = inputRef.current.selectionStart;
    const selectionEnd = inputRef.current.selectionEnd;
    const newValue =
      message.slice(0, selectionStart) +
      `<span style="color: ${hexColor};">` +
      message.slice(selectionStart, selectionEnd) +
      '</span>' +
      message.slice(selectionEnd);
    setMessage(newValue);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }

        setMessage("")
    }
    return (
      <div className="chat__footer">
        <div className="toolbar">
          <button onClick={handleBoldClick}>B</button>
          <button onClick={handleItalicClick}>I</button>
          <button onClick={handleStrikethroughClick}>
            <del>S</del>
          </button>
          <button onClick={handleHyperlinkClick}>🔗</button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
          {showEmojiPicker && (
            <Picker data={data}
              onSelect={handleEmojiClick}
              style={{ position: 'absolute', bottom: '20px', right: '20px' }}
            />
          )}
          <input type="file" onChange={handleFileChange} />
          <input type="color" onChange={handleColorChange} />
        </div>
        <form className="form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Write message"
            className="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            ref={inputRef}
          />
          <button className="sendBtn">SEND</button>
        </form>
      </div>
    );
  };
  
  export default ChatFooter;