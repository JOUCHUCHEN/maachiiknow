import React, { useState, useEffect } from 'react';
import { 
  Camera, Plus, Trash2, ArrowRight, Sparkles, Cat, Heart, ShieldAlert, Loader2, 
  Image as ImageIcon, Wand2, Tag, Key, AlertCircle, Copy, Check, Briefcase, 
  Stethoscope, CheckCircle2, ShieldCheck, Award 
} from 'lucide-react';

export default function CatRescueLesson() {
  const [activeTab, setActiveTab] = useState('task1'); // 'task1' | 'task2'

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
  
  const [currentCatIndex, setCurrentCatIndex] = useState(0);

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
          <p className="text-base md:text-lg text-gray-600 font-medium">從「觀察描述」到「展開救援」，帶領小朋友用英文拯救小生命！</p>
        </header>

        {/* Task Navigation Switcher */}
        <div className="flex justify-center border-b border-orange-200 pb-2">
          <div className="bg-orange-100 p-1.5 rounded-2xl flex gap-2 shadow-inner">
            <button
              onClick={() => setActiveTab('task1')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'task1' 
                  ? 'bg-white text-orange-700 shadow-md scale-105' 
                  : 'text-orange-900 hover:bg-orange-200/60'
              }`}
            >
              <Cat size={20} />
              <span>Task 1: 觀察與描述 (Observe)</span>
            </button>
            <button
              onClick={() => setActiveTab('task2')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'task2' 
                  ? 'bg-white text-emerald-700 shadow-md scale-105' 
                  : 'text-orange-900 hover:bg-orange-200/60'
              }`}
            >
              <ShieldCheck size={20} className="text-emerald-600" />
              <span>Task 2: 展開救援 (Rescue)</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
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
                          onKeyDown={(e) => handleAddWord(categories[currentCatIndex].id, e)}
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

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {rescueItems.map((item) => {
                      const isSelected = backpack.some(i => i.id === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleBackpackItem(item)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
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
                      );
                    })}
                  </div>
                </section>

                {/* Step 2B: Choose Your Action */}
                <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-emerald-100 space-y-6">
                  <h2 className="text-2xl font-bold text-emerald-900 flex items-center">
                    <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2B</span>
                    Choose Your Action (救援行動抉擇)
                  </h2>
                  <p className="text-gray-500 text-sm">遇到現場狀況，引導小朋友選擇正確的動作 (Verbs)：</p>

                  {/* Situation 1 */}
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

                  {/* Situation 2 */}
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
                        <span>🥫 Give food (給食物)</span>
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

      </div>

      <footer className="text-center mt-12 text-gray-400 text-sm">
        <p>© 2026 Cat & Dog Rescue RPG English Project | Project-Based Learning</p>
      </footer>
    </div>
  );
}