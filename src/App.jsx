import React, { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const backendURL = import.meta.env.VITE_BACKEND_URL

  const sendMessage = async () => {
    if (!input) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')

    try {
      const res = await fetch(`${backendURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Server error' }])
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial' }}>
      <h1>AI Marriage Health Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px', marginBottom: '10px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '5px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <b>{m.role === 'user' ? 'You' : 'Bot'}:</b> {m.content}
          </div>
        ))}
      </div>
      <input
        style={{ width: '80%', padding: '10px' }}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
      />
      <button style={{ padding: '10px 15px', marginLeft: '5px' }} onClick={sendMessage}>
        Send
      </button>
    </div>
  )
}

export default App