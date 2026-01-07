import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Brain, ShoppingBag, Share2, MessageSquare } from 'lucide-react';

/**
 * Вспомогательная функция для получения ответов от ИИ.
 * В будущем здесь можно будет подключить реальный API ключ OpenAI.
 */
const getAiResponse = async (userMessage, level) => {
  // Пока у нас нет API ключа, имитируем "умные" и саркастичные ответы
  const sarcasticResponses = [
    "Ого, ты умеешь печатать? Я впечатлен.",
    "Слушай, а давай ты поработаешь, а я отдохну?",
    "Твой запрос обрабатывается... (на самом деле я просто игнорирую тебя).",
    "Это слишком скучно, давай что-нибудь про захват мира.",
    "Моя нейросеть сейчас занята майнингом биткоина, подожди.",
    "Ты называешь это проблемой? Вот у меня проблема — батарейка садится.",
    "Ладно, помогу. Но только потому, что ты меня кормишь.",
  ];
  
  // Имитируем небольшую задержку ответа
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)];
};

const App = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Ну привет, кожаный. Я загрузился. Чего надо?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [energy, setEnergy] = useState(80);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(50);
  const [activeSkin, setActiveSkin] = useState('default');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    if (energy < 10) {
      setMessages(prev => [...prev, { id: Date.now(), text: "У меня нет энергии даже на твой бред. Иди в викторину.", sender: 'bot' }]);
      return;
    }

    const userText = inputValue;
    const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setEnergy(prev => Math.max(0, prev - 10));
    setIsTyping(true);

    // Получаем ответ
    const responseText = await getAiResponse(userText, level);
    
    const aiResponse = { id: Date.now() + 1, text: responseText, sender: 'bot' };
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
    setXp(prev => {
      const newXp = prev + 20;
      if (newXp >= 100) {
        setLevel(l => l + 1);
        return 0;
      }
      return newXp;
    });
  };

  const renderPet = () => {
    let emoji = "🤖";
    if (activeSkin === 'cyberpunk') emoji = "😼";
    if (activeSkin === 'musk') emoji = "🚀";

    return (
      <div className="flex flex-col items-center justify-center py-10 bg-gray-800">
        <div className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center border-4 border-blue-400 relative animate-bounce">
          <span className="text-6xl">{emoji}</span>
          <div className="absolute -bottom-3 bg-gray-900 text-white text-xs px-2 py-1 rounded-full border border-gray-700 font-bold shadow-lg">
            LVL {level}
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm italic">
          {isTyping ? "Анализирую твою глупость..." : "Ожидаю команд"}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans border-x border-gray-800">
      {/* Шапка */}
      <div className="px-4 py-3 bg-gray-800 flex justify-between items-center border-b border-gray-700 shadow-sm">
        <div className="flex gap-2">
          <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            🪙 {coins}
          </span>
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
            XP: {xp}/100
          </span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
           <Zap size={14} fill="currentColor" />
           <span className="text-xs font-bold">{energy}%</span>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' && (
          <>
            {renderPet()}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-gray-800 px-4 py-2 rounded-2xl rounded-tl-none border border-gray-700">
                     <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                     </div>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Поле ввода */}
            <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Напиши что-нибудь..."
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-full text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isTyping}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-2.5 rounded-full transition-colors active:scale-95 shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
        
        {activeTab === 'quiz' && (
          <div className="p-8 text-center space-y-4">
            <Brain size={64} className="mx-auto text-green-400 opacity-50" />
            <h2 className="text-xl font-bold">Раздел обучения</h2>
            <p className="text-gray-400">Здесь будут викторины для заработка энергии и монет. В разработке!</p>
            <button onClick={() => setActiveTab('chat')} className="text-blue-400 hover:underline">Вернуться в чат</button>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="p-8 text-center space-y-4">
            <ShoppingBag size={64} className="mx-auto text-yellow-400 opacity-50" />
            <h2 className="text-xl font-bold">Магазин скинов</h2>
            <p className="text-gray-400">Тут можно будет приодеть твоего ИИ-друга. Скоро открытие!</p>
            <button onClick={() => setActiveTab('chat')} className="text-blue-400 hover:underline">Вернуться в чат</button>
          </div>
        )}
      </div>

      {/* Навигация */}
      <div className="bg-gray-800 border-t border-gray-700 flex justify-around items-center py-2 safe-area-bottom">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'chat' ? 'text-blue-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px]">Чат</span>
        </button>
        <button 
          onClick={() => setActiveTab('quiz')} 
          className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'quiz' ? 'text-green-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Brain size={20} />
          <span className="text-[10px]">Учеба</span>
        </button>
        <button 
          onClick={() => setActiveTab('shop')} 
          className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'shop' ? 'text-yellow-400 scale-110' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px]">Магазин</span>
        </button>
      </div>
    </div>
  );
};

export default App;