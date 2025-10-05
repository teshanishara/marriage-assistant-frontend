import React, { useState, useRef, useEffect } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const messagesEndRef = useRef(null)

  // Scroll to the latest message automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const messageToSend = input
    setInput('')

    try {
      const res = await fetch(`${backendURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      })

      if (!res.ok) throw new Error(`Backend returned status ${res.status}`)
      const data = await res.json()

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Server error. Please try again.' }])
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Marriage Health Chatbot</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px', marginBottom: '10px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '5px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <b>{m.role === 'user' ? 'You' : 'Bot'}:</b> {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
