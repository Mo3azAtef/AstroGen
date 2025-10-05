import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import knowledgeBase from '../data/knowledge-base.json';
import Header from '../components/Header';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      content: "Hello! I am AstroGen0.1, your AI guide through the cosmos of knowledge. I'm powered by advanced AI and trained on our comprehensive space research database.\n\nI can help you with:\n• Our 13 research categories\n• International Space Station (ISS) information\n• Space biology and microbiology\n• Radiation and microgravity effects\n• And much more!\n\nWhat would you like to explore today?",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const API_KEY = 'AIzaSyBMQI6cLQB3Tg4cN6bKXgbpYLnJxR5-P2s';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Function to prepare context from knowledge base
  const prepareKnowledgeContext = () => {
    let context = "You are AstroGen0.1, an AI assistant for a space research knowledge base. ";
    context += "You can ONLY answer questions based on the following information. ";
    context += "If a question is outside this scope, politely inform the user that you can only answer questions about the available space research topics.\n\n";
    
    context += `WEBSITE INFO:\n${knowledgeBase.general_info.description}\n`;
    context += `Total Categories: ${knowledgeBase.general_info.total_categories}\n`;
    context += `Total Articles: ${knowledgeBase.general_info.total_articles}\n`;
    context += `Data Source: ${knowledgeBase.general_info.data_source}\n\n`;
    
    context += "RESEARCH CATEGORIES:\n";
    knowledgeBase.categories.forEach(cat => {
      context += `- ${cat.name}: ${cat.description}. ${cat.details}\n`;
    });
    
    if (knowledgeBase.key_topics) {
      context += "\nKEY TOPICS:\n";
      Object.entries(knowledgeBase.key_topics).forEach(([topic, description]) => {
        context += `- ${topic.replace('_', ' ')}: ${description}\n`;
      });
    }
    
    context += "\nFREQUENTLY ASKED QUESTIONS:\n";
    knowledgeBase.faq.forEach(faq => {
      context += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    });
    
    context += "\nIMPORTANT: Only answer questions related to this space research knowledge base. ";
    context += "If asked about topics outside this scope, politely decline and redirect to available topics. ";
    context += "Be conversational, friendly, and provide detailed yet concise answers.";
    
    return context;
  };

  // Function to call Gemini API with knowledge base context
  const callGeminiWithContext = async (userMessage) => {
    setIsTyping(true);

    try {
      const context = prepareKnowledgeContext();
      const fullPrompt = `${context}\n\nUser Question: ${userMessage}\n\nProvide a helpful answer based ONLY on the knowledge base above. Keep your response concise and informative.`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      let responseText = "I'm sorry, I couldn't process that request.";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && 
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        responseText = data.candidates[0].content.parts[0].text;
      }

      return responseText;

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry, I encountered an error processing your request. Please try again.";
    } finally {
      setIsTyping(false);
    }
  };

  // Function to process user message
  const processMessage = async (message) => {
    const response = await callGeminiWithContext(message);
    return response;
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    const message = inputValue.trim();
    
    if (!message || isSending) return;

    // Add user message
    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setInputValue('');
    setIsSending(true);

    // Get bot response from knowledge base
    const botResponse = await processMessage(message);
    setMessages(prev => [...prev, { content: botResponse, isUser: false }]);
    
    setIsSending(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#0a0e17',
      backgroundImage: `
        radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 4px),
        radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 3px),
        radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 4px)
      `,
      backgroundSize: '550px 550px, 350px 350px, 250px 250px',
      backgroundPosition: '0 0, 40px 60px, 130px 270px'
    }}>
      <Header />
      
      <div className="flex items-center justify-center p-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Chat Container */}
        <div className="w-full max-w-4xl flex flex-col rounded-2xl overflow-hidden shadow-2xl" style={{
          background: 'rgba(16, 21, 36, 0.85)',
          border: '1px solid #2a3a5a',
          boxShadow: '0 0 25px rgba(100, 120, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          height: 'calc(100vh - 120px)'
        }}>
          
          {/* Chat Header */}
          <div className="p-4 border-b text-center" style={{
            background: 'linear-gradient(90deg, #1a1f38, #2d1a4a, #1a1f38)',
            borderBottom: '1px solid #3a4a6a'
          }}>
            <h1 className="text-2xl font-bold m-0" style={{
              color: '#aab6ff',
              textShadow: '0 0 10px rgba(170, 182, 255, 0.5)'
            }}>
              AstroGen0.1 Chatbot
            </h1>
            <p className="text-sm mt-1 m-0" style={{ color: '#8a9ba8' }}>
              Your cosmic guide to knowledge. Ask me anything...
            </p>
          </div>

        {/* Messages Area */}
        <div 
          ref={chatMessagesRef}
          className="flex-1 p-5 overflow-y-auto flex flex-col gap-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3a4a6a rgba(20, 25, 45, 0.5)'
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-5 py-3 rounded-2xl leading-relaxed animate-fadeIn ${
                msg.isUser ? 'self-end' : 'self-start'
              }`}
              style={msg.isUser ? {
                background: 'linear-gradient(135deg, #3a4a6a, #2a3a5a)',
                border: '1px solid #4a5a8a',
                color: '#e0e0ff',
                borderBottomRightRadius: '5px',
                whiteSpace: 'pre-wrap'
              } : {
                background: 'linear-gradient(135deg, #1e2a45, #162035)',
                border: '1px solid #2a3a5a',
                color: '#c0c0e0',
                borderBottomLeftRadius: '5px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div 
              className="self-start px-5 py-3 rounded-2xl italic"
              style={{
                background: 'rgba(30, 42, 69, 0.7)',
                borderBottomLeftRadius: '5px',
                color: '#8a9ba8'
              }}
            >
              Thinking
              <span className="inline-block animate-typingDots">...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex p-4 gap-3" style={{
          background: 'rgba(14, 19, 32, 0.9)',
          borderTop: '1px solid #2a3a5a'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your message here..."
            disabled={isSending}
            className="flex-1 px-4 py-3 rounded-full outline-none transition-all duration-300"
            style={{
              border: '1px solid #3a4a6a',
              background: 'rgba(22, 28, 45, 0.8)',
              color: '#e0e0ff',
              fontSize: '1em'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5a6aaa';
              e.target.style.boxShadow = '0 0 0 2px rgba(90, 106, 170, 0.3)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a4a6a';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="px-6 py-3 rounded-full font-bold cursor-pointer transition-all duration-300 flex items-center gap-2"
            style={{
              border: 'none',
              background: !inputValue.trim() || isSending 
                ? '#3a4a6a' 
                : 'linear-gradient(135deg, #5a6aaa, #4a5a9a)',
              color: 'white',
              cursor: !inputValue.trim() || isSending ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim() && !isSending) {
                e.target.style.background = 'linear-gradient(135deg, #6a7aba, #5a6aaa)';
                e.target.style.boxShadow = '0 0 15px rgba(90, 106, 170, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (inputValue.trim() && !isSending) {
                e.target.style.background = 'linear-gradient(135deg, #5a6aaa, #4a5a9a)';
                e.target.style.boxShadow = 'none';
              }
            }}
            onMouseDown={(e) => {
              if (inputValue.trim() && !isSending) {
                e.target.style.transform = 'scale(0.98)';
              }
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            Send
            <Send className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes typingDots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-typingDots::after {
          content: '...';
          animation: typingDots 1.5s infinite;
        }

        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(20, 25, 45, 0.5);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb {
          background: #3a4a6a;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;
