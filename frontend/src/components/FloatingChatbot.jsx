import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import knowledgeBase from '../data/knowledge-base.json';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm AstroGen0.1. Ask me about our space research!",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = 'AIzaSyBMQI6cLQB3Tg4cN6bKXgbpYLnJxR5-P2s';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Prepare context from knowledge base
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
    context += "Keep answers brief and concise (max 2-3 sentences).";
    
    return context;
  };

  // Call Gemini API
  const callGeminiWithContext = async (userMessage) => {
    setIsTyping(true);

    try {
      const context = prepareKnowledgeContext();
      const fullPrompt = `${context}\n\nUser Question: ${userMessage}\n\nProvide a brief, helpful answer based ONLY on the knowledge base above.`;

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
          maxOutputTokens: 300,
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
      return "Sorry, I encountered an error. Please try again.";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    
    if (!message || isSending) return;

    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setInputValue('');
    setIsSending(true);

    const botResponse = await callGeminiWithContext(message);
    setMessages(prev => [...prev, { content: botResponse, isUser: false }]);
    
    setIsSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        style={{
          background: 'linear-gradient(135deg, #5a6aaa, #4a5a9a)',
          boxShadow: '0 0 20px rgba(90, 106, 170, 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(90, 106, 170, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(90, 106, 170, 0.5)';
        }}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 flex flex-col rounded-2xl shadow-2xl overflow-hidden z-50 transition-all duration-300"
      style={{
        width: isMinimized ? '320px' : '400px',
        height: isMinimized ? '60px' : '600px',
        background: 'rgba(16, 21, 36, 0.95)',
        border: '1px solid #2a3a5a',
        boxShadow: '0 0 30px rgba(100, 120, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        style={{
          background: 'linear-gradient(90deg, #1a1f38, #2d1a4a)',
          borderBottom: isMinimized ? 'none' : '1px solid #3a4a6a'
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #5a6aaa, #4a5a9a)'
          }}>
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#aab6ff' }}>AstroGen0.1</h3>
            <p className="text-xs" style={{ color: '#8a9ba8' }}>AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <Minimize2 className="w-4 h-4" style={{ color: '#aab6ff' }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#aab6ff' }} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3a4a6a rgba(20, 25, 45, 0.5)'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-4 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.isUser ? 'self-end' : 'self-start'
                }`}
                style={msg.isUser ? {
                  background: 'linear-gradient(135deg, #3a4a6a, #2a3a5a)',
                  border: '1px solid #4a5a8a',
                  color: '#e0e0ff',
                  borderBottomRightRadius: '4px',
                  whiteSpace: 'pre-wrap'
                } : {
                  background: 'linear-gradient(135deg, #1e2a45, #162035)',
                  border: '1px solid #2a3a5a',
                  color: '#c0c0e0',
                  borderBottomLeftRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}
              </div>
            ))}

            {isTyping && (
              <div 
                className="self-start px-4 py-2 rounded-xl text-sm italic"
                style={{
                  background: 'rgba(30, 42, 69, 0.7)',
                  borderBottomLeftRadius: '4px',
                  color: '#8a9ba8'
                }}
              >
                Thinking...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 flex gap-2" style={{
            background: 'rgba(14, 19, 32, 0.9)',
            borderTop: '1px solid #2a3a5a'
          }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isSending}
              className="flex-1 px-3 py-2 rounded-full text-sm outline-none transition-all duration-300"
              style={{
                border: '1px solid #3a4a6a',
                background: 'rgba(22, 28, 45, 0.8)',
                color: '#e0e0ff'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="p-2 rounded-full transition-all duration-300"
              style={{
                background: !inputValue.trim() || isSending 
                  ? '#3a4a6a' 
                  : 'linear-gradient(135deg, #5a6aaa, #4a5a9a)',
                cursor: !inputValue.trim() || isSending ? 'not-allowed' : 'pointer'
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(20, 25, 45, 0.5);
          border-radius: 2px;
        }

        div::-webkit-scrollbar-thumb {
          background: #3a4a6a;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default FloatingChatbot;
