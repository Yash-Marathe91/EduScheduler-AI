'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I am your Academic Coordinator AI. How can I help you manage the campus today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && windowRef.current) {
      gsap.fromTo(windowRef.current, 
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await fetchWithAuth('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content })
      });
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || '⚠️ Sorry, I encountered an error communicating with the server.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={windowRef}
          className="mb-4 w-[380px] h-[550px] bg-surface/80 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-primary-fixed-dim text-on-primary flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-label-lg font-bold leading-tight">AI Coordinator</h3>
                <p className="text-[11px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-surface-container-lowest/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "max-w-[85%] rounded-2xl p-3 font-body-sm text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-on-primary rounded-tr-sm self-end"
                    : "bg-surface-container text-on-surface border border-outline-variant/20 rounded-tl-sm self-start"
                )}
              >
                {msg.role === 'assistant' && msg.content.includes('⚠️') ? (
                  <span className="text-error font-medium">{msg.content}</span>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-surface-container border border-outline-variant/20 text-on-surface rounded-2xl rounded-tl-sm self-start p-3 shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-outline-variant/30 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 max-h-[120px] min-h-[44px] resize-none font-body-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all custom-scrollbar"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-primary text-on-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(var(--color-primary),0.3)] transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-surface-container-high text-on-surface rotate-90" : "bg-gradient-to-r from-primary to-primary-fixed-dim text-on-primary hover:shadow-[0_10px_25px_rgba(var(--color-primary),0.4)]"
        )}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
}
