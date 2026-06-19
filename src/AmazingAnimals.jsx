import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Download, ChevronRight, ArrowLeft, Volume2, 
  Hand, LayoutGrid, RotateCcw, Play, MonitorPlay, ChevronLeft, 
  FileText, FileImage, Menu, X
} from 'lucide-react';

const apiKey = ""; 

// --- Custom Animal Icon Component ---
const AnimalIcon = ({ name, emoji, className = "" }) => {
  if (name === 'Crow') {
    return (
      <img 
        src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f426-200d-2b1b.svg" 
        alt="Crow" 
        className={className}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      />
    );
  }
  if (name === 'Seal') {
    return (
      <img 
        src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f9ad.svg" 
        alt="Seal" 
        className={className}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      />
    );
  }
  return <span className={className}>{emoji}</span>;
};

const animalsData = [
  { id: 1, name: 'Dog', category: 'Land', emoji: '🐶', tpr: 'Put your hands on your head like puppy ears!' },
  { id: 2, name: 'Horse', category: 'Land', emoji: '🐎', tpr: 'March in place and pretend to ride a horse!' },
  { id: 3, name: 'Elephant', category: 'Land', emoji: '🐘', tpr: 'Swing one arm in front of your face like a long trunk!' },
  { id: 4, name: 'Lion', category: 'Land', emoji: '🦁', tpr: 'Open your hands like claws and ROAR!' },
  { id: 5, name: 'Snake', category: 'Land', emoji: '🐍', tpr: 'Put your arms together, wiggle them, and go Sssss!' },
  { id: 6, name: 'Human', category: 'Land', emoji: '🧑', tpr: 'Point to yourself, smile, wave, and say Hello!' },
  { id: 7, name: 'Crow', category: 'Air', emoji: '🐦‍⬛', tpr: 'Tap your hands on your sides and say Caw, caw!' },
  { id: 8, name: 'Eagle', category: 'Air', emoji: '🦅', tpr: 'Stretch your arms out wide like big wings and glide!' },
  { id: 9, name: 'Whale', category: 'Water', emoji: '🐳', tpr: 'Put hands together above your head, pretend to spout water!' },
  { id: 10, name: 'Seal', category: 'Water', emoji: '🦭', tpr: 'Keep your arms close to your body and clap your hands!' }
];

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const AdBanner = ({ format = 'horizontal', className = "" }) => (
  <div className={`relative flex items-center justify-center bg-sky-100/50 border-2 border-dashed border-sky-200 text-sky-400 rounded-lg overflow-hidden ${format === 'horizontal' ? 'w-full h-20 my-2' : 'w-full aspect-square max-h-[250px] my-4'} ${className}`}>
    <span className="absolute top-1 right-2 text-[10px] bg-sky-200 text-sky-600 px-1 rounded uppercase tracking-tighter font-bold">AD Space</span>
    <p className="font-semibold text-xs">{format === 'horizontal' ? '728 x 90' : '300 x 250'}</p>
  </div>
);

function AaHomeView({ setModuleView }) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-full w-full py-12">
      <div className="flex gap-4 mb-6 animate-bounce justify-center">
        <span className="text-7xl drop-shadow-xl">🐶</span>
        <span className="text-7xl drop-shadow-xl">🦁</span>
        <span className="text-7xl drop-shadow-xl">🐘</span>
        <span className="text-7xl drop-shadow-xl">🐎</span>
      </div>
      <h2 className="text-4xl font-black text-sky-900 mb-2 tracking-tight">Amazing Animals!</h2>
      <p className="text-base text-sky-700/60 mb-10 max-w-sm font-bold leading-relaxed mx-auto">Meet animal friends, listen, and move your body!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl px-6 mb-12">
        <AaHomeCard icon={<BookOpen className="text-amber-500" />} title="Learn & Move" desc="Vocabulary & TPR Actions" color="bg-amber-50 border-amber-200" onClick={() => setModuleView('learn')} />
        <AaHomeCard icon={<Hand className="text-rose-500" />} title="Listening Game" desc="Test Your Ears" color="bg-rose-50 border-rose-200" onClick={() => setModuleView('swatter')} />
        {/* 注意：Matching Game 如果還沒轉組件，這裡會用傳統方式開新分頁連過去 public 裡的舊檔案 */}
        <AaHomeCard icon={<LayoutGrid className="text-emerald-500" />} title="Matching Game" desc="Find the Pairs" color="bg-emerald-50 border-emerald-200" onClick={() => window.open('/animals/matching_game.html', '_blank')} />
        <AaHomeCard icon={<Download className="text-purple-500" />} title="Materials" desc="PPT & PDF Download" color="bg-purple-50 border-purple-200" onClick={() => setModuleView('downloads')} />
      </div>

      <div className="mt-auto w-full max-w-3xl px-6">
        <AdBanner format="horizontal" />
      </div>
    </div>
  );
}

function AaHomeCard({ icon, title, desc, color, onClick }) {
  return (
    <button onClick={onClick} className={`${color} border-2 rounded-[2rem] p-6 text-left flex items-center gap-5 transition-all hover:scale-[1.03] active:scale-95 group shadow-sm w-full`}>
      <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:rotate-6 transition-transform">{icon}</div>
      <div>
        <h3 className="text-xl font-black text-gray-800 leading-tight"> {title} </h3>
        <p className="text-[12px] text-gray-500 font-black mt-1 uppercase tracking-wider">{desc}</p>
      </div>
    </button>
  );
}

function AaLearnView({ onHome }) {
  const categories = [
    { id: 'Land', label: 'Land', eng: "Let's go to the Land!", icon: "🌳", color: "from-emerald-400 to-green-600" },
    { id: 'Air', label: 'Air', eng: "Let's fly in the Sky!", icon: "☁️", color: "from-cyan-300 to-blue-400" },
    { id: 'Water', label: 'Water', eng: "Let's dive into the Sea!", icon: "🌊", color: "from-blue-400 to-indigo-600" },
  ];

  const [filter, setFilter] = useState('Land');
  const [intro, setIntro] = useState({ title: categories[0].eng, sub: `${categories[0].label} Animals`, color: categories[0].color, icon: categories[0].icon });

  useEffect(() => { speak(categories[0].eng); }, []);

  const handleFilterChange = (cat) => {
    if (cat.id === filter) return;
    setIntro({ title: cat.eng, sub: `${cat.label} Animals`, color: cat.color, icon: cat.icon });
    speak(cat.eng);
    setFilter(cat.id);
  };

  const getSentence = (name) => {
    if (name === 'Human') return "I am a human.";
    const lowerName = name.toLowerCase();
    const isVowel = ['a', 'e', 'i', 'o', 'u'].includes(lowerName[0]);
    return `It is ${isVowel ? 'an' : 'a'} ${lowerName}.`;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden animate-in fade-in">
      {intro && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white bg-gradient-to-br ${intro.color} animate-in fade-in zoom-in duration-500`}>
          <div className="text-[10rem] mb-10 animate-bounce">{intro.icon}</div>
          <h2 className="text-4xl md:text-6xl font-black text-center px-8 mb-8 drop-shadow-2xl uppercase tracking-tighter opacity-95">{intro.title}</h2>
          <div className="bg-white/20 backdrop-blur-xl px-16 py-4 rounded-[3rem] border border-white/40 text-[36px] md:text-[58px] font-black mb-12 shadow-2xl tracking-tighter text-center">{intro.sub}</div>
          <button 
            onClick={() => setIntro(null)} 
            className="bg-white text-sky-900 px-12 py-5 rounded-full font-black text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3"
          >
            Start Learning <ChevronRight size={28} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 bg-white p-3 rounded-3xl shadow-sm border border-sky-100">
        <button onClick={onHome} className="p-3 text-orange-600 hover:bg-orange-50 rounded-2xl transition-all shadow-sm active:scale-90"><ArrowLeft size={28} /></button>
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => handleFilterChange(cat)} 
              className={`px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-black transition-all flex-shrink-0 whitespace-nowrap ${filter === cat.id ? 'bg-sky-500 text-white shadow-lg scale-105' : 'bg-white text-sky-600 hover:bg-sky-50 border border-sky-100'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div className="w-12 hidden sm:block"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 custom-scroll">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 max-w-7xl mx-auto">
          {animalsData.filter(a => a.category === filter).map(animal => {
            const sentenceText = getSentence(animal.name);
            return (
              <div key={animal.id} className="bg-white rounded-[3rem] p-8 sm:p-10 shadow-lg border border-sky-50 flex flex-col items-center text-center transition-all hover:shadow-2xl hover:-translate-y-2 group relative">
                <div className="w-40 h-40 mb-6 cursor-pointer group-hover:scale-110 transition-transform active:scale-95 flex items-center justify-center" onClick={() => speak(animal.name)}>
                  <AnimalIcon name={animal.name} emoji={animal.emoji} className="text-9xl drop-shadow-2xl w-full h-full object-contain" />
                </div>
                <h3 className="text-4xl font-black text-gray-800 mb-6 tracking-tighter">{animal.name}</h3>
                <div className="mb-6 min-h-8 flex items-center justify-center">
                  <p className="text-xl font-black text-sky-600 italic tracking-tight opacity-90">"{sentenceText}"</p>
                </div>
                <div className="bg-sky-50/70 p-6 rounded-[2rem] w-full mb-8 border border-sky-100/50 relative">
                  <p className="text-[11px] uppercase tracking-[0.3em] font-black text-sky-400 mb-3 text-center flex items-center justify-center gap-2">🏃 TPR ACTION</p>
                  <p className="text-base text-sky-800 font-bold italic text-center leading-relaxed">"{animal.tpr}"</p>
                </div>
                <div className="flex gap-4 w-full mt-auto">
                  <button onClick={() => speak(animal.name)} className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-4 sm:py-5 rounded-[1.5rem] font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 shadow-amber-100"><Volume2 size={20}/>Word</button>
                  <button onClick={() => speak(sentenceText)} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-4 sm:py-5 rounded-[1.5rem] font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 shadow-sky-100"><Play size={20}/>Sentence</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AaSwatterGameView({ onHome }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const startRound = () => {
    const randomTarget = animalsData[Math.floor(Math.random() * animalsData.length)];
    setTarget(randomTarget);
    const distractors = animalsData.filter(a => a.id !== randomTarget.id);
    const selectedDistractors = shuffleArray(distractors).slice(0, 4);
    setOptions(shuffleArray([randomTarget, ...selectedDistractors]));
    setFeedback(null);
    speak(randomTarget.name);
  };

  useEffect(() => { startRound(); }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleTap = (animal) => {
    if (feedback?.type === 'success' || gameOver) return; 
    if (animal.id === target.id) {
      setScore(s => s + 1);
      setFeedback({ type: 'success', text: `✨ Correct!` });
      setTimeout(startRound, 1200);
    } else {
      speak('Try again.');
      setFeedback({ type: 'error', text: `Try again!` });
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    startRound();
  };

  if (gameOver) {
    return (
      <div className="flex flex-col h-full animate-in fade-in zoom-in max-h-screen">
         <button onClick={onHome} className="p-3 bg-white text-orange-600 rounded-2xl shadow-sm border mb-6 w-12 active:scale-90 transition-all hover:bg-orange-50"><ArrowLeft size={24}/></button>
         <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full pb-8">
           <div className="bg-white p-12 rounded-[3.5rem] shadow-xl w-full flex flex-col items-center text-center relative border border-sky-50">
              <h2 className="text-4xl font-black text-gray-800 mb-4">Time's Up!</h2>
              <div className="text-6xl mb-6">🏆</div>
              <p className="text-xl font-bold text-gray-500 mb-8">Your final score is <span className="text-orange-500 text-3xl mx-2">{score}</span></p>
              <button onClick={restartGame} className="bg-orange-500 text-white px-10 py-4 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3"><RotateCcw size={24} /> Play Again</button>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in max-h-screen">
      <button onClick={onHome} className="p-3 bg-white text-orange-600 rounded-2xl shadow-sm border mb-6 w-12 active:scale-90 transition-all hover:bg-orange-50"><ArrowLeft size={24}/></button>
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full pb-8">
        <div className="bg-white p-10 sm:p-12 rounded-[3.5rem] shadow-xl mb-8 sm:mb-12 w-full flex flex-col items-center text-center relative border border-sky-50">
          <div className="flex gap-4 mb-8">
            <div className="bg-rose-50 text-rose-500 px-6 py-2 rounded-full font-black text-sm shadow-sm tracking-widest uppercase">Score: {score}</div>
            <div className={`bg-orange-50 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'} px-6 py-2 rounded-full font-black text-sm shadow-sm tracking-widest uppercase`}>Time: {timeLeft}s</div>
          </div>
          <button onClick={() => speak(target?.name)} className="w-24 h-24 sm:w-28 sm:h-28 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-8 hover:scale-105 active:scale-95 shadow-inner transition-all"><Volume2 size={48} /></button>
          <div className="text-xl sm:text-2xl font-black text-gray-600 uppercase tracking-tighter">{feedback ? feedback.text : `Where is the ${target?.name}?`}</div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 w-full">
          {options.map((animal) => (
            <button key={animal.id} onClick={() => handleTap(animal)} className="bg-white aspect-square rounded-[2rem] shadow-sm border-2 border-transparent hover:border-orange-300 hover:bg-orange-50 active:scale-90 transition-all p-2 sm:p-3 flex items-center justify-center shadow-orange-100/50"><AnimalIcon name={animal.name} emoji={animal.emoji} className="text-5xl w-full h-full object-contain" /></button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AaDownloadsView({ onHome }) {
  const slideUrls = [
    "https://i.ibb.co/bjYZjv5X/1.png",
    "https://i.ibb.co/709rzzP/2.png",
    "https://i.ibb.co/kk6JHQs/3.png",
    "https://i.ibb.co/CsHpG0yT/4.png",
    "https://i.ibb.co/7x2xZchn/5.png",
    "https://i.ibb.co/QvFRQmrD/6.png",
    "https://i.ibb.co/7JjSNRhj/7.png",
    "https://i.ibb.co/dd7mW1L/8.png",
    "https://i.ibb.co/ZR2X8G9s/9.png",
    "https://i.ibb.co/93T3Q2VX/10.png",
    "https://i.ibb.co/V0Jcj6bH/11.png",
    "https://i.ibb.co/60KnLN5q/12.png",
    "https://i.ibb.co/7dds53mq/13.png",
    "https://i.ibb.co/XkMBRkNx/14.png",
    "https://i.ibb.co/FbWxMw0k/15.png"
  ];

  const [slideIndex, setSlideIndex] = useState(0);

  const handleDownload = (type) => {
    let url = "";
    let filename = "";
    if (type === 'pdf') {
      url = "https://raw.githubusercontent.com/JOUCHUCHEN/CurioCat/main/animals/Animal_Field_Guide.pdf";
      filename = "Animal_Field_Guide.pdf";
    } else if (type === 'ppt') {
      url = "https://github.com/JOUCHUCHEN/CurioCat/blob/main/animals/Animal_Field_Guide.pptx?raw=true";
      filename = "Animal_Field_Guide.pptx";
    } else if (type === 'flashcards') {
      url = "https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/animals/Flashcards.zip";
      filename = "Flashcards.zip";
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <button onClick={onHome} className="p-3 bg-white text-orange-600 rounded-2xl shadow-sm border mb-6 w-12 active:scale-90 transition-all hover:bg-orange-50"><ArrowLeft size={24}/></button>
      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white rounded-[3rem] border p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black flex items-center gap-3 text-gray-800 uppercase"><MonitorPlay size={24} className="text-orange-500" /> Preview</h3>
            <span className="text-xs bg-orange-50 text-orange-600 px-4 py-1 rounded-full font-black">Slide {slideIndex + 1} / {slideUrls.length}</span>
          </div>
          
          <div className="flex-1 min-h-[300px] bg-gray-900 rounded-[2rem] border-[6px] md:border-[8px] border-gray-800 overflow-hidden relative shadow-inner group flex items-center justify-center">
            <img src={slideUrls[slideIndex]} className="h-full w-full object-contain transition-opacity duration-300" alt={`Preview Slide ${slideIndex + 1}`} />
            <button onClick={() => setSlideIndex((prev) => (prev - 1 + slideUrls.length) % slideUrls.length)} className="absolute left-4 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={28} /></button>
            <button onClick={() => setSlideIndex((prev) => (prev + 1) % slideUrls.length)} className="absolute right-4 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={28} /></button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap justify-center px-4 w-full">
                {slideUrls.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === slideIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} />
                ))}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/3 bg-white rounded-[3rem] border py-6 xl:py-8 flex flex-row items-center shadow-sm">
          <div className="w-1/3 flex flex-col items-center justify-center shrink-0 relative left-[5%]">
            <div className="scale-110 flex flex-col items-center transform origin-center">
              <div className="bg-orange-50 p-4 xl:p-5 rounded-full mb-3 text-orange-500 shadow-sm">
                <Download size={40} className="w-8 h-8 xl:w-10 xl:h-10" />
              </div>
              <h3 className="text-xl xl:text-2xl font-black text-gray-800 text-center tracking-tight">Materials</h3>
            </div>
          </div>

          <div className="w-2/3 flex flex-col items-center justify-center space-y-3">
            <button onClick={() => handleDownload('ppt')} className="w-[75%] bg-indigo-500 text-white py-3 xl:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><MonitorPlay size={18} /> PPTX</button>
            <button onClick={() => handleDownload('pdf')} className="w-[75%] bg-rose-500 text-white py-3 xl:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><FileText size={18} /> PDF</button>
            <button onClick={() => handleDownload('flashcards')} className="w-[75%] bg-emerald-500 text-white py-3 xl:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"><FileImage size={18} /> Flashcards</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 匯出主要組件 ---
// 加入 backToHome 屬性，用來跟外部的 App.jsx 溝通切換頁面
export default function AmazingAnimals({ backToHome }) {
  const [moduleView, setModuleView] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f0f9ff; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #bae6fd; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #7dd3fc; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 
        .no-scrollbar::-webkit-scrollbar { display: none; } 
      `}</style>
      <div className="min-h-screen bg-sky-50 flex flex-col h-screen overflow-hidden">
          {/* Navbar 已經接上 backToHome，點擊 Home 就能回到主平台 */}
          <nav className="bg-white shadow-sm h-20 border-b flex-shrink-0 z-50 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
              <div className="flex items-center cursor-pointer group" onClick={backToHome}>
                <img 
                    src="https://i.ibb.co/CFC5v9L/Machi-Know-Logo.png" 
                    alt="Maachiiknow Logo" 
                    className="w-16 h-16 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all relative -top-1 left-0 z-0"
                />
                <span className="font-logo font-black text-3xl text-gray-900 tracking-tighter relative z-10 ml-0">
                  Maachii<span className="text-orange-600">Know</span>
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-12">
                <button 
                  onClick={backToHome} 
                  className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors"
                >
                  Home
                </button>
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="md:hidden text-gray-600 p-2"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
            
            {isMobileMenuOpen && (
              <div className="absolute top-20 left-0 w-full bg-white shadow-xl border-b md:hidden flex flex-col p-6 space-y-4 z-40 animate-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={backToHome} 
                  className="text-left font-bold text-gray-700"
                >
                  Home
                </button>
              </div>
            )}
          </nav>

          <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scroll p-4 md:p-6">
            <div className="max-w-7xl mx-auto h-full">
              {moduleView === 'home' && <AaHomeView setModuleView={setModuleView} />}
              {moduleView === 'learn' && <AaLearnView onHome={() => setModuleView('home')} />}
              {moduleView === 'swatter' && <AaSwatterGameView onHome={() => setModuleView('home')} />}
              {moduleView === 'downloads' && <AaDownloadsView onHome={() => setModuleView('home')} />}
            </div>
          </main>
          
          <footer className="bg-white/80 backdrop-blur-sm border-t py-4 text-center shrink-0">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">© 2026 MaachiiKnow. All rights reserved.</p>
          </footer>
      </div>
    </>
  );
}