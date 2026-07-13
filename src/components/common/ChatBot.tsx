import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Rural Services assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('passport')) {
      return 'I can help you with passport services! We offer:\n• New Passport Application\n• Passport Renewal\n• Tatkal Passport\n• Police Clearance Certificate\n\nWould you like to apply for any of these services?';
    }
    
    if (message.includes('recharge') || message.includes('mobile')) {
      return 'We provide instant mobile recharge services for all operators. You can also recharge DTH, pay bills, and more through our utility services section.';
    }
    
    if (message.includes('doctor') || message.includes('health')) {
      return 'Our healthcare services include:\n• Online Doctor Consultation (₹300)\n• Health Checkup Packages\n• Medicine Home Delivery\n\nWould you like to book a consultation?';
    }
    
    if (message.includes('training') || message.includes('certificate')) {
      return 'We offer various training programs:\n• Digital Literacy Training\n• Financial Literacy Program\n• Skill Development Courses\n\nAll programs include certificates upon completion!';
    }
    
    if (message.includes('loan') || message.includes('mudra')) {
      return 'We can help you apply for various loans:\n• MUDRA Loan\n• Stand-Up India Loan\n• PMEGP Loan\n• Kisan Credit Card\n\nWhich loan are you interested in?';
    }
    
    if (message.includes('scholarship')) {
      return 'You can apply for scholarships through the National Scholarship Portal. We help with:\n• SC/ST/OBC Scholarships\n• Merit-based Scholarships\n• State Government Scholarships';
    }
    
    if (message.includes('pan') || message.includes('tax')) {
      return 'Our taxation services include:\n• PAN Card Application\n• Income Tax e-Filing\n• GST Registration\n• TDS Filing\n\nWhich service do you need?';
    }
    
    if (message.includes('state') || message.includes('government')) {
      return 'We provide access to all state government services like:\n• MeeSeva (AP/Telangana)\n• Seva Sindhu (Karnataka)\n• Aaple Sarkar (Maharashtra)\n• And many more state portals';
    }
    
    if (message.includes('marketplace') || message.includes('sell')) {
      return 'Join our e-commerce marketplace! We offer:\n• Seller Registration\n• ONDC Network Integration\n• Product Listing Support\n• Order Management\n\nStart selling today!';
    }
    
    if (message.includes('commission') || message.includes('earn')) {
      return `As a ${user?.role}, you can earn commissions on various services. Commission rates vary by service type. Check the service cards for specific commission amounts.`;
    }
    
    if (message.includes('support') || message.includes('help')) {
      return 'For additional support, you can:\n• WhatsApp: +91 9391931543\n• Email: support@ruraltechstore.com\n• Use this chat for quick queries\n\nOur support team is available 24/7!';
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return `Hello ${user?.name || 'there'}! Welcome to Rural Services Portal. I can help you with information about our services, applications, and more. What would you like to know?`;
    }
    
    return 'I understand you\'re looking for information. Could you please be more specific about which service you need help with? You can ask about:\n• Passport services\n• Healthcare\n• Training programs\n• Government schemes\n• Taxation services\n• And much more!';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    'Passport Services',
    'Doctor Consultation',
    'Mobile Recharge',
    'Training Programs',
    'Government Schemes'
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Rural Services Assistant</h3>
                <p className="text-xs text-blue-100">Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-blue-100" />
                    )}
                    <div>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Support Links */}
            <div className="flex justify-center space-x-4 mt-2">
              <a
                href="https://wa.me/919391931543"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-green-600 hover:text-green-700"
              >
                <Phone className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:support@ruraltechstore.com"
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;