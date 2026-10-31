import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Trash2, ArrowRight, Sparkles, Cat, Heart, ShieldAlert, Loader2, 
  Image as ImageIcon, Wand2, Tag, Key, AlertCircle, Copy, Check, Briefcase, 
  Stethoscope, CheckCircle2, ShieldCheck, Award, Gamepad2, MapPin, Play, Grid,
  RotateCcw, AlertTriangle, ChevronRight, HelpCircle, FileText, Printer, Syringe,
  Activity, Share2, HeartHandshake
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

// Helper function to remove white / near-white background from avatar image
const removeWhiteBackground = (dataUrl, threshold = 220) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0; // Set alpha to 0 (Transparent)
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export default function CatRescueLesson() {
  const [activeTab, setActiveTab] = useState('task1'); // 'task1' | 'task2' | 'task3' | 'game'

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
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isAvatarPromptCopied, setIsAvatarPromptCopied] = useState(false);
  
  const [currentCatIndex, setCurrentCatIndex] = useState(0);

  // Deploying Cat to Game state
  const [deployX, setDeployX] = useState(8);
  const [deployY, setDeployY] = useState(8);
  const [deployCatDanger, setDeployCatDanger] = useState('feed');
  const [deploySuccessMsg, setDeploySuccessMsg] = useState('');
  const [deployAvatarImage, setDeployAvatarImage] = useState(null);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);

  // Task 2 Backpack States - NO ITEM LIMIT
  const [backpack, setBackpack] = useState([]);
  
  // Task 2C Vet Check States with Infectious Disease Testing & Vaccination
  const [vetCheck, setVetCheck] = useState({
    ears: 'dirty',
    eyes: 'clean',
    paws: 'cold',
    body: 'healthy',
    disease: 'negative',   // 'negative' | 'positive' | 'clear'
    vaccine: 'vaccinated'  // 'vaccinated' | '1st_dose' | 'pending'
  });
  const [isCopiedTask2, setIsCopiedTask2] = useState(false);

  // Task 2A Custom Rescue Item Auto-translation States
  const [customRescueItems, setCustomRescueItems] = useState([]);
  const [customItemEng, setCustomItemEng] = useState('');
  const [customItemChi, setCustomItemChi] = useState('');
  const [isTranslatingItem, setIsTranslatingItem] = useState(false);

  // Task 3 Adoption Flyer States
  const [adoptionPetName, setAdoptionPetName] = useState('Lucky (幸運兒)');
  const [adoptionSlogan, setAdoptionSlogan] = useState('Looking for a warm & loving home!');
  const [isFlyerPromptCopied, setIsFlyerPromptCopied] = useState(false);

  // Combined Proposal 1 + 2: Branching Decision Tree + Smart Dynamic Generator State
  const [decisionStep, setDecisionStep] = useState(1);
  const [trustMeter, setTrustMeter] = useState(50);
  const [approachChoice, setApproachChoice] = useState(null);
  const [actionChoice, setActionChoice] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Game Shared Cats State
  const [gameCats, setGameCats] = useState(INITIAL_CATS_DATA);

  const translationTimeoutRef = useRef(null);

  const translateBiDirectional = async (text, direction) => {
    if (!text.trim()) return '';
    setIsTranslatingItem(true);
    
    try {
      const term = text.toLowerCase().trim();
      const dict = {
        '手電筒': 'flashlight', 'flashlight': '手電筒',
        '零食': 'treats', '點心': 'treats', '零食/點心': 'treats', 'treats': '零食/點心',
        '項圈': 'collar', 'collar': '項圈',
        '毛巾': 'towel', 'towel': '毛巾',
        '籠子': 'cage', 'cage': '籠子',
        '牽繩': 'leash', 'leash': '牽繩',
        '溫水': 'warm water', 'warm water': '溫水',
        '繃帶': 'bandage', 'bandage': '繃帶',
        '玩具': 'toy', 'toy': '玩具',
        '藥品': 'medicine', 'medicine': '藥品',
        '罐頭': 'canned food', 'canned food': '罐頭',
        '保暖毯': 'warm blanket', 'warm blanket': '保暖毯',
        '手套': 'safety gloves', 'safety gloves': '防咬手套',
        '乾淨水': 'fresh water', 'fresh water': '乾淨水',
        '網子': 'net', 'net': '網子',
        '剪刀': 'scissors', 'scissors': '剪刀',
        '乾糧': 'dry food', 'dry food': '乾糧',
        '箱子': 'box', 'box': '箱子',
        '誘捕籠': 'trap cage', 'trap cage': '誘捕籠'
      };

      if (dict[term]) {
        return dict[term];
      }

      // 使用免費且免 key 的在線翻譯服務
      const langpair = direction === 'chiToEng' ? 'zh-TW|en' : 'en|zh-TW';
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`);
      const data = await res.json();
      let translated = data?.responseData?.translatedText?.trim() || '';
      
      if (translated) {
        if (direction === 'chiToEng') translated = translated.toLowerCase();
        return translated;
      }
      return text;
    } catch (err) {
      console.error("Auto translation error:", err);
      return text;
    } finally {
      setIsTranslatingItem(false);
    }
  };

  const handleChiItemChange = (val) => {
    setCustomItemChi(val);
    if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
    if (!val.trim()) {
      setCustomItemEng('');
      return;
    }
    translationTimeoutRef.current = setTimeout(async () => {
      const translatedEng = await translateBiDirectional(val, 'chiToEng');
      if (translatedEng) setCustomItemEng(translatedEng);
    }, 350);
  };

  const handleEngItemChange = (val) => {
    setCustomItemEng(val);
    if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
    if (!val.trim()) {
      setCustomItemChi('');
      return;
    }
    translationTimeoutRef.current = setTimeout(async () => {
      const translatedChi = await translateBiDirectional(val, 'engToChi');
      if (translatedChi) setCustomItemChi(translatedChi);
    }, 350);
  };

  const handleAddCustomRescueItem = async (e) => {
    if (e && e.key !== 'Enter' && e.type !== 'click') return;
    if (!customItemEng.trim() && !customItemChi.trim()) return;

    let engVal = customItemEng.trim();
    let chiVal = customItemChi.trim();

    if (!engVal && chiVal) {
      engVal = await translateBiDirectional(chiVal, 'chiToEng');
    } else if (!chiVal && engVal) {
      chiVal = await translateBiDirectional(engVal, 'engToChi');
    }

    const newItem = {
      id: `custom_${Date.now()}`,
      eng: (engVal || chiVal).toLowerCase(),
      chi: chiVal || engVal,
      icon: '🎒'
    };

    setCustomRescueItems(prev => [...prev, newItem]);
    // NO LIMIT: Automatically add to backpack!
    setBackpack(prev => [...prev, newItem]);

    setCustomItemEng('');
    setCustomItemChi('');
  };

  const handleRemoveCustomRescueItem = (itemId) => {
    setCustomRescueItems(prev => prev.filter(i => i.id !== itemId));
    setBackpack(prev => prev.filter(i => i.id !== itemId));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError('');

    const fileName = file.name.toLowerCase();
    const isHeic = file.type === 'image/heic' || 
                   file.type === 'image/heif' || 
                   fileName.endsWith('.heic') || 
                   fileName.endsWith('.heif');

    if (isHeic) {
      setIsConvertingImage(true);
      try {
        if (!window.heic2any) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error("HEIC 轉換套件載入失敗"));
            document.head.appendChild(script);
          });
        }

        const convertedBlob = await window.heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.85
        });

        const targetBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        const reader = new FileReader();
        reader.onloadend = () => {
          setCatImage(reader.result);
          setIsConvertingImage(false);
        };
        reader.onerror = () => {
          setImageUploadError("無法讀取轉換後的圖片。");
          setIsConvertingImage(false);
        };
        reader.readAsDataURL(targetBlob);
        return;
      } catch (err) {
        console.error("HEIC conversion error:", err);
        setImageUploadError("HEIC 照片轉碼失敗。建議將 iPhone 拍照設定「格式」改為「最相容」(JPEG) 後再拍攝上傳。");
        setIsConvertingImage(false);
        return;
      }
    }

    setIsConvertingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCatImage(reader.result);
      setIsConvertingImage(false);
    };
    reader.onerror = () => {
      setImageUploadError("照片讀取失敗，請重新選擇。");
      setIsConvertingImage(false);
    };
    reader.readAsDataURL(file);
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

  const handleAIGeneration = async () => {
    if (!chineseInput.trim()) return;
    
    setIsGenerating(true);
    setApiError('');
    const termToTranslate = chineseInput.trim();
    const targetCat = selectedCat;
    
    try {
      let engWord = '';
      
      const commonDict = {
        '貓': 'cat', '小貓': 'kitten', '狗': 'dog', '小狗': 'puppy',
        '黑': 'black', '白': 'white', '橘': 'orange', '黃': 'yellow', '三花': 'calico', '玳瑁': 'tortoiseshell',
        '虎斑': 'tabby', '灰': 'gray', '黑白': 'black and white', '黑白相間': 'black and white',
        '大': 'big', '小': 'small', '微小': 'tiny', '巨大': 'huge',
        '幼年': 'young', '嬰兒': 'baby', '老': 'old', '年幼': 'young',
        '害怕': 'scared', '恐懼': 'scared', '緊張': 'nervous', '飢餓': 'hungry', '生氣': 'angry', '難過': 'sad', '可愛': 'cute',
        '雨中': 'in the rain', '車底': 'under the car', '引擎蓋': 'in the car engine', '巷弄': 'in the alley', '屋頂': 'on the roof', '樹上': 'in the tree',
        '親人': 'friendly', '受傷': 'injured', '虛弱': 'weak', '吵鬧': 'noisy', '快速': 'fast'
      };

      if (commonDict[termToTranslate]) {
        engWord = commonDict[termToTranslate];
      } else {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(termToTranslate)}&langpair=zh-TW|en`);
        const data = await res.json();
        engWord = data?.responseData?.translatedText?.trim()?.toLowerCase() || termToTranslate;
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
      // Unlimited backpack selection!
      setBackpack([...backpack, item]);
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

  const formatLocationSentence = (arr) => {
    if (!arr || arr.length === 0) {
      return (
        <span>
          It's in the <span className="text-gray-400 border-b-2 border-dashed border-gray-300 px-4">________</span>.
        </span>
      );
    }

    const formattedPlaces = arr.map(item => {
      const lower = item.trim().toLowerCase();
      if (/^(in|on|at|under|behind|inside|near|by)\b/.test(lower)) {
        return lower;
      }
      let prep = 'in the';
      if (['street', 'road', 'roof', 'balcony', 'top', 'wall', 'ground', 'sidewalk'].some(w => lower.includes(w))) {
        prep = 'on the';
      } else if (['tree', 'table', 'car hood', 'bed', 'bridge', 'bench'].some(w => lower.includes(w))) {
        prep = 'under the';
      } else if (['car engine', 'box', 'cardboard', 'park', 'alley', 'rain', 'drain', 'house', 'room', 'cage', 'bush', 'forest'].some(w => lower.includes(w))) {
        prep = 'in the';
      }
      return `${prep} ${lower}`;
    });

    if (formattedPlaces.length === 1) {
      return (
        <span>
          It's <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">{formattedPlaces[0]}</span>.
        </span>
      );
    }

    const last = formattedPlaces[formattedPlaces.length - 1];
    const initial = formattedPlaces.slice(0, formattedPlaces.length - 1).join(', ');
    return (
      <span>
        It's <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">{initial} and {last}</span>.
      </span>
    );
  };

  // Re-ordered categories to place Danger/Place (危險/環境) / Background right between Appearance (Animal & Color) and Details (Size & Age)
  const categories = [
    { id: 'animal', label: 'Cat or Dog (貓或狗)', icon: <Cat size={18} className="mr-2 text-indigo-500"/>, placeholder: 'e.g., cat, dog' },
    { id: 'color', label: 'Color (顏色)', icon: <Sparkles size={18} className="mr-2 text-yellow-500"/>, placeholder: 'e.g., black, white, orange' },
    { id: 'environment', label: 'Danger/Place (危險/環境)', icon: <ShieldAlert size={18} className="mr-2 text-purple-500"/>, placeholder: 'e.g., street, rain, cold' },
    { id: 'size', label: 'Size (大小)', icon: <Cat size={18} className="mr-2 text-blue-500"/>, placeholder: 'e.g., small, tiny, big' },
    { id: 'age', label: 'Age (年紀)', icon: <Heart size={18} className="mr-2 text-pink-500"/>, placeholder: 'e.g., young, baby, old' },
    { id: 'emotion', label: 'Feelings (情緒)', icon: <Heart size={18} className="mr-2 text-red-500"/>, placeholder: 'e.g., scared, sad, hungry' },
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
      const cleanW = w.replace('-sized', '');
      if (['small', 'tiny', 'little', 'mini'].includes(cleanW)) sizeClass = "scale-50";
      if (['big', 'large', 'huge', 'fat', 'giant'].includes(cleanW)) sizeClass = "scale-150";
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
  const currentEnvName = vocabulary.environment.length ? vocabulary.environment.join('/') : 'street';
  const currentEmotionName = vocabulary.emotion.length ? vocabulary.emotion.join('/') : 'scared';

  const diseaseLabelMap = {
    negative: 'Negative / Healthy (陰性健康)',
    positive: 'Positive / Under Care (陽性照護中)',
    clear: 'Tested Clear (過關無病毒)'
  };

  const vaccineLabelMap = {
    vaccinated: 'Fully Vaccinated (已施打疫苗)',
    '1st_dose': '1st Dose Completed (完成首劑)',
    pending: 'Pending Vet Schedule (安排中)'
  };

  const task2Prompt = `[IMPORTANT: MUST strictly match the animal's exact breed, facial markings, and fur color in the uploaded photo!] Create a heartwarming, joyful, and childlike children's book illustration (NOT realistic) of this rescued ${currentAnimalName} successfully saved and happy! The ${currentAnimalName} is now inside a cozy warm room, happily eating ${backpack.map(i => i.eng).join(', ') || 'canned food'}, wrapped in a warm blanket. Infectious disease check: ${diseaseLabelMap[vetCheck.disease]}, Vaccine: ${vaccineLabelMap[vetCheck.vaccine]}. Its paws and ears are gently checked by a friendly vet. Soft pastel colors, warm lighting of hope.`;

  const avatarPrompt = `[IMPORTANT: Strictly focus on and crop the pet's face from the uploaded photo!] Create a clean, clear, front-facing portrait headshot avatar of this ${currentAnimalName}. Head only, no neck, no shoulders, solid clean white background, clear soft lighting, sharp focus on the pet's face, ears, and eyes matching the uploaded image.`;

  const flyerImagePrompt = `[IMPORTANT: Base on the rescued animal in the uploaded photo!] Create a professional, cute, and heartwarming adoption poster illustration of a rescued ${currentAnimalName} named "${adoptionPetName}". Bright cheerful background, banner saying "ADOPT ME!", featuring medical health badge: Disease Test ${diseaseLabelMap[vetCheck.disease]}, ${vaccineLabelMap[vetCheck.vaccine]}. Loving children's storybook art style, clean vector feel.`;

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const transparentPng = await removeWhiteBackground(reader.result, 220);
        setDeployAvatarImage(transparentPng);
      } catch (err) {
        console.error("Avatar background removal error:", err);
        setDeployAvatarImage(reader.result);
      } finally {
        setIsProcessingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeployToMap = () => {
    const animalType = vocabulary.animal.length ? vocabulary.animal[0] : 'cat';
    const colorDesc = vocabulary.color.length ? vocabulary.color.join(' and ') : 'rescued';
    const placeDesc = vocabulary.environment.length ? vocabulary.environment.join(', ') : 'street';
    const emotionDesc = vocabulary.emotion.length ? vocabulary.emotion.join(', ') : 'scared';
    const autoName = `Unnamed ${colorDesc} ${animalType}`.trim();

    const newCatObj = {
      id: `cat_custom_${Date.now()}`,
      rescueType: deployCatDanger,
      mapX: Number(deployX),
      mapY: Number(deployY),
      emoji: animalType.includes('dog') ? '🐕' : '🐈',
      avatarUrl: deployAvatarImage,
      profile: {
        name: autoName,
        englishDesc: `${autoName} found in ${placeDesc}.`,
        story: `An unnamed ${colorDesc} ${animalType} trapped in ${placeDesc}! Features: ${vocabulary.color.join(', ') || 'special markings'}, feeling ${emotionDesc}. Help save this little animal!`
      }
    };

    setGameCats(prev => [...prev, newCatObj]);
    setDeploySuccessMsg(`🎉 成功將待拯救小動物「${autoName}」置入 2D 遊戲地圖 (X:${deployX}, Y:${deployY})！可以切換到 [RPG 遊戲] 分頁開始尋找牠了！`);
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
            Cat Rescue Quest: 浪浪救助三階段教案
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-medium">從「觀察描述」到「展開救援與健康檢查」，最後完成「領養宣傳單」！</p>
        </header>

        {/* Tab Bar */}
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
              <span>Task 2: 展開救援 & 健檢 (Rescue)</span>
            </button>
            <button
              onClick={() => setActiveTab('task3')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'task3' 
                  ? 'bg-white text-purple-700 shadow-md scale-105' 
                  : 'text-orange-900 hover:bg-orange-200/60'
              }`}
            >
              <HeartHandshake size={18} className="text-purple-600" />
              <span>Task 3: 領養宣傳單 (Adoption Flyer)</span>
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
            <PawsAndPlay 
              gameCats={gameCats} 
              setGameCats={setGameCats} 
              vocabulary={vocabulary}
              backpack={backpack}
              actionChoice1={approachChoice}
              actionChoice2={actionChoice}
              selectedTool={selectedTool}
              vetCheck={vetCheck}
              setVetCheck={setVetCheck}
              catImage={catImage}
              adoptionPetName={adoptionPetName}
              setAdoptionPetName={setAdoptionPetName}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* ==================== TASK 3: ADOPTION FLYER TAB ==================== */}
        {activeTab === 'task3' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {gameCats.length > 0 ? (
              <section className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-4 border-purple-200 text-center space-y-6">
                <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                  🔒
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-purple-900">
                    Task 3 領養宣傳單尚未解鎖 (Adoption Flyer Locked)
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
                    請先前往 <span className="font-bold text-indigo-600">[2D RPG 遊戲 (Paws & Play)]</span> 完成所有待救援動物的任務！
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-purple-900">
                    <span>🎮 遊戲救援進度 (Game Rescue Progress):</span>
                    <span className="text-purple-700 font-mono text-sm">{gameCats.length} 隻待救援</span>
                  </div>
                  <div className="w-full bg-purple-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full transition-all duration-500"
                      style={{ width: `${Math.max(0, ((INITIAL_CATS_DATA.length - gameCats.length) / INITIAL_CATS_DATA.length) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-[11px]">全數完成遊戲地圖上的浪浪救援後，系統將會自動解鎖這份專業英文領養宣傳單！</p>
                </div>

                <button
                  onClick={() => setActiveTab('game')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-300/50 transition-all text-sm inline-flex items-center gap-2 scale-105"
                >
                  <Gamepad2 size={20} className="text-yellow-300" />
                  <span>前往 2D RPG 遊戲展開救援 ➔</span>
                </button>
              </section>
            ) : (
              <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-purple-600 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-700/80 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-purple-400/30">
                    <HeartHandshake size={16} className="text-pink-400" />
                    AUTOMATIC ADOPTION FLYER GENERATOR
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-yellow-300">Task 3: 愛心領養宣傳單 (Adoption Flyer)</h2>
                  <p className="text-xs md:text-sm text-purple-200 mt-1">遊戲完成與救助後，為牠取個溫馨的名字，自動生成專業英文領養海報！</p>
                </div>
                
                <button
                  onClick={() => window.print()}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-xs"
                >
                  <Printer size={16} /> 列印/儲存宣傳單 (Print Flyer)
                </button>
              </div>

              {/* Name & Slogan Input Form */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-purple-700/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-yellow-300 mb-1.5 flex items-center gap-1.5">
                      <Tag size={14} /> 1. 填寫動物名字 (Animal Name):
                    </label>
                    <input
                      type="text"
                      value={adoptionPetName}
                      onChange={(e) => setAdoptionPetName(e.target.value)}
                      placeholder="例：Lucky, Mimi, Cookie"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-purple-500/80 text-white font-bold text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-yellow-300 mb-1.5 flex items-center gap-1.5">
                      <Sparkles size={14} /> 2. 領養口號 (Adoption Slogan):
                    </label>
                    <input
                      type="text"
                      value={adoptionSlogan}
                      onChange={(e) => setAdoptionSlogan(e.target.value)}
                      placeholder="例：Looking for a forever family!"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border-2 border-purple-500/80 text-white font-bold text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* PRINTABLE ADOPTION FLYER POSTER */}
              <div className="bg-white text-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-amber-300 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 bg-yellow-400 text-slate-950 font-black text-xs px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow">
                  Ready For Adoption 🐾
                </div>

                <div className="text-center space-y-2 mb-6 pt-2">
                  <h1 className="text-3xl md:text-4xl font-black text-orange-600 tracking-tight">
                    ADOPT ME! 「{adoptionPetName}」
                  </h1>
                  <p className="text-base font-bold text-purple-700 italic">"{adoptionSlogan}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Photo Column */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-orange-200 shadow-md bg-slate-100 relative">
                      <img 
                        src={catImage || "https://placehold.co/600x600/f8fafc/f97316?text=Rescued+Pet+Photo"} 
                        alt="Adoption Pet"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full mt-3">
                      📍 Saved from: {currentEnvName}
                    </span>
                  </div>

                  {/* Info Details Column */}
                  <div className="md:col-span-7 space-y-4 text-sm">
                    
                    {/* Basic Traits */}
                    <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <h3 className="font-extrabold text-orange-800 border-b border-amber-200 pb-1 flex items-center gap-2">
                        <Cat size={18} /> Basic Information (基本資料)
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                        <p><span className="font-bold text-gray-500">Species:</span> <span className="capitalize font-bold text-gray-800">{currentAnimalName}</span></p>
                        <p><span className="font-bold text-gray-500">Color:</span> <span className="capitalize font-bold text-gray-800">{vocabulary.color.join(' / ') || 'Special'}</span></p>
                        <p><span className="font-bold text-gray-500">Size:</span> <span className="capitalize font-bold text-gray-800">{vocabulary.size.join(' / ') || 'Medium'}</span></p>
                        <p><span className="font-bold text-gray-500">Feeling:</span> <span className="capitalize font-bold text-gray-800">{currentEmotionName} ➔ Safe ❤️</span></p>
                      </div>
                    </div>

                    {/* Medical Check Record (Task 2C) */}
                    <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2">
                      <h3 className="font-extrabold text-emerald-900 border-b border-emerald-200 pb-1 flex items-center gap-2">
                        <Stethoscope size={18} className="text-emerald-600" /> Medical Record (獸醫健康報告)
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <p><span className="font-bold text-emerald-800">Infectious Disease:</span> <span className="font-bold text-emerald-700">{diseaseLabelMap[vetCheck.disease]}</span></p>
                        <p><span className="font-bold text-emerald-800">Vaccine:</span> <span className="font-bold text-emerald-700">{vaccineLabelMap[vetCheck.vaccine]}</span></p>
                        <p><span className="font-bold text-emerald-800">Ears & Eyes:</span> <span className="capitalize text-emerald-700 font-bold">{vetCheck.ears} / {vetCheck.eyes}</span></p>
                        <p><span className="font-bold text-emerald-800">Body Condition:</span> <span className="capitalize text-emerald-700 font-bold">{vetCheck.body}</span></p>
                      </div>
                    </div>

                    {/* Equipped Rescue Gear */}
                    <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-200 text-xs text-purple-950">
                      <span className="font-bold text-purple-800">🎒 Rescue Equipment Used:</span>{' '}
                      {backpack.length ? backpack.map(i => `${i.eng} (${i.chi})`).join(', ') : 'Standard Carrier & Blanket'}
                    </div>

                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 text-center text-xs text-gray-500 font-medium">
                  💌 "Give a stray animal a second chance at life." | ESL Rescue Quest Project
                </div>
              </div>

              {/* Gemini Prompt Generator for Adoption Poster */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-purple-700 font-mono text-xs space-y-3">
                <p className="font-bold text-yellow-300 flex items-center gap-2">
                  <Wand2 size={16} /> Gemini 高畫質領養海報繪本生成 Prompt:
                </p>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {flyerImagePrompt}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(flyerImagePrompt);
                      setIsFlyerPromptCopied(true);
                      setTimeout(() => setIsFlyerPromptCopied(false), 2000);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {isFlyerPromptCopied ? <Check size={16} /> : <Copy size={16} />}
                    {isFlyerPromptCopied ? '已複製海報 Prompt！' : '複製領養海報 Prompt'}
                  </button>
                  <a
                    href="https://gemini.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1.5 justify-center underline underline-offset-4 text-xs py-2"
                  >
                    開啟 Gemini 生成領養海報 ➔
                  </a>
                </div>
              </div>

            </section>
            )}
          </div>
        )}

        {/* ==================== TASKS TAB (2-COLUMN LAYOUT) ==================== */}
        {activeTab !== 'game' && activeTab !== 'task3' && (
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
                      accept="image/*,.heic,.heif" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-gray-500 mb-4 w-full text-left">Look at the picture. What do you see?<br/>(看看這張照片，你看到了什麼？)</p>
                
                {imageUploadError && (
                  <div className="mb-4 w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}

                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-gray-200 bg-gray-100 group cursor-pointer" onClick={() => document.getElementById('cat-image-input-main').click()}>
                  <input 
                    id="cat-image-input-main"
                    type="file" 
                    accept="image/*,.heic,.heif" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  {isConvertingImage && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 space-y-2 p-4 text-center">
                      <Loader2 size={36} className="animate-spin text-orange-500" />
                      <p className="text-xs font-bold text-orange-700">正在處理與轉碼照片中...</p>
                      <p className="text-[10px] text-gray-500">(iPhone HEIC 照片需要 1-3 秒進行即時解碼轉換)</p>
                    </div>
                  )}
                  <img 
                    src={catImage || "https://placehold.co/800x800/f8fafc/f97316?text=Image+of+the+Rescued+Cat\n(Click+Here+to+Upload+Photo)"} 
                    alt="Rescued Cat"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4 justify-between pointer-events-none">
                    <span className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mx-auto">
                      <Camera size={14} /> 點擊更換照片 (支援 HEIC / JPG / PNG)
                    </span>
                  </div>
                </div>
              </section>

              {/* Task 2 Live Backpack (Shown on Task 2 tab) */}
              {activeTab === 'task2' && (
                <section className="bg-emerald-900 text-white p-5 rounded-3xl shadow-xl border-4 border-emerald-800">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-extrabold text-lg flex items-center gap-2 text-emerald-300">
                      <Briefcase size={20} /> 救援後背包 (Rescue Backpack)
                    </h3>
                    <span className="bg-emerald-950 text-yellow-300 font-mono text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-600">
                      已帶 {backpack.length} 樣 (無上限)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 mb-3">選取的裝備會放進這裡，不限數量：</p>
                  
                  {backpack.length === 0 ? (
                    <div className="bg-emerald-950/70 border-2 border-dashed border-emerald-600/50 rounded-xl p-4 text-center text-xs text-emerald-500 font-mono">
                      目前無裝備，請點擊右側道具帶上！
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {backpack.map((item, idx) => (
                        <div key={`${item.id}_${idx}`} className="bg-emerald-950/90 border-2 border-emerald-600 rounded-xl p-2 text-center flex flex-col items-center justify-center min-h-[75px]">
                          <span className="text-xl mb-0.5">{item.icon}</span>
                          <span className="text-[10px] font-bold text-emerald-200 capitalize truncate w-full">{item.eng}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

            </div>

            {/* RIGHT COLUMN: Interactive Steps for Task 1 or Task 2 */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* ==================== TASK 1 CONTENT ==================== */}
              {activeTab === 'task1' && (
                <>
                  {/* Step 1.5: Front Portrait Avatar Generator */}
                  <section className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl shadow-xl border-2 border-indigo-700 text-white">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                        <Sparkles size={22} className="text-yellow-400" />
                        正面大頭照生成指令 (Front Portrait Avatar Prompt)
                      </h2>
                      <span className="bg-indigo-800 text-indigo-200 text-xs px-2.5 py-1 rounded-full font-mono">Pet Headshot</span>
                    </div>
                    <p className="text-xs text-indigo-200 mb-4">擷取小朋友上傳的照片，專注於小動物臉部特徵，生成一張清晰的正面大頭照！</p>
                    
                    <div className="bg-slate-950 p-4 rounded-xl border border-indigo-800/60 font-mono text-xs text-indigo-100 leading-relaxed mb-4">
                      {avatarPrompt}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(avatarPrompt);
                          setIsAvatarPromptCopied(true);
                          setTimeout(() => setIsAvatarPromptCopied(false), 2000);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
                      >
                        {isAvatarPromptCopied ? <Check size={16} /> : <Copy size={16} />}
                        {isAvatarPromptCopied ? '已複製大頭照 Prompt！' : '複製正面大頭照 Prompt'}
                      </button>

                      <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center gap-1.5 justify-center underline underline-offset-4"
                      >
                        開啟 Gemini 生成正面大頭照 ➔
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

                  {/* Step 4: Magic Sentences - Placed Danger/Place (Background) right between Appearance and Details */}
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
                      <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-purple-400 uppercase tracking-wider">Danger/Place (Background)</p>
                        <p>{formatLocationSentence(vocabulary.environment)}</p>
                      </div>
                      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-blue-400 uppercase tracking-wider">Details</p>
                        <p>
                          {vocabulary.size.includes('small') && vocabulary.age.includes('baby') ? (
                            <>
                              It is a <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">small baby</span> {formatList(vocabulary.animal)}.
                            </>
                          ) : (
                            <>
                              It is a {vocabulary.size.length ? formatList(vocabulary.size.map(s => s.endsWith('-sized') ? s : `${s}-sized`)) : <span className="text-gray-400 border-b-2 border-dashed border-gray-300 px-4">________-sized</span>}, {formatList(vocabulary.age)} {formatList(vocabulary.animal)}.
                            </>
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm">
                        <p className="mb-2 text-sm font-bold text-red-400 uppercase tracking-wider">Feelings</p>
                        <p>The poor {formatList(vocabulary.animal)} looks {formatList(vocabulary.emotion)}.</p>
                      </div>
                      <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-200 shadow-sm md:col-span-2">
                        <p className="mb-2 text-sm font-bold text-teal-400 uppercase tracking-wider">Other Features</p>
                        <p>Special traits: {formatList(vocabulary.other)}.</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 5: RPG Character Unlocked - Prompt adjusted to place Danger/Place (Background) between Appearance and Details */}
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
                          It has {vocabulary.color.length ? vocabulary.color.join(' and ') : '[Color]'} fur.<br/>
                          It is currently trapped or found in {vocabulary.environment.length ? vocabulary.environment.join(', ') : '[Place]'}.<br/>
                          {vocabulary.size.includes('small') && vocabulary.age.includes('baby') ? (
                            <>The {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} is a small baby.<br/></>
                          ) : (
                            <>The {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} is {vocabulary.size.length ? vocabulary.size.map(s => s.endsWith('-sized') ? s : `${s}-sized`).join(', ') : '[Size]-sized'} and {vocabulary.age.length ? vocabulary.age.join(', ') : '[Age]'}.<br/></>
                          )}
                          The poor {vocabulary.animal.length ? vocabulary.animal.join('/') : '[cat/dog]'} looks {vocabulary.emotion.length ? vocabulary.emotion.join(' and ') : '[Emotion]'}.<br/>
                          Special features: {vocabulary.other.length ? vocabulary.other.join(', ') : '[Other traits]'}.<br/>
                          The atmosphere shows its rescue situation, slightly dramatic but with a warm, comforting light of hope shining on it.
                        </div>
                        
                        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
                           <button 
                             onClick={() => {
                               const isSmallBaby = vocabulary.size.includes('small') && vocabulary.age.includes('baby');
                               const sizeAgeStr = isSmallBaby 
                                 ? 'a small baby' 
                                 : `${vocabulary.size.length ? vocabulary.size.map(s => s.endsWith('-sized') ? s : `${s}-sized`).join(', ') : 'medium-sized'} and ${vocabulary.age.length ? vocabulary.age.join(', ') : 'unknown age'}`;
                               const promptText = `[IMPORTANT: Please strictly base the animal's appearance, colors, and markings on the uploaded photo!] Create a cute, playful, and childlike children's book illustration (NOT realistic) of this rescued ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} waiting for help. It has ${vocabulary.color.length ? vocabulary.color.join(' and ') : 'unspecified'} fur. It is currently trapped or found in ${vocabulary.environment.length ? vocabulary.environment.join(', ') : 'an unknown place'}. The ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} is ${sizeAgeStr}. The poor ${vocabulary.animal.length ? vocabulary.animal.join('/') : 'cat/dog'} looks ${vocabulary.emotion.length ? vocabulary.emotion.join(' and ') : 'anxious'}. Special features: ${vocabulary.other.length ? vocabulary.other.join(', ') : 'none'}. The atmosphere shows its rescue situation, slightly dramatic but with a warm, comforting light of hope shining on it.`;
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

                  {/* Step 6: Deploy Cat to RPG Map Panel */}
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
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                          <p><span className="text-yellow-400 font-bold">目前定位:</span> X={deployX}, Y={deployY}</p>
                          <p><span className="text-yellow-400 font-bold">特徵狀態:</span> {vocabulary.color.join('/') || '無特別指定'} / {vocabulary.emotion.join('/') || '無'}</p>
                        </div>

                        {/* Avatar Image Upload & Auto Background Removal Panel */}
                        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2">
                          <label className="block font-bold text-yellow-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5"><Camera size={14} /> 植入生成好的頭像 (Upload Avatar)</span>
                            <span className="text-[10px] text-emerald-400 font-normal">✨ 自動去除白色背景</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow">
                              <Camera size={14} />
                              <span>上傳頭像照片</span>
                              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                            </label>
                            {isProcessingAvatar && (
                              <span className="text-[11px] text-yellow-300 flex items-center gap-1">
                                <Loader2 size={14} className="animate-spin"/> 正在轉換透明背景...
                              </span>
                            )}
                            {deployAvatarImage && !isProcessingAvatar && (
                              <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg border border-indigo-400 bg-slate-950 overflow-hidden flex items-center justify-center p-0.5 shadow-inner">
                                  <img src={deployAvatarImage} alt="Avatar Preview" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[11px] text-emerald-400 font-bold">✓ 已成功去背</span>
                                <button onClick={() => setDeployAvatarImage(null)} className="text-[11px] text-red-400 hover:text-red-300 underline ml-1">重設</button>
                              </div>
                            )}
                          </div>
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
                    <p className="text-gray-500 text-sm mb-4">點擊裝備帶上它（不限制選擇數量！）：</p>

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

                    {/* Bi-directional Custom Rescue Item Generator */}
                    <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                      <p className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                        <Plus size={16} className="text-emerald-600" />
                        自由新增自訂裝備 (中英文雙向自動翻譯)
                      </p>
                      <p className="text-xs text-emerald-700 mb-3">輸入中文會自動變英文，或輸入英文自動變中文！</p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={customItemChi}
                            onChange={(e) => handleChiItemChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRescueItem(e)}
                            placeholder="中文 (例：手電筒、牽繩)"
                            className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                          />
                        </div>

                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={customItemEng}
                            onChange={(e) => handleEngItemChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRescueItem(e)}
                            placeholder="英文 (例：flashlight, treats)"
                            className="w-full px-3 py-2 text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                          />
                          {isTranslatingItem && (
                            <Loader2 size={16} className="absolute right-2.5 top-2.5 animate-spin text-emerald-600" />
                          )}
                        </div>

                        <button
                          onClick={handleAddCustomRescueItem}
                          disabled={!customItemEng.trim() && !customItemChi.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap flex items-center justify-center gap-1"
                        >
                          <Plus size={16} /> 新增裝備
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Direct Transition to 2D RPG Game Banner */}
                  <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl animate-bounce">🎒</span>
                      <div>
                        <h2 className="text-2xl font-black text-yellow-300">
                          裝備準備完畢！直接進入 2D RPG 核心關卡
                        </h2>
                        <p className="text-xs md:text-sm text-purple-200 mt-1 leading-relaxed">
                          Task 1 (觀察描述) 與 Task 2 (裝備選取) 是遊戲前的素材累積與英文練習。點擊下方按鈕直接進入 2D RPG Game 展開現場救援抉擇、多重裝備使用、獸醫健檢與生成英文報告！
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-indigo-700/80 text-xs text-indigo-200 flex flex-wrap justify-between items-center gap-2">
                      <span>已選擇攜帶裝備：<strong className="text-yellow-300">{backpack.length ? backpack.map(i => i.eng).join(', ') : '基本裝備'}</strong></span>
                      <span className="bg-indigo-800 text-yellow-300 px-3 py-1 rounded-full font-mono font-bold">{backpack.length} Items Ready</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('game')}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 rounded-2xl shadow-xl hover:shadow-yellow-400/50 transition-all text-base flex items-center justify-center gap-3 active:scale-98"
                    >
                      <Gamepad2 size={24} className="text-indigo-950" />
                      <span>帶著裝備，直接進入 2D RPG Game 展開救援 ➔</span>
                    </button>
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

function PawsAndPlay({ 
  gameCats, 
  setGameCats,
  vocabulary = { animal: [], color: [], size: [], age: [], emotion: [], environment: [], other: [] },
  backpack = [],
  actionChoice1 = null,
  actionChoice2 = null,
  selectedTool = null,
  vetCheck = { ears: 'clean', eyes: 'clean', paws: 'warm', body: 'healthy', disease: 'negative', vaccine: 'vaccinated' },
  setVetCheck = () => {},
  catImage = null,
  adoptionPetName = 'Lucky',
  setAdoptionPetName = () => {},
  setActiveTab = () => {}
}) {
  const [gameState, setGameState] = useState('START'); // START, MAP, MINIGAME, PROFILE
  const [activeCat, setActiveCat] = useState(null);
  
  // Game stages inside active cat rescue
  const [gameStage, setGameStage] = useState('APPROACH_TOOLS'); // 'APPROACH_TOOLS' | 'MINIGAME_ACTION' | 'VET_CHECK' | 'RESCUE_REPORT'
  
  // Multi-select tools for active rescue
  const [selectedTools, setSelectedTools] = useState([]);
  const [approachChoice, setApproachChoice] = useState('slow');
  const [trustMeter, setTrustMeter] = useState(50);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Local vet check state for current rescued cat
  const [localVetCheck, setLocalVetCheck] = useState({
    ears: 'dirty',
    eyes: 'clean',
    paws: 'cold',
    body: 'healthy',
    disease: 'negative',
    vaccine: 'vaccinated'
  });

  // Feeding Mini-game state
  const [feedStep, setFeedStep] = useState(1);
  const [temperature, setTemperature] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [tempMsg, setTempMsg] = useState('');
  const [usedItemMsg, setUsedItemMsg] = useState('');
  const [isCopiedMergedPrompt, setIsCopiedMergedPrompt] = useState(false);
  const [isCopiedReportPrompt, setIsCopiedReportPrompt] = useState(false);
  
  // Car Engine Mini-game state
  const [carStep, setCarStep] = useState(1);

  const canvasRef = useRef(null);
  const requestRef = useRef();
  const avatarCacheRef = useRef({});
  const keysRef = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false });
  
  const gameDataRef = useRef({ cats: [...gameCats], map: JSON.parse(JSON.stringify(INITIAL_MAP_DATA)) });

  const currentAnimal = vocabulary.animal[0] || 'cat';
  
  // Dynamic rescue sentence with selected MULTIPLE tools
  const selectedToolObjs = backpack.filter(i => selectedTools.includes(i.id));
  const selectedToolNames = selectedToolObjs.length 
    ? selectedToolObjs.map(i => i.eng).join(', ') 
    : 'canned food';

  const missionSentence = `You should ${approachChoice === 'slow' ? 'walk slowly' : 'approach carefully'} and use ${selectedToolNames} to rescue the ${currentAnimal}!`;

  useEffect(() => {
    gameDataRef.current.cats = [...gameCats];
    
    // Preload custom transparent avatar images for canvas rendering
    gameCats.forEach(cat => {
      if (cat.avatarUrl && !avatarCacheRef.current[cat.id]) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          avatarCacheRef.current[cat.id] = img;
        };
        img.src = cat.avatarUrl;
      }
    });
  }, [gameCats]);

  const playerRef = useRef({
    x: 7, y: 17, 
    pixelX: 7 * 32, pixelY: 17 * 32,
    targetX: 7, targetY: 17, 
    moving: false, speed: 2
  });

  const generateImagePrompt = (cat) => {
    let situation = "";
    if (cat.rescueType === 'feed') {
      situation = `alone and cold in ${vocabulary.environment.join(', ') || 'a box in the rain'}`;
    } else if (cat.rescueType === 'car_engine') {
      situation = "hiding under the hood of a car, peeking out nervously";
    } else {
      situation = "waiting to be rescued on the street";
    }

    const itemsStr = selectedToolNames || 'canned food and blanket';
    return `Create a heartwarming children's storybook illustration of a small rescued ${vocabulary.animal[0] || 'cat'} named ${adoptionPetName || cat.profile.name}. The cat is ${situation}. Rescued using ${itemsStr}. The style should be emotional but hopeful, with soft lighting and cute details. (Story: ${cat.profile.story})`;
  };

  const startMiniGame = (cat) => {
    for (let k in keysRef.current) keysRef.current[k] = false;
    setActiveCat(cat);
    setGameState('MINIGAME');
    setGameStage('APPROACH_TOOLS');
    
    // Default select all tools in backpack
    if (backpack.length > 0) {
      setSelectedTools(backpack.map(b => b.id));
    } else {
      setSelectedTools([]);
    }
    setApproachChoice('slow');
    setTrustMeter(75);
    setFeedbackMsg('');
    setUsedItemMsg('');
    setLocalVetCheck({
      ears: 'dirty',
      eyes: 'clean',
      paws: 'cold',
      body: 'healthy',
      disease: 'negative',
      vaccine: 'vaccinated'
    });
    
    if (cat.rescueType === 'feed') {
      setFeedStep(1); setTemperature(0); setTempMsg('');
    } else if (cat.rescueType === 'car_engine') {
      setCarStep(1);
    }
  };

  const toggleToolSelection = (toolId) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
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
        }
      }
    }

    const bounce = Math.sin(Date.now() / 300) * 2;
    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    data.cats.forEach(cat => {
      const cx = cat.mapX * TILE_SIZE;
      const cy = cat.mapY * TILE_SIZE;

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); 
      ctx.ellipse(cx + 16, cy + 24, 10, 4, 0, 0, Math.PI * 2); 
      ctx.fill();

      const customImg = avatarCacheRef.current[cat.id];
      if (customImg && customImg.complete) {
        ctx.drawImage(customImg, cx + 2, cy + 2 + bounce, 28, 28);
      } else if (cat.avatarUrl) {
        const img = new Image();
        img.src = cat.avatarUrl;
        avatarCacheRef.current[cat.id] = img;
        ctx.fillText(cat.emoji || "🐈", cx + 16, cy + 16 + bounce);
      } else {
        ctx.fillText(cat.emoji || "🐈", cx + 16, cy + 16 + bounce);
      }
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

  return (
    <div className="relative w-full max-w-5xl aspect-[16/9] flex bg-gray-950 rounded-3xl overflow-hidden select-none font-sans border-4 border-indigo-800 shadow-2xl">
      <style>{`
        @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 25% { transform: translate(-1px, -2px) rotate(-5deg); } 50% { transform: translate(-3px, 0px) rotate(5deg); } 75% { transform: translate(3px, 2px) rotate(0deg); } 100% { transform: translate(1px, -1px) rotate(0deg); } }
        .shaking { animation: shake 0.5s infinite; }
      `}</style>

      {/* LEFT: Game Canvas Area */}
      <div className="relative flex-1 h-full bg-gray-900 flex items-center justify-center p-2 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={640} 
          className="h-full max-h-full aspect-square rounded-2xl bg-gray-800 object-contain shadow-inner" 
          style={{ imageRendering: 'pixelated' }} 
        />

        {/* Touch D-Pad placed over canvas area on mobile */}
        {gameState === 'MAP' && (
          <div className="absolute bottom-3 right-3 grid grid-cols-3 grid-rows-3 gap-1 md:hidden z-10 opacity-80">
            <div className="col-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-9 h-9 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowUp')}>▲</div>
            <div className="col-start-1 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-9 h-9 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowLeft')}>◀</div>
            <div className="col-start-3 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-9 h-9 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowRight')}>▶</div>
            <div className="col-start-2 row-start-3 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-9 h-9 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowDown')}>▼</div>
          </div>
        )}
      </div>

      {/* RIGHT: Dynamic Rescue Bag Sidebar Panel */}
      <div className="w-60 sm:w-72 md:w-80 h-full bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 border-l-4 border-amber-700/80 p-3.5 sm:p-4 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl shrink-0">
        
        <div className="space-y-3">
          {/* Rescue Bag Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-700/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow">🎒</span>
              <div>
                <h3 className="font-extrabold text-amber-200 text-xs sm:text-sm tracking-wider uppercase">Rescue Bag</h3>
                <p className="text-[10px] text-amber-400 font-medium">救援後背包道具欄</p>
              </div>
            </div>
            <span className="bg-amber-950 border border-amber-600/80 text-yellow-300 font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {backpack.length} items
            </span>
          </div>

          {/* Rescue Backpack Equipment Slots - Dynamic List */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>📦</span> 已裝備道具 (Equipment)
            </p>
            {backpack.length === 0 ? (
              <div className="p-3 bg-amber-950/40 border border-amber-800/40 text-amber-700 rounded-xl text-center text-xs italic">
                No items equipped
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-44 overflow-y-auto pr-1">
                {backpack.map((item, slotIdx) => (
                  <div 
                    key={`${item.id}_${slotIdx}`} 
                    className="p-2 rounded-xl bg-amber-900/90 border border-amber-500/80 text-amber-100 flex items-center gap-3 shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700/60 flex items-center justify-center text-lg shrink-0 shadow-inner">
                      {item.icon}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="font-bold text-xs text-yellow-200 capitalize truncate">{item.eng}</p>
                      <p className="text-[10px] text-amber-400 truncate">{item.chi}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task 2 Active Sentence Mission Badge */}
          <div className="bg-indigo-950/90 border-2 border-yellow-400/80 rounded-2xl p-2.5 text-xs text-yellow-200 space-y-1 shadow-lg">
            <p className="font-bold text-yellow-300 text-[11px] flex items-center gap-1">
              <Gamepad2 size={14} className="text-yellow-400" /> Task 2 救援句型任務
            </p>
            <p className="text-[11px] font-mono text-white bg-slate-900/90 p-2 rounded-xl border border-indigo-700/60 leading-snug">
              "{missionSentence}"
            </p>
          </div>

          {/* Task 1 Target Animal Traits Tag */}
          {vocabulary.color.length > 0 && (
            <div className="bg-yellow-950/80 border border-yellow-600/60 rounded-xl p-2.5 text-xs text-yellow-200 space-y-1 shadow">
              <p className="font-bold text-yellow-400 text-[11px] flex items-center gap-1">
                <Tag size={12} /> Task 1 目標救援特徵
              </p>
              <p className="text-[11px] text-amber-200 leading-tight">
                Target: <span className="font-bold text-white capitalize">{vocabulary.color.join('/') || 'Rescued'} {vocabulary.animal[0] || 'Cat'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="pt-2 border-t border-amber-800/60 text-[10px] text-amber-400 space-y-0.5">
          <p className="font-bold text-amber-300">💡 操作提示：</p>
          <p className="leading-tight">地圖移動尋找 🐈，遭遇小貓即可使用此後背包內的道具展開救援！</p>
        </div>
      </div>

      {/* Victory Celebration when Game is Completed */}
      {gameState === 'MAP' && gameCats.length === 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-30 p-4 text-center">
          <div className="bg-gradient-to-b from-purple-900 to-indigo-950 border-4 border-yellow-400 p-6 md:p-8 rounded-3xl max-w-md text-white shadow-2xl space-y-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <h2 className="text-2xl md:text-3xl font-black text-yellow-300">
              ALL ANIMALS RESCUED!
            </h2>
            <p className="text-xs md:text-sm text-purple-200 leading-relaxed">
              恭喜完成 2D RPG 遊戲！地圖上所有的浪浪都被你安全救援了！
            </p>
            <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-500 text-xs text-yellow-200 font-bold">
              ✨ Task 3 愛心領養宣傳單 (Adoption Flyer) 已成功解鎖！
            </div>
            <button
              onClick={() => setActiveTab('task3')}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <HeartHandshake size={20} /> 前往 Task 3 製作領養宣傳單 ➔
            </button>
          </div>
        </div>
      )}

      {/* OVERLAYS: Start, Multi-Stage Mini-game, Profile modals */}
      {gameState !== 'MAP' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-20 overflow-y-auto p-4">
          
          {/* Start Screen */}
          {gameState === 'START' && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-indigo-500">
              <h1 className="text-3xl font-black text-indigo-600 mb-1">Paws & Play</h1>
              <p className="text-gray-600 font-bold mb-4 text-xs">Street Cat Heroes 2D RPG</p>
              
              <div className="mb-4 bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-left text-xs space-y-1">
                <p className="font-bold text-indigo-900">🔗 Task Integration Active:</p>
                <p className="text-indigo-700">• Task 1 Target: <span className="font-bold">{vocabulary.color.join(' ') || 'Rescued'} {vocabulary.animal[0] || 'cat'}</span></p>
                <p className="text-indigo-700">• Task 2 Items: <span className="font-bold">{backpack.map(i => i.eng).join(', ') || 'Standard Kit'}</span></p>
              </div>

              <div className="text-left text-xs text-gray-600 mb-6 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p>🎮 <b>How to play:</b></p>
                <p>1. Use Keyboard (WASD / Arrow Keys) or Touch D-Pad.</p>
                <p>2. Walk up to stray cats (🐈) on the map.</p>
                <p>3. Select action strategies, multiple backpack tools, perform vet checks, and generate rescue reports!</p>
              </div>
              <button onClick={() => setGameState('MAP')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">Start Game 🚀</button>
            </div>
          )}

          {/* Mini-Game Overlays (Multi-Stage RPG Rescue Flow) */}
          {gameState === 'MINIGAME' && activeCat && (
            <div className="bg-white p-6 rounded-3xl w-full max-w-lg text-center shadow-2xl border-4 border-indigo-500 relative max-h-[90vh] overflow-y-auto">
              
              {/* STAGE 1: Choose Your Action & Multiple Backpack Tools */}
              {gameStage === 'APPROACH_TOOLS' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 1: Choose Your Action & Tools
                    </span>
                    <h2 className="text-2xl font-black text-indigo-900 mt-2">
                      🚨 Rescue Challenge: {activeCat.profile.name}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Target: {vocabulary.color.join(' ') || 'stray'} {currentAnimal} in {vocabulary.environment[0] || 'street'}
                    </p>
                  </div>

                  {/* Approach Choice */}
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                    <p className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                      <span>🚶‍♂️</span> 1. 選擇靠近方式 (Approach Strategy):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setApproachChoice('slow');
                          setTrustMeter(80);
                          setFeedbackMsg('❤️ 輕聲慢步靠近讓動物放下警戒 (Trust Meter ⬆️)');
                        }}
                        className={`p-2.5 rounded-xl font-bold text-xs text-left transition ${approachChoice === 'slow' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200'}`}
                      >
                        🚶‍♂️ Walk slowly & softly
                      </button>
                      <button
                        onClick={() => {
                          setApproachChoice('fast');
                          setTrustMeter(30);
                          setFeedbackMsg('⚠️ 快速衝過去嚇到了小動物！(Trust Meter ⬇️)');
                        }}
                        className={`p-2.5 rounded-xl font-bold text-xs text-left transition ${approachChoice === 'fast' ? 'bg-red-500 text-white shadow' : 'bg-white text-gray-700 border border-gray-200'}`}
                      >
                        🏃‍♂️ Run fast & shout
                      </button>
                    </div>
                  </div>

                  {/* Multiple Backpack Tools Selection */}
                  <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                        <Briefcase size={14} className="text-purple-600" /> 2. 選擇使用的救援裝備 (可多選 Select Tools):
                      </p>
                      <span className="text-[10px] font-mono bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                        {selectedTools.length} selected
                      </span>
                    </div>

                    {backpack.length === 0 ? (
                      <p className="text-xs text-purple-700 italic bg-white p-2.5 rounded-xl border border-purple-100">
                        目前背包無裝備，將使用基本救助物資。
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                        {backpack.map((item) => {
                          const isChecked = selectedTools.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleToolSelection(item.id)}
                              className={`p-2 rounded-xl text-left font-bold text-xs border transition flex items-center justify-between ${isChecked ? 'bg-purple-600 text-white border-purple-700 shadow' : 'bg-white text-gray-700 border-gray-200'}`}
                            >
                              <span className="truncate">{item.icon} {item.eng}</span>
                              {isChecked && <CheckCircle2 size={14} className="shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Feedback & Mission Sentence Preview */}
                  {feedbackMsg && (
                    <p className={`text-xs font-bold p-2 rounded-xl border ${feedbackMsg.includes('⚠️') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                      {feedbackMsg}
                    </p>
                  )}

                  <div className="bg-slate-950 text-yellow-300 p-3 rounded-2xl font-mono text-xs border border-yellow-400/50 space-y-1">
                    <p className="text-[10px] text-yellow-400 font-bold">🎯 生成救援任務句型 (Sentence Practice):</p>
                    <p className="text-white text-xs leading-snug font-bold">"{missionSentence}"</p>
                  </div>

                  <button
                    onClick={() => setGameStage('MINIGAME_ACTION')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
                  >
                    <span>🚀 進入現場救援操作 (Proceed to Rescue) ➔</span>
                  </button>
                </div>
              )}

              {/* STAGE 2: Mini-game Action (Feeding or Car Engine) */}
              {gameStage === 'MINIGAME_ACTION' && (
                <div className="space-y-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                    Stage 2: Rescue Action
                  </span>
                  
                  {activeCat.rescueType === 'feed' ? (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-blue-900">Feeding & Care</h2>
                      <div className={`text-6xl my-3 flex justify-center transition-transform ${feedStep <= 2 ? 'shaking' : ''}`}>
                        {feedStep <= 2 ? '🐱📦' : feedStep === 3 ? '🐱🍼' : '🩺🐱'}
                      </div>

                      {feedStep === 1 && (
                        <>
                          <p className="text-gray-600 text-xs font-bold">Step 1: Observe! Is the mother cat here?</p>
                          <div className="flex gap-2">
                            <button onClick={() => setTempMsg("DON'T TOUCH! Mother cat might be around.")} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded-xl text-xs shadow">👀 Yes</button>
                            <button onClick={() => { setTempMsg("Good! The kitten is alone."); setTimeout(() => setFeedStep(2), 1000); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded-xl text-xs shadow">🚫 No</button>
                          </div>
                          <p className={`text-xs font-bold mt-2 h-6 ${tempMsg.includes("DON'T") ? 'text-red-600' : 'text-green-600'}`}>{tempMsg}</p>
                        </>
                      )}
                      {feedStep === 2 && (
                        <>
                          <p className="text-gray-600 text-xs font-bold">Step 2: Heat the milk to a safe warm temperature!</p>
                          <div className="w-full h-5 bg-gray-200 rounded-full my-2 relative overflow-hidden border border-gray-400">
                            <div className="absolute left-[40%] w-[20%] h-full bg-green-500/40 border-l border-r border-dashed border-gray-700" />
                            <div className={`h-full transition-all duration-100 ${temperature < 40 ? 'bg-blue-500' : temperature <= 60 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${temperature}%` }} />
                          </div>
                          <button onMouseDown={() => setIsHeating(true)} onMouseUp={() => setIsHeating(false)} onMouseLeave={() => setIsHeating(false)} onTouchStart={() => setIsHeating(true)} onTouchEnd={() => setIsHeating(false)} disabled={tempMsg.includes('Perfect')} className="w-full bg-orange-500 text-white font-bold py-2.5 px-4 rounded-xl shadow text-xs active:scale-95 disabled:opacity-50">🔥 Hold to Heat Milk</button>
                          <p className={`text-xs font-bold mt-2 h-5 ${temperature > 60 ? 'text-red-600' : temperature >= 40 ? 'text-green-600' : 'text-blue-600'}`}>{tempMsg}</p>
                        </>
                      )}
                      {(feedStep === 3 || feedStep === 4) && (
                        <>
                          <p className="text-gray-600 text-xs font-bold">Step 3: Feed milk & wrap in warm blanket with selected tools ({selectedToolNames})!</p>
                          <button onClick={() => setGameStage('VET_CHECK')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2">
                            <span>🩺 前往診所進行 Vet Check-up ➔</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-black text-red-800">Car Engine Rescue</h2>
                      <div className="text-5xl my-3">{carStep === 1 ? '🚗' : carStep === 2 ? '🐈💕' : '🩺🐱'}</div>

                      {carStep === 1 && (
                        <>
                          <p className="text-gray-600 text-xs font-bold">The cat is inside the engine! Tap the car hood first to alert her.</p>
                          <button onClick={() => setCarStep(2)} className="w-full bg-yellow-500 text-white font-bold py-2.5 px-2 rounded-xl text-xs shadow hover:bg-yellow-600">👋 Tap Car Hood</button>
                        </>
                      )}
                      {carStep >= 2 && (
                        <>
                          <p className="text-gray-600 text-xs font-bold">She peeked out! Use selected tools ({selectedToolNames}) to lure her safely into carrier.</p>
                          <button onClick={() => setGameStage('VET_CHECK')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2">
                            <span>🩺 前往診所進行 Vet Check-up ➔</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: Vet Check-up in RPG Game */}
              {gameStage === 'VET_CHECK' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 3: Vet Check-up Clinic
                    </span>
                    <h2 className="text-2xl font-black text-emerald-900 mt-1 flex items-center justify-center gap-2">
                      <Stethoscope size={24} className="text-emerald-600" />
                      獸醫健檢與疫苗篩檢
                    </h2>
                    <p className="text-xs text-gray-500">進行健康檢查，檢查耳朵、眼睛、傳染病與疫苗狀況：</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Ears (耳朵):</p>
                      <div className="flex gap-1">
                        {['dirty', 'clean', 'injured'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, ears: opt })}
                            className={`px-2 py-1 rounded-lg font-bold capitalize transition ${localVetCheck.ears === opt ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Body (身體):</p>
                      <div className="flex gap-1">
                        {['healthy', 'thin', 'soft'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, body: opt })}
                            className={`px-2 py-1 rounded-lg font-bold capitalize transition ${localVetCheck.body === opt ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 col-span-2 space-y-1">
                      <p className="font-bold text-emerald-900 flex items-center gap-1">
                        <Activity size={14} /> 傳染病篩檢 (Infectious Disease Test):
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { key: 'negative', label: 'Negative (陰性)' },
                          { key: 'positive', label: 'Positive (陽性)' },
                          { key: 'clear', label: 'Clear (過關)' }
                        ].map(item => (
                          <button
                            key={item.key}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, disease: item.key })}
                            className={`p-1.5 rounded-lg text-[11px] font-bold transition ${localVetCheck.disease === item.key ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-700 border'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 col-span-2 space-y-1">
                      <p className="font-bold text-emerald-900 flex items-center gap-1">
                        <Syringe size={14} /> 疫苗施打 (Vaccination):
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { key: 'vaccinated', label: 'Fully Vaccinated' },
                          { key: '1st_dose', label: '1st Dose' },
                          { key: 'pending', label: 'Pending' }
                        ].map(item => (
                          <button
                            key={item.key}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, vaccine: item.key })}
                            className={`p-1.5 rounded-lg text-[11px] font-bold transition ${localVetCheck.vaccine === item.key ? 'bg-emerald-600 text-white shadow' : 'bg-white text-gray-700 border'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setVetCheck(localVetCheck);
                      setGameStage('RESCUE_REPORT');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    <span>生成完整 Rescue Report (Generate Report) ➔</span>
                  </button>
                </div>
              )}

              {/* STAGE 4: Generated Rescue Report in RPG Game */}
              {gameStage === 'RESCUE_REPORT' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 4: Rescue Report Complete!
                    </span>
                    <h2 className="text-2xl font-black text-purple-900 mt-1 flex items-center justify-center gap-2">
                      <Award size={24} className="text-yellow-500" />
                      救援與健檢英文報告
                    </h2>
                  </div>

                  {/* Comprehensive Rescue Report */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-purple-700 text-xs font-mono space-y-2 leading-relaxed">
                    <p className="text-yellow-300 font-bold border-b border-slate-700 pb-1">
                      📜 RESCUE REPORT: {activeCat.profile.name}
                    </p>
                    <p>• Animal: <span className="text-yellow-200 capitalize">{vocabulary.color.join('/') || 'Rescued'} {currentAnimal}</span></p>
                    <p>• Strategy: <span className="text-emerald-400">{approachChoice === 'slow' ? 'Walked slowly and softly' : 'Approached carefully'}</span></p>
                    <p>• Tools Used: <span className="text-yellow-300">{selectedToolNames}</span></p>
                    <p>• Disease Test: <span className="text-emerald-300">{localVetCheck.disease}</span></p>
                    <p>• Vaccine: <span className="text-emerald-300">{localVetCheck.vaccine}</span></p>
                    <p>• Condition: Ears are <span className="text-emerald-300">{localVetCheck.ears}</span>, Body is <span className="text-emerald-300">{localVetCheck.body}</span>!</p>
                  </div>

                  {/* Gemini Prompt for Happy Rescue Ending */}
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs space-y-2">
                    <p className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Wand2 size={14} className="text-purple-600" /> Happy Ending Gemini Prompt:
                    </p>
                    <p className="text-[11px] text-gray-700 bg-white p-2 rounded border border-purple-100 font-mono italic">
                      "{generateImagePrompt(activeCat)}"
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateImagePrompt(activeCat));
                        setIsCopiedReportPrompt(true);
                        setTimeout(() => setIsCopiedReportPrompt(false), 2000);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition flex justify-center items-center gap-1"
                    >
                      {isCopiedReportPrompt ? <Check size={14} /> : <Copy size={14} />}
                      {isCopiedReportPrompt ? '已複製 Prompt！' : '複製救援成功繪本 Prompt'}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={() => {
                        finishMiniGame();
                        setActiveTab('task3');
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <HeartHandshake size={16} /> 前往 Task 3 製作領養宣傳單 ➔
                    </button>
                    <button
                      onClick={finishMiniGame}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      🎮 回到 2D 地圖繼續冒險 ➔
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Profile Card Modal */}
          {gameState === 'PROFILE' && activeCat && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-indigo-500 relative max-h-[85vh] overflow-y-auto">
              
              <div className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-2">
                🎉 RPG Character Rescued!
              </div>

              {catImage && (
                <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-indigo-300 shadow-md">
                  <img src={catImage} alt="Uploaded Cat" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Editable Name Field for Adoption Flyer */}
              <div className="mb-3">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">取一個領養英文名字 (Adoption Pet Name):</label>
                <input
                  type="text"
                  value={adoptionPetName}
                  onChange={(e) => setAdoptionPetName(e.target.value)}
                  className="w-full text-center text-xl font-extrabold text-indigo-900 border-2 border-indigo-200 rounded-xl py-1 px-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Task 1 Sentence Summary */}
              <div className="text-left bg-orange-50 p-3 rounded-xl mb-3 text-xs text-gray-700 leading-relaxed border border-orange-200">
                <span className="font-bold text-orange-600 block mb-1">✨ Task 1 Observation Story:</span>
                {activeCat.profile.story}
              </div>

              {/* Task 2 Rescue Report Summary */}
              <div className="text-left bg-emerald-50 p-3 rounded-xl mb-3 text-xs text-emerald-950 leading-relaxed border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">🎒 Task 2 Rescue & Medical Report:</span>
                <p>• Equipment: <span className="font-bold">{selectedToolNames}</span></p>
                <p>• Medical: Disease <span className="font-bold">{localVetCheck.disease}</span>, Vaccine <span className="font-bold">{localVetCheck.vaccine}</span></p>
              </div>

              {/* Task 3 Adoption Flyer Quick Button */}
              <div className="bg-purple-50 p-3 rounded-xl mb-4 text-xs border border-purple-200 space-y-2">
                <p className="font-bold text-purple-900">✨ 製作這隻小貓的【Task 3 愛心領養宣傳單】</p>
                <button
                  onClick={() => {
                    setActiveCat(null);
                    setGameState('MAP');
                    setActiveTab('task3');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  <HeartHandshake size={16} /> 自動生成 Task 3 領養海報 ➔
                </button>
              </div>

              {/* Gemini Image Prompt Generator */}
              <div className="text-left bg-indigo-50 p-3 rounded-xl mb-4 text-xs border-2 border-indigo-200">
                <span className="font-bold text-indigo-800 block mb-1.5">🖼️ 雙任務合成 Gemini 繪本 Prompt:</span>
                <p className="text-gray-600 italic mb-2.5 bg-white p-2 rounded border border-indigo-100 text-[11px] select-all">
                  "{generateImagePrompt(activeCat)}"
                </p>
                
                {isCopiedMergedPrompt && (
                  <p className="text-[11px] text-emerald-600 font-bold text-center mb-1 animate-pulse">
                    ✓ 已複製雙任務整合 Prompt！
                  </p>
                )}

                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateImagePrompt(activeCat));
                    setIsCopiedMergedPrompt(true);
                    setTimeout(() => setIsCopiedMergedPrompt(false), 2000);
                  }}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded-xl text-xs shadow transition mb-1.5 flex justify-center items-center gap-2"
                >
                  📋 複製整合 Prompt 給 Gemini
                </button>
              </div>
              
              <button 
                onClick={() => { setActiveCat(null); setGameState('MAP'); }} 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Back to Map (回到地圖冒險)
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}