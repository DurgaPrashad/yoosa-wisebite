import { useState, useRef, useEffect } from 'react';
import { Send, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { chatWithHealthAI } from '../services/ai';
import { useAppContext } from '../context/AppContext';

export default function AIAssistant() {
  const { userData } = useAppContext();
  const [messages, setMessages] = useState([
    { role: 'model', text: `Hi ${userData?.gender === 'male' ? 'sir' : 'there'}, I'm your WiseBite Health AI. You can ask me about your diet, request a meal plan, or upload a photo of food to see if it fits your goals!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithHealthAI(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For a real app, convert to base64 and send to Gemini Vision.
      // Here we simulate the process for the chat UI.
      const fakeImageUrl = URL.createObjectURL(file);
      setMessages(prev => [...prev, { role: 'user', text: "Can I eat this?", image: fakeImageUrl }]);
      setLoading(true);
      
      setTimeout(() => {
        const diet = userData?.diet || 'Classic';
        const msg = `Based on your ${diet} diet and goal to ${userData?.goal || 'improve health'}, this looks like a decent choice! It appears to be high in protein, but watch out for the portion size to stay within your calorie limits.`;
        setMessages(prev => [...prev, { role: 'model', text: msg }]);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-color)' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>✨</span> Health AI
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Powered by Gemini</p>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}>
            {msg.role === 'model' && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', marginLeft: '12px' }}>WiseBite AI</div>
            )}
            <div style={{
              backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--card-bg)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px',
              border: msg.role === 'model' ? '1px solid var(--border-color)' : 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              {msg.image && <img src={msg.image} alt="Upload" style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />}
              <div style={{ lineHeight: '1.5', fontSize: '14px' }}>{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--card-bg)', padding: '12px 16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Loader2 size={16} className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'var(--text-secondary)', borderTopColor: 'transparent' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ padding: '12px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--primary-dark)', cursor: 'pointer', display: 'flex' }}
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..." 
            style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{ padding: '12px', borderRadius: '50%', border: 'none', backgroundColor: input.trim() ? 'var(--primary)' : 'var(--bg-color)', color: input.trim() ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
