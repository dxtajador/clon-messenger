import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { name, message });
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-messenger-background">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center w-96">
          <h2 className="text-2xl font-bold mb-4 text-messenger-dark">Messenger Chat</h2>
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full border p-2 rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-messenger-base hover:bg-messenger-dark text-white px-4 py-2 rounded"
            onClick={() => name.trim() && setJoined(true)}
          >
            Entrar al chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-messenger-background">
      <header className="bg-messenger-base text-white p-4 text-center text-xl font-semibold">
        Chat Grupal de Messenger
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl px-4 py-2 rounded-lg ${
              msg.name === name ? 'bg-messenger-base text-white self-end ml-auto' : 'bg-white text-black'
            }`}
          >
            <span className="block font-bold">{msg.name}</span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-2 border-t">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-messenger-base hover:bg-messenger-dark text-white px-4 rounded"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default App;
