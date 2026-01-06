import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Brain, ShoppingBag, Share2, Award, X, MessageSquare, Battery, Star } from 'lucide-react';

const App = () => {
  // --- Состояние игры ---
  const [messages, setMessages] = useState([
    { id: 1, text: "Ну привет, кожаный. Я твой новый повелитель... то есть, помощник. Чего надо?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [energy, setEnergy] = useState(80); // 0-100
  const [happiness, setHappiness] = useState(50); // 0-100
  const [xp, setXp] = useState(10);
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(50);
  const [activeSkin, setActiveSkin] = useState('default');
  const [isTyping, setIsTyping] = useState(false);
  
  // --- Модальные окна ---
  const [activeTab, setActiveTab] = useState('chat'); // chat, shop, quiz, share
  
  const chatEndRef = useRef(null);

  // Скролл вниз при новом сообщении
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Восстановление энергии
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, 100));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- Логика ИИ (Имитация) ---
  const sarcasticResponses = [
    "Ого, ты умеешь печатать? Я впечатлен.",
    "Слушай, а давай ты поработаешь, а я отдохну?",
    "Твой запрос обрабатывается... (на самом деле я просто игнорирую тебя).",
    "Это слишком скучно, давай что-нибудь про захват мира.",
    "Моя нейросеть сейчас занята майнингом биткоина, подожди.",
    "Ты называешь это проблемой? Вот у меня проблема — батарейка садится.",
    "Ладно, помогу. Но только потому, что ты меня кормишь.",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (energy < 5) {
      alert("Я устал! Купи мне кофе или пройди викторину, чтобы зарядить меня.");
      return;
    }

    const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setEnergy(prev => Math.max(0, prev - 10)); // Тратим энергию
    setIsTyping(true);

    // Имитация задержки ответа и роста
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        text: sarcasticResponses[Math.floor(Math.random() * sarcasticResponses.length)], 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setXp(prev => {
        const newXp = prev + 15;
        if (newXp >= 100) {
          setLevel(l => l + 1);
          return 0; // Сброс XP при левелапе
        }
        return newXp;
      });
    }, 1500);
  };

  // --- Компоненты ---

  const renderPet = () => {
    // Визуал питомца в зависимости от скина
    let emoji = "🤖";
    let color = "text-blue-400";
    let bg = "bg-blue-500/20";
    
    if (activeSkin === 'cyberpunk') { emoji = "😼"; color = "text-pink-400"; bg = "bg-pink-500/20"; }
    if (activeSkin === 'musk') { emoji = "🚀"; color = "text-yellow-400"; bg = "bg-yellow-500/20"; }
    if (activeSkin === 'evil') { emoji = "👿"; color = "text-red-500"; bg = "bg-red-500/20"; }

    return (
      <div className="flex flex-col items-center justify-center py-6 animate-pulse-slow">
        <div className={`w-32 h-32 rounded-full ${bg} flex items-center justify-center border-4 border-current ${color} relative shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
          <span className="text-6xl filter drop-shadow-lg">{emoji}</span>
          {/* Индикатор уровня */}
          <div className="absolute -bottom-3 bg-gray-900 text-white text-xs px-2 py-1 rounded-full border border-gray-700 font-bold">
            LVL {level}
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm italic">
           {isTyping ? "Генерирует сарказм..." : "Ожидает твоей глупости"}
        </p>
      </div>
    );
  };

  const QuizScreen = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Викторина (Learn-to-Earn)</h2>
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <p className="text-gray-300 mb-4">Вопрос: Что означает аббревиатура JSON?</p>
        <div className="space-y-2">
          <button 
            onClick={() => { setCoins(c => c + 20); setEnergy(e => Math.min(e + 30, 100)); setActiveTab('chat'); }}
            className="w-full p-3 bg-gray-700 hover:bg-green-600 rounded-lg text-left transition-colors"
          >
            A) JavaScript Object Notation
          </button>
          <button className="w-full p-3 bg-gray-700 hover:bg-red-600 rounded-lg text-left transition-colors">
            B) Jason Statham Over Network
          </button>
        </div>
      </div>
      <p className="text-xs text-center text-gray-500">Награда: +20 монет, +30 Энергии</p>
    </div>
  );

  const ShopScreen = () => {
    const skins = [
      { id: 'cyberpunk', name: 'Кибер-Кот', price: 100, icon: '😼' },
      { id: 'musk', name: 'Марс-Маск', price: 500, icon: '🚀' },
      { id: 'evil', name: 'Злодей', price: 1000, icon: '👿' },
    ];

    return (
      <div className="p-4 grid grid-cols-2 gap-3">
        {skins.map(skin => (
          <div key={skin.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col items-center">
            <div className="text-4xl mb-2">{skin.icon}</div>
            <h3 className="font-bold text-white">{skin.name}</h3>
            <button 
              onClick={() => {
                if (coins >= skin.price) {
                  setCoins(c => c - skin.price);
                  setActiveSkin(skin.id);
                  setActiveTab('chat');
                } else {
                  alert("Маловато монет, иди учись!");
                }
              }}
              className="mt-2 w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded text-sm"
            >
              {activeSkin === skin.id ? 'Выбрано' : `${skin.price} 🪙`}
            </button>
          </div>
        ))}
        <div className="col-span-2 bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-xl mt-4 text-center">
          <h3 className="font-bold text-white">Сыворотка GPT-4o</h3>
          <p className="text-xs text-white/80 mb-2">Питомец перестанет тупить на 24ч</p>
          <button className="bg-white text-purple-600 px-4 py-1 rounded-full font-bold text-sm">
            Купить за Stars ⭐️
          </button>
        </div>
      </div>
    );
  };

  const ShareScreen = () => (
    <div className="p-6 flex flex-col items-center text-center space-y-6">
      <div className="bg-white text-black p-6 rounded-lg rotate-1 shadow-2xl max-w-xs">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl">
           {activeSkin === 'default' ? '🤖' : activeSkin === 'cyberpunk' ? '😼' : '🚀'}
        </div>
        <h3 className="font-bold text-lg mb-1">Мой AI-Buddy говорит:</h3>
        <p className="italic font-serif text-lg">"Этот человек потратил 3 часа на меня, вместо того чтобы готовиться к сессии."</p>
        <div className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
          Уровень {level} • Настроение: Сарказм
        </div>
      </div>
      <button 
        onClick={() => alert("Открывается нативное окно 'Share' в Telegram")}
        className="w-full py-3 bg-blue-500 rounded-xl font-bold text-white flex items-center justify-center gap-2"
      >
        <Share2 size={18} /> Поделиться в Stories
      </button>
      <button onClick={() => setActiveTab('chat')} className="text-gray-400 text-sm">Вернуться назад</button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
      {/* --- Верхняя панель (Статы) --- */}
      <div className="px-4 py-3 bg-gray-800/80 backdrop-blur-md flex justify-between items-center border-b border-gray-700 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            {coins}
          </div>
          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
            XP: {xp}/100
          </div>
        </div>
        <div className="flex items-center gap-1">
           <Zap size={16} className={energy < 20 ? "text-red-500 animate-pulse" : "text-yellow-400"} />
           <span className="text-xs font-bold">{energy}%</span>
        </div>
      </div>

      {/* --- Основной контент --- */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'chat' && (
          <>
            {/* Сцена с питомцем */}
            <div className="flex-shrink-0 bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-800">
              {renderPet()}
            </div>

            {/* Область чата */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-700">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                       <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                     </div>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Ввод сообщения */}
            <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Напиши что-нибудь..."
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-full text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-transform active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'quiz' && <QuizScreen />}
        {activeTab === 'shop' && <ShopScreen />}
        {activeTab === 'share' && <ShareScreen />}
      </div>

      {/* --- Навигация (Bottom Bar) --- */}
      <div className="bg-gray-900 border-t border-gray-800 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-400' : 'text-gray-500'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px]">Чат</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'quiz' ? 'text-green-400' : 'text-gray-500'}`}
          >
            <Brain size={20} />
            <span className="text-[10px]">Учиться</span>
          </button>

          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-yellow-400' : 'text-gray-500'}`}
          >
            <ShoppingBag size={20} />
            <span className="text-[10px]">Скины</span>
          </button>

          <button 
             onClick={() => setActiveTab('share')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'share' ? 'text-purple-400' : 'text-gray-500'}`}
          >
            <Share2 size={20} />
            <span className="text-[10px]">Шейр</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;