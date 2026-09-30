import React, { useState } from 'react';

// 智慧視覺對應字典：確保圖文 100% 相符，且無須連線外部圖片伺服器
const getVisualIcon = (word) => {
  const lowerWord = word.toLowerCase();
  const iconMap = {
    // 動物
    cat: '🐱', dog: '🐶', rabbit: '🐰', bird: '🐦', animal: '🐾',
    // 顏色
    red: '🟥', blue: '🟦', green: '🟩', yellow: '🟨', orange: '🟧', black: '⬛', white: '⬜', brown: '🟫', gray: '🩶',
    // 尺寸
    big: '🐘', huge: '🦕', small: '🐭', tiny: '🐜',
    // 年紀
    old: '🕰️', young: '🌱', baby: '🍼',
    // 情緒
    angry: '😡', sad: '😢', scared: '🙀', happy: '😺', hungry: '🤤', sick: '🤒',
    // 其他
    dirty: '💩', clean: '✨', cute: '🥰', dangerous: '⚠️'
  };
  return iconMap[lowerWord] || '✨'; // 若找不到對應，給予魔法符號
};

export default function CatRescueLesson() {
  const [vocabList, setVocabList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('animal');
  const [chineseInput, setChineseInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // 字卡切換狀態
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // 模擬 AI 翻譯 (此處可替換回您的 Gemini API，已加入錯誤捕捉防止崩潰)
  const handleTranslate = async () => {
    if (!chineseInput) return;
    setIsTranslating(true);
    
    try {
      // 模擬翻譯延遲與結果 (請在此處放回您的 Gemini 翻譯邏輯)
      // 若使用 Gemini API，請加上 AbortController 來設定 timeout
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      // 這裡簡單做個中文對應英文的 Demo，實際請接 AI
      let translatedWord = 'magic';
      if (chineseInput.includes('貓')) translatedWord = 'cat';
      if (chineseInput.includes('狗')) translatedWord = 'dog';
      if (chineseInput.includes('黑')) translatedWord = 'black';
      if (chineseInput.includes('白')) translatedWord = 'white';
      if (chineseInput.includes('怕') || chineseInput.includes('恐')) translatedWord = 'scared';
      if (chineseInput.includes('橘')) translatedWord = 'orange';
      if (chineseInput.includes('小')) translatedWord = 'small';
      
      const newItem = {
        id: Date.now(),
        category: currentCategory,
        chinese: chineseInput,
        english: translatedWord,
        icon: getVisualIcon(translatedWord),
        studentInput: '' // 新增：供學生填空的欄位
      };

      setVocabList(prev => [...prev, newItem]);
      setChineseInput('');
      // 自動切換到最新的一張字卡
      setCurrentCardIndex(vocabList.length);
      
    } catch (error) {
      alert("連線逾期或失敗，請檢查網路或 API 狀態！");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleStudentFill = (text, index) => {
    const newList = [...vocabList];
    newList[index].studentInput = text;
    setVocabList(newList);
  };

  // 生成最終咒語 (維持不變)
  const generatePrompt = () => {
    const animalWord = vocabList.find(v => v.category === 'animal')?.studentInput || '[cat/dog]';
    const features = vocabList
      .filter(v => v.category !== 'animal' && v.studentInput)
      .map(v => v.studentInput)
      .join(', ');
      
    return `[IMPORTANT: MUST strictly follow the appearance and colors of the uploaded photo!] A childlike children's book illustration (NOT realistic) of a rescued ${animalWord} waiting for help. Features: ${features}. Dramatic but hopeful lighting, solid color background.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt());
    alert('Prompt 已複製！');
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">🐾 Rescue Mission</h1>
          <p className="text-gray-600">幫助待救援的小動物建立檔案！</p>
        </div>

        {/* 1. AI Magic Dictionary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
            <span className="bg-orange-200 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
            AI Magic Dictionary (魔法辭典)
          </h2>
          <div className="flex gap-4">
            <select 
              className="border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-400"
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
            >
              <option value="animal">Cat or Dog (貓或狗)</option>
              <option value="color">Color (顏色)</option>
              <option value="size">Size (大小)</option>
              <option value="emotion">Emotion (情緒)</option>
              <option value="other">Other (其他)</option>
            </select>
            <input 
              type="text"
              placeholder="輸入中文 (例：很害怕)"
              className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-400"
              value={chineseInput}
              onChange={(e) => setChineseInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
            />
            <button 
              onClick={handleTranslate}
              disabled={isTranslating || !chineseInput}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTranslating ? '施法中...' : '變魔法!'}
            </button>
          </div>
        </div>

        {/* 2. Interactive Flashcards (上下切換模式) */}
        {vocabList.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 relative">
             <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="bg-blue-200 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
              Fill in the Blanks (填寫學習卡)
            </h2>
            
            {/* 卡片本體 */}
            <div className="flex flex-col items-center justify-center py-10 bg-blue-50/50 rounded-xl border-2 border-dashed border-blue-200 min-h-[300px]">
               <div className="text-8xl mb-6 filter drop-shadow-md">
                 {vocabList[currentCardIndex].icon}
               </div>
               <p className="text-xl text-gray-500 mb-4">中文提示：{vocabList[currentCardIndex].chinese}</p>
               
               <input
                 type="text"
                 placeholder="Type English word..."
                 className="text-center text-3xl font-bold text-blue-700 bg-transparent border-b-4 border-blue-300 focus:border-blue-500 outline-none w-64 pb-2 transition-colors placeholder:text-blue-200"
                 value={vocabList[currentCardIndex].studentInput}
                 onChange={(e) => handleStudentFill(e.target.value, currentCardIndex)}
               />
               <p className="mt-4 text-sm text-gray-400">
                 (AI 建議單字：<span className="font-mono bg-gray-100 px-2 py-1 rounded">{vocabList[currentCardIndex].english}</span>)
               </p>
            </div>

            {/* 上下切換控制列 */}
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                disabled={currentCardIndex === 0}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
              >
                ↑ 上一張 (Prev)
              </button>
              <span className="text-gray-500 font-medium">
                {currentCardIndex + 1} / {vocabList.length}
              </span>
              <button 
                onClick={() => setCurrentCardIndex(prev => Math.min(vocabList.length - 1, prev + 1))}
                disabled={currentCardIndex === vocabList.length - 1}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
              >
                下一張 (Next) ↓
              </button>
            </div>
          </div>
        )}

        {/* 3. RPG Character & AI Prompt (依據學生填寫內容生成) */}
        {vocabList.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
              <span className="bg-purple-200 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
              RPG Character Unlocked!
            </h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4 leading-relaxed overflow-x-auto">
              {generatePrompt()}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                複製 Prompt 給 Gemini
              </button>
              <a 
                href="https://gemini.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-bold underline underline-offset-4"
              >
                再來點擊這裡開啟 Gemini 並貼上生成圖片 ➔
              </a>
            </div>
            <p className="text-red-500 text-sm mt-3 font-bold">
              * 提醒：前往 Gemini 時，請記得上傳動物的真實照片，AI 才能依照照片生成花色喔！
            </p>
          </div>
        )}

      </div>
    </div>
  );
}