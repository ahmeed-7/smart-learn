import React from 'react';
import { Bot, Send, Sparkles, User, X, MessageCircle, Brain } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useExamStore } from '../../store/useExamStore';
import { usePlannerStore } from '../../store/usePlannerStore';
import apiClient from '../../api/apiClient';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const tasks = useTaskStore((state) => state.tasks);
  const exams = useExamStore((state) => state.exams);
  const plannerSessions = usePlannerStore((state) => state.sessions);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am the Smart Learn AI. I can help you organize your planner, track tasks, review exams, and guide your study workflow.',
    },
  ]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input.trim();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await apiClient.post('/chat', {
        messages: apiMessages,
        context: {
          tasks,
          exams,
          plannerSessions,
        },
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.reply || 'Sorry, I received an empty response.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat AI Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please contact the administrator or check the API key.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-5 py-3 shadow-xl bg-primary-600 text-white hover:scale-105 transition-all"
      >
        <Brain size={20} />
        <span className="font-semibold hidden sm:inline">AI Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full sm:w-[420px] h-[80vh] sm:h-[700px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-white/20">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Smart Learn AI</h2>
                    <p className="text-sm text-white/80">
                      Intelligent academic planning assistant
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 border-b bg-slate-50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-xs text-slate-400 font-semibold">Pending</p>
                  <p className="text-lg font-bold text-slate-900">
                    {tasks.filter((task) => task.status === 'todo').length}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-xs text-slate-400 font-semibold">Exams</p>
                  <p className="text-lg font-bold text-slate-900">{exams.length}</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-3">
                  <p className="text-xs text-slate-400 font-semibold">Sessions</p>
                  <p className="text-lg font-bold text-slate-900">
                    {plannerSessions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-9 h-9 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl px-4 py-3 text-sm shadow-sm">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t bg-white p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  'Give me an academic overview',
                  'What exams do I have?',
                  'What tasks are pending?',
                  'Give me a study plan',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="text-xs px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50">
                  <MessageCircle size={18} className="text-slate-400" />
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSend();
                    }}
                    placeholder="Ask about your tasks, exams, or study plan..."
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700"
                  />
                </div>

                <button
                  onClick={handleSend}
                  className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSupport;