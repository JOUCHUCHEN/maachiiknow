import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Trash2, ArrowRight, Sparkles, Cat, Heart, ShieldAlert, Loader2, 
  Image as ImageIcon, Wand2, Tag, Key, AlertCircle, Copy, Check, Briefcase, 
  Stethoscope, CheckCircle2, ShieldCheck, Award, Gamepad2, MapPin, Play, Grid
} from 'lucide-react';

const TILE_SIZE = 32;

const INITIAL_CATS_DATA = [
  {
    id: "cat_001",
    rescueType: "feed",
    mapX: 16,
    mapY: 3,
    emoji: "🐈",
    profile: {
      name: "Happy",
      englishDesc: "Happy was ALONE. No mother cat around. He was cold and hungry.",
      story: "Happy was found in a cardboard box during heavy rain. We observed for a long time to make sure the mother cat wasn't around before rescuing him."
    }
  },
  {
    id: "cat_002",
    rescueType: "car_engine",
    mapX: 3,
    mapY: 17,
    emoji: "🐈",
    profile: {
      name: "Mimi",
      englishDesc: "Mimi was hiding in a car engine. We must be careful!",
      story: "Mimi was hiding under a car hood to stay warm, which is very dangerous! Volunteers tapped the hood first to alert her, then used wet food to safely lure her out."
    }
  }
];

const INITIAL_MAP_DATA = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 2, 3, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 3, 0, 2, 0, 2],
  [2, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 2, 2, 0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 0, 0, 0, 3, 3, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 2],
  [2, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 2, 0, 0, 0, 2],
  [2, 0, 2, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 2],
  [2, 0, 3, 3, 3, 0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 2],
  [2, 0, 2, 2, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 3, 3, 0, 0, 0, 2],
  [2, 2, 0, 0, 2, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

export default function CatRescueLesson() {
  const [activeTab, setActiveTab] = useState('task1'); // 'task1' | 'task2' | 'game'

  // Task 1 Vocabulary & Inputs
  const [vocabulary, setVocabulary] = useState({
    animal: [],
    color: [],
    size: [],
    age: [],
    emotion: [],
    environment: [],
    other: []
  });

  const [inputs, setInputs] = useState({
    animal: '',
    color: '',
    size: '',
    age: '',
    emotion: '',
    environment: '',
    other: ''
  });

  const [apiError, setApiError] = useState('');
  const [chineseInput, setChineseInput] = useState('');
  const [selectedCat, setSelectedCat] = useState('animal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [catImage, setCatImage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isAvatarPromptCopied, setIsAvatarPromptCopied] = useState(false);
  
  const [currentCatIndex, setCurrentCatIndex] = useState(0);

  // Deploying Cat to Game state
  const [deployX, setDeployX] = useState(8);
  const [deployY, setDeployY] = useState(8);
  const [deployCatName, setDeployCatName] = useState('Lucky');
  const [deployCatDanger, setDeployCatDanger] = useState('feed');
  const [deploySuccessMsg, setDeploySuccessMsg] = useState('');

  // Task 2 Backpack & Interactive States
  const [backpack, setBackpack] = useState([]);
  const [actionChoice1, setActionChoice1] = useState(null); // 'slow' | 'fast'
  const [actionChoice2, setActionChoice2] = useState(null); // 'food' | 'shout'
  const [vetCheck, setVetCheck] = useState({
    ears: 'dirty',
    eyes: 'clean',
    paws: 'cold',
    body: 'healthy'
  });
  const [isCopiedTask2, setIsCopiedTask2] = useState(false);

  const [customRescueItems, setCustomRescueItems] = useState([]);
  const [customItemEng, setCustomItemEng] = useState('');
  const [customItemChi, setCustomItemChi] = useState('');

  // Game Shared Cats State
  const [gameCats, setGameCats] = useState(INITIAL_CATS_DATA);

  const handleAddCustomRescueItem = (e) => {
    if (e && e.key !== 'Enter' && e.type !== 'click') return;
    if (!customItemEng.trim()) return;

    const newItem = {
      id: `custom_${Date.now()}`,
      eng: customItemEng.trim().toLowerCase(),
      chi: customItemChi.trim() || customItemEng.trim(),
      icon: '🎒'
    };

    setCustomRescueItems(prev => [...prev, newItem]);
    if (backpack.length < 3) {
      setBackpack(prev => [...prev, newItem]);
    }

    setCustomItemEng('');
    setCustomItemChi('');
  };

  const handleRemoveCustomRescueItem = (itemId) => {
    setCustomRescueItems(prev => prev.filter(i => i.id !== itemId));
    setBackpack(prev => prev.filter(i => i.id !== itemId));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCatImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (category, value) => {
    setInputs(prev => ({ ...prev, [category]: value }));
  };

  const handleAddWord = (category, e) => {
    if (e && e.key !== 'Enter' && e.type !== 'click') return;
    
    const newWord = inputs[category].trim().toLowerCase();
    if (newWord && !vocabulary[category].includes(newWord)) {
      setVocabulary(prev => ({
        ...prev,
        [category]: [...prev[category], newWord]
      }));
      setInputs(prev => ({ ...prev, [category]: '' }));
    }
  };

  const handleRemoveWord = (category, wordToRemove) => {
    setVocabulary(prev => ({
      ...prev,
      [category]: prev[category].filter(word => word !== wordToRemove)
    }));
  };

  const fetchWithRetry = async (url, options, retries = 3, backoff = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(res => setTimeout(res, backoff * Math.pow(2, i)));
      }
    }
  };

  const handleAIGeneration = async () => {
    if (!chineseInput.trim()) return;
    
    setIsGenerating(true);
    setApiError('');
    const termToTranslate = chineseInput;
    const targetCat = selectedCat;
    const apiKey = ""; 
    
    try {
      let engWord = 'magic';
      
      if (!apiKey) {
        await new Promise(res => setTimeout(res, 600));
        if (termToTranslate.includes('貓')) engWord = 'cat';
        else if (termToTranslate.includes('狗')) engWord = 'dog';
        else if (termToTranslate.includes('黑')) engWord = 'black';
        else if (termToTranslate.includes('白')) engWord = 'white';
        else if (termToTranslate.includes('橘')) engWord = 'orange';
        else if (termToTranslate.includes('大')) engWord = 'big';
        else if (termToTranslate.includes('小')) engWord = 'small';
        else if (termToTranslate.includes('怕') || termToTranslate.includes('恐')) engWord = 'scared';
        else if (termToTranslate.includes('餓')) engWord = 'hungry';
        else if (termToTranslate.includes('氣')) engWord = 'angry';
        else if (termToTranslate.includes('可愛')) engWord = 'cute';
        else engWord = 'magic';
      } else {
        const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
        const textPayload = {
          contents: [{ parts: [{ text: `Translate this Chinese word/phrase to a simple English vocabulary word for a beginner ESL class. Only output the English word/phrase, nothing else, all lowercase. Chinese: "${termToTranslate}"` }] }],
          systemInstruction: { parts: [{ text: "You are an English teacher for kids. Provide only the translated English word." }] }
        };
        
        const textResult = await fetchWithRetry(textUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(textPayload)
        });
        
        engWord = textResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase() || 'unknown';
        engWord = engWord.replace(/[^a-z\s-]/g, '');
      }

      if (engWord && !vocabulary[targetCat].includes(engWord)) {
        setVocabulary(prev => ({
          ...prev,
          [targetCat]: [...prev[targetCat], engWord]
        }));
      }
      
      setFlashcards(prev => [{
        id: Date.now(),
        chi: termToTranslate,
        eng: engWord,
        cat: targetCat
      }, ...prev]);
      
      setChineseInput('');

    } catch (error) {
      console.error("Error generating AI content:", error);
      setApiError("系統連線稍微延遲，請再試一次！(Failed to connect. Please try again.)");
    } finally {
      setIsGenerating(false);
    }
  };

  const rescueItems = [
    { id: 'carrier', eng: 'carrier', chi: '外出籠', icon: '🏠' },
    { id: 'food', eng: 'canned food', chi: '罐頭', icon: '🥫' },
    { id: 'blanket', eng: 'warm blanket', chi: '保暖毯', icon: '🛋️' },
    { id: 'gloves', eng: 'safety gloves', chi: '防咬手套', icon: '🧤' },
    { id: 'toy', eng: 'cat toy', chi: '逗貓棒/玩具', icon: '🧸' },
    { id: 'water', eng: 'fresh water', chi: '乾淨水', icon: '💧' },
  ];

  const toggleBackpackItem = (item) => {
    if (backpack.some(i => i.id === item.id)) {
      setBackpack(backpack.filter(i => i.id !== item.id));
    } else {
      if (backpack.length < 3) {
        setBackpack([...backpack, item]);
      }
    }
  };

  const formatList = (arr) => {
    if (arr.length === 0) return <span className="text-gray-400 border-b-2 border-dashed border-gray-300 px-4">________</span>;
    if (arr.length === 1) return <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">{arr[0]}</span>;
    
    const last = arr[arr.length - 1];
    const initial = arr.slice(0, arr.length - 1).join(', ');
    return (
      <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">
        {initial} and {last}
      </span>
    );
  };

  const categories = [
    { id: 'animal', label: 'Cat or Dog (貓或狗)', icon: <Cat size={18} className="mr-2 text-indigo-500"/>, placeholder: 'e.g., cat, dog' },
    { id: 'color', label: 'Color (顏色)', icon: <Sparkles size={18} className="mr-2 text-yellow-500"/>, placeholder: 'e.g., black, white, orange' },
    { id: 'size', label: 'Size (大小)', icon: <Cat size={18} className="mr-2 text-blue-500"/>, placeholder: 'e.g., small, tiny, big' },
    { id: 'age', label: 'Age (年紀)', icon: <Heart size={18} className="mr-2 text-pink-500"/>, placeholder: 'e.g., young, baby, old' },
    { id: 'emotion', label: 'Feelings (情緒)', icon: <Heart size={18} className="mr-2 text-red-500"/>, placeholder: 'e.g., scared, sad, hungry' },
    { id: 'environment', label: 'Danger/Place (危險/環境)', icon: <ShieldAlert size={18} className="mr-2 text-purple-500"/>, placeholder: 'e.g., street, rain, cold' },
    { id: 'other', label: 'Other (其他)', icon: <Tag size={18} className="mr-2 text-teal-500"/>, placeholder: 'e.g., cute, fast, noisy' }
  ];

  const renderCardVisual = (category, word) => {
    const w = word.toLowerCase();

    if (category === 'color') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl shadow-inner relative overflow-hidden">
          <Cat size={100} style={{ color: w, fill: w }} className="drop-shadow-md z-10" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundColor: w }}></div>
        </div>
      );
    }

    if (category === 'emotion') {
      const emojis = {
        angry: '😾', mad: '😾',
        sad: '😿', cry: '😿', crying: '😿',
        happy: '😸', glad: '😸', cute: '😻',
        scared: '🙀', afraid: '🙀', shocked: '🙀',
        hungry: '🤤', starving: '🤤',
        tired: '🥱', sleepy: '😴'
      };
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-xl text-6xl shadow-inner">
          {emojis[w] || '🐱'}
        </div>
      );
    }

    if (category === 'size') {
      let sizeClass = "scale-100";
      if (['small', 'tiny', 'little', 'mini'].includes(w)) sizeClass = "scale-50";
      if (['big', 'large', 'huge', 'fat', 'giant'].includes(w)) sizeClass = "scale-150";
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-xl overflow-hidden shadow-inner">
          <Cat size={60} className={`text-blue-500 transition-transform duration-500 ${sizeClass}`} />
        </div>
      );
    }

    const genericEmojis = {
      cat: '🐱', dog: '🐶', bird: '🐦',
      street: '🛣️', rain: '🌧️', cold: '❄️',
      cute: '✨', fast: '⚡', noisy: '🔊',
      dirty: '💩', clean: '🫧', magic: '🪄'
    };

    return (
      <div className="w-full h-full flex items-center justify-center bg-purple-50 rounded-xl text-6xl shadow-inner">
         {genericEmojis[w] || '🐾'}
      </div>
    );
  };

  const currentAnimalName = vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog';

  const task2Prompt = `[IMPORTANT: MUST strictly match the animal's exact breed, facial markings, and fur color in the uploaded photo!] Create a heartwarming, joyful, and childlike children's book illustration (NOT realistic) of this rescued ${currentAnimalName} successfully saved and happy! The ${currentAnimalName} is now inside a cozy warm room, happily eating ${backpack.map(i => i.eng).join(', ') || 'canned food'}, wrapped in a warm blanket. Its paws and ears are gently checked by a friendly vet. The ${currentAnimalName} looks safe, loved, purring, and extremely happy. Soft pastel colors, warm lighting of hope.`;

  const pixelAvatarPrompt = `[IMPORTANT: Strictly base on the cat in the uploaded photo!] Create a cute 16x16 or 32x32 retro pixel art video game sprite avatar icon of this ${currentAnimalName}. Retro 8-bit / 16-bit arcade style, front view, vibrant colors, clear dark outline, centered on a clean flat background.`;

  const handleDeployToMap = () => {
    const nameToUse = deployCatName.trim() || 'Lucky';
    const animalType = vocabulary.animal.length ? vocabulary.animal[0] : 'cat';
    const colorDesc = vocabulary.color.length ? vocabulary.color.join(' and ') : 'rescued';
    const placeDesc = vocabulary.environment.length ? vocabulary.environment.join(', ') : 'street';

    const newCatObj = {
      id: `cat_custom_${Date.now()}`,
      rescueType: deployCatDanger,
      mapX: Number(deployX),
      mapY: Number(deployY),
      emoji: animalType.includes('dog') ? '🐕' : '🐈',
      profile: {
        name: nameToUse,
        englishDesc: `${nameToUse} is a ${colorDesc} ${animalType} found in ${placeDesc}.`,
        story: `${nameToUse} was rescued from ${placeDesc}! Features: ${vocabulary.color.join(', ') || 'special markings'}, feeling ${vocabulary.emotion.join(', ') || 'anxious'}. Help save ${nameToUse}!`
      }
    };

    setGameCats(prev => [...prev, newCatObj]);
    setDeploySuccessMsg(`🎉 成功將「${nameToUse}」放置到 2D 遊戲地圖 (X:${deployX}, Y:${deployY})！可以切換到 [RPG 遊戲] 分頁開始尋找牠了！`);
    setTimeout(() => setDeploySuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-1 border border-orange-200 shadow-sm">
            CLASSROOM ESL x RPG ANIMAL RESCUE PROJECT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-orange-700 drop-shadow-sm flex items-center justify-center gap-3">
            <Cat size={42} className="text-orange-500" />
            Cat Rescue Quest: 浪浪救助雙任務教案
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium">從「觀察描述」到「展開救援」，帶領小朋友用英文拯救小生命並在 2D 地圖冒險！</p>
        </header>

        {/* Task & Game Navigation Switcher */}
        <div className="flex justify-center border-b border-orange-200 pb-2">
          <div className="bg-orange-100 p-1.5 rounded-2xl flex flex-wrap justify-center gap-2 shadow-inner">
            <button
              onClick={() => setActiveTab('task1')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'task1' 
                  ? 'bg-white text-orange-700 shadow-md scale-105' 
                  : 'text-orange-900 hover:bg-orange-200/60'
              }`}
            >
              <Cat size={18} />
              <span>Task 1: 觀察與描述 (Observe)</span>
            </button>
            <button
              onClick={() => setActiveTab('task2')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'task2' 
                  ? 'bg-white text-emerald-700 shadow-md scale-105' 
                  : 'text-orange-900 hover:bg-orange-200/60'
              }`}
            >
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Task 2: 展開救援 (Rescue)</span>
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'game' 
                  ? 'bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-400' 
                  : 'text-indigo-900 bg-indigo-200/60 hover:bg-indigo-300/80'
              }`}
            >
              <Gamepad2 size={18} className="text-yellow-300" />
              <span>2D RPG 遊戲 (Paws & Play)</span>
            </button>
          </div>
        </div>

        {/* ==================== GAME TAB ==================== */}
        {activeTab === 'game' && (
          <div className="w-full flex justify-center">
            <PawsAndPlay gameCats={gameCats} setGameCats={setGameCats} />
          </div>
        )}

        {/* ==================== TASKS TAB (2-COLUMN LAYOUT) ==================== */}
        {activeTab !== 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Fixed Photo & Live Backpack */}
            <div className="lg:col-span-5 sticky top-6 space-y-6">
              
              {/* Step 1 Photo Upload Box */}
              <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">1</span>
                    Look & Observe
                  </h2>
                  <label className="cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-xl border border-orange-200 text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
                    <Camera size={18} />
                    <span>上傳照片</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-gray-500 mb-4 w-full text-left">Look at the picture. What do you see?<br/>(看看這張照片，你看到了什麼？)</p>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100 group cursor-pointer" onClick={() => document.getElementById('cat-image-input-main').click()}>
                  <input 
                    id="cat-image-input-main"
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  <img 
                    src={catImage || "https://placehold.co/800x800/f8fafc/f97316?text=Image+of+the+Rescued+Cat\n(Click+Here+to+Upload+Photo)"} 
                    alt="Rescued Cat"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4 justify-between">
                    <span className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mx-auto">
                      <Camera size={14} /> 點擊更換照片
                    </span>
                  </div>
                </div>
              </section>

              {/* Task 2 Live Backpack (Shown on Task 2 tab) */}
              {activeTab === 'task2' && (
                <section className="bg-emerald-900 text-white p-5 rounded-3xl shadow-xl border-4 border-emerald-800">
                  <h3 className="font-extrabold text-lg flex items-center gap-2 text-emerald-300 mb-2">
                    <Briefcase size={20} /> 救援後背包 (Rescue Backpack)
                  </h3>
                  <p className="text-xs text-emerald-200 mb-3">選取的裝備會放進這裡，最多選 3 樣：</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((slotIndex) => {
                      const item = backpack[slotIndex];
                      return (
                        <div key={slotIndex} className="bg-emerald-950/70 border-2 border-dashed border-emerald-600/50 rounded-xl p-3 text-center flex flex-col items-center justify-center min-h-[85px]">
                          {item ? (
                            <>
                              <span className="text-2xl mb-1">{item.icon}</span>
                              <span className="text-xs font-bold text-emerald-200 capitalize">{item.eng}</span>
                            </>
                          ) : (
                            <span className="text-xs text-emerald-600 font-mono">裝備格 {slotIndex + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>

            {/* RIGHT COLUMN: Interactive Steps for Task 1 or Task 2 */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* ==================== TASK 1 CONTENT ==================== */}
              {activeTab === 'task1' && (
                <>
                  {/* Step 1.5: Pixel Art Avatar Generator */}
                  <section className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl shadow-xl border-2 border-indigo-700 text-white">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                        <Sparkles size={22} className="text-yellow-400" />
                        像素頭像生成指令 (Pixel Art Avatar Prompt)
                      </h2>
                      <span className="bg-indigo-800 text-indigo-200 text-xs px-2.5 py-1 rounded-full font-mono">16x16 / 32x32</span>
                    </div>
                    <p className="text-xs text-indigo-200 mb-4">將小朋友上傳的照片，轉換成 2D 像素遊戲風格的可愛頭像！</p>
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-indigo-800/60 font-mono text-xs text-indigo-100 leading-relaxed mb-4">
                      {pixelAvatarPrompt}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pixelAvatarPrompt);
                          setIsAvatarPromptCopied(true);
                          setTimeout(() => setIsAvatarPromptCopied(false), 2000);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
                      >
                        {isAvatarPromptCopied ? <Check size={16} /> : <Copy size={16} />}
                        {isAvatarPromptCopied ? '已複製頭像 Prompt！' : '複製像素頭像 Prompt'}
                      </button>

                      <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center gap-1.5 justify-center underline underline-offset-4"
                      >
                        開啟 Gemini 生成像素頭像 ➔
                      </a>
                    </div>
                  </section>

                  {/* Step 2: AI Magic Dictionary */}
                  <section className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 md:p-8 rounded-3xl shadow-lg border-2 border-purple-200">
                    <h2 className="text-2xl font-bold text-purple-900 flex items-center mb-3">
                      <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2</span>
                      AI Magic Dictionary
                    </h2>
                    <p className="text-purple-700 mb-6">老師輸入小朋友說的中文，系統自動轉為英文單字與專屬圖卡！</p>

                    {apiError && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{apiError}</span>
                      </div>
                    )}

                    <div className="flex flex-col xl:flex-row gap-3">
                      <select
                        value={selectedCat}
                        onChange={(e) => setSelectedCat(e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-400 bg-white font-bold text-gray-700 shadow-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                      
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={chineseInput}
                          onChange={(e) => setChineseInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAIGeneration()}
                          placeholder="輸入中文 (如：黑白相間)"
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-400 text-lg shadow-inner bg-white"
                          disabled={isGenerating}
                        />
                        <button 
                          onClick={handleAIGeneration}
                          disabled={isGenerating || !chineseInput.trim()}
                          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                        >
                          {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                          {isGenerating ? '施法中...' : '變魔法!'}
                        </button>
                      </div>
                    </div>

                    {flashcards.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-purple-200">
                        <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ImageIcon size={16} /> Magic Word Cards
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 px-2 -mx-2 snap-x">
                          {flashcards.map(card => (
                            <div key={card.id} className="snap-center shrink-0 w-40 bg-white rounded-2xl border-2 border-purple-100 shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300">
                              <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-2 relative">
                                {renderCardVisual(card.cat, card.eng)}
                              </div>
                              <div className="p-3 text-center bg-gradient-to-b from-white to-purple-50/30">
                                <p className="font-black text-lg text-gray-800 capitalize tracking-wide">{card.eng}</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">{card.chi}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Step 3: Collect Words */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                        <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">3</span>
                        Collect Words
                      </h2>
                      <span className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm">
                        Step {currentCatIndex + 1} of {categories.length}
                      </span>
                    </div>
                    <p className="text-gray-500 mb-6">Teacher, type the words students shout out!</p>
                    
                    <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-inner flex flex-col min-h-[250px] justify-between">
                      <div>
                        <label className="flex items-center text-xl font-bold text-gray-800 mb-4">
                          {categories[currentCatIndex].icon} {categories[currentCatIndex].label}
                        </label>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputs[categories[currentCatIndex].id]}
                            onChange={(e) => handleInputChange(categories[currentCatIndex].id, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddWord(categories[currentCatIndex].id, e)}
                            placeholder={categories[currentCatIndex].placeholder}
                            className="flex-1 px-5 py-4 text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                          />
                          <button 
                            onClick={(e) => handleAddWord(categories[currentCatIndex].id, e)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center"
                          >
                            <Plus size={28} />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-6 min-h-[40px]">
                          {vocabulary[categories[currentCatIndex].id].map(word => (
                            <span 
                              key={word} 
                              className="inline-flex items-center bg-white border-2 border-orange-300 text-orange-700 text-lg font-semibold px-4 py-1.5 rounded-full shadow-sm"
                            >
                              {word}
                              <button 
                                onClick={() => handleRemoveWord(categories[currentCatIndex].id, word)}
                                className="ml-3 text-orange-400 hover:text-red-500 transition-colors focus:outline-none"
                              >
                                <Trash2 size={16} />
                              </button>
                            </span>
                          ))}
                          {vocabulary[categories[currentCatIndex].id].length === 0 && (
                            <span className="text-gray-400 italic flex items-center h-full">No words yet...</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setCurrentCatIndex(prev => Math.max(0, prev - 1))}
                          disabled={currentCatIndex === 0}
                          className="px-5 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg disabled:opacity-30 hover:bg-gray-300 transition-colors"
                        >
                          ← 上一個
                        </button>
                        <button
                          onClick={() => setCurrentCatIndex(prev => Math.min(categories.length - 1, prev + 1))}
                          disabled={currentCatIndex === categories.length - 1}
                          className="px-5 py-2.5 bg-blue-500 text-white font-bold rounded-lg disabled:opacity-30 hover:bg-blue-600 transition-colors"
                        >
                          下一個 →
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Step 4: Magic Sentences */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-10 opacity-50"></div>
                    
                    <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-6">
                      <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">4</span>
                      Magic Sentences
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-xl text-gray-700 font-medium leading-relaxed">
                      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-orange-400 uppercase tracking-wider">Appearance</p>
                        <p>Look at the {formatList(vocabulary.animal)}! It's {formatList(vocabulary.color)}.</p>
                      </div>
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-blue-400 uppercase tracking-wider">Details</p>
                        <p>It is a {formatList(vocabulary.size)}, {formatList(vocabulary.age)} {formatList(vocabulary.animal)}.</p>
                      </div>
                      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-red-400 uppercase tracking-wider">Feelings</p>
                        <p>The poor {formatList(vocabulary.animal)} feels {formatList(vocabulary.emotion)}.</p>
                      </div>
                      <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-purple-400 uppercase tracking-wider">Background</p>
                        <p>It was found in the {formatList(vocabulary.environment)}.</p>
                      </div>
                      <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-200 shadow-sm md:col-span-2">
                        <p className="mb-2 text-sm font-bold text-teal-400 uppercase tracking-wider">Other Features</p>
                        <p>Special traits: {formatList(vocabulary.other)}.</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 5: RPG Character Unlocked */}
                  <section className="bg-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl text-white relative border-4 border-slate-700">
                    <h2 className="text-2xl font-bold flex items-center mb-6 text-yellow-400">
                      <span className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg font-black">5</span>
                      RPG Character Unlocked!
                    </h2>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                      <div className="w-full md:w-32 h-32 shrink-0 bg-slate-700 rounded-2xl border-4 border-slate-600 flex items-center justify-center flex-col shadow-inner">
                         <Wand2 size={48} className="text-slate-400 mb-2" />
                         <span className="text-xs font-mono text-slate-400">Prompt</span>
                      </div>
                      
                      <div className="flex-1 space-y-4 font-mono w-full">
                        <div className="border-b border-slate-700 pb-2">
                          <h3 className="text-xl font-bold text-white mb-1">小貓/小狗待救援處境 (Image Prompt)</h3>
                          <p className="text-sm text-yellow-500">將這段咒語交給 AI，還原救援現場！（⚠️ 記得要上傳照片喔！）</p>
                        </div>
                        
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 text-slate-300 text-sm md:text-base leading-relaxed break-words">
                          [IMPORTANT: Please strictly base the animal's appearance, colors, and markings on the uploaded photo!]<br/><br/>
                          Create a cute, playful, and childlike children's book illustration (NOT realistic) of this rescued {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} waiting for help.<br/>
                          The {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} is {vocabulary.size.length ? vocabulary.size.join(', ') : '[Size]'}, {vocabulary.age.length ? vocabulary.age.join(', ') : '[Age]'}, and has {vocabulary.color.length ? vocabulary.color.join(' and ') : '[Color]'} fur.<br/>
                          It is currently trapped or found in {vocabulary.environment.length ? vocabulary.environment.join(', ') : '[Place]'}.<br/>
                          The poor {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} looks {vocabulary.emotion.length ? vocabulary.emotion.join(' and ') : '[Emotion]'}.<br/>
                          Special features: {vocabulary.other.length ? vocabulary.other.join(', ') : '[Other traits]'}.<br/>
                          The atmosphere shows its rescue situation, slightly dramatic but with a warm, comforting light of hope shining on it.
                        </div>
                        
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                           <button 
                             onClick={() => {
                               const promptText = `[IMPORTANT: Please strictly base the animal's appearance, colors, and markings on the uploaded photo!] Create a cute, playful, and childlike children's book illustration (NOT realistic) of this rescued ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} waiting for help. The ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} is ${vocabulary.size.length ? vocabulary.size.join(', ') : 'medium'}, ${vocabulary.age.length ? vocabulary.age.join(', ') : 'unknown age'}, and has ${vocabulary.color.length ? vocabulary.color.join(' and ') : 'unspecified'} fur. It is currently trapped or found in ${vocabulary.environment.length ? vocabulary.environment.join(', ') : 'an unknown place'}. The poor ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} looks ${vocabulary.emotion.length ? vocabulary.emotion.join(' and ') : 'anxious'}. Special features: ${vocabulary.other.length ? vocabulary.other.join(', ') : 'none'}. The atmosphere shows its rescue situation, slightly dramatic but with a warm, comforting light of hope shining on it.`;
                               navigator.clipboard.writeText(promptText);
                               setIsCopied(true);
                               setTimeout(() => setIsCopied(false), 2000);
                             }}
                             className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                           >
                             {isCopied ? <Check size={20} /> : <Copy size={20} />}
                             {isCopied ? '已複製 (Copied!)' : '複製prompt'}
                           </button>

                           <a 
                             href="https://gemini.google.com/" 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-2 transition-colors underline underline-offset-4 w-full sm:w-auto justify-center sm:justify-start"
                           >
                             開啟 Gemini 生成圖片 ➔
                           </a>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Step 6 (NEW): Deploy Cat to RPG Map Panel */}
                  <section className="bg-slate-900 p-6 rounded-3xl border-4 border-indigo-600 text-white shadow-2xl">
                    <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2 mb-2">
                      <MapPin size={26} className="text-indigo-400" />
                      置入貓咪角色於 2D 遊戲地圖 (Deploy Cat to RPG Map)
                    </h2>
                    <p className="text-xs text-slate-300 mb-6">小朋友完成描述後，可以在地圖上記錄點位，將自訂小貓放入 2D 遊戲中！</p>

                    {deploySuccessMsg && (
                      <div className="mb-4 bg-emerald-900/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl font-bold text-sm">
                        {deploySuccessMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Mini Map Coordinate Picker */}
                      <div>
                        <p className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-1">
                          <Grid size={14} /> 點擊地圖選擇放置位置 (X: {deployX}, Y: {deployY})
                        </p>
                        <div className="grid grid-cols-20 gap-0.5 bg-slate-950 p-2 rounded-xl border border-slate-700 aspect-square max-w-[280px] mx-auto md:mx-0">
                          {INITIAL_MAP_DATA.map((row, y) => 
                            row.map((tile, x) => {
                              const isSelected = deployX === x && deployY === y;
                              const isWalkable = tile === 0 || tile === 1;
                              const hasExistingCat = gameCats.some(c => c.mapX === x && c.mapY === y);

                              return (
                                <button
                                  key={`${x}_${y}`}
                                  onClick={() => {
                                    if (isWalkable) {
                                      setDeployX(x);
                                      setDeployY(y);
                                    }
                                  }}
                                  className={`aspect-square text-[8px] flex items-center justify-center rounded-xs transition-transform ${
                                    isSelected 
                                      ? 'bg-yellow-400 ring-2 ring-yellow-300 scale-125 z-10' 
                                      : hasExistingCat
                                      ? 'bg-red-500 text-white'
                                      : tile === 2
                                      ? 'bg-amber-900/60 opacity-50'
                                      : tile === 1
                                      ? 'bg-slate-700'
                                      : 'bg-emerald-900/50 hover:bg-emerald-700'
                                  }`}
                                  title={`X: ${x}, Y: ${y}`}
                                >
                                  {isSelected ? '📍' : hasExistingCat ? '🐱' : ''}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Deploy Options Form */}
                      <div className="space-y-4 text-sm font-sans">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">小貓/小狗名字 (Cat Name)</label>
                          <input
                            type="text"
                            value={deployCatName}
                            onChange={(e) => setDeployCatName(e.target.value)}
                            placeholder="如: Lucky, Mimi"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">救援情境關卡 (Rescue Mission Type)</label>
                          <select
                            value={deployCatDanger}
                            onChange={(e) => setDeployCatDanger(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                          >
                            <option value="feed">🥛 孤單發抖 (Cold & Alone - Feeding Mission)</option>
                            <option value="car_engine">🚗 躲車底引擎室 (Car Engine Rescue)</option>
                          </select>
                        </div>

                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                          <p><span className="text-yellow-400 font-bold">目前定位:</span> X={deployX}, Y={deployY}</p>
                          <p><span className="text-yellow-400 font-bold">特徵狀態:</span> {vocabulary.color.join('/') || '無特別指定'} / {vocabulary.emotion.join('/') || '無'}</p>
                        </div>

                        <button
                          onClick={handleDeployToMap}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <Play size={18} /> 🚀 置入角色至 RPG 地圖 (Deploy Cat)
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* ==================== TASK 2 CONTENT ==================== */}
              {activeTab === 'task2' && (
                <>
                  {/* Step 2A: Rescue Inventory */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100">
                    <h2 className="text-2xl font-bold text-emerald-900 flex items-center mb-2">
                      <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2A</span>
                      Rescue Inventory (救援裝備庫)
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">點擊裝備帶上它！帶領小朋友認識救援必備的英文單字：</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {[...rescueItems, ...customRescueItems].map((item) => {
                        const isSelected = backpack.some(i => i.id === item.id);
                        const isCustom = item.id.startsWith('custom_');
                        return (
                          <div key={item.id} className="relative group">
                            <button
                              onClick={() => toggleBackpackItem(item)}
                              className={`w-full h-full p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400 shadow-sm' 
                                  : 'border-gray-200 bg-white hover:border-emerald-200'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-3xl">{item.icon}</span>
                                {isSelected && <CheckCircle2 size={18} className="text-emerald-600" />}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 capitalize text-sm">{item.eng}</p>
                                <p className="text-xs text-gray-400">{item.chi}</p>
                              </div>
                            </button>
                            {isCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveCustomRescueItem(item.id);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition-colors"
                                title="刪除自訂裝備"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                      <p className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
                        <Plus size={16} className="text-emerald-600" />
                        自由新增自訂裝備 (Custom Rescue Item)
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={customItemEng}
                          onChange={(e) => setCustomItemEng(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRescueItem(e)}
                          placeholder="英文名稱 (例：flashlight, treats)"
                          className="flex-1 px-3 py-2 text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                        />
                        <input
                          type="text"
                          value={customItemChi}
                          onChange={(e) => setCustomItemChi(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRescueItem(e)}
                          placeholder="中文名稱 (例：手電筒、零食)"
                          className="flex-1 px-3 py-2 text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                        />
                        <button
                          onClick={handleAddCustomRescueItem}
                          disabled={!customItemEng.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                        >
                          新增裝備
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Step 2B: Choose Your Action */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100 space-y-6">
                    <h2 className="text-2xl font-bold text-emerald-900 flex items-center">
                      <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2B</span>
                      Choose Your Action (救援行動抉擇)
                    </h2>
                    <p className="text-gray-500 text-sm">遇到現場狀況，引導小朋友選擇正確的動作 (Verbs)：</p>

                    <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
                      <p className="font-bold text-emerald-900 mb-1">狀況一：動物看起來非常緊張！(The animal is scared!)</p>
                      <p className="text-xs text-emerald-700 mb-3">你該怎麼靠近牠？</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => setActionChoice1('slow')}
                          className={`p-3 rounded-xl font-bold border-2 text-left flex items-center justify-between transition-all ${
                            actionChoice1 === 'slow' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <span>🚶‍♂️ Walk slowly (慢慢走)</span>
                          {actionChoice1 === 'slow' && <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded">正確! ❤️</span>}
                        </button>
                        <button
                          onClick={() => setActionChoice1('fast')}
                          className={`p-3 rounded-xl font-bold border-2 text-left flex items-center justify-between transition-all ${
                            actionChoice1 === 'fast' ? 'bg-red-500 text-white border-red-600' : 'bg-white border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <span>🏃‍♂️ Run fast (快速跑)</span>
                          {actionChoice1 === 'fast' && <span className="text-xs bg-red-700 px-2 py-0.5 rounded">小動物嚇跑了 💨</span>}
                        </button>
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
                      <p className="font-bold text-emerald-900 mb-1">狀況二：牠躲在車底不肯出來！(Hiding under the car!)</p>
                      <p className="text-xs text-emerald-700 mb-3">你該怎麼吸引牠？</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => setActionChoice2('food')}
                          className={`p-3 rounded-xl font-bold border-2 text-left flex items-center justify-between transition-all ${
                            actionChoice2 === 'food' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <span>罐頭/食物 (Give food)</span>
                          {actionChoice2 === 'food' && <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded">好香! 🥩</span>}
                        </button>
                        <button
                          onClick={() => setActionChoice2('shout')}
                          className={`p-3 rounded-xl font-bold border-2 text-left flex items-center justify-between transition-all ${
                            actionChoice2 === 'shout' ? 'bg-red-500 text-white border-red-600' : 'bg-white border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <span>🔊 Shout "Come out!" (大聲叫)</span>
                          {actionChoice2 === 'shout' && <span className="text-xs bg-red-700 px-2 py-0.5 rounded">躲更深了 🙀</span>}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Step 2C: Vet Check-up */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100">
                    <h2 className="text-2xl font-bold text-emerald-900 flex items-center mb-2">
                      <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2C</span>
                      Vet Check-up (獸醫初步檢查)
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">救援成功！帶到診所，練習身體部位 (Body Parts) 的英文：</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: 'ears', label: 'Ears (耳朵)', options: ['dirty', 'clean', 'injured'] },
                        { key: 'eyes', label: 'Eyes (眼睛)', options: ['clean', 'watery', 'bright'] },
                        { key: 'paws', label: 'Paws (肉墊/爪)', options: ['cold', 'warm', 'dirty'] },
                        { key: 'body', label: 'Body (身體)', options: ['healthy', 'thin', 'soft'] },
                      ].map((part) => (
                        <div key={part.key} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-700 mb-2">{part.label}</p>
                          <div className="flex gap-2">
                            {part.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setVetCheck({ ...vetCheck, [part.key]: opt })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                  vetCheck[part.key] === opt 
                                    ? 'bg-emerald-600 text-white shadow-sm' 
                                    : 'bg-white text-gray-600 border border-gray-300'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Step 2D: Rescue Report */}
                  <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100">
                    <h2 className="text-2xl font-bold text-emerald-900 flex items-center mb-4">
                      <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2D</span>
                      Rescue Report (救援英文報告)
                    </h2>
                    <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-3 text-lg text-emerald-950 font-medium">
                      <p>We brought a <span className="font-bold text-emerald-700 underline">{backpack.length ? backpack.map(i => i.eng).join(', ') : 'carrier and blanket'}</span> to rescue the {currentAnimalName}.</p>
                      <p>We <span className="font-bold text-emerald-700 underline">{actionChoice1 === 'slow' ? 'walked slowly' : 'approached'}</span> and gave it <span className="font-bold text-emerald-700 underline">{actionChoice2 === 'food' ? 'delicious food' : 'a warm welcome'}</span>.</p>
                      <p>At the vet: Its ears are <span className="font-bold text-emerald-700 underline">{vetCheck.ears}</span>, but its body is <span className="font-bold text-emerald-700 underline">{vetCheck.body}</span> now!</p>
                    </div>
                  </section>

                  {/* Task 2 Complete Prompt */}
                  <section className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl text-white border-4 border-emerald-700 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold flex items-center text-emerald-400">
                        <Award size={28} className="mr-2 text-emerald-400" />
                        Task 2 Complete: Happy Ending Unlocked!
                      </h2>
                    </div>

                    <div className="space-y-4 font-mono">
                      <div className="border-b border-slate-700 pb-2">
                        <h3 className="text-lg font-bold text-white">救援成功！溫馨未來 (Happy Rescue Image Prompt)</h3>
                        <p className="text-xs text-emerald-400">將這段咒語貼給 Gemini，產出小動物被拯救後幸福溫馨的繪本畫面！</p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-700 text-slate-300 text-sm leading-relaxed">
                        {task2Prompt}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(task2Prompt);
                            setIsCopiedTask2(true);
                            setTimeout(() => setIsCopiedTask2(false), 2000);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          {isCopiedTask2 ? <Check size={20} /> : <Copy size={20} />}
                          {isCopiedTask2 ? '已複製！(Copied)' : '複製 Task 2 救援成功 Prompt'}
                        </button>

                        <a 
                          href="https://gemini.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-2 transition-colors underline underline-offset-4 w-full sm:w-auto justify-center"
                        >
                          開啟 Gemini 生成圖片 ➔
                        </a>
                      </div>
                    </div>
                  </section>
                </>
              )}

            </div>
          </div>
        )}

      </div>

      <footer className="text-center mt-12 text-gray-400 text-sm">
        <p>© 2026 Cat & Dog Rescue RPG English Project | Project-Based Learning</p>
      </footer>
    </div>
  );
}

function PawsAndPlay({ gameCats, setGameCats }) {
  const [gameState, setGameState] = useState('START'); // START, MAP, MINIGAME, PROFILE, CREATOR, VOCAB
  const [activeCat, setActiveCat] = useState(null);
  
  // Feeding Mini-game state
  const [feedStep, setFeedStep] = useState(1); // 1: Observe, 2: Heat, 3: Feed, 4: Blanket
  const [temperature, setTemperature] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [tempMsg, setTempMsg] = useState('');
  
  // Car Engine Mini-game state
  const [carStep, setCarStep] = useState(1); // 1: Tap, 2: Food

  // Creator Form state
  const [creatorForm, setCreatorForm] = useState({
    name: 'Happy',
    danger: 'feed',
    story: 'Happy was ALONE. No mother cat around. He was cold and hungry in the rain.',
    x: 16,
    y: 3,
    element: '4' // Box
  });

  const canvasRef = useRef(null);
  const requestRef = useRef();
  const keysRef = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false });
  
  const gameDataRef = useRef({ cats: [...gameCats], map: JSON.parse(JSON.stringify(INITIAL_MAP_DATA)) });

  // Keep gameDataRef in sync with gameCats prop
  useEffect(() => {
    gameDataRef.current.cats = [...gameCats];
  }, [gameCats]);

  const playerRef = useRef({
    x: 7, y: 17, 
    pixelX: 7 * 32, pixelY: 17 * 32,
    targetX: 7, targetY: 17, 
    moving: false, speed: 2
  });

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateImagePrompt = (cat) => {
    let situation = "";
    if (cat.rescueType === 'feed') {
      situation = "alone and cold inside a cardboard box during a heavy rain";
    } else if (cat.rescueType === 'car_engine') {
      situation = "hiding under the hood of a car, peeking out nervously";
    } else {
      situation = "waiting to be rescued on the street";
    }
    return `Create a heartwarming children's storybook illustration of a small street cat named ${cat.profile.name}. The cat is ${situation}. The style should be emotional but hopeful, with soft lighting and cute details. (Based on magic sentences: ${cat.profile.story})`;
  };

  const startMiniGame = (cat) => {
    for (let k in keysRef.current) keysRef.current[k] = false;
    setActiveCat(cat);
    setGameState('MINIGAME');
    
    if (cat.rescueType === 'feed') {
      setFeedStep(1); setTemperature(0); setTempMsg('');
    } else if (cat.rescueType === 'car_engine') {
      setCarStep(1);
    }
  };

  const finishMiniGame = () => {
    setGameState('PROFILE');
    const remainingCats = gameDataRef.current.cats.filter(c => c.id !== activeCat.id);
    gameDataRef.current.cats = remainingCats;
    setGameCats(remainingCats);
  };

  useEffect(() => {
    let interval;
    if (isHeating && feedStep === 2) {
      interval = setInterval(() => {
        setTemperature(prev => (prev >= 100 ? 100 : prev + 2));
      }, 50);
    } else if (!isHeating && feedStep === 2 && temperature > 0) {
      if (temperature >= 40 && temperature <= 60) {
        setTempMsg('Perfect! The milk is WARM.');
        setTimeout(() => setFeedStep(3), 1500);
      } else if (temperature > 60) {
        setTempMsg('Too HOT! Let it cool down.');
        setTimeout(() => { setTemperature(0); setTempMsg(''); }, 1000);
      } else {
        setTempMsg('Too COLD! Keep heating.');
        setTimeout(() => { setTemperature(0); setTempMsg(''); }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isHeating, temperature, feedStep]);

  const drawMap = (ctx) => {
    const data = gameDataRef.current;
    for (let y = 0; y < data.map.length; y++) {
      for (let x = 0; x < data.map[y].length; x++) {
        const tile = data.map[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        if (tile === 1) { 
          ctx.fillStyle = '#9ca3af'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#d1d5db'; ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#f3f4f6'; ctx.fillRect(px + 14, py + 14, 4, 4);
        } else { 
          ctx.fillStyle = '#86efac'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#4ade80'; ctx.fillRect(px + 4, py + 4, 4, 4);
          ctx.fillRect(px + 24, py + 20, 4, 4); ctx.fillRect(px + 10, py + 26, 4, 4);
        }

        if (tile === 2) { 
          ctx.fillStyle = '#78350f'; ctx.fillRect(px + 12, py + 16, 8, 14);
          ctx.fillStyle = '#166534'; ctx.beginPath(); ctx.arc(px + 16, py + 12, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(px + 12, py + 8, 6, 0, Math.PI * 2); ctx.fill();
        } else if (tile === 3) { 
          ctx.fillStyle = '#fef3c7'; ctx.fillRect(px + 2, py + 14, 28, 16);
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(px, py + 14); ctx.lineTo(px + 16, py + 2); ctx.lineTo(px + 32, py + 14); ctx.fill();
          ctx.fillStyle = '#8b5cf6'; ctx.fillRect(px + 12, py + 20, 8, 10);
          ctx.fillStyle = '#93c5fd'; ctx.fillRect(px + 4, py + 18, 6, 6); ctx.fillRect(px + 22, py + 18, 6, 6);
        } else if (tile === 4) {
          ctx.fillStyle = '#d97706'; ctx.fillRect(px + 4, py + 12, 24, 16);
          ctx.fillStyle = '#b45309'; ctx.fillRect(px + 6, py + 14, 20, 12);
        } else if (tile === 5) {
          ctx.fillStyle = '#374151'; ctx.fillRect(px + 4, py + 22, 6, 6); ctx.fillRect(px + 22, py + 22, 6, 6);
          ctx.fillStyle = '#ef4444'; ctx.fillRect(px + 2, py + 12, 28, 12);
          ctx.fillStyle = '#93c5fd'; ctx.fillRect(px + 6, py + 8, 20, 8);
        }
      }
    }

    const bounce = Math.sin(Date.now() / 300) * 2;
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    data.cats.forEach(cat => {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(cat.mapX * TILE_SIZE + 16, cat.mapY * TILE_SIZE + 24, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(cat.emoji || "🐈", cat.mapX * TILE_SIZE + 16, cat.mapY * TILE_SIZE + 16 + bounce);
    });
  };

  const drawPlayer = (ctx) => {
    const p = playerRef.current;
    
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(p.pixelX + 16, p.pixelY + 28, 10, 4, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#3b82f6'; ctx.fillRect(p.pixelX + 10, p.pixelY + 16, 12, 12);
    ctx.fillStyle = '#92400e'; ctx.fillRect(p.pixelX + 6, p.pixelY + 18, 4, 8); 
    
    ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(p.pixelX + 16, p.pixelY + 10, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.arc(p.pixelX + 16, p.pixelY + 8, 8, 0, Math.PI, true); ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.fillRect(p.pixelX + 12, p.pixelY + 8, 2, 2); ctx.fillRect(p.pixelX + 18, p.pixelY + 8, 2, 2);
    
    const legOffset = p.moving ? Math.sin(Date.now() / 100) * 2 : 0;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(p.pixelX + 11, p.pixelY + 28 + legOffset, 4, 4);
    ctx.fillRect(p.pixelX + 17, p.pixelY + 28 - legOffset, 4, 4);
  };

  const updatePlayer = () => {
    const p = playerRef.current;
    const keys = keysRef.current;
    const data = gameDataRef.current;

    if (p.moving) {
      let dx = p.targetX * TILE_SIZE - p.pixelX;
      let dy = p.targetY * TILE_SIZE - p.pixelY;

      if (dx > 0) p.pixelX += p.speed; else if (dx < 0) p.pixelX -= p.speed;
      if (dy > 0) p.pixelY += p.speed; else if (dy < 0) p.pixelY -= p.speed;

      if (p.pixelX === p.targetX * TILE_SIZE && p.pixelY === p.targetY * TILE_SIZE) {
        p.moving = false; p.x = p.targetX; p.y = p.targetY;
      }
      return;
    }

    let nextX = p.x;
    let nextY = p.y;
    if (keys.ArrowUp || keys.w) nextY--;
    else if (keys.ArrowDown || keys.s) nextY++;
    else if (keys.ArrowLeft || keys.a) nextX--;
    else if (keys.ArrowRight || keys.d) nextX++;

    if (nextX !== p.x || nextY !== p.y) {
      const encounteredCat = data.cats.find(c => c.mapX === nextX && c.mapY === nextY);
      if (encounteredCat) {
        startMiniGame(encounteredCat);
        return;
      }

      if (nextX >= 0 && nextX < data.map[0].length && nextY >= 0 && nextY < data.map.length) {
        if (data.map[nextY][nextX] === 0 || data.map[nextY][nextX] === 1) {
          p.targetX = nextX; p.targetY = nextY; p.moving = true;
        }
      }
    }
  };

  const gameLoop = () => {
    if (gameState === 'MAP' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      updatePlayer();
      ctx.clearRect(0, 0, 640, 640);
      drawMap(ctx);
      drawPlayer(ctx);
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if(keysRef.current.hasOwnProperty(e.key)) keysRef.current[e.key] = true; };
    const handleKeyUp = (e) => { if(keysRef.current.hasOwnProperty(e.key)) keysRef.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const dpadProps = (keyName) => ({
    onTouchStart: (e) => { e.preventDefault(); keysRef.current[keyName] = true; },
    onTouchEnd: (e) => { e.preventDefault(); keysRef.current[keyName] = false; },
    onMouseDown: (e) => { e.preventDefault(); keysRef.current[keyName] = true; },
    onMouseUp: (e) => { e.preventDefault(); keysRef.current[keyName] = false; },
    onMouseLeave: (e) => { e.preventDefault(); keysRef.current[keyName] = false; }
  });

  const handleDeploy = () => {
    const newCat = {
      id: "cat_" + Date.now(),
      rescueType: creatorForm.danger,
      mapX: Number(creatorForm.x),
      mapY: Number(creatorForm.y),
      emoji: "🐈",
      profile: {
        name: creatorForm.name,
        englishDesc: `Rescue Mission for ${creatorForm.name}`,
        story: creatorForm.story,
      }
    };
    
    const updated = [...gameCats, newCat];
    setGameCats(updated);
    gameDataRef.current.cats = updated;

    if (creatorForm.element !== '0' && gameDataRef.current.map[creatorForm.y]?.[creatorForm.x] !== undefined) {
      gameDataRef.current.map[creatorForm.y][creatorForm.x] = Number(creatorForm.element);
    }
    setGameState('MAP');
  };

  return (
    <div className="relative w-full max-w-[660px] h-[660px] flex justify-center items-center bg-gray-900 rounded-3xl overflow-hidden select-none font-sans border-4 border-indigo-800 shadow-2xl">
      <style>{`
        @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 25% { transform: translate(-1px, -2px) rotate(-5deg); } 50% { transform: translate(-3px, 0px) rotate(5deg); } 75% { transform: translate(3px, 2px) rotate(0deg); } 100% { transform: translate(1px, -1px) rotate(0deg); } }
        .shaking { animation: shake 0.5s infinite; }
      `}</style>

      {/* Top Controls */}
      {gameState === 'MAP' && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => setGameState('CREATOR')} className="bg-white/90 border-2 border-indigo-500 text-indigo-600 font-black py-1.5 px-3 rounded-xl shadow text-xs hover:bg-indigo-50 transition transform hover:scale-105">
            🛠️ AI Creator
          </button>
          <button onClick={() => setGameState('VOCAB')} className="bg-white/90 border-2 border-yellow-500 text-yellow-600 font-black py-1.5 px-3 rounded-xl shadow text-xs hover:bg-yellow-50 transition transform hover:scale-105">
            📚 Mission Deck
          </button>
        </div>
      )}

      <canvas ref={canvasRef} width={640} height={640} className="w-full h-full rounded-2xl bg-gray-800" style={{ imageRendering: 'pixelated' }} />

      {/* Touch D-Pad */}
      {gameState === 'MAP' && (
        <div className="absolute bottom-4 right-4 grid grid-cols-3 grid-rows-3 gap-1 md:hidden z-10 opacity-80">
          <div className="col-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowUp')}>▲</div>
          <div className="col-start-1 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowLeft')}>◀</div>
          <div className="col-start-3 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowRight')}>▶</div>
          <div className="col-start-2 row-start-3 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowDown')}>▼</div>
        </div>
      )}

      {/* Overlays */}
      {gameState !== 'MAP' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-20 overflow-y-auto p-4">
          
          {/* Start Screen */}
          {gameState === 'START' && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-indigo-500">
              <h1 className="text-3xl font-black text-indigo-600 mb-1">Paws & Play</h1>
              <p className="text-gray-600 font-bold mb-4 text-xs">Street Cat Heroes 2D RPG</p>
              <div className="text-left text-xs text-gray-600 mb-6 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p>🎮 <b>How to play:</b></p>
                <p>1. Use Keyboard (WASD / Arrow Keys) or Touch D-Pad.</p>
                <p>2. Walk up to stray cats (🐈) on the map.</p>
                <p>3. Complete rescue mini-games and learn English!</p>
              </div>
              <button onClick={() => setGameState('MAP')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">Start Game 🚀</button>
            </div>
          )}

          {/* Mini-Game: Feeding */}
          {gameState === 'MINIGAME' && activeCat?.rescueType === 'feed' && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-blue-400 relative">
              <div className="absolute top-3 right-4 text-xs font-bold text-gray-700 tracking-widest">🐟 ({feedStep}/4)</div>
              <h2 className="text-2xl font-black text-blue-800 mb-2 mt-4">Feeding & Care</h2>
              <div className={`text-6xl mb-4 flex justify-center transition-transform ${feedStep <= 2 ? 'shaking' : ''}`}>{feedStep <= 2 ? '🐱📦' : feedStep === 3 ? '🐱🍼' : '🐱🛌'}</div>
              {feedStep === 1 && (
                <>
                  <p className="text-gray-600 mb-4 text-xs font-bold">Step 1: Observe! Is the mother cat here?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setTempMsg("DON'T TOUCH! The mother cat will abandon the kitten.")} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded-xl text-xs shadow">👀 Yes</button>
                    <button onClick={() => { setTempMsg("Good! The kitten is alone."); setTimeout(() => setFeedStep(2), 1500); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded-xl text-xs shadow">🚫 No</button>
                  </div>
                  <p className={`text-xs font-bold mt-2 h-8 ${tempMsg.includes("DON'T") ? 'text-red-600' : 'text-green-600'}`}>{tempMsg}</p>
                </>
              )}
              {feedStep === 2 && (
                <>
                  <p className="text-gray-600 mb-4 text-xs font-bold">Step 2: Heat the milk!</p>
                  <div className="w-full h-5 bg-gray-200 rounded-full mb-4 relative overflow-hidden border border-gray-400">
                    <div className="absolute left-[40%] w-[20%] h-full bg-green-500/40 border-l border-r border-dashed border-gray-700" />
                    <div className={`h-full transition-all duration-100 ${temperature < 40 ? 'bg-blue-500' : temperature <= 60 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${temperature}%` }} />
                  </div>
                  <button onMouseDown={() => setIsHeating(true)} onMouseUp={() => setIsHeating(false)} onMouseLeave={() => setIsHeating(false)} onTouchStart={() => setIsHeating(true)} onTouchEnd={() => setIsHeating(false)} disabled={tempMsg.includes('Perfect')} className="w-full bg-orange-500 text-white font-bold py-2.5 px-4 rounded-xl shadow text-xs active:scale-95 disabled:opacity-50">🔥 Heat Milk (Hold)</button>
                  <p className={`text-xs font-bold mt-2 h-5 ${temperature > 60 ? 'text-red-600' : temperature >= 40 ? 'text-green-600' : 'text-blue-600'}`}>{tempMsg}</p>
                </>
              )}
              {feedStep === 3 && (
                <>
                  <p className="text-gray-600 mb-4 text-xs font-bold">Step 3: Aim for a mouth.</p>
                  <button onClick={() => setFeedStep(4)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl shadow text-xs active:scale-95">🍼 Use Bottle on a mouth</button>
                </>
              )}
              {feedStep === 4 && (
                <>
                  <p className="text-gray-600 mb-4 text-xs font-bold">Step 4: Keep a tummy warm.</p>
                  <button onClick={finishMiniGame} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl shadow text-xs active:scale-95">🛌 Put Blanket on a tummy</button>
                </>
              )}
            </div>
          )}

          {/* Mini-Game: Car Engine */}
          {gameState === 'MINIGAME' && activeCat?.rescueType === 'car_engine' && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-red-400 relative">
              <h2 className="text-2xl font-black text-red-800 mb-2">Car Rescue!</h2>
              <p className="text-gray-600 mb-4 text-xs font-bold">{carStep === 1 ? "The cat is under the hood! Very dangerous! First, alert her." : "Great! She peeked out. Now use wet food to lure her out!"}</p>
              <div className="text-5xl mb-6 transition-transform" style={{ transform: carStep === 2 ? 'scale(1.2)' : 'none' }}>{carStep === 1 ? '🚗' : '🐈💕'}</div>
              <div className="flex gap-2">
                <button onClick={() => setCarStep(2)} disabled={carStep === 2} className={`flex-1 font-bold py-2.5 px-2 rounded-xl text-xs shadow ${carStep === 1 ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>👋 Tap Hood</button>
                <button onClick={finishMiniGame} disabled={carStep === 1} className={`flex-1 font-bold py-2.5 px-2 rounded-xl text-xs shadow ${carStep === 2 ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>🐟 Use Food</button>
              </div>
            </div>
          )}

          {/* Profile Card & Prompt Generator */}
          {gameState === 'PROFILE' && activeCat && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-indigo-500 relative max-h-[85vh] overflow-y-auto">
              
              <div className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
                🎉 RPG Character Unlocked!
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">{activeCat.profile.name}</h2>
              
              <div className="text-left bg-gray-50 p-3 rounded-lg mb-4 text-xs text-gray-700 leading-relaxed border border-gray-200">
                <span className="font-bold text-indigo-600 block mb-1">✨ Magic Sentences (故事):</span>
                {activeCat.profile.story}
              </div>

              <div className="text-left bg-indigo-50 p-3 rounded-lg mb-4 text-xs border-2 border-indigo-200">
                <span className="font-bold text-indigo-800 block mb-2">🖼️ 圖像生成指令 (Image Prompt):</span>
                <p className="text-gray-600 italic mb-3 bg-white p-2 rounded border border-indigo-100 text-[11px] select-all">
                  "{generateImagePrompt(activeCat)}"
                </p>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateImagePrompt(activeCat));
                    alert("已複製指令！現在可以貼上給 Gemini 囉！(Copied!)");
                  }}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded-xl text-xs shadow transition mb-2 flex justify-center items-center gap-2"
                >
                  📋 複製 prompt 給 Gemini
                </button>
                
                <a 
                  href="https://gemini.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-xl text-xs shadow transition text-center"
                >
                  開啟 Gemini 生成圖片 ➔
                </a>
              </div>
              
              <button 
                onClick={() => { setActiveCat(null); setGameState('MAP'); }} 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl text-xs transition"
              >
                Back to Map (回到地圖)
              </button>
            </div>
          )}

          {/* Creator Panel */}
          {gameState === 'CREATOR' && (
            <div className="bg-white p-5 rounded-2xl w-full max-w-sm text-left shadow-2xl border-4 border-indigo-500 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-black text-indigo-600">🛠️ Cat Story Creator</h2>
                <button onClick={() => setGameState('MAP')} className="text-gray-500 hover:text-red-500 font-bold text-lg">✕</button>
              </div>
              
              <div className="space-y-3 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cat's Name</label>
                  <input type="text" value={creatorForm.name} onChange={e => setCreatorForm({...creatorForm, name: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">1. Danger (Situation)</label>
                  <select value={creatorForm.danger} onChange={e => setCreatorForm({...creatorForm, danger: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none">
                    <option value="feed">Cold & Alone (Lost Kitten)</option>
                    <option value="car_engine">Trapped in Car Engine (Street Cat)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">3. Story (Magic Sentences)</label>
                  <textarea value={creatorForm.story} onChange={e => setCreatorForm({...creatorForm, story: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none min-h-[60px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Map X (0-19)</label>
                    <input type="number" min="0" max="19" value={creatorForm.x} onChange={e => setCreatorForm({...creatorForm, x: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Map Y (0-19)</label>
                    <input type="number" min="0" max="19" value={creatorForm.y} onChange={e => setCreatorForm({...creatorForm, y: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">5. Add Map Element</label>
                  <select value={creatorForm.element} onChange={e => setCreatorForm({...creatorForm, element: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none">
                    <option value="0">None (Grass)</option>
                    <option value="4">📦 Cardboard Box</option>
                    <option value="5">🚗 Car</option>
                  </select>
                </div>
                <button onClick={handleDeploy} className="w-full bg-green-500 text-white font-bold py-2.5 rounded-xl shadow hover:bg-green-600 transition mt-2">🚀 Deploy to Game!</button>
              </div>
            </div>
          )}

          {/* Mission Deck: Vocab & Grammar */}
          {gameState === 'VOCAB' && (
            <div className="bg-white p-5 rounded-2xl w-full max-w-md text-left shadow-2xl border-4 border-yellow-400 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 border-b">
                <h2 className="text-xl font-black text-yellow-600">📚 Mission Deck</h2>
                <button onClick={() => setGameState('MAP')} className="text-gray-500 hover:text-red-500 font-bold text-lg">✕</button>
              </div>
              
              <div className="text-gray-600 mb-3 font-bold text-xs bg-yellow-50 p-2.5 rounded-lg">
                💡 點擊任何英文單字或句子收聽發音 (Click to listen)
              </div>

              <div className="space-y-4">
                
                {/* Block 1: Feeding */}
                <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-3">
                  <h3 className="text-sm font-bold text-blue-800 mb-1.5">🍼 1. Feeding & Care</h3>
                  <div className="flex flex-wrap gap-1.5 mb-2 border-b border-blue-200 pb-2">
                    {['Warm', 'Cold', 'Bottle', 'Milk', 'Blanket'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-blue-300 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold shadow hover:bg-blue-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-xs font-black text-blue-600 mb-1">Grade 3 Grammar</h4>
                  <ul className="space-y-1 text-xs">
                    <li onClick={() => speak('Happy was cold.')} className="bg-white p-1.5 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 font-bold text-gray-700">
                      Happy was <span className="text-blue-600">cold</span>.
                    </li>
                    <li onClick={() => speak('Heat the milk!')} className="bg-white p-1.5 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 font-bold text-gray-700">
                      <span className="text-blue-600">Heat</span> the milk!
                    </li>
                    <li onClick={() => speak('Don\'t touch the kitten!')} className="bg-white p-1.5 rounded border border-blue-100 cursor-pointer hover:bg-red-100 font-bold text-red-700">
                      <span className="text-red-600">Don't</span> touch the kitten!
                    </li>
                  </ul>
                </div>

                {/* Block 2: Medical */}
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-3">
                  <h3 className="text-sm font-bold text-green-800 mb-1.5">🩹 2. Medical Rescue</h3>
                  <div className="flex flex-wrap gap-1.5 mb-2 border-b border-green-200 pb-2">
                    {['Bandage', 'Medicine', 'Vet', 'Clean', 'Heal'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-green-300 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold shadow hover:bg-green-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-xs font-black text-green-600 mb-1">Grade 3 Grammar</h4>
                  <ul className="space-y-1 text-xs">
                    <li onClick={() => speak('Mimi was hurt.')} className="bg-white p-1.5 rounded border border-green-100 cursor-pointer hover:bg-green-100 font-bold text-gray-700">
                      Mimi was <span className="text-green-600">hurt</span>.
                    </li>
                    <li onClick={() => speak('Clean a tail!')} className="bg-white p-1.5 rounded border border-green-100 cursor-pointer hover:bg-green-100 font-bold text-gray-700">
                      <span className="text-green-600">Clean</span> a tail!
                    </li>
                    <li onClick={() => speak('Don\'t use human medicine!')} className="bg-white p-1.5 rounded border border-green-100 cursor-pointer hover:bg-red-100 font-bold text-red-700">
                      <span className="text-red-600">Don't</span> use human medicine!
                    </li>
                  </ul>
                </div>

                {/* Block 3: Tool */}
                <div className="border-2 border-amber-200 bg-amber-50 rounded-xl p-3">
                  <h3 className="text-sm font-bold text-amber-800 mb-1.5">🪜 3. Tool Rescue</h3>
                  <div className="flex flex-wrap gap-1.5 mb-2 border-b border-amber-200 pb-2">
                    {['Ladder', 'Flashlight', 'Treat', 'Up', 'Down'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-amber-300 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold shadow hover:bg-amber-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-xs font-black text-amber-600 mb-1">Grade 3 Grammar</h4>
                  <ul className="space-y-1 text-xs">
                    <li onClick={() => speak('The cat is up in the tree.')} className="bg-white p-1.5 rounded border border-amber-100 cursor-pointer hover:bg-amber-100 font-bold text-gray-700">
                      The cat is <span className="text-amber-600">UP in</span> the tree.
                    </li>
                    <li onClick={() => speak('Use a ladder!')} className="bg-white p-1.5 rounded border border-amber-100 cursor-pointer hover:bg-amber-100 font-bold text-gray-700">
                      <span className="text-amber-600">Use</span> a ladder!
                    </li>
                    <li onClick={() => speak('Don\'t scare the cat!')} className="bg-white p-1.5 rounded border border-amber-100 cursor-pointer hover:bg-red-100 font-bold text-red-700">
                      <span className="text-red-600">Don't</span> scare the cat!
                    </li>
                  </ul>
                </div>

                {/* Block 4: TNR */}
                <div className="border-2 border-indigo-200 bg-indigo-50 rounded-xl p-3">
                  <h3 className="text-sm font-bold text-indigo-800 mb-1.5">🥅 4. TNR (誘捕)</h3>
                  <div className="flex flex-wrap gap-1.5 mb-2 border-b border-indigo-200 pb-2">
                    {['Safe', 'Wait', 'Catch', 'Release'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-indigo-300 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold shadow hover:bg-indigo-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-xs font-black text-indigo-600 mb-1">Grade 3 Grammar</h4>
                  <ul className="space-y-1 text-xs">
                    <li onClick={() => speak('The cat is safe.')} className="bg-white p-1.5 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100 font-bold text-gray-700">
                      The cat is <span className="text-indigo-600">safe</span>.
                    </li>
                    <li onClick={() => speak('Wait for the cat!')} className="bg-white p-1.5 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100 font-bold text-gray-700">
                      <span className="text-indigo-600">Wait</span> for the cat!
                    </li>
                    <li onClick={() => speak('Don\'t open the cage!')} className="bg-white p-1.5 rounded border border-indigo-100 cursor-pointer hover:bg-red-100 font-bold text-red-700">
                      <span className="text-red-600">Don't</span> open the cage!
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}