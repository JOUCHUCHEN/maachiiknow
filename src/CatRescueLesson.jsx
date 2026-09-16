import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, ArrowRight, Sparkles, Cat, Heart, ShieldAlert, Loader2, Image as ImageIcon, Wand2, Tag } from 'lucide-react';

export default function CatRescueLesson() {
  // State for storing vocabulary entered by the teacher/students
  const [vocabulary, setVocabulary] = useState({
    color: [],
    size: [],
    age: [],
    emotion: [],
    environment: [],
    other: []
  });

  // State for handling current input field values
  const [inputs, setInputs] = useState({
    color: '',
    size: '',
    age: '',
    emotion: '',
    environment: '',
    other: ''
  });

  // New states for AI Translation & Image Gen
  const [chineseInput, setChineseInput] = useState('');
  const [selectedCat, setSelectedCat] = useState('color');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

  // Handle typing in input fields
  const handleInputChange = (category, value) => {
    setInputs(prev => ({ ...prev, [category]: value }));
  };

  // Add word to the specific category list on Enter or button click
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

  // Remove a word from the category list
  const handleRemoveWord = (category, wordToRemove) => {
    setVocabulary(prev => ({
      ...prev,
      [category]: prev[category].filter(word => word !== wordToRemove)
    }));
  };

  // API Retry Helper Function
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

  // AI Translation & Image Generation Logic
  const handleAIGeneration = async () => {
    if (!chineseInput.trim()) return;
    setIsGenerating(true);
    const termToTranslate = chineseInput;
    const targetCat = selectedCat;
    
    try {
      // ✨ 這裡已經替換為讀取環境變數的語法
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      
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
      
      let engWord = textResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toLowerCase() || 'unknown';
      // Clean up any stray punctuation from AI
      engWord = engWord.replace(/[^a-z\s-]/g, '');

      const imgUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-image:generateContent?key=${apiKey}`;
      const imgPayload = {
        contents: [{ parts: [{ text: `A simple, cute, flat vector illustration of a cat that represents the concept '${engWord}' (Chinese meaning: ${termToTranslate}). Clean white background, educational children flashcard style, no text in image.` }] }],
        generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
      };
      
      const imgResult = await fetchWithRetry(imgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imgPayload)
      });
      
      const base64Data = imgResult?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      let imageUrl = '';
      if (base64Data) {
        imageUrl = `data:image/png;base64,${base64Data}`;
      }

      // Auto-add to vocabulary if not exists
      if (engWord && !vocabulary[targetCat].includes(engWord)) {
        setVocabulary(prev => ({
          ...prev,
          [targetCat]: [...prev[targetCat], engWord]
        }));
      }
      
      // Save Flashcard
      setFlashcards(prev => [{
        id: Date.now(),
        chi: termToTranslate,
        eng: engWord,
        img: imageUrl,
        cat: targetCat
      }, ...prev]);
      
      setChineseInput('');

    } catch (error) {
      console.error("Error generating AI content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to format an array of words into a natural English list (e.g., "black, white and brown")
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
    { id: 'color', label: 'Color (顏色)', icon: <Sparkles size={18} className="mr-2 text-yellow-500"/>, placeholder: 'e.g., black, white, orange' },
    { id: 'size', label: 'Size (大小)', icon: <Cat size={18} className="mr-2 text-blue-500"/>, placeholder: 'e.g., small, tiny, big' },
    { id: 'age', label: 'Age (年紀)', icon: <Heart size={18} className="mr-2 text-pink-500"/>, placeholder: 'e.g., young, baby, old' },
    { id: 'emotion', label: 'Feelings (情緒)', icon: <Heart size={18} className="mr-2 text-red-500"/>, placeholder: 'e.g., scared, sad, hungry' },
    { id: 'environment', label: 'Danger/Place (危險/環境)', icon: <ShieldAlert size={18} className="mr-2 text-purple-500"/>, placeholder: 'e.g., street, rain, cold' },
    { id: 'other', label: 'Other (其他)', icon: <Tag size={18} className="mr-2 text-teal-500"/>, placeholder: 'e.g., cute, fast, noisy' }
  ];

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <header className="text-center space-y-3">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-bold tracking-wider mb-2 border border-orange-200 shadow-sm">
            CLASS 1: ENGLISH X RPG PROJECT
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-700 drop-shadow-sm flex items-center justify-center gap-3">
            <Cat size={48} className="text-orange-500" />
            Cat Rescue Quest
          </h1>
          <p className="text-lg text-gray-600 font-medium">任務一：描述這位神秘的小客人 (Describe the new friend)</p>
        </header>

        {/* Stacked Layout for Presentation Flow */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Step 1: Image Observation */}
          <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">1</span>
                Look & Observe
              </h2>
              <Camera className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4 w-full text-left">Look at the picture. What do you see? (看看這張照片，你看到了什麼？)</p>
            {/* Placeholder Image - In a real app, you can let teacher upload an image here */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100 group">
              <img 
                src="https://placehold.co/800x600/f8fafc/f97316?text=Image+of+the+Rescued+Cat\n(Put Cat Photo Here)" 
                alt="Rescued Cat"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <p className="text-white font-semibold">Location: Taichung Streets</p>
              </div>
            </div>
          </section>

          {/* New Step 2: AI Magic Translator */}
          <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2</span>
                <Wand2 className="mr-2 text-purple-500" /> AI Magic Dictionary
              </h2>
            </div>
            <p className="text-gray-500 mb-6">小朋友說中文，AI 魔法辭典幫你變成英文單字與圖卡！(Kids speak Chinese, AI translates and draws!)</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select 
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-400 bg-white font-bold text-gray-700 md:w-48 shadow-sm"
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
                  placeholder="輸入小朋友說的中文 (例如：黑白相間、肚子餓)"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-400 text-lg shadow-inner"
                  disabled={isGenerating}
                />
                <button 
                  onClick={handleAIGeneration}
                  disabled={isGenerating || !chineseInput.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  {isGenerating ? '施法中...' : '變魔法!'}
                </button>
              </div>
            </div>

            {/* Generated Flashcards Gallery */}
            {flashcards.length > 0 && (
              <div className="mt-6 pt-6 border-t border-purple-100">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon size={16} /> Magic Word Cards (單字圖卡)
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 -mx-2 snap-x">
                  {flashcards.map(card => (
                    <div key={card.id} className="snap-center shrink-0 w-48 bg-white rounded-2xl border-2 border-gray-100 shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 duration-300">
                      <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-2 relative">
                        {card.img ? (
                          <img src={card.img} alt={card.eng} className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          <ImageIcon className="text-gray-200" size={64} />
                        )}
                        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-purple-600 border border-purple-100 shadow-sm">
                          {categories.find(c => c.id === card.cat)?.label.split(' ')[0]}
                        </span>
                      </div>
                      <div className="p-4 text-center bg-gradient-to-b from-white to-purple-50/30">
                        <p className="font-black text-xl text-gray-800 capitalize tracking-wide">{card.eng}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">{card.chi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Step 3: Vocabulary Input (Manual adjustment if needed) */}
          <section className="bg-white p-6 rounded-3xl shadow-lg border-2 border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-700 flex items-center">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">3</span>
                Collect Words
              </h2>
            </div>
            <p className="text-gray-500 mb-6">Teacher, type the words students shout out! (老師，請將學生回答的單字輸入在此)</p>
            
            <div className="space-y-5">
              {categories.map(cat => (
                <div key={cat.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    {cat.icon} {cat.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputs[cat.id]}
                      onChange={(e) => handleInputChange(cat.id, e.target.value)}
                      onKeyDown={(e) => handleAddWord(cat.id, e)}
                      placeholder={cat.placeholder}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    />
                    <button 
                      onClick={(e) => handleAddWord(cat.id, e)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  {/* Word Chips */}
                  <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
                    {vocabulary[cat.id].map(word => (
                      <span 
                        key={word} 
                        className="inline-flex items-center bg-white border border-orange-300 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full shadow-sm animate-fade-in-up"
                      >
                        {word}
                        <button 
                          onClick={() => handleRemoveWord(cat.id, word)}
                          className="ml-2 text-orange-400 hover:text-red-500 transition-colors focus:outline-none"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    ))}
                    {vocabulary[cat.id].length === 0 && (
                      <span className="text-xs text-gray-400 italic flex items-center h-full">No words yet...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Step 4: Grammar & Sentence Building */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -z-10 opacity-50"></div>
          
          <h2 className="text-2xl font-bold text-gray-700 flex items-center mb-6">
            <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">4</span>
            Magic Sentences
          </h2>
          <p className="text-gray-500 mb-6">Let's put the words together! (我們來把單字變成句子吧！)</p>
          
          <div className="grid md:grid-cols-2 gap-6 text-xl text-gray-700 font-medium leading-relaxed">
            
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-2 text-sm font-bold text-orange-400 uppercase tracking-wider">Appearance</p>
              <p>Look at the cat! It's {formatList(vocabulary.color)}.</p>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-2 text-sm font-bold text-blue-400 uppercase tracking-wider">Details</p>
              <p>It is a {formatList(vocabulary.size)}, {formatList(vocabulary.age)} cat.</p>
            </div>

            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-2 text-sm font-bold text-red-400 uppercase tracking-wider">Feelings</p>
              <p>The poor cat feels {formatList(vocabulary.emotion)}.</p>
            </div>

            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-2 text-sm font-bold text-purple-400 uppercase tracking-wider">Background</p>
              <p>It was found in the {formatList(vocabulary.environment)}.</p>
            </div>

            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="mb-2 text-sm font-bold text-teal-400 uppercase tracking-wider">Other Features</p>
              <p>Special traits: {formatList(vocabulary.other)}.</p>
            </div>

          </div>
        </section>

        {/* Step 5: Final RPG Card Output */}
        <section className="bg-slate-800 p-8 rounded-3xl shadow-2xl text-white relative border-4 border-slate-700 mt-8">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
            <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          
          <h2 className="text-2xl font-bold flex items-center mb-6 text-yellow-400">
            <span className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg font-black">5</span>
            RPG Character Unlocked!
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
            {/* RPG Avatar Placeholder */}
            <div className="w-40 h-40 shrink-0 bg-slate-700 rounded-2xl border-4 border-slate-600 flex items-center justify-center flex-col shadow-inner">
               <Cat size={64} className="text-slate-400 mb-2" />
               <span className="text-xs font-mono text-slate-400">Lv.1 Stray</span>
            </div>
            
            {/* RPG Stats & Story */}
            <div className="flex-1 space-y-4 font-mono">
              <div className="border-b border-slate-700 pb-2">
                <h3 className="text-xl font-bold text-white mb-1">Unknown Rescued Cat</h3>
                <p className="text-sm text-yellow-500">Type: Normal/Feline</p>
              </div>
              
              <div className="space-y-2 text-slate-300">
                <p className="flex items-start">
                  <ArrowRight size={16} className="text-yellow-500 mt-1 mr-2 shrink-0" />
                  <span>
                    Look at the cat! It's {vocabulary.color.length ? vocabulary.color.join(', ') : '[Color]'}. 
                    It is a {vocabulary.size.length ? vocabulary.size.join(', ') : '[Size]'}, {vocabulary.age.length ? vocabulary.age.join(', ') : '[Age]'} cat.
                  </span>
                </p>
                <p className="flex items-start">
                  <ArrowRight size={16} className="text-yellow-500 mt-1 mr-2 shrink-0" />
                  <span>
                    The poor cat feels {vocabulary.emotion.length ? vocabulary.emotion.join(', ') : '[Emotion]'}. 
                    It was found in the {vocabulary.environment.length ? vocabulary.environment.join(', ') : '[Place]'}.
                  </span>
                </p>
                <p className="flex items-start">
                  <ArrowRight size={16} className="text-yellow-500 mt-1 mr-2 shrink-0" />
                  <span>
                    Special features: {vocabulary.other.length ? vocabulary.other.join(', ') : '[Other traits]'}.
                  </span>
                </p>
              </div>
              
              <div className="pt-4 flex gap-4">
                 <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-[0_4px_0_rgb(161,98,7)] active:shadow-[0_0px_0_rgb(161,98,7)] active:translate-y-1 transition-all">
                   Save Profile
                 </button>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      {/* Footer */}
      <footer className="text-center mt-12 text-gray-400 text-sm">
        <p>© 2026 Cat Rescue RPG English Project</p>
      </footer>
    </div>
  );
}