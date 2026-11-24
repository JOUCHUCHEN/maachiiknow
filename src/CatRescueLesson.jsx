import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Trash2, ArrowRight, Sparkles, Heart, ShieldAlert, Loader2, 
  Image as ImageIcon, Wand2, Tag, AlertCircle, Copy, Check, Briefcase, 
  Stethoscope, CheckCircle2, ShieldCheck, Award, Gamepad2, MapPin, Play, Grid,
  FileText, Printer, HeartHandshake, Maximize2, Minimize2, BookOpen, X, Compass
} from 'lucide-react';

// Custom Cat Icon component for universal rendering compatibility
const CatIcon = ({ size = 24, className = "", style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M12 5c-4 0-7.5 2.5-7.5 7 0 4.5 3.5 7 7.5 7s7.5-2.5 7.5-7c0-4.5-3.5-7-7.5-7z" />
    <path d="M4.5 9.5L2 4l5 2" />
    <path d="M19.5 9.5L22 4l-5 2" />
    <circle cx="9" cy="11" r="1" fill="currentColor" />
    <circle cx="15" cy="11" r="1" fill="currentColor" />
    <path d="M11 14a1 1 0 0 0 2 0" />
  </svg>
);

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

// Helper function to remove white background from avatar image
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

export default function App() {
  // Unified Game Stage State: 'START' | 'TASK1' | 'TASK2' | 'GAME' | 'TASK3'
  const [gameStageScreen, setGameStageScreen] = useState('START');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Callable AI Magic Dictionary Modal State
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(err => console.log(err));
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

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
  const [deployCatDanger] = useState('feed');
  const [deploySuccessMsg, setDeploySuccessMsg] = useState('');
  const [deployAvatarImage, setDeployAvatarImage] = useState(null);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [hasDeployedCustomCat, setHasDeployedCustomCat] = useState(false);

  // Task 2 Backpack States - NO ITEM LIMIT
  const [backpack, setBackpack] = useState([]);
  
  // Vet Check States
  const [vetCheck, setVetCheck] = useState({
    ears: 'dirty',
    eyes: 'clean',
    paws: 'cold',
    body: 'healthy',
    disease: 'negative',   
    vaccine: 'vaccinated'  
  });

  // Task 2A Custom Rescue Item Auto-translation States
  const [customRescueItems, setCustomRescueItems] = useState([]);
  const [customItemEng, setCustomItemEng] = useState('');
  const [customItemChi, setCustomItemChi] = useState('');
  const [isTranslatingItem, setIsTranslatingItem] = useState(false);

  // Task 3 Adoption Flyer States
  const [adoptionPetName, setAdoptionPetName] = useState('Lucky (幸運兒)');
  const [adoptionSlogan, setAdoptionSlogan] = useState('Looking for a warm & loving home!');
  const [isFlyerPromptCopied, setIsFlyerPromptCopied] = useState(false);

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
      icon: '🎒',
      desc: '自訂救援裝備'
    };

    setCustomRescueItems(prev => [...prev, newItem]);
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

  // 預設救援裝備清單（明確標示罐頭是用來引誘小貓的）
  const rescueItems = [
    { id: 'carrier', eng: 'carrier', chi: '外出籠', icon: '🏠', desc: '安全裝載與運送' },
    { id: 'food', eng: 'canned food', chi: '罐頭', icon: '🥫', desc: '引誘小貓出來' },
    { id: 'blanket', eng: 'warm blanket', chi: '保暖毯', icon: '🛋️', desc: '保暖與安撫情緒' },
    { id: 'gloves', eng: 'safety gloves', chi: '防咬手套', icon: '🧤', desc: '保護雙手防抓咬' },
    { id: 'trap_cage', eng: 'trap cage', chi: '誘捕籠', icon: '🪤', desc: '安全誘捕警戒浪浪' },
  ];

  const toggleBackpackItem = (item) => {
    if (backpack.some(i => i.id === item.id)) {
      setBackpack(backpack.filter(i => i.id !== item.id));
    } else {
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

  // 自動識別危險處境與地點詞彙，生成自然道地的英文處境短語
  const getDangerPlacePhrase = (rawItem) => {
    const lower = rawItem.trim().toLowerCase();

    if (/^(in|on|at|under|behind|inside|near|by|into|onto|trapped|stuck|hiding|out|alone|lost|stranded|caught|chased|surrounded)\b/.test(lower)) {
      return lower;
    }

    const withArticle = (phrase) => {
      const clean = phrase.trim();
      if (/^(a|an|the)\b/i.test(clean)) return clean;
      const article = /^[aeiou]/i.test(clean) && !/^(uni|use|eu)/i.test(clean) ? 'an' : 'a';
      return `${article} ${clean}`;
    };

    const disasters = [
      'typhoon', 'hurricane', 'tornado', 'storm', 'thunderstorm',
      'blizzard', 'sandstorm', 'snowstorm', 'earthquake', 'landslide',
      'flood', 'wildfire', 'tsunami', 'avalanche', 'heatwave', 'lightning'
    ];
    if (disasters.some(w => lower.includes(w))) {
      if (lower === 'lightning') return 'in the middle of a lightning storm';
      return `in the middle of ${withArticle(lower)}`;
    }

    if (lower.includes('rain') || lower.includes('drizzle')) {
      return lower === 'rain' ? 'out in the heavy rain' : `out in the ${lower}`;
    }
    if (['snow', 'hail', 'sleet', 'cold', 'freezing', 'frost', 'ice', 'winter'].some(w => lower.includes(w))) {
      return `out in the freezing ${lower}`;
    }
    if (['hot', 'heat', 'sun', 'sunlight'].some(w => lower.includes(w))) {
      return 'under the scorching sun';
    }
    if (['wind', 'gale', 'breeze'].some(w => lower.includes(w))) {
      return `in the strong ${lower}`;
    }
    if (['fog', 'mist', 'smog'].some(w => lower.includes(w))) {
      return `lost in the thick ${lower}`;
    }
    if (['dark', 'darkness', 'night', 'midnight'].some(w => lower.includes(w))) {
      return `alone in the ${lower}`;
    }

    if (['car engine', 'engine', 'car hood', 'hood', 'bonnet', 'exhaust', 'trunk'].some(w => lower.includes(w))) {
      return `trapped inside ${withArticle(lower)}`;
    }
    if (['wheel', 'tire', 'bumper'].some(w => lower.includes(w))) {
      return `hiding near ${withArticle(lower)}`;
    }
    if (['car', 'truck', 'van', 'bus', 'taxi', 'jeep', 'suv', 'vehicle', 'motorcycle', 'scooter', 'bicycle', 'bike', 'tractor'].some(w => lower === w || lower.endsWith(` ${w}`))) {
      return `under ${withArticle(lower)}`;
    }
    if (lower.includes('traffic')) {
      return 'in the middle of heavy traffic';
    }
    if (['highway', 'freeway', 'intersection', 'crosswalk', 'railway', 'train track', 'tracks', 'subway'].some(w => lower.includes(w))) {
      return `near a dangerous ${lower}`;
    }
    if (lower === 'bridge' || lower === 'overpass') {
      return `under ${withArticle(lower)}`;
    }
    if (['street', 'road', 'avenue', 'sidewalk', 'pavement'].some(w => lower.includes(w))) {
      return `on a busy ${lower}`;
    }

    if (['drain', 'sewer', 'gutter', 'ditch', 'trench', 'culvert', 'manhole', 'pipe', 'tube', 'vent', 'chimney', 'duct', 'well', 'pit', 'hole', 'sinkhole', 'basement', 'cage', 'trap'].some(w => lower.includes(w))) {
      return `trapped in ${withArticle(lower)}`;
    }
    if (['net', 'wire', 'fence', 'rope'].some(w => lower.includes(w))) {
      return `caught in ${withArticle(lower)}`;
    }
    if (['box', 'cardboard', 'bag', 'trash can', 'garbage', 'bin', 'dumpster', 'bucket', 'barrel', 'crate', 'washing machine', 'dryer', 'closet'].some(w => lower.includes(w))) {
      return `hiding inside ${withArticle(lower)}`;
    }

    if (['roof', 'rooftop', 'balcony', 'ledge', 'window', 'wall', 'stairs', 'ladder'].some(w => lower.includes(w))) {
      return `stuck on a high ${lower}`;
    }
    if (['cliff', 'edge', 'mountain', 'hill'].some(w => lower.includes(w))) {
      return `on the edge of a steep ${lower}`;
    }
    if (['tree', 'branch', 'pole'].some(w => lower.includes(w))) {
      return `stuck up in ${withArticle(lower)}`;
    }

    if (['mud', 'swamp', 'puddle', 'quicksand'].some(w => lower.includes(w))) {
      return `stuck in the ${lower}`;
    }
    if (['river', 'lake', 'pond', 'pool', 'canal', 'stream', 'creek', 'sea', 'ocean', 'water', 'waterfall'].some(w => lower.includes(w))) {
      return `stranded near a deep ${lower}`;
    }

    if (['fire', 'smoke', 'flames', 'burning'].some(w => lower.includes(w))) {
      return `trapped near a dangerous ${lower}`;
    }
    if (['construction', 'ruins', 'factory', 'warehouse', 'abandoned'].some(w => lower.includes(w))) {
      return `trapped in a dangerous ${lower}`;
    }
    if (['alley', 'corner'].some(w => lower.includes(w))) {
      return `hiding in a dark ${lower}`;
    }

    if (['dog', 'snake', 'hawk', 'eagle', 'rat', 'bully'].includes(lower)) {
      return `chased by ${withArticle(lower)}`;
    }
    if (['dogs', 'snakes', 'rats', 'crowd', 'strangers'].includes(lower)) {
      return `surrounded by ${lower}`;
    }

    if (['park', 'garden', 'yard', 'backyard', 'forest', 'woods', 'bush', 'grass', 'field', 'farm', 'beach', 'house', 'room', 'kitchen', 'bathroom', 'bedroom', 'classroom'].some(w => lower.includes(w))) {
      return `alone in the ${lower}`;
    }
    if (['school', 'station', 'market', 'store', 'shop', 'hospital', 'temple'].some(w => lower.includes(w))) {
      return `wandering near the ${lower}`;
    }
    if (['table', 'chair', 'bench', 'bed', 'sofa', 'couch', 'desk', 'shelf'].some(w => lower.includes(w))) {
      return `hiding under the ${lower}`;
    }

    return `trapped in a dangerous ${lower}`;
  };

  const formatLocationSentence = (arr) => {
    if (!arr || arr.length === 0) {
      return (
        <span>
          It's in the <span className="text-gray-400 border-b-2 border-dashed border-gray-300 px-4">________</span>.
        </span>
      );
    }

    const formattedPlaces = arr.map(item => getDangerPlacePhrase(item));

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

  const categories = [
    { id: 'animal', label: 'Cat or Dog (貓或狗)', icon: <CatIcon size={18} className="mr-2 text-indigo-500"/>, placeholder: 'e.g., cat, dog' },
    { id: 'color', label: 'Color (顏色)', icon: <Sparkles size={18} className="mr-2 text-yellow-500"/>, placeholder: 'e.g., black, white, orange' },
    { id: 'environment', label: 'Danger/Place (危險/環境)', icon: <ShieldAlert size={18} className="mr-2 text-purple-500"/>, placeholder: 'e.g., street, rain, cold' },
    { id: 'size', label: 'Size (大小)', icon: <CatIcon size={18} className="mr-2 text-blue-500"/>, placeholder: 'e.g., small, tiny, big' },
    { id: 'age', label: 'Age (年紀)', icon: <Heart size={18} className="mr-2 text-pink-500"/>, placeholder: 'e.g., young, baby, old' },
    { id: 'emotion', label: 'Feelings (情緒)', icon: <Heart size={18} className="mr-2 text-red-500"/>, placeholder: 'e.g., scared, sad, hungry' },
    { id: 'other', label: 'Other (其他)', icon: <Tag size={18} className="mr-2 text-teal-500"/>, placeholder: 'e.g., cute, fast, noisy' }
  ];

  const renderCardVisual = (category, word) => {
    const w = word.toLowerCase();

    if (category === 'color') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl shadow-inner relative overflow-hidden">
          <CatIcon size={72} style={{ color: w, fill: w }} className="drop-shadow-md z-10" />
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
        <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-xl text-5xl shadow-inner">
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
          <CatIcon size={54} className={`text-blue-500 transition-transform duration-500 ${sizeClass}`} />
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
      <div className="w-full h-full flex items-center justify-center bg-purple-50 rounded-xl text-5xl shadow-inner">
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

  const handleDeployToMap = (proceedToTask2 = false) => {
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
    setHasDeployedCustomCat(true);
    setDeploySuccessMsg(`🎉 成功將「${autoName}」置入 2D 地圖 (X:${deployX}, Y:${deployY})！`);
    setTimeout(() => setDeploySuccessMsg(''), 4000);

    if (proceedToTask2) {
      setGameStageScreen('TASK2');
    }
  };

  const questSteps = [
    { id: 'TASK1', label: '1. 觀察與置入', short: 'Task 1' },
    { id: 'TASK2', label: '2. 救援背包', short: 'Task 2' },
    { id: 'GAME', label: '3. 2D RPG 關卡', short: 'RPG Map' },
    { id: 'TASK3', label: '4. 領養與解鎖', short: 'Task 3' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-gray-800 flex flex-col justify-between selection:bg-orange-200">
      
      {/* ==================== UNIFIED GAME CONSOLE TOP HUD ==================== */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b-2 border-indigo-700/80 px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Game Logo & Title */}
          <div 
            onClick={() => setGameStageScreen('START')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="回到遊戲主畫面 (Title Screen)"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <CatIcon size={24} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-yellow-300 tracking-wide flex items-center gap-1.5">
                Cat Rescue Quest
                <span className="hidden md:inline-block text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-mono uppercase">
                  ESL RPG Edition
                </span>
              </h1>
              <p className="text-[11px] text-indigo-300 hidden sm:block">浪浪救助全流程互動遊戲</p>
            </div>
          </div>

          {/* Quest Progress Stepper (Visible once Start Game is clicked) */}
          {gameStageScreen !== 'START' && (
            <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/80 p-1 rounded-2xl border border-indigo-800/80">
              {questSteps.map((step, idx) => {
                const isActive = gameStageScreen === step.id;
                return (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => setGameStageScreen(step.id)}
                      className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-yellow-400 text-slate-950 shadow-md scale-105'
                          : 'text-indigo-200 hover:bg-indigo-900/70'
                      }`}
                    >
                      <span className="hidden sm:inline">{step.label}</span>
                      <span className="sm:hidden">{step.short}</span>
                    </button>
                    {idx < questSteps.length - 1 && (
                      <ArrowRight size={12} className="text-indigo-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Right HUD Controls: Callable AI Magic Dictionary Icon + Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDictionaryOpen(prev => !prev)}
              className={`px-3 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md border ${
                isDictionaryOpen
                  ? 'bg-purple-500 text-white border-purple-300 ring-2 ring-purple-300/60'
                  : 'bg-purple-700 hover:bg-purple-600 text-white border-purple-400/50'
              }`}
              title="點擊呼叫 AI Magic Dictionary (魔法字典)"
            >
              <BookOpen size={16} className="text-yellow-300" />
              <span>AI 魔法字典</span>
              {flashcards.length > 0 && (
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {flashcards.length}
                </span>
              )}
            </button>

            <button 
              onClick={toggleFullscreen}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-200 rounded-xl border border-slate-700 transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
              title="切換全螢幕 (Toggle Fullscreen)"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== CALLABLE AI MAGIC DICTIONARY MODAL ==================== */}
      {isDictionaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 w-full max-w-xl rounded-3xl shadow-2xl border-4 border-purple-500 p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsDictionaryOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center transition-colors"
              title="關閉字典"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-purple-950">AI Magic Dictionary (魔法字典)</h2>
                <p className="text-xs text-purple-700">輸入中文自動轉為英文單字與圖卡，並同步收錄至單字庫！</p>
              </div>
            </div>

            {apiError && (
              <div className="my-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle size={16} />
                <span>{apiError}</span>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">1. 選擇單字分類 (Category):</label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 bg-white font-bold text-sm text-gray-700"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">2. 輸入中文詞彙 (Chinese Term):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chineseInput}
                    onChange={(e) => setChineseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAIGeneration()}
                    placeholder="例如：黑白相間、引擎蓋、害怕..."
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 text-base bg-white"
                    disabled={isGenerating}
                    autoFocus
                  />
                  <button 
                    onClick={handleAIGeneration}
                    disabled={isGenerating || !chineseInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow whitespace-nowrap text-sm"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isGenerating ? '施法中...' : '變魔法!'}
                  </button>
                </div>
              </div>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-5 pt-4 border-t border-purple-200">
                <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ImageIcon size={14} /> 已生成的魔法字卡 (Magic Word Cards)
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x">
                  {flashcards.map(card => (
                    <div key={card.id} className="snap-center shrink-0 w-32 bg-white rounded-2xl border-2 border-purple-100 shadow-sm overflow-hidden flex flex-col">
                      <div className="h-24 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-2">
                        {renderCardVisual(card.cat, card.eng)}
                      </div>
                      <div className="p-2 text-center">
                        <p className="font-black text-sm text-gray-800 capitalize truncate">{card.eng}</p>
                        <p className="text-[11px] text-gray-500 truncate">{card.chi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsDictionaryOpen(false)}
                className="bg-purple-900 hover:bg-purple-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
              >
                完成並關閉字典
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN UNIFIED GAME VIEWPORT ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">

        {/* ---------- STAGE 0: START SCREEN ---------- */}
        {gameStageScreen === 'START' && (
          <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl border-4 border-yellow-400/90 shadow-2xl p-8 md:p-12 text-center text-white space-y-8 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase">
                <Sparkles size={16} /> Classroom ESL × 2D RPG Adventure
              </div>
              <div className="flex justify-center my-2">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-2xl border-4 border-white/20 animate-bounce">
                  <CatIcon size={54} className="text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-200 drop-shadow">
                Cat Rescue Quest
              </h2>
              <p className="text-lg md:text-xl font-bold text-indigo-200">
                浪浪救助英文互動冒險遊戲
              </p>
            </div>

            {/* Quest Roadmap Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-3xl mx-auto relative z-10">
              <div className="bg-slate-900/80 border border-indigo-700/80 p-3.5 rounded-2xl">
                <span className="text-xs font-black text-orange-400">STAGE 1</span>
                <p className="font-bold text-sm text-white mt-0.5">Look & Observe</p>
                <p className="text-[11px] text-slate-400 mt-1">上傳照片、大頭照指令、造句並置入地圖</p>
              </div>
              <div className="bg-slate-900/80 border border-indigo-700/80 p-3.5 rounded-2xl">
                <span className="text-xs font-black text-emerald-400">STAGE 2</span>
                <p className="font-bold text-sm text-white mt-0.5">Rescue Inventory</p>
                <p className="text-[11px] text-slate-400 mt-1">挑選救援裝備放進救援後背包</p>
              </div>
              <div className="bg-slate-900/80 border border-indigo-700/80 p-3.5 rounded-2xl">
                <span className="text-xs font-black text-yellow-400">STAGE 3</span>
                <p className="font-bold text-sm text-white mt-0.5">2D RPG 現場救援</p>
                <p className="text-[11px] text-slate-400 mt-1">探索地圖尋找浪浪、執行救援與健檢</p>
              </div>
              <div className="bg-slate-900/80 border border-indigo-700/80 p-3.5 rounded-2xl">
                <span className="text-xs font-black text-purple-400">STAGE 4</span>
                <p className="font-bold text-sm text-white mt-0.5">領養宣傳單 & 解鎖</p>
                <p className="text-[11px] text-slate-400 mt-1">生成領養海報與 RPG 繪本角色指令</p>
              </div>
            </div>

            <div className="pt-2 relative z-10">
              <button
                onClick={() => setGameStageScreen('TASK1')}
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black text-xl md:text-2xl px-12 py-4 rounded-2xl shadow-[0_6px_0_rgb(180,83,9)] active:translate-y-1 transition-all inline-flex items-center gap-3 cursor-pointer"
              >
                <Play size={28} fill="currentColor" />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------- STAGE 1: TASK 1 (OBSERVE -> WORDS -> SENTENCES -> DEPLOY) ---------- */}
        {gameStageScreen === 'TASK1' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Step 1 Look & Observe + Front Portrait Avatar Prompt */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              <section className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border-4 border-orange-300 flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-3">
                  <h2 className="text-xl font-black text-gray-800 flex items-center">
                    <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2.5 text-sm">1</span>
                    Look & Observe
                  </h2>
                  <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow">
                    <Camera size={16} />
                    <span>上傳照片</span>
                    <input 
                      type="file" 
                      accept="image/*,.heic,.heif" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-gray-500 text-xs mb-3 w-full text-left">
                  Look at the picture. What do you see? (請先上傳浪浪照片)
                </p>
                
                {imageUploadError && (
                  <div className="mb-3 w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}

                <div 
                  className="relative w-full aspect-square max-h-[300px] rounded-2xl overflow-hidden shadow-inner border-2 border-orange-100 bg-gray-100 group cursor-pointer" 
                  onClick={() => document.getElementById('cat-image-input-main').click()}
                >
                  <input 
                    id="cat-image-input-main"
                    type="file" 
                    accept="image/*,.heic,.heif" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                  {isConvertingImage && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 space-y-2 p-4 text-center">
                      <Loader2 size={32} className="animate-spin text-orange-500" />
                      <p className="text-xs font-bold text-orange-700">正在處理與轉碼照片中...</p>
                    </div>
                  )}
                  <img 
                    src={catImage || "https://placehold.co/800x800/fff7ed/f97316?text=Click+Here+to+Upload+Photo\n(%E9%BB%9E%E6%93%8A%E4%B8%8A%E5%82%B3%E6%B5%AA%E6%B5%AA%E7%85%A7%E7%89%87)"} 
                    alt="Rescued Cat"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3 justify-center pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Camera size={14} /> 點擊上傳/更換照片 (支援 HEIC / JPG / PNG)
                    </span>
                  </div>
                </div>

                {/* Front Portrait Avatar Prompt (Generated simultaneously with Look & Observe) */}
                <div className="w-full mt-4 bg-gradient-to-br from-indigo-900 to-slate-900 p-4 rounded-2xl border-2 border-indigo-600 text-white space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-yellow-300">
                      <Sparkles size={16} className="text-yellow-400" />
                      正面大頭照生成指令 (Front Portrait Avatar Prompt)
                    </h3>
                    <span className="bg-indigo-800 text-indigo-200 text-[10px] px-2 py-0.5 rounded-full font-mono">Headshot</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-800/70 font-mono text-[11px] text-indigo-100 leading-relaxed">
                    {avatarPrompt}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(avatarPrompt);
                        setIsAvatarPromptCopied(true);
                        setTimeout(() => setIsAvatarPromptCopied(false), 2000);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-2 px-3.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow"
                    >
                      {isAvatarPromptCopied ? <Check size={14} /> : <Copy size={14} />}
                      {isAvatarPromptCopied ? '已複製指令！' : '複製大頭照 Prompt'}
                    </button>
                    <a
                      href="https://gemini.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-300 hover:text-yellow-200 text-xs font-bold underline underline-offset-4"
                    >
                      開啟 Gemini 生成頭像 ➔
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Collect Words -> Magic Sentences -> Deploy Cat to RPG Map */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 2: Collect Words */}
              <section className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border-4 border-blue-200">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <h2 className="text-xl font-black text-gray-800 flex items-center">
                    <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2.5 text-sm">2</span>
                    Collect Words (收集觀察單字)
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDictionaryOpen(true)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 transition"
                    >
                      <BookOpen size={14} /> 呼叫魔法字典
                    </button>
                    <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                      {currentCatIndex + 1} / {categories.length}
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 space-y-4">
                  <label className="flex items-center text-base md:text-lg font-extrabold text-gray-800">
                    {categories[currentCatIndex].icon} {categories[currentCatIndex].label}
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputs[categories[currentCatIndex].id]}
                      onChange={(e) => handleInputChange(categories[currentCatIndex].id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddWord(categories[currentCatIndex].id, e)}
                      placeholder={categories[currentCatIndex].placeholder}
                      className="flex-1 px-4 py-3 text-base rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <button 
                      onClick={(e) => handleAddWord(categories[currentCatIndex].id, e)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl transition-colors flex items-center justify-center shadow"
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-[36px]">
                    {vocabulary[categories[currentCatIndex].id].map(word => (
                      <span 
                        key={word} 
                        className="inline-flex items-center bg-white border-2 border-orange-300 text-orange-700 text-sm font-bold px-3.5 py-1 rounded-full shadow-xs"
                      >
                        {word}
                        <button 
                          onClick={() => handleRemoveWord(categories[currentCatIndex].id, word)}
                          className="ml-2 text-orange-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    ))}
                    {vocabulary[categories[currentCatIndex].id].length === 0 && (
                      <span className="text-gray-400 italic text-xs flex items-center">尚未輸入單字，可手動輸入或點擊右上角「AI 魔法字典」...</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentCatIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentCatIndex === 0}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs disabled:opacity-30 hover:bg-gray-300"
                    >
                      ← 上一題
                    </button>
                    <div className="flex gap-1">
                      {categories.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => setCurrentCatIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === currentCatIndex ? 'bg-blue-600 w-5' : vocabulary[c.id].length > 0 ? 'bg-orange-400' : 'bg-gray-300'
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentCatIndex(prev => Math.min(categories.length - 1, prev + 1))}
                      disabled={currentCatIndex === categories.length - 1}
                      className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs disabled:opacity-30 hover:bg-blue-700"
                    >
                      下一題 →
                    </button>
                  </div>
                </div>
              </section>

              {/* Step 3: Magic Sentences */}
              <section className="bg-white p-5 md:p-6 rounded-3xl shadow-xl border-4 border-emerald-200">
                <h2 className="text-xl font-black text-gray-800 flex items-center mb-4">
                  <span className="bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center mr-2.5 text-sm">3</span>
                  Magic Sentences (魔法造句)
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-3 text-base text-gray-700 font-medium leading-relaxed">
                  <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200">
                    <p className="mb-1 text-[11px] font-bold text-orange-500 uppercase tracking-wider">Appearance</p>
                    <p>Look at the {formatList(vocabulary.animal)}! It's {formatList(vocabulary.color)}.</p>
                  </div>
                  <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
                    <p className="mb-1 text-[11px] font-bold text-purple-500 uppercase tracking-wider">Danger / Place</p>
                    <p>{formatLocationSentence(vocabulary.environment)}</p>
                  </div>
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                    <p className="mb-1 text-[11px] font-bold text-blue-500 uppercase tracking-wider">Details</p>
                    <p>
                      {vocabulary.size.includes('small') && vocabulary.age.includes('baby') ? (
                        <>It is a <span className="font-bold text-orange-600 border-b-2 border-orange-400 px-1">small baby</span> {formatList(vocabulary.animal)}.</>
                      ) : (
                        <>It is a {vocabulary.size.length ? formatList(vocabulary.size.map(s => s.endsWith('-sized') ? s : `${s}-sized`)) : <span className="text-gray-400 border-b-2 border-dashed border-gray-300 px-3">____-sized</span>}, {formatList(vocabulary.age)} {formatList(vocabulary.animal)}.</>
                      )}
                    </p>
                  </div>
                  <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200">
                    <p className="mb-1 text-[11px] font-bold text-red-500 uppercase tracking-wider">Feelings</p>
                    <p>The poor {formatList(vocabulary.animal)} looks {formatList(vocabulary.emotion)}.</p>
                  </div>
                  <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 sm:col-span-2">
                    <p className="mb-1 text-[11px] font-bold text-teal-600 uppercase tracking-wider">Other Features</p>
                    <p>Special traits: {formatList(vocabulary.other)}.</p>
                  </div>
                </div>
              </section>

              {/* Step 4: Deploy Cat to RPG Map */}
              <section className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 md:p-6 rounded-3xl border-4 border-indigo-500 text-white shadow-2xl space-y-4">
                <div>
                  <h2 className="text-xl font-black text-yellow-300 flex items-center gap-2">
                    <MapPin size={22} className="text-indigo-400" />
                    4. 置入貓咪角色於 2D 遊戲地圖 (Deploy Cat to RPG Map)
                  </h2>
                  <p className="text-xs text-indigo-200 mt-1">
                    選擇地圖座標並可上傳去背大頭照，將角色置入 2D 遊戲地圖後進入 Task 2！
                  </p>
                </div>

                {deploySuccessMsg && (
                  <div className="bg-emerald-900/90 border border-emerald-400 text-emerald-200 px-4 py-2.5 rounded-xl font-bold text-xs">
                    {deploySuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                  {/* Mini Map Coordinate Picker */}
                  <div>
                    <p className="text-xs font-bold text-indigo-300 mb-2 flex items-center gap-1">
                      <Grid size={14} /> 點擊地圖選擇座標 (X: {deployX}, Y: {deployY})
                    </p>
                    <div 
                      className="grid gap-0.5 bg-slate-950 p-2 rounded-xl border border-slate-700 aspect-square max-w-[240px] mx-auto sm:mx-0"
                      style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                    >
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

                  {/* Avatar Upload & Action Buttons */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                      <p><span className="text-yellow-400 font-bold">放置座標:</span> X={deployX}, Y={deployY}</p>
                      <p><span className="text-yellow-400 font-bold">角色狀態:</span> {vocabulary.color.join('/') || '浪浪'} {currentAnimalName}</p>
                    </div>

                    <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2">
                      <label className="block font-bold text-yellow-300 flex items-center justify-between">
                        <span className="flex items-center gap-1"><Camera size={14} /> 上傳大頭照 (自動去背)</span>
                      </label>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow">
                          <Camera size={14} />
                          <span>選擇頭像圖片</span>
                          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                        {isProcessingAvatar && (
                          <span className="text-[11px] text-yellow-300 flex items-center gap-1">
                            <Loader2 size={14} className="animate-spin"/> 去背中...
                          </span>
                        )}
                        {deployAvatarImage && !isProcessingAvatar && (
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg border border-indigo-400 bg-slate-950 overflow-hidden flex items-center justify-center p-0.5">
                              <img src={deployAvatarImage} alt="Avatar" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-[11px] text-emerald-400 font-bold">✓ 已去背</span>
                            <button onClick={() => setDeployAvatarImage(null)} className="text-[11px] text-red-400 underline">重設</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => handleDeployToMap(true)}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                      >
                        <Play size={18} fill="currentColor" />
                        <span>置入角色並進入 Task 2 ➔</span>
                      </button>
                      
                      {hasDeployedCustomCat && (
                        <button
                          onClick={() => setGameStageScreen('TASK2')}
                          className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                        >
                          直接前往 Task 2 (救援裝備庫) ➔
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* ---------- STAGE 2: TASK 2 (RESCUE INVENTORY & BACKPACK -> 2D RPG) ---------- */}
        {gameStageScreen === 'TASK2' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Rescue Backpack */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <section className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border-4 border-emerald-500">
                <div className="flex justify-between items-center mb-3 border-b border-emerald-700/80 pb-3">
                  <h3 className="font-black text-xl flex items-center gap-2 text-emerald-300">
                    <Briefcase size={22} /> 救援後背包 (Rescue Backpack)
                  </h3>
                  <span className="bg-emerald-950 text-yellow-300 font-mono text-xs font-bold px-3 py-1 rounded-full border border-emerald-500">
                    已帶 {backpack.length} 樣
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mb-4">
                  點擊右側救援裝備庫的道具，即可裝進你的救援背包中（不限數量）：
                </p>
                
                {backpack.length === 0 ? (
                  <div className="bg-emerald-950/80 border-2 border-dashed border-emerald-600/60 rounded-2xl p-8 text-center text-sm text-emerald-400 font-medium">
                    🎒 背包目前是空的，請從右側選擇救援道具！
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {backpack.map((item, idx) => (
                      <div 
                        key={`${item.id}_${idx}`} 
                        onClick={() => toggleBackpackItem(item)}
                        title="點擊移出背包"
                        className="cursor-pointer bg-emerald-950/90 hover:bg-red-950/80 border-2 border-emerald-500 hover:border-red-400 rounded-2xl p-3 text-center flex flex-col items-center justify-center transition-colors group"
                      >
                        <span className="text-3xl mb-1">{item.icon}</span>
                        <span className="text-xs font-bold text-yellow-200 capitalize truncate w-full">{item.eng}</span>
                        <span className="text-[11px] text-emerald-300 group-hover:text-red-300 truncate w-full">
                          {item.chi}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Rescue Inventory + Enter 2D RPG CTA */}
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white p-6 rounded-3xl shadow-xl border-4 border-emerald-200">
                <h2 className="text-2xl font-black text-emerald-950 flex items-center mb-1">
                  <ShieldCheck size={26} className="mr-2 text-emerald-600" />
                  Rescue Inventory (救援裝備庫)
                </h2>
                <p className="text-gray-500 text-xs mb-4">點擊裝備帶上它，準備進入現場展開救援！</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[...rescueItems, ...customRescueItems].map((item) => {
                    const isSelected = backpack.some(i => i.id === item.id);
                    const isCustom = item.id.startsWith('custom_');
                    return (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => toggleBackpackItem(item)}
                          className={`w-full h-full p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400 shadow-sm' 
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-3xl">{item.icon}</span>
                            {isSelected && <CheckCircle2 size={20} className="text-emerald-600" />}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-800 capitalize text-sm">{item.eng}</p>
                            <p className="text-xs text-gray-500 font-medium">{item.chi}</p>
                            {item.desc && (
                              <p className={`text-[11px] mt-1 font-bold ${item.id === 'food' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                • {item.desc}
                              </p>
                            )}
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

                {/* Custom Rescue Item Generator */}
                <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200">
                  <p className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                    <Plus size={16} className="text-emerald-600" />
                    自由新增自訂裝備 (中英文雙向自動翻譯)
                  </p>
                  <p className="text-xs text-emerald-700 mb-3">輸入中文會自動變英文，或輸入英文自動變中文！</p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customItemChi}
                      onChange={(e) => handleChiItemChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRescueItem(e)}
                      placeholder="中文 (例：手電筒、牽繩)"
                      className="flex-1 px-3 py-2 text-sm rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                    />

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

              {/* Direct Transition to 2D RPG Core Stage */}
              <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border-4 border-yellow-400 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl animate-bounce">🎒</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-yellow-300">
                      裝備準備完畢！直接進入 2D RPG 核心關卡
                    </h2>
                    <p className="text-xs text-purple-200 mt-1">
                      帶著你挑選的救援道具，進入 2D 地圖尋找浪浪、進行現場救援與獸醫健檢！
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-indigo-700/80 text-xs text-indigo-200 flex flex-wrap justify-between items-center gap-2">
                  <span>目前攜帶裝備：<strong className="text-yellow-300">{backpack.length ? backpack.map(i => i.eng).join(', ') : '基本徒手救援'}</strong></span>
                  <span className="bg-indigo-800 text-yellow-300 px-3 py-1 rounded-full font-mono font-bold">{backpack.length} Items</span>
                </div>

                <button
                  onClick={() => setGameStageScreen('GAME')}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 rounded-2xl shadow-xl hover:shadow-yellow-400/50 transition-all text-base flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Gamepad2 size={24} className="text-indigo-950" />
                  <span>裝備準備完畢！直接進入 2D RPG 核心關卡 ➔</span>
                </button>
              </section>
            </div>
          </div>
        )}

        {/* ---------- STAGE 3: 2D RPG CORE GAME ---------- */}
        {gameStageScreen === 'GAME' && (
          <div className="w-full flex justify-center">
            <PawsAndPlay 
              gameCats={gameCats} 
              setGameCats={setGameCats} 
              vocabulary={vocabulary}
              backpack={backpack}
              vetCheck={vetCheck}
              setVetCheck={setVetCheck}
              catImage={catImage}
              adoptionPetName={adoptionPetName}
              setAdoptionPetName={setAdoptionPetName}
              onProceedToTask3={() => setGameStageScreen('TASK3')}
            />
          </div>
        )}

        {/* ---------- STAGE 4: TASK 3 (ADOPTION FLYER + RPG CHARACTER UNLOCKED) ---------- */}
        {gameStageScreen === 'TASK3' && (
          <div className="max-w-5xl mx-auto w-full space-y-8">
            
            {/* BLOCK 1: ADOPTION FLYER */}
            <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-purple-500 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-700/80 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-purple-400/30">
                    <HeartHandshake size={16} className="text-pink-400" />
                    FINAL QUEST REWARD • ADOPTION FLYER
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-yellow-300">愛心領養宣傳單 (Adoption Flyer)</h2>
                  <p className="text-xs md:text-sm text-purple-200 mt-1">救援與健檢完成！為牠取個溫暖的名字，製作專屬英文領養海報！</p>
                </div>
                
                <button
                  onClick={() => window.print()}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-xs shrink-0"
                >
                  <Printer size={16} /> 列印/儲存宣傳單
                </button>
              </div>

              {/* Name & Slogan Input Form */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-purple-700/80">
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
                    <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2">
                      <h3 className="font-extrabold text-orange-800 border-b border-amber-200 pb-1 flex items-center gap-2">
                        <CatIcon size={18} /> Basic Information (基本資料)
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                        <p><span className="font-bold text-gray-500">Species:</span> <span className="capitalize font-bold text-gray-800">{currentAnimalName}</span></p>
                        <p><span className="font-bold text-gray-500">Color:</span> <span className="capitalize font-bold text-gray-800">{vocabulary.color.join(' / ') || 'Special'}</span></p>
                        <p><span className="font-bold text-gray-500">Size:</span> <span className="capitalize font-bold text-gray-800">{vocabulary.size.join(' / ') || 'Medium'}</span></p>
                        <p><span className="font-bold text-gray-500">Feeling:</span> <span className="capitalize font-bold text-gray-800">{currentEmotionName} ➔ Safe ❤️</span></p>
                      </div>
                    </div>

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

                    <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-200 text-xs text-purple-950">
                      <span className="font-bold text-purple-800">🎒 Rescue Equipment Used:</span>{' '}
                      {backpack.length ? backpack.map(i => `${i.eng} (${i.chi})`).join(', ') : 'Standard Carrier & Blanket'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 text-center text-xs text-gray-500 font-medium">
                  💌 "Give a stray animal a second chance at life." | Cat Rescue Quest Project
                </div>
              </div>

              {/* Gemini Adoption Poster Prompt */}
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

            {/* BLOCK 2: RPG CHARACTER UNLOCKED! (Placed together with Adoption Flyer at the end) */}
            <section className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl text-white relative border-4 border-yellow-500/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                <h2 className="text-2xl font-black flex items-center text-yellow-400">
                  <span className="bg-yellow-500 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg font-black">★</span>
                  RPG Character Unlocked! (角色繪本故事卡解鎖)
                </h2>
                <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  Storybook Illustration Prompt
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-950/70 p-6 rounded-2xl border border-slate-700">
                <div className="w-full md:w-32 h-32 shrink-0 bg-slate-800 rounded-2xl border-4 border-slate-600 flex items-center justify-center flex-col shadow-inner">
                   <Wand2 size={44} className="text-yellow-400 mb-2" />
                   <span className="text-xs font-mono text-slate-300">AI Prompt</span>
                </div>
                
                <div className="flex-1 space-y-4 font-mono w-full">
                  <div className="border-b border-slate-700 pb-2">
                    <h3 className="text-lg font-bold text-white mb-1">小貓/小狗待救援處境繪本插畫指令 (Image Prompt)</h3>
                    <p className="text-xs text-yellow-400">將這段咒語交給 AI，還原牠等待救援的感人繪本畫面！（⚠️ 記得一併附上照片喔！）</p>
                  </div>
                  
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-600 text-slate-200 text-xs md:text-sm leading-relaxed break-words">
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
                  
                  <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
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
                       className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3 px-6 rounded-xl shadow-[0_4px_0_rgb(161,98,7)] active:translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                     >
                       {isCopied ? <Check size={20} /> : <Copy size={20} />}
                       {isCopied ? '已複製 (Copied!)' : '複製角色 Prompt'}
                     </button>

                     <a 
                       href="https://gemini.google.com/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-2 transition-colors underline underline-offset-4 w-full sm:w-auto justify-center sm:justify-start"
                     >
                       開啟 Gemini 生成角色插畫 ➔
                     </a>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      <footer className="text-center py-3 text-slate-500 text-xs border-t border-slate-900">
        <p>© 2026 Cat Rescue Quest RPG • Classroom ESL Interactive Adventure</p>
      </footer>
    </div>
  );
}

function PawsAndPlay({ 
  gameCats, 
  setGameCats,
  vocabulary = { animal: [], color: [], size: [], age: [], emotion: [], environment: [], other: [] },
  backpack = [],
  vetCheck = { ears: 'clean', eyes: 'clean', paws: 'warm', body: 'healthy', disease: 'negative', vaccine: 'vaccinated' },
  setVetCheck = () => {},
  catImage = null,
  adoptionPetName = 'Lucky',
  setAdoptionPetName = () => {},
  onProceedToTask3 = () => {}
}) {
  // Starts directly in 'MAP' mode since the player already clicked "Start Game" and prepared in Task 1 & 2!
  const [gameState, setGameState] = useState('MAP');
  const [activeCat, setActiveCat] = useState(null);
  const [gameStage, setGameStage] = useState('APPROACH_TOOLS');
  
  const [selectedTools, setSelectedTools] = useState([]);
  const [approachChoice, setApproachChoice] = useState('slow');
  
  const [localVetCheck, setLocalVetCheck] = useState({
    ears: vetCheck.ears || 'dirty',
    eyes: vetCheck.eyes || 'clean',
    paws: vetCheck.paws || 'cold',
    body: vetCheck.body || 'healthy',
    disease: vetCheck.disease || 'negative',
    vaccine: vetCheck.vaccine || 'vaccinated'
  });

  const [itemActionProgress, setItemActionProgress] = useState({});

  const canvasRef = useRef(null);
  const requestRef = useRef();
  const avatarCacheRef = useRef({});
  const keysRef = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false });
  
  const gameDataRef = useRef({ cats: [...gameCats], map: JSON.parse(JSON.stringify(INITIAL_MAP_DATA)) });

  const currentAnimal = vocabulary.animal[0] || 'cat';
  const animalChinese = currentAnimal.includes('dog') ? '小狗' : '小貓';
  
  const selectedToolObjs = backpack.filter(i => selectedTools.includes(i.id));
  const selectedToolNames = selectedToolObjs.length 
    ? selectedToolObjs.map(i => i.eng).join(', ') 
    : 'canned food';

  const isOnlyLureFood = selectedToolObjs.length === 1 && (
    selectedToolObjs[0].eng.toLowerCase().includes('food') ||
    selectedToolObjs[0].eng.toLowerCase().includes('treat')
  );

  const missionSentence = isOnlyLureFood
    ? `You should ${approachChoice === 'slow' ? 'walk slowly' : 'approach carefully'} and use ${selectedToolNames} to lure the ${currentAnimal} out!`
    : `You should ${approachChoice === 'slow' ? 'walk slowly' : 'approach carefully'} and use ${selectedToolNames} to rescue the ${currentAnimal}!`;

  useEffect(() => {
    gameDataRef.current.cats = [...gameCats];
    
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

  const startMiniGame = (cat) => {
    for (let k in keysRef.current) keysRef.current[k] = false;
    setActiveCat(cat);
    setGameState('MINIGAME');
    setGameStage('APPROACH_TOOLS');
    
    if (backpack.length > 0) {
      setSelectedTools(backpack.map(b => b.id));
    } else {
      setSelectedTools([]);
    }
    setApproachChoice('slow');
    setItemActionProgress({});
    setLocalVetCheck({
      ears: 'dirty',
      eyes: 'clean',
      paws: 'cold',
      body: 'healthy',
      disease: 'negative',
      vaccine: 'vaccinated'
    });
  };

  const finishMiniGame = () => {
    setGameState('PROFILE');
    const remainingCats = gameDataRef.current.cats.filter(c => c.id !== activeCat.id);
    gameDataRef.current.cats = remainingCats;
    setGameCats(remainingCats);
  };

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
    <div className="relative w-full max-w-6xl min-h-[520px] md:aspect-[16/9] flex flex-col md:flex-row bg-gray-950 rounded-3xl overflow-hidden select-none font-sans border-4 border-indigo-700 shadow-2xl">
      
      {/* LEFT: 2D RPG Map Canvas */}
      <div className="relative flex-1 min-h-[360px] bg-gray-900 flex items-center justify-center p-3 overflow-hidden">
        {/* Top-left floating Map Radar Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/85 border border-indigo-500/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 z-10 shadow">
          <Compass size={16} className="text-yellow-400 animate-pulse" />
          <span>待救援浪浪：{gameCats.length} 隻</span>
        </div>

        <canvas 
          ref={canvasRef} 
          width={640} 
          height={640} 
          className="h-full max-h-full aspect-square rounded-2xl bg-gray-800 object-contain shadow-inner" 
          style={{ imageRendering: 'pixelated' }} 
        />

        {/* Touch D-Pad */}
        {gameState === 'MAP' && (
          <div className="absolute bottom-3 right-3 grid grid-cols-3 grid-rows-3 gap-1 md:hidden z-10 opacity-85">
            <div className="col-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowUp')}>▲</div>
            <div className="col-start-1 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowLeft')}>◀</div>
            <div className="col-start-3 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowRight')}>▶</div>
            <div className="col-start-2 row-start-3 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-10 h-10 text-lg active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowDown')}>▼</div>
          </div>
        )}
      </div>

      {/* RIGHT: Dynamic Rescue Bag Sidebar */}
      <div className="w-full md:w-80 bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 border-t-4 md:border-t-0 md:border-l-4 border-amber-700/80 p-4 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-amber-700/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl drop-shadow">🎒</span>
              <div>
                <h3 className="font-extrabold text-amber-200 text-sm tracking-wider uppercase">Rescue Bag</h3>
                <p className="text-[10px] text-amber-400 font-medium">救援後背包道具欄</p>
              </div>
            </div>
            <span className="bg-amber-950 border border-amber-600/80 text-yellow-300 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
              {backpack.length} items
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>📦</span> 已裝備道具 (Equipment)
            </p>
            {backpack.length === 0 ? (
              <div className="p-3 bg-amber-950/40 border border-amber-800/40 text-amber-500 rounded-xl text-center text-xs italic">
                尚未裝備道具 (徒手溫柔救援模式)
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1">
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
                      <p className="text-[10px] text-amber-400 truncate">
                        {item.chi} {item.id === 'food' ? '(引誘小貓出來)' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-indigo-950/90 border-2 border-yellow-400/80 rounded-2xl p-2.5 text-xs text-yellow-200 space-y-1 shadow-lg">
            <p className="font-bold text-yellow-300 text-[11px] flex items-center gap-1">
              <Gamepad2 size={14} className="text-yellow-400" /> 救援句型任務
            </p>
            <p className="text-[11px] font-mono text-white bg-slate-900/90 p-2 rounded-xl border border-indigo-700/60 leading-snug">
              "{missionSentence}"
            </p>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-amber-800/60 text-[11px] text-amber-300 space-y-1">
          <p className="font-bold">💡 操作提示：</p>
          <p className="text-amber-400 leading-tight">使用方向鍵 (↑↓←→) 或 WASD 移動尋找地圖上的 🐈/🐕，靠近即可展開救援與健檢！</p>
        </div>
      </div>

      {/* Victory Banner when all cats on map are rescued */}
      {gameState === 'MAP' && gameCats.length === 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-30 p-4 text-center">
          <div className="bg-gradient-to-b from-purple-900 to-indigo-950 border-4 border-yellow-400 p-6 md:p-8 rounded-3xl max-w-md text-white shadow-2xl space-y-4">
            <div className="text-6xl animate-bounce">🏆</div>
            <h2 className="text-2xl md:text-3xl font-black text-yellow-300">
              ALL ANIMALS RESCUED!
            </h2>
            <p className="text-xs md:text-sm text-purple-200 leading-relaxed">
              太棒了！地圖上所有的浪浪都已經安全獲救並完成健檢！
            </p>
            <div className="bg-purple-900/60 p-3 rounded-xl border border-purple-500 text-xs text-yellow-200 font-bold">
              ✨ 最終獎勵「愛心領養宣傳單 & RPG 角色故事卡」已解鎖！
            </div>
            <button
              onClick={onProceedToTask3}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <HeartHandshake size={20} /> 前往製作領養宣傳單 & 查看角色解鎖 ➔
            </button>
          </div>
        </div>
      )}

      {/* RESCUE MINI-GAME & PROFILE MODALS */}
      {gameState !== 'MAP' && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-20 overflow-y-auto p-4">
          
          {gameState === 'MINIGAME' && activeCat && (
            <div className="bg-white p-6 rounded-3xl w-full max-w-lg text-center shadow-2xl border-4 border-indigo-500 relative max-h-[90vh] overflow-y-auto">
              
              {gameStage === 'APPROACH_TOOLS' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase">Stage 1: Approach & Tools</span>
                    <h2 className="text-2xl font-black text-indigo-900 mt-1">救援方式與裝備準備</h2>
                  </div>

                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
                    <p className="font-bold text-amber-900">🐱 動物處境與情境：</p>
                    <p className="text-amber-800">{activeCat.profile.englishDesc}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">選擇接近方式 (Approach strategy):</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setApproachChoice('slow')}
                        className={`p-3 rounded-xl font-bold border-2 transition ${approachChoice === 'slow' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-200'}`}
                      >
                        🚶‍♂️ 輕聲緩慢靠近 (Walk slowly)
                      </button>
                      <button
                        onClick={() => setApproachChoice('fast')}
                        className={`p-3 rounded-xl font-bold border-2 transition ${approachChoice === 'fast' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-200'}`}
                      >
                        🏃‍♂️ 謹慎觀察靠近 (Approach carefully)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setGameStage('MINIGAME_ACTION')}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl shadow transition text-xs"
                  >
                    下一步：執行救援任務 ➔
                  </button>
                </div>
              )}

              {gameStage === 'MINIGAME_ACTION' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 2: Item Tasks
                    </span>
                    <h2 className="text-2xl font-black text-blue-900 mt-1">
                      🛠️ 裝備救援任務
                    </h2>
                  </div>

                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {selectedToolObjs.length === 0 ? (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-gray-300 text-center text-xs text-gray-500 space-y-2">
                        {itemActionProgress.bare_hands ? (
                          <div className="bg-emerald-100 border border-emerald-400 p-3 rounded-xl text-emerald-900 font-bold text-xs space-y-1">
                            <p className="text-[11px] text-emerald-700 flex items-center justify-center gap-1">
                              <span>🗣️</span> 學習英文句型 (Learning Sentence):
                            </p>
                            <p className="text-emerald-800 text-sm font-extrabold italic font-mono">
                              "I gently pick up the {currentAnimal} with my hands!"
                            </p>
                            <p className="text-[11px] text-emerald-600 font-normal">（我用雙手溫柔地抱起這隻{animalChinese}！）</p>
                          </div>
                        ) : (
                          <p className="py-1">未選擇特定道具，使用雙手溫柔救援...</p>
                        )}
                        <button
                          onClick={() => setItemActionProgress(prev => ({ ...prev, bare_hands: true }))}
                          disabled={itemActionProgress.bare_hands}
                          className={`block mx-auto font-bold px-4 py-2 rounded-xl text-xs shadow transition ${
                            itemActionProgress.bare_hands ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {itemActionProgress.bare_hands ? '✓ Completed (已完成)' : '🤲 溫柔抱起小動物 (Gentle Pick Up)'}
                        </button>
                      </div>
                    ) : (
                      selectedToolObjs.map((item) => {
                        const isDone = itemActionProgress[item.id];
                        
                        const getActionDetails = (itemObj) => {
                          const eng = itemObj.eng.toLowerCase();
                          if (eng.includes('carrier') || eng.includes('籠')) {
                            return {
                              subtitle: `將${animalChinese}安全地放進${itemObj.chi}`,
                              sentence: `I put the ${currentAnimal} safely into the ${itemObj.eng}.`,
                              meaning: `（我把${animalChinese}安全地放進${itemObj.chi}裡。）`
                            };
                          }
                          if (eng.includes('food') || eng.includes('treat') || eng.includes('罐頭') || eng.includes('零食') || eng.includes('糧')) {
                            return {
                              subtitle: `打開${itemObj.chi}，用香味引誘${animalChinese}出來`,
                              sentence: `I use yummy ${itemObj.eng} to lure the ${currentAnimal} out!`,
                              meaning: `（我用香噴噴的${itemObj.chi}引誘${animalChinese}出來！）`
                            };
                          }
                          if (eng.includes('blanket') || eng.includes('towel') || eng.includes('毯') || eng.includes('毛巾')) {
                            return {
                              subtitle: `用溫暖的${itemObj.chi}安撫並包裹${animalChinese}`,
                              sentence: `I wrap the ${currentAnimal} with a warm ${itemObj.eng}.`,
                              meaning: `（我用溫暖的${itemObj.chi}把${animalChinese}包起來保暖。）`
                            };
                          }
                          if (eng.includes('glove') || eng.includes('手套')) {
                            return {
                              subtitle: `戴上${itemObj.chi}保護雙手並抱起${animalChinese}`,
                              sentence: `I wear ${itemObj.eng} to hold the ${currentAnimal} safely.`,
                              meaning: `（我戴上${itemObj.chi}安全地抱起${animalChinese}。）`
                            };
                          }
                          if (eng.includes('trap') || eng.includes('誘捕')) {
                            return {
                              subtitle: `設置${itemObj.chi}引誘警戒的${animalChinese}進入`,
                              sentence: `I place the ${itemObj.eng} to safely lure the ${currentAnimal} inside.`,
                              meaning: `（我放好${itemObj.chi}安全地引誘${animalChinese}進入。）`
                            };
                          }
                          if (eng.includes('water') || eng.includes('水')) {
                            return {
                              subtitle: `提供乾淨的${itemObj.chi}補充水分`,
                              sentence: `I give clean ${itemObj.eng} to the ${currentAnimal}.`,
                              meaning: `（我給${animalChinese}喝乾淨的${itemObj.chi}。）`
                            };
                          }
                          if (eng.includes('leash') || eng.includes('collar') || eng.includes('牽繩') || eng.includes('項圈')) {
                            return {
                              subtitle: `幫${animalChinese}繫上${itemObj.chi}避免走失`,
                              sentence: `I attach the ${itemObj.eng} gently to the ${currentAnimal}.`,
                              meaning: `（我輕輕地幫${animalChinese}繫上${itemObj.chi}。）`
                            };
                          }
                          return {
                            subtitle: `使用 ${itemObj.chi} 來協助救援`,
                            sentence: `I use the ${itemObj.eng} to help rescue the ${currentAnimal}!`,
                            meaning: `（我使用${itemObj.chi}來協助救援${animalChinese}！）`
                          };
                        };

                        const actionDetails = getActionDetails(item);

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                              isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-blue-200'
                            }`}
                          >
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <h3 className="font-extrabold text-xs sm:text-sm">Use {item.eng} ({item.chi})</h3>
                                  <p className="text-[11px] text-gray-500">{actionDetails.subtitle}</p>
                                </div>
                              </div>

                              <button
                                onClick={() => setItemActionProgress(prev => ({ ...prev, [item.id]: true }))}
                                disabled={isDone}
                                className={`px-3 py-2 rounded-xl font-bold text-xs transition shrink-0 ${
                                  isDone ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                              >
                                {isDone ? '✓ Completed' : (item.id === 'food' ? 'Lure (引誘)' : 'Action')}
                              </button>
                            </div>

                            {isDone && (
                              <div className="bg-emerald-100/90 border border-emerald-300 p-2.5 rounded-xl text-xs space-y-1">
                                <p className="font-bold text-emerald-900 text-[11px] flex items-center gap-1">
                                  <span>🗣️</span> 學習英文句型 (Learning Sentence):
                                </p>
                                <p className="font-extrabold text-emerald-800 text-xs sm:text-sm font-mono italic">
                                  "{actionDetails.sentence}"
                                </p>
                                <p className="text-[11px] text-emerald-700 font-medium">
                                  {actionDetails.meaning}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {(() => {
                    const allDone = selectedToolObjs.length === 0 
                      ? itemActionProgress.bare_hands 
                      : selectedToolObjs.every(i => itemActionProgress[i.id]);

                    return (
                      <button
                        onClick={() => setGameStage('VET_CHECK')}
                        disabled={!allDone}
                        className={`w-full font-black py-3 rounded-2xl shadow transition text-xs ${
                          allDone ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        🩺 {allDone ? '前往診所進行 Vet Check-up ➔' : '請完成上方任務 ➔'}
                      </button>
                    );
                  })()}
                </div>
              )}

              {gameStage === 'VET_CHECK' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 3: Vet Check-up Clinic
                    </span>
                    <h2 className="text-2xl font-black text-emerald-900 mt-1 flex items-center justify-center gap-2">
                      <Stethoscope size={24} className="text-emerald-600" /> 獸醫健檢報告
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Ears (耳朵):</p>
                      <div className="flex flex-wrap gap-1">
                        {['dirty', 'clean', 'injured'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, ears: opt })}
                            className={`px-2 py-1 rounded-lg font-bold capitalize ${localVetCheck.ears === opt ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Eyes (眼睛):</p>
                      <div className="flex flex-wrap gap-1">
                        {['clean', 'watery', 'bright'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, eyes: opt })}
                            className={`px-2 py-1 rounded-lg font-bold capitalize ${localVetCheck.eyes === opt ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Body (身體):</p>
                      <div className="flex flex-wrap gap-1">
                        {['healthy', 'thin', 'soft'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, body: opt })}
                            className={`px-2 py-1 rounded-lg font-bold capitalize ${localVetCheck.body === opt ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700 mb-1">Vaccine (疫苗):</p>
                      <div className="flex flex-wrap gap-1">
                        {[
                          { id: 'vaccinated', label: 'Done' },
                          { id: '1st_dose', label: '1st Dose' },
                          { id: 'pending', label: 'Pending' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setLocalVetCheck({ ...localVetCheck, vaccine: opt.id })}
                            className={`px-2 py-1 rounded-lg font-bold ${localVetCheck.vaccine === opt.id ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
                          >
                            {opt.label}
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
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow transition text-xs flex items-center justify-center gap-2"
                  >
                    <FileText size={16} /> 生成完整 Rescue Report ➔
                  </button>
                </div>
              )}

              {gameStage === 'RESCUE_REPORT' && (
                <div className="space-y-4 text-left">
                  <div className="text-center">
                    <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                      Stage 4: Rescue Report Complete!
                    </span>
                    <h2 className="text-2xl font-black text-purple-900 mt-1 flex items-center justify-center gap-2">
                      <Award size={24} className="text-yellow-500" /> 救援與健檢英文報告
                    </h2>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-2xl border border-purple-700 text-xs font-mono space-y-2">
                    <p className="text-yellow-300 font-bold border-b border-slate-700 pb-1">
                      📜 RESCUE REPORT: {activeCat.profile.name}
                    </p>
                    <p>• Animal: <span className="text-yellow-200 capitalize">{vocabulary.color.join('/') || 'Rescued'} {currentAnimal}</span></p>
                    <p>• Tools Used: <span className="text-yellow-300">{selectedToolNames}</span></p>
                    <p>• Condition: Ears are <span className="text-emerald-300">{localVetCheck.ears}</span>, Eyes are <span className="text-emerald-300">{localVetCheck.eyes}</span>, Body is <span className="text-emerald-300">{localVetCheck.body}</span>!</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={() => {
                        finishMiniGame();
                        onProceedToTask3();
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <HeartHandshake size={16} /> 前往領養宣傳單 & 角色解鎖 ➔
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

          {gameState === 'PROFILE' && activeCat && (
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl border-4 border-indigo-500 relative max-h-[85vh] overflow-y-auto">
              <div className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-2">
                🎉 Animal Safely Rescued!
              </div>

              {catImage && (
                <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-indigo-300 shadow-md">
                  <img src={catImage} alt="Uploaded Cat" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="mb-3">
                <label className="block text-[11px] font-bold text-gray-500 mb-1">取一個領養英文名字 (Adoption Pet Name):</label>
                <input
                  type="text"
                  value={adoptionPetName}
                  onChange={(e) => setAdoptionPetName(e.target.value)}
                  className="w-full text-center text-xl font-extrabold text-indigo-900 border-2 border-indigo-200 rounded-xl py-1 px-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={() => { setActiveCat(null); setGameState('MAP'); }} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow"
              >
                回到 2D 地圖 (Back to Map)
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}