import React, { useState, useEffect, useRef } from 'react';

const TOYS = [
  {
    id: 'robot',
    word: 'robot',
    zh: '機器人',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <line x1="60" y1="8" x2="60" y2="24" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="8" r="6" fill="#EF4444" />
        <rect x="32" y="22" width="56" height="36" rx="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
        <rect x="23" y="32" width="9" height="16" rx="4" fill="#F59E0B" />
        <rect x="88" y="32" width="9" height="16" rx="4" fill="#F59E0B" />
        <circle cx="47" cy="38" r="6.5" fill="#FFFFFF" />
        <circle cx="47" cy="38" r="3" fill="#0F172A" />
        <circle cx="73" cy="38" r="6.5" fill="#FFFFFF" />
        <circle cx="73" cy="38" r="3" fill="#0F172A" />
        <rect x="46" y="48" width="28" height="5" rx="2.5" fill="#FEF08A" />
        <rect x="28" y="62" width="64" height="40" rx="10" fill="#0EA5E9" stroke="#0369A1" strokeWidth="3" />
        <rect x="40" y="70" width="40" height="22" rx="6" fill="#E0F2FE" />
        <circle cx="50" cy="81" r="4" fill="#EF4444" />
        <circle cx="60" cy="81" r="4" fill="#FACC15" />
        <circle cx="70" cy="81" r="4" fill="#22C55E" />
        <path d="M28 70 L14 82 L18 92" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 70 L106 82 L102 92" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="102" width="14" height="12" rx="4" fill="#475569" />
        <rect x="68" y="102" width="14" height="12" rx="4" fill="#475569" />
      </svg>
    ),
  },
  {
    id: 'doll',
    word: 'doll',
    zh: '洋娃娃',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="28" cy="38" r="14" fill="#92400E" />
        <circle cx="92" cy="38" r="14" fill="#92400E" />
        <polygon points="34,26 24,20 26,32" fill="#F43F5E" />
        <polygon points="86,26 96,20 94,32" fill="#F43F5E" />
        <circle cx="60" cy="42" r="24" fill="#92400E" />
        <circle cx="60" cy="46" r="20" fill="#FDE68A" />
        <path d="M40 42 Q50 30 60 40 Q70 30 80 42" fill="#92400E" />
        <circle cx="52" cy="46" r="3" fill="#1E293B" />
        <circle cx="68" cy="46" r="3" fill="#1E293B" />
        <circle cx="46" cy="52" r="3.5" fill="#FDA4AF" />
        <circle cx="74" cy="52" r="3.5" fill="#FDA4AF" />
        <path d="M55 54 Q60 59 65 54" fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 66 L76 66 L90 100 L30 100 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="45" cy="92" r="3" fill="#FFF1F2" />
        <circle cx="60" cy="92" r="3" fill="#FFF1F2" />
        <circle cx="75" cy="92" r="3" fill="#FFF1F2" />
        <path d="M44 70 L28 80" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
        <path d="M76 70 L92 80" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="100" x2="50" y2="112" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="100" x2="70" y2="112" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="113" r="4" fill="#E11D48" />
        <circle cx="70" cy="113" r="4" fill="#E11D48" />
      </svg>
    ),
  },
  {
    id: 'ball',
    word: 'ball',
    zh: '球',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="60" r="46" fill="#FACC15" stroke="#D97706" strokeWidth="3" />
        <path d="M60 14 A46 46 0 0 1 106 60 Q80 60 60 60 Q60 35 60 14 Z" fill="#EF4444" />
        <path d="M60 106 A46 46 0 0 1 14 60 Q40 60 60 60 Q60 85 60 106 Z" fill="#3B82F6" />
        <path d="M60 14 Q36 38 36 60 Q36 82 60 106 Q84 82 84 60 Q84 38 60 14 Z" fill="#FFFFFF" opacity="0.9" />
        <circle cx="60" cy="60" r="9" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
        <ellipse cx="42" cy="34" rx="10" ry="5" transform="rotate(-30 42 34)" fill="#FFFFFF" opacity="0.65" />
      </svg>
    ),
  },
  {
    id: 'car',
    word: 'car',
    zh: '玩具車',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <path d="M32 58 L44 34 L78 34 L90 58 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="3" strokeLinejoin="round" />
        <path d="M47 39 L58 39 L58 55 L38 55 Z" fill="#BAE6FD" />
        <path d="M63 39 L75 39 L84 55 L63 55 Z" fill="#BAE6FD" />
        <rect x="14" y="56" width="92" height="28" rx="12" fill="#FB7185" stroke="#BE123C" strokeWidth="3" />
        <circle cx="100" cy="68" r="5" fill="#FEF08A" />
        <rect x="16" y="64" width="5" height="8" rx="2" fill="#F97316" />
        <line x1="30" y1="70" x2="86" y2="70" stroke="#FFE4E6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="86" r="14" fill="#1E293B" />
        <circle cx="36" cy="86" r="6" fill="#CBD5E1" />
        <circle cx="84" cy="86" r="14" fill="#1E293B" />
        <circle cx="84" cy="86" r="6" fill="#CBD5E1" />
      </svg>
    ),
  },
  {
    id: 'kite',
    word: 'kite',
    zh: '風箏',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <path d="M60 82 Q45 96 65 104 Q78 110 56 116" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        <polygon points="52,93 62,90 58,99" fill="#F43F5E" />
        <polygon points="66,104 75,100 72,110" fill="#38BDF8" />
        <polygon points="60,10 96,46 60,82 24,46" fill="#34D399" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="60,10 96,46 60,46" fill="#FBBF24" />
        <polygon points="24,46 60,46 60,82" fill="#60A5FA" />
        <line x1="60" y1="10" x2="60" y2="82" stroke="#065F46" strokeWidth="2.5" />
        <line x1="24" y1="46" x2="96" y2="46" stroke="#065F46" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'yoyo',
    word: 'yoyo',
    zh: '溜溜球',
    article: 'a',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <path d="M60 44 C60 22, 85 16, 94 24 C100 30, 88 38, 82 32" fill="none" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 44 C60 22, 85 16, 94 24 C100 30, 88 38, 82 32" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="56" cy="74" r="34" fill="#A855F7" stroke="#6B21A8" strokeWidth="3" />
        <circle cx="56" cy="74" r="22" fill="#F3E8FF" />
        <polygon points="56,56 61,68 74,69 64,77 67,90 56,83 45,90 48,77 38,69 51,68" fill="#FACC15" stroke="#D97706" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function ToyExplorer() {
  const [mode, setMode] = useState('explore'); // 'explore' | 'quiz' | 'builder' | 'drag'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.5); // 預設語速放慢一半 (0.5x)
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // 模式一：探索學習
  const [exploreDistance, setExploreDistance] = useState('near');
  const [exploreToy, setExploreToy] = useState(TOYS[0]);

  // 模式二：句型配對
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(1);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTarget, setQuizTarget] = useState({ distance: 'near', toy: TOYS[0] });
  const [quizOptions, setQuizOptions] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizWrongIndices, setQuizWrongIndices] = useState([]);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState({
    text: '👆 點擊上方的英文對話卡片作答！',
    style: 'bg-slate-50 text-slate-500 border-slate-200',
  });

  // 模式三：組句大師
  const [builderQuestionIndex, setBuilderQuestionIndex] = useState(1);
  const [builderScore, setBuilderScore] = useState(0);
  const [builderTarget, setBuilderTarget] = useState({ distance: 'near', toy: TOYS[0] });
  const [builderTokens, setBuilderTokens] = useState([]);
  const [builderSelectedQ, setBuilderSelectedQ] = useState([]);
  const [builderSelectedA, setBuilderSelectedA] = useState([]);
  const [builderSolved, setBuilderSolved] = useState(false);
  const [builderFeedback, setBuilderFeedback] = useState({
    text: '注意玩具在近處 (this) 還是遠處 (that) 喔！',
    style: 'text-slate-500',
  });

  // 模式四：拖曳挑戰 (this -> 手的前方, that -> 手的遠方)
  const [dragQuestionIndex, setDragQuestionIndex] = useState(1);
  const [dragScore, setDragScore] = useState(0);
  const [dragTarget, setDragTarget] = useState({ distance: 'near', toy: TOYS[0] });
  const [dragSolved, setDragSolved] = useState(false);
  const [dragShowText, setDragShowText] = useState(true);
  const [selectedDragToy, setSelectedDragToy] = useState(null);
  const [draggingToy, setDraggingToy] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [hoverZone, setHoverZone] = useState(null); // 'near' | 'far' | null
  const [dragFeedback, setDragFeedback] = useState({
    text: '🖐️ 拖曳玩具到「手的前方 (this)」或「手的遠方 (that)」！',
    style: 'bg-slate-50 text-slate-600 border-slate-200',
  });

  // 彩紙與結算彈窗
  const [confettiList, setConfettiList] = useState([]);
  const [roundModal, setRoundModal] = useState({ open: false, score: 0 });

  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const nearZoneRef = useRef(null);
  const farZoneRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const playTone = (type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.22);
        });
      } else if (type === 'wrong') {
        [310, 250].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.13);
          gain.gain.setValueAtTime(0.16, now + idx * 0.13);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.13 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.13);
          osc.stop(now + idx * 0.13 + 0.18);
        });
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.22, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.3);
        });
      }
    } catch (e) {}
  };

  const speakEnglish = (text, customRate = speechRate) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = customRate;
      utterance.pitch = 1.08;

      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find(
          (v) =>
            v.lang.includes('en-US') &&
            (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'))
        ) || voices.find((v) => v.lang.includes('en'));
      if (enVoice) utterance.voice = enVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  const spawnConfetti = () => {
    const colors = ['#F43F5E', '#FACC15', '#34D399', '#38BDF8', '#A78BFA', '#FB923C'];
    const batchId = Date.now();
    const pieces = Array.from({ length: 24 }, (_, i) => ({
      id: `${batchId}-${i}`,
      left: `${15 + Math.random() * 70}%`,
      top: `${10 + Math.random() * 30}%`,
      color: colors[i % colors.length],
      delay: `${Math.random() * 0.2}s`,
    }));
    setConfettiList((prev) => [...prev, ...pieces]);
    setTimeout(() => {
      setConfettiList((prev) => prev.filter((p) => !p.id.startsWith(`${batchId}-`)));
    }, 1300);
  };

  const speakCurrentSentence = () => {
    let target = null;
    if (mode === 'explore') target = { distance: exploreDistance, toy: exploreToy };
    if (mode === 'quiz') target = quizTarget;
    if (mode === 'builder') target = builderTarget;
    if (mode === 'drag') target = dragTarget;
    if (!target) return;

    const qWord = target.distance === 'near' ? "What's this?" : "What's that?";
    if (
      mode === 'explore' ||
      mode === 'drag' ||
      (mode === 'quiz' && quizAnswered) ||
      (mode === 'builder' && builderSolved)
    ) {
      speakEnglish(`${qWord} It's ${target.toy.article} ${target.toy.word}.`);
    } else {
      speakEnglish(qWord);
    }
  };

  const toggleSpeed = () => {
    playTone('click');
    const nextRate = speechRate < 0.8 ? 1.0 : 0.5;
    setSpeechRate(nextRate);
    const target =
      mode === 'explore'
        ? { distance: exploreDistance, toy: exploreToy }
        : mode === 'quiz'
        ? quizTarget
        : mode === 'builder'
        ? builderTarget
        : dragTarget;
    const qWord = target.distance === 'near' ? "What's this?" : "What's that?";
    speakEnglish(
      mode === 'explore' || mode === 'drag' ? `${qWord} It's ${target.toy.article} ${target.toy.word}.` : qWord,
      nextRate
    );
  };

  // =========================================================================
  // 模式二：Quiz 出題邏輯
  // =========================================================================
  const generateQuizQuestion = (nextIdx) => {
    setQuizQuestionIndex(nextIdx);
    setQuizAnswered(false);
    setQuizWrongIndices([]);
    setQuizCorrectIndex(null);
    setQuizFeedback({
      text: '👆 點擊上方的英文對話卡片作答！',
      style: 'bg-slate-50 text-slate-500 border-slate-200',
    });

    const distance = Math.random() < 0.5 ? 'near' : 'far';
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    setQuizTarget({ distance, toy });

    const correctPronoun = distance === 'near' ? 'this' : 'that';
    const wrongPronoun = distance === 'near' ? 'that' : 'this';
    const otherToys = TOYS.filter((t) => t.id !== toy.id);
    const distractorToy = otherToys[Math.floor(Math.random() * otherToys.length)];

    const options = [
      { isCorrect: true, pronoun: correctPronoun, toyWord: toy.word, article: toy.article },
      { isCorrect: false, pronoun: wrongPronoun, toyWord: toy.word, article: toy.article },
      { isCorrect: false, pronoun: correctPronoun, toyWord: distractorToy.word, article: distractorToy.article },
      { isCorrect: false, pronoun: wrongPronoun, toyWord: distractorToy.word, article: distractorToy.article },
    ].sort(() => Math.random() - 0.5);

    setQuizOptions(options);
    setTimeout(() => speakEnglish(`What's ${correctPronoun}?`), 220);
  };

  const startQuizRound = () => {
    setQuizScore(0);
    setStreak(0);
    generateQuizQuestion(1);
  };

  const handleQuizChoice = (opt, idx) => {
    if (quizAnswered || quizWrongIndices.includes(idx)) return;

    if (opt.isCorrect) {
      setQuizAnswered(true);
      setQuizCorrectIndex(idx);
      const nextScore = quizScore + 1;
      setQuizScore(nextScore);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setStars((s) => s + 1);
      playTone('correct');
      spawnConfetti();

      setQuizFeedback({
        text: `🎉 答對了！What's ${opt.pronoun}? It's ${opt.article} ${opt.toyWord}. (+1 ⭐)`,
        style: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-bounce-in',
      });
      speakEnglish(`Great job! What's ${opt.pronoun}? It's ${opt.article} ${opt.toyWord}.`);

      timerRef.current = setTimeout(() => {
        if (quizQuestionIndex >= 10) {
          playTone('fanfare');
          spawnConfetti();
          speakEnglish('Congratulations! You did a great job!');
          setRoundModal({ open: true, score: nextScore });
        } else {
          generateQuizQuestion(quizQuestionIndex + 1);
        }
      }, 2600);
    } else {
      setStreak(0);
      playTone('wrong');
      setQuizWrongIndices((prev) => [...prev, idx]);
      const hintDist =
        quizTarget.distance === 'near'
          ? '看一看玩具在「近處」，要用 this 喔！'
          : '看一看玩具在「遠處」，要用 that 喔！';
      setQuizFeedback({
        text: `💡 再試一次！${hintDist}`,
        style: 'bg-rose-100 text-rose-800 border-rose-300',
      });
    }
  };

  // =========================================================================
  // 模式三：Builder 出題邏輯
  // =========================================================================
  const generateBuilderQuestion = (nextIdx) => {
    setBuilderQuestionIndex(nextIdx);
    setBuilderSolved(false);
    setBuilderSelectedQ([]);
    setBuilderSelectedA([]);
    setBuilderFeedback({
      text: '注意玩具在近處 (this) 還是遠處 (that) 喔！',
      style: 'text-slate-500',
    });

    const distance = Math.random() < 0.5 ? 'near' : 'far';
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    setBuilderTarget({ distance, toy });

    const targetPronoun = distance === 'near' ? 'this' : 'that';
    const distractorPronoun = distance === 'near' ? 'that' : 'this';

    const rawWords = [
      { id: 'w1', text: "What's" },
      { id: 'w2', text: targetPronoun },
      { id: 'w3', text: '?' },
      { id: 'w4', text: "It's" },
      { id: 'w5', text: toy.article },
      { id: 'w6', text: toy.word },
      { id: 'w7', text: '.' },
      { id: 'w8', text: distractorPronoun },
    ].sort(() => Math.random() - 0.5);

    setBuilderTokens(rawWords);
    setTimeout(() => speakEnglish(`What's ${targetPronoun}?`), 220);
  };

  const startBuilderRound = () => {
    setBuilderScore(0);
    setStreak(0);
    generateBuilderQuestion(1);
  };

  const pickBuilderToken = (token) => {
    if (builderSolved) return;
    playTone('click');
    if (token.text !== '?' && token.text !== '.') {
      speakEnglish(token.text);
    }
    if (builderSelectedQ.length < 3) {
      setBuilderSelectedQ((prev) => [...prev, token.id]);
    } else if (builderSelectedA.length < 4) {
      setBuilderSelectedA((prev) => [...prev, token.id]);
    }
  };

  const removeBuilderToken = (slotType, tokenId) => {
    if (builderSolved) return;
    playTone('click');
    if (slotType === 'q') {
      setBuilderSelectedQ((prev) => prev.filter((id) => id !== tokenId));
    } else {
      setBuilderSelectedA((prev) => prev.filter((id) => id !== tokenId));
    }
  };

  const checkBuilderAnswer = () => {
    if (builderSolved) return;
    if (builderSelectedQ.length < 3 || builderSelectedA.length < 4) {
      playTone('wrong');
      setBuilderFeedback({
        text: '⚠️ 請把問句（3格）與答句（4格）都排滿喔！',
        style: 'text-amber-600',
      });
      return;
    }

    const qWords = builderSelectedQ.map((id) => builderTokens.find((t) => t.id === id)?.text);
    const aWords = builderSelectedA.map((id) => builderTokens.find((t) => t.id === id)?.text);
    const expectedPronoun = builderTarget.distance === 'near' ? 'this' : 'that';

    const isQCorrect = qWords[0] === "What's" && qWords[1] === expectedPronoun && qWords[2] === '?';
    const isACorrect =
      aWords[0] === "It's" &&
      aWords[1] === builderTarget.toy.article &&
      aWords[2] === builderTarget.toy.word &&
      aWords[3] === '.';

    if (isQCorrect && isACorrect) {
      setBuilderSolved(true);
      const nextScore = builderScore + 1;
      setBuilderScore(nextScore);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setStars((s) => s + 2);
      playTone('correct');
      spawnConfetti();

      const fullSentence = `What's ${expectedPronoun}? It's ${builderTarget.toy.article} ${builderTarget.toy.word}.`;
      setBuilderFeedback({
        text: '🌟 完全正確！太棒了！(+2 ⭐)',
        style: 'text-emerald-600 animate-bounce-in',
      });
      speakEnglish(`Awesome! ${fullSentence}`);

      timerRef.current = setTimeout(() => {
        if (builderQuestionIndex >= 10) {
          playTone('fanfare');
          spawnConfetti();
          speakEnglish('Congratulations! You did a great job!');
          setRoundModal({ open: true, score: nextScore });
        } else {
          generateBuilderQuestion(builderQuestionIndex + 1);
        }
      }, 2800);
    } else {
      setStreak(0);
      playTone('wrong');
      let hint = "再檢查順序：What's this/that ? / It's a [玩具] .";
      if (qWords[1] !== expectedPronoun && (qWords[1] === 'this' || qWords[1] === 'that')) {
        hint =
          builderTarget.distance === 'near'
            ? '玩具在「近處」，問句要用 this 喔！'
            : '玩具在「遠處」，問句要用 that 喔！';
      }
      setBuilderFeedback({
        text: `❌ ${hint}`,
        style: 'text-rose-600',
      });
    }
  };

  // =========================================================================
  // 模式四：Drag & Drop 拖曳挑戰邏輯
  // =========================================================================
  const generateDragQuestion = (nextIdx) => {
    setDragQuestionIndex(nextIdx);
    setDragSolved(false);
    setSelectedDragToy(null);
    setDraggingToy(null);
    setHoverZone(null);
    setDragFeedback({
      text: '🖐️ 把正確玩具拖曳到「手的前方 (this)」或「手的遠方 (that)」！',
      style: 'bg-slate-50 text-slate-600 border-slate-200',
    });

    const distance = Math.random() < 0.5 ? 'near' : 'far';
    const toy = TOYS[Math.floor(Math.random() * TOYS.length)];
    setDragTarget({ distance, toy });

    const pronoun = distance === 'near' ? 'this' : 'that';
    setTimeout(() => {
      speakEnglish(`What's ${pronoun}? It's ${toy.article} ${toy.word}.`);
    }, 240);
  };

  const startDragRound = () => {
    setDragScore(0);
    setStreak(0);
    generateDragQuestion(1);
  };

  const evaluateDragDrop = (toyObj, zone) => {
    if (dragSolved || !toyObj || !zone) return;

    const isToyRight = toyObj.id === dragTarget.toy.id;
    const isZoneRight = zone === dragTarget.distance;

    if (isToyRight && isZoneRight) {
      setDragSolved(true);
      setSelectedDragToy(null);
      const nextScore = dragScore + 1;
      setDragScore(nextScore);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      setStars((s) => s + 1);
      playTone('correct');
      spawnConfetti();

      const pronoun = dragTarget.distance === 'near' ? 'this' : 'that';
      const placeZh = dragTarget.distance === 'near' ? '手的前方（近處）' : '手的遠方（遠處）';
      setDragFeedback({
        text: `🎉 太棒了！What's ${pronoun}? 放在${placeZh}完全正確！(+1 ⭐)`,
        style: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-bounce-in',
      });
      speakEnglish(`Great job! What's ${pronoun}? It's ${toyObj.article} ${toyObj.word}.`);

      timerRef.current = setTimeout(() => {
        if (dragQuestionIndex >= 10) {
          playTone('fanfare');
          spawnConfetti();
          speakEnglish('Congratulations! You did a great job!');
          setRoundModal({ open: true, score: nextScore });
        } else {
          generateDragQuestion(dragQuestionIndex + 1);
        }
      }, 2600);
    } else {
      setStreak(0);
      playTone('wrong');
      if (isToyRight && !isZoneRight) {
        const hint =
          dragTarget.distance === 'near'
            ? '💡 玩具選對了！但題目是 "this"，要拖曳到「手的前方（近處）」喔！'
            : '💡 玩具選對了！但題目是 "that"，要拖曳到「手的遠方（遠處）」喔！';
        setDragFeedback({
          text: hint,
          style: 'bg-amber-100 text-amber-800 border-amber-300',
        });
      } else if (!isToyRight && isZoneRight) {
        setDragFeedback({
          text: `💡 位置對了！但這不是 ${toyObj.word}，再聽聽看是哪一個玩具喔！`,
          style: 'bg-rose-100 text-rose-800 border-rose-300',
        });
      } else {
        setDragFeedback({
          text: '💡 再聽一次題目，注意是 this（前方）還是 that（遠方）以及玩具名稱喔！',
          style: 'bg-rose-100 text-rose-800 border-rose-300',
        });
      }
    }
  };

  useEffect(() => {
    if (!draggingToy) return;

    const checkHover = (x, y) => {
      const pad = 24;
      const nearRect = nearZoneRef.current?.getBoundingClientRect();
      const farRect = farZoneRef.current?.getBoundingClientRect();

      if (
        nearRect &&
        x >= nearRect.left - pad &&
        x <= nearRect.right + pad &&
        y >= nearRect.top - pad &&
        y <= nearRect.bottom + pad
      ) {
        return 'near';
      }
      if (
        farRect &&
        x >= farRect.left - pad &&
        x <= farRect.right + pad &&
        y >= farRect.top - pad &&
        y <= farRect.bottom + pad
      ) {
        return 'far';
      }
      return null;
    };

    const handlePointerMove = (e) => {
      e.preventDefault();
      setDragPos({ x: e.clientX, y: e.clientY });
      setHoverZone(checkHover(e.clientX, e.clientY));
    };

    const handlePointerUp = (e) => {
      const droppedZone = checkHover(e.clientX, e.clientY);
      const toyToEval = draggingToy;
      setDraggingToy(null);
      setHoverZone(null);
      if (droppedZone) {
        evaluateDragDrop(toyToEval, droppedZone);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  });

  const handleToyPointerDown = (e, toy) => {
    if (dragSolved) return;
    e.preventDefault();
    playTone('click');
    setSelectedDragToy(toy);
    setDraggingToy(toy);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleSwitchMode = (newMode) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraggingToy(null);
    setHoverZone(null);
    playTone('click');
    setMode(newMode);
    if (newMode === 'explore') {
      const qWord = exploreDistance === 'near' ? "What's this?" : "What's that?";
      speakEnglish(`${qWord} It's ${exploreToy.article} ${exploreToy.word}.`);
    } else if (newMode === 'quiz') {
      startQuizRound();
    } else if (newMode === 'builder') {
      startBuilderRound();
    } else if (newMode === 'drag') {
      startDragRound();
    }
  };

  const activeStage =
    mode === 'explore'
      ? { distance: exploreDistance, toy: exploreToy }
      : mode === 'quiz'
      ? quizTarget
      : mode === 'builder'
      ? builderTarget
      : dragTarget;

  const stagePointDirection =
    mode === 'drag' && !dragSolved ? hoverZone || 'near' : activeStage.distance;

  const exploreOtherFarToy = TOYS[(TOYS.findIndex((t) => t.id === exploreToy.id) + 2) % TOYS.length];
  const exploreOtherNearToy = TOYS[(TOYS.findIndex((t) => t.id === exploreToy.id) + 1) % TOYS.length];
  const usedBuilderIds = new Set([...builderSelectedQ, ...builderSelectedA]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 h-[calc(100dvh-5rem)] min-h-[580px] flex flex-col select-none text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Noto+Sans+TC:wght@500;700;900&family=Nunito:wght@600;700;800;900&display=swap');
        .te-root { font-family: 'Nunito', 'Noto Sans TC', sans-serif; }
        .font-kids { font-family: 'Fredoka', 'Noto Sans TC', sans-serif; }
        .playroom-bg {
          background: linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 48%, #FEF3C7 48.5%, #FDE68A 74%, #D97706 74.5%, #B45309 100%);
          position: relative;
          overflow: hidden;
        }
        .wood-floor {
          background-image: repeating-linear-gradient(0deg, rgba(120, 53, 15, 0.12) 0px, rgba(120, 53, 15, 0.12) 2px, transparent 2px, transparent 24px);
        }
        @keyframes pulse-near {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
        }
        .near-ring { animation: pulse-near 2.2s infinite ease-in-out; }
        @keyframes pulse-far {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.55); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        }
        .far-ring { animation: pulse-far 2.2s infinite ease-in-out; }
        @keyframes point-near {
          0%, 100% { transform: translate(0, 0) rotate(-10deg); }
          50% { transform: translate(7px, -4px) rotate(-4deg); }
        }
        .animate-point-near { animation: point-near 1.4s infinite ease-in-out; }
        @keyframes point-far {
          0%, 100% { transform: translate(0, 0) rotate(-28deg); }
          50% { transform: translate(10px, -9px) rotate(-22deg); }
        }
        .animate-point-far { animation: point-far 1.4s infinite ease-in-out; }
        @keyframes dash-flow { to { stroke-dashoffset: -36; } }
        .animated-dash { stroke-dasharray: 10 8; animation: dash-flow 1.2s linear infinite; }
        @keyframes bounce-in {
          0% { transform: scale(0.75); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.35s ease-in-out; }
        .btn-3d {
          transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.15s ease;
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.16);
        }
        .btn-3d:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
        }
        @keyframes float-cloud {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(12px); }
        }
        .cloud-float { animation: float-cloud 6s ease-in-out infinite; }
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(180px) rotate(540deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          pointer-events: none;
          animation: confetti-fall 1.1s ease-out forwards;
        }
      `}</style>

      {/* 拖曳跟隨幽靈卡片 */}
      {draggingToy && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${dragPos.x}px`, top: `${dragPos.y}px` }}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/95 border-4 border-teal-400 shadow-2xl p-2 flex flex-col items-center justify-center scale-110 rotate-3">
            <div className="w-14 h-14">{draggingToy.svg}</div>
            {dragShowText && (
              <span className="font-kids font-bold text-xs text-slate-800 leading-none">{draggingToy.word}</span>
            )}
          </div>
        </div>
      )}

      <div className="te-root flex-1 min-h-0 flex flex-col bg-amber-50 rounded-3xl border-4 border-amber-200/80 shadow-xl overflow-hidden">
        {/* 頂部精簡導覽列 */}
        <header className="h-12 sm:h-14 shrink-0 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 px-2.5 sm:px-5 flex items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0l-1.414 1.414M6.05 17.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <div className="truncate">
              <h1 className="font-kids text-sm sm:text-base md:text-lg font-bold text-slate-800 leading-none truncate">
                Toy Explorer <span className="text-orange-500 hidden xl:inline">: What&apos;s this? &amp; What&apos;s that?</span>
              </h1>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 shrink-0 gap-0.5">
            <button
              onClick={() => handleSwitchMode('explore')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs md:text-sm transition-all ${
                mode === 'explore' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. 探索 <span className="hidden lg:inline text-[11px] opacity-90">Explore</span>
            </button>
            <button
              onClick={() => handleSwitchMode('quiz')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs md:text-sm transition-all ${
                mode === 'quiz' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. 配對 <span className="hidden lg:inline text-[11px] opacity-90">Quiz</span>
            </button>
            <button
              onClick={() => handleSwitchMode('builder')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs md:text-sm transition-all ${
                mode === 'builder' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. 組句 <span className="hidden lg:inline text-[11px] opacity-90">Builder</span>
            </button>
            <button
              onClick={() => handleSwitchMode('drag')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold text-[11px] sm:text-xs md:text-sm transition-all ${
                mode === 'drag' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. 拖曳 <span className="hidden lg:inline text-[11px] opacity-90">Drag</span>
            </button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl">
              <span className="text-sm sm:text-base">⭐</span>
              <span className="font-kids font-bold text-amber-800 text-sm sm:text-base">{stars}</span>
            </div>

            <button
              onClick={toggleSpeed}
              title="切換朗讀語速"
              className="px-2 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1 transition"
            >
              <span>{speechRate < 0.8 ? '🐢' : '🐇'}</span>
              <span className="hidden sm:inline">{speechRate < 0.8 ? '0.5x' : '1.0x'}</span>
            </button>

            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playTone('click');
              }}
              title="開啟或關閉聲音"
              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition"
            >
              {soundEnabled ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* 主遊戲工作區 */}
        <main className="flex-1 min-h-0 w-full p-2 sm:p-3.5 grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3.5 overflow-hidden">
          {/* 左欄：互動空間視覺舞台 */}
          <section
            onClick={speakCurrentSentence}
            className="md:col-span-6 h-full min-h-0 rounded-2xl sm:rounded-3xl border-4 border-white shadow-lg playroom-bg flex flex-col justify-between cursor-pointer"
          >
            {/* 窗戶與藍天白雲 */}
            <div className="absolute top-3 right-4 sm:top-4 sm:right-6 w-36 sm:w-48 lg:w-56 h-24 sm:h-32 lg:h-36 bg-sky-200 rounded-2xl border-4 sm:border-6 border-white shadow-inner overflow-hidden pointer-events-none">
              <div className="absolute top-2 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-300 shadow-xs" />
              <div className="cloud-float absolute top-3 left-2.5 w-11 h-4 bg-white rounded-full opacity-90" />
              <div className="cloud-float absolute top-7 left-6 w-14 h-4 bg-white rounded-full opacity-80" style={{ animationDelay: '1.5s' }} />
              <div className="absolute -bottom-3 -left-3 w-28 h-10 bg-emerald-400 rounded-full" />
              <div className="absolute -bottom-4 right-0 w-32 h-12 bg-emerald-500 rounded-full" />
              <div className="absolute inset-y-0 left-1/2 w-1.5 bg-white -translate-x-1/2" />
              <div className="absolute inset-x-0 top-1/2 h-1.5 bg-white -translate-y-1/2" />
            </div>

            {/* 遠方壁架 */}
            <div className="absolute top-[104px] sm:top-[132px] lg:top-[148px] right-3 sm:right-5 w-40 sm:w-52 lg:w-60 h-3 bg-amber-700 rounded-full shadow-md border-b-2 border-amber-900 pointer-events-none" />
            <div className="absolute top-[116px] sm:top-[144px] lg:top-[160px] right-8 sm:right-10 w-2.5 h-4 bg-amber-800 rounded-b pointer-events-none" />
            <div className="absolute top-[116px] sm:top-[144px] lg:top-[160px] right-36 sm:right-48 lg:right-56 w-2.5 h-4 bg-amber-800 rounded-b pointer-events-none" />

            {/* 牆面裝飾小旗幟 */}
            <svg className="absolute top-0 left-3 w-36 sm:w-48 h-10 pointer-events-none" viewBox="0 0 240 50">
              <path d="M0,5 Q120,35 240,5" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
              <polygon points="25,13 45,17 33,34" fill="#F43F5E" />
              <polygon points="65,20 85,22 74,40" fill="#FBBF24" />
              <polygon points="108,23 128,23 118,42" fill="#34D399" />
              <polygon points="150,21 170,19 161,38" fill="#38BDF8" />
              <polygon points="190,15 210,11 202,30" fill="#A78BFA" />
            </svg>

            {/* 木地板與前景地毯 */}
            <div className="absolute inset-x-0 bottom-0 h-[26%] wood-floor pointer-events-none" />
            <div className="absolute bottom-2 left-3 sm:bottom-3 sm:left-6 w-52 sm:w-64 lg:w-72 h-16 sm:h-20 bg-rose-200/90 border-3 border-dashed border-rose-400 rounded-[50%] transform -rotate-2 shadow-inner pointer-events-none" />

            {/* 左上角距離圖例 */}
            <div className="relative z-10 m-2.5 sm:m-3.5 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-sky-200 shadow-xs w-fit pointer-events-none">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Near (手的前方) ➔ <b>this</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-amber-700 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Far (手的遠方) ➔ <b>that</b></span>
              </div>
            </div>

            {/* SVG 動態虛線箭頭（指向遠方 That 時顯示） */}
            {(stagePointDirection === 'far' || (mode === 'drag' && !dragSolved)) && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 450" preserveAspectRatio="none">
                <defs>
                  <marker id="arrowhead-far" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#F59E0B" />
                  </marker>
                </defs>
                <path
                  d="M 190 320 Q 320 200 455 110"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity={mode === 'drag' && !dragSolved && hoverZone !== 'far' ? 0.35 : 1}
                  className="animated-dash"
                  markerEnd="url(#arrowhead-far)"
                />
              </svg>
            )}

            {/* 遠距離玩具展示 / 拖曳放置區 (手的遠方 Far • That) */}
            <div
              ref={farZoneRef}
              onClick={(e) => {
                e.stopPropagation();
                if (mode === 'explore') {
                  playTone('click');
                  setExploreDistance('far');
                  speakEnglish(`What's that? It's ${exploreToy.article} ${exploreToy.word}.`);
                } else if (mode === 'drag' && !dragSolved && selectedDragToy) {
                  evaluateDragDrop(selectedDragToy, 'far');
                } else {
                  speakCurrentSentence();
                }
              }}
              className={`absolute top-[22px] sm:top-[34px] lg:top-[42px] right-10 sm:right-14 lg:right-20 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 z-20 group ${
                mode === 'drag' && hoverZone === 'far' ? 'scale-115' : ''
              }`}
            >
              {mode === 'drag' && !dragSolved ? (
                <>
                  <div
                    className={`absolute inset-0 rounded-full border-3 border-dashed transition-all ${
                      hoverZone === 'far'
                        ? 'bg-amber-300/70 border-amber-600 shadow-lg'
                        : 'bg-amber-200/45 border-amber-500 far-ring'
                    }`}
                  />
                  <span className="-top-3 absolute bg-amber-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow tracking-wider whitespace-nowrap">
                    👉 手的遠方 (that)
                  </span>
                  <span className="text-center text-[11px] sm:text-xs font-black text-amber-900 px-2 leading-tight pointer-events-none">
                    放這裡
                  </span>
                </>
              ) : (
                <>
                  {activeStage.distance === 'far' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-amber-300/35 border-3 border-dashed border-amber-500 far-ring" />
                      <span className="-top-2.5 absolute bg-amber-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow tracking-wider whitespace-nowrap">
                        FAR • THAT
                      </span>
                    </>
                  )}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 transform group-hover:scale-110 transition-transform drop-shadow-md">
                    {activeStage.distance === 'far'
                      ? activeStage.toy.svg
                      : mode === 'explore' && (
                          <div className="opacity-50 hover:opacity-100 transition">{exploreOtherFarToy.svg}</div>
                        )}
                  </div>
                </>
              )}
            </div>

            {/* 近距離玩具展示 / 拖曳放置區 (手的前方 Near • This) */}
            <div
              ref={nearZoneRef}
              onClick={(e) => {
                e.stopPropagation();
                if (mode === 'explore') {
                  playTone('click');
                  setExploreDistance('near');
                  speakEnglish(`What's this? It's ${exploreToy.article} ${exploreToy.word}.`);
                } else if (mode === 'drag' && !dragSolved && selectedDragToy) {
                  evaluateDragDrop(selectedDragToy, 'near');
                } else {
                  speakCurrentSentence();
                }
              }}
              className={`absolute bottom-4 sm:bottom-6 left-16 sm:left-24 lg:left-28 w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-200 z-20 group ${
                mode === 'drag' && hoverZone === 'near' ? 'scale-110' : ''
              }`}
            >
              {mode === 'drag' && !dragSolved ? (
                <>
                  <div
                    className={`absolute inset-0 rounded-full border-4 border-dashed transition-all ${
                      hoverZone === 'near'
                        ? 'bg-emerald-300/70 border-emerald-600 shadow-lg'
                        : 'bg-emerald-200/45 border-emerald-500 near-ring'
                    }`}
                  />
                  <span className="-top-3 absolute bg-emerald-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow tracking-wider whitespace-nowrap">
                    👇 手的前方 (this)
                  </span>
                  <span className="text-center text-xs sm:text-sm font-black text-emerald-900 px-2 leading-tight pointer-events-none">
                    拖曳到此處
                  </span>
                </>
              ) : (
                <>
                  {activeStage.distance === 'near' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-emerald-300/35 border-4 border-emerald-500 near-ring" />
                      <span className="-top-2.5 absolute bg-emerald-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow tracking-wider whitespace-nowrap">
                        NEAR • THIS
                      </span>
                    </>
                  )}
                  <div className="w-26 h-26 sm:w-34 sm:h-34 lg:w-38 lg:h-38 transform group-hover:scale-105 transition-transform drop-shadow-xl">
                    {activeStage.distance === 'near'
                      ? activeStage.toy.svg
                      : mode === 'explore' && (
                          <div className="opacity-50 hover:opacity-100 transition">{exploreOtherNearToy.svg}</div>
                        )}
                  </div>
                </>
              )}
            </div>

            {/* 可愛小熊與動態手指 */}
            <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 z-20 pointer-events-none flex items-end">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                  <circle cx="28" cy="34" r="16" fill="#D97706" />
                  <circle cx="28" cy="34" r="9" fill="#FDE68A" />
                  <circle cx="92" cy="34" r="16" fill="#D97706" />
                  <circle cx="92" cy="34" r="9" fill="#FDE68A" />
                  <circle cx="60" cy="64" r="42" fill="#F59E0B" />
                  <ellipse cx="60" cy="74" rx="22" ry="16" fill="#FEF3C7" />
                  <circle cx="44" cy="56" r="5" fill="#1E293B" />
                  <circle cx="46" cy="54" r="1.8" fill="#FFFFFF" />
                  <circle cx="76" cy="56" r="5" fill="#1E293B" />
                  <circle cx="78" cy="54" r="1.8" fill="#FFFFFF" />
                  <ellipse cx="34" cy="68" rx="6" ry="3.5" fill="#FB7185" opacity="0.7" />
                  <ellipse cx="86" cy="68" rx="6" ry="3.5" fill="#FB7185" opacity="0.7" />
                  <ellipse cx="60" cy="68" rx="6" ry="4.5" fill="#78350F" />
                  <path d="M51 77 Q60 85 69 77" fill="none" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
                </svg>

                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 transition-all duration-300 ${
                    stagePointDirection === 'near'
                      ? 'absolute -right-6 top-6 sm:-right-8 sm:top-7 animate-point-near'
                      : 'absolute -right-5 -top-2 sm:-right-6 sm:-top-3 animate-point-far'
                  }`}
                >
                  <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-lg">
                    <path
                      d="M12 42 C12 32, 24 28, 34 30 L58 30 C64 30, 68 34, 68 39 C68 44, 64 48, 58 48 L44 48 C47 51, 47 56, 42 58 C44 62, 41 67, 35 67 L22 67 C15 67, 12 58, 12 42 Z"
                      fill="#FFFFFF"
                      stroke="#1E293B"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <path d="M35 48 L45 48 M33 57 L42 57" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 彩紙粒子特效 */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              {confettiList.map((p) => (
                <div
                  key={p.id}
                  className="confetti-piece"
                  style={{
                    left: p.left,
                    top: p.top,
                    backgroundColor: p.color,
                    animationDelay: p.delay,
                  }}
                />
              ))}
            </div>

            {/* 右下角語音重播按鈕 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakCurrentSentence();
              }}
              className="btn-3d self-end m-2.5 sm:m-3.5 z-20 bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 border-2 border-sky-300 shadow-md text-xs sm:text-sm"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <path strokeLinecap="round" d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              <span>聽發音</span>
            </button>
          </section>

          {/* 右欄：四模式互動控制區 */}
          <div className="md:col-span-6 h-full min-h-0 flex flex-col">
            {/* 模式一：探索學習 */}
            {mode === 'explore' && (
              <section className="h-full min-h-0 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-sky-200 shadow-md flex flex-col justify-between gap-2.5">
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playTone('click');
                      setExploreDistance('near');
                      speakEnglish(`What's this? It's ${exploreToy.article} ${exploreToy.word}.`);
                    }}
                    className={`btn-3d py-2 px-3 rounded-xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 border-2 ${
                      exploreDistance === 'near'
                        ? 'bg-emerald-500 text-white border-emerald-400'
                        : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <span>👇 近處 Near (this)</span>
                  </button>
                  <button
                    onClick={() => {
                      playTone('click');
                      setExploreDistance('far');
                      speakEnglish(`What's that? It's ${exploreToy.article} ${exploreToy.word}.`);
                    }}
                    className={`btn-3d py-2 px-3 rounded-xl font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 border-2 ${
                      exploreDistance === 'far'
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    <span>👉 遠處 Far (that)</span>
                  </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="text-[11px] sm:text-xs font-extrabold text-slate-400 mb-1 shrink-0">
                    🧸 點擊玩具學習單字與句型：
                  </div>
                  <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-2">
                    {TOYS.map((toy) => {
                      const isSelected = toy.id === exploreToy.id;
                      return (
                        <button
                          key={toy.id}
                          onClick={() => {
                            playTone('click');
                            setExploreToy(toy);
                            const pronoun = exploreDistance === 'near' ? 'this' : 'that';
                            speakEnglish(`What's ${pronoun}? It's ${toy.article} ${toy.word}.`);
                          }}
                          className={`btn-3d h-full min-h-0 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border-2 flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'ring-3 ring-sky-400 bg-sky-50 border-sky-400'
                              : 'bg-slate-50 border-slate-200 hover:bg-sky-50'
                          }`}
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0">{toy.svg}</div>
                          <span className="font-kids font-bold text-xs sm:text-sm md:text-base text-slate-800 leading-tight mt-0.5">
                            {toy.word}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-none">{toy.zh}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="shrink-0 bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 rounded-2xl p-2.5 sm:p-3.5 border-2 border-sky-200 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] sm:text-xs font-black shrink-0">
                        問 Q
                      </span>
                      <span className="font-kids text-lg sm:text-2xl font-bold text-slate-800 truncate">
                        What&apos;s{' '}
                        <span
                          className={`${
                            exploreDistance === 'near' ? 'text-emerald-600' : 'text-amber-600'
                          } underline decoration-wavy`}
                        >
                          {exploreDistance === 'near' ? 'this' : 'that'}
                        </span>
                        ?
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        playTone('click');
                        speakEnglish(exploreDistance === 'near' ? "What's this?" : "What's that?");
                      }}
                      className="btn-3d shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1"
                    >
                      <span>🔊 問句</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white text-[10px] sm:text-xs font-black shrink-0">
                        答 A
                      </span>
                      <span className="font-kids text-lg sm:text-2xl font-bold text-sky-600 truncate">
                        It&apos;s {exploreToy.article} <span className="text-rose-500">{exploreToy.word}</span>.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        playTone('click');
                        speakEnglish(`It's ${exploreToy.article} ${exploreToy.word}.`);
                      }}
                      className="btn-3d shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-bold text-xs flex items-center gap-1"
                    >
                      <span>🔊 答句</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-sky-200/70 pt-1 mt-0.5">
                    <p className="text-xs font-bold text-slate-600 truncate">
                      {exploreDistance === 'near' ? '這是什麼？（近處）' : '那是什麼？（遠處）'} — 它是一個{exploreToy.zh}。
                    </p>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        exploreDistance === 'near' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exploreDistance === 'near' ? 'NEAR • THIS' : 'FAR • THAT'}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* 模式二：句型配對挑戰 */}
            {mode === 'quiz' && (
              <section className="h-full min-h-0 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-amber-200 shadow-md flex flex-col justify-between gap-2.5">
                <div className="shrink-0">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-600 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span>
                        題目進度：<span className="text-amber-600">{quizQuestionIndex}</span> / 10
                      </span>
                      <div className="hidden sm:flex items-center gap-1 ml-1">
                        {Array.from({ length: 10 }, (_, i) => {
                          const done = i < quizQuestionIndex - 1;
                          const curr = i === quizQuestionIndex - 1;
                          return (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                done ? 'bg-emerald-500' : curr ? 'bg-amber-500 scale-125' : 'bg-slate-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      🔥 連勝：{streak}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                      style={{ width: `${quizQuestionIndex * 10}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 text-center bg-amber-50/80 rounded-xl py-2 px-3 border-2 border-amber-200">
                  <p className="text-xs sm:text-sm md:text-base font-extrabold text-slate-700">
                    看一看小熊指著
                    <span
                      className={`font-black mx-1 ${
                        quizTarget.distance === 'near' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {quizTarget.distance === 'near' ? '近處手邊 (Near)' : '遠處架上 (Far)'}
                    </span>
                    的什麼玩具？選出正確對話！
                  </p>
                </div>

                <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-2 sm:gap-2.5">
                  {quizOptions.map((opt, idx) => {
                    const isWrong = quizWrongIndices.includes(idx);
                    const isRight = quizCorrectIndex === idx;
                    return (
                      <button
                        key={idx}
                        disabled={isWrong}
                        onClick={() => handleQuizChoice(opt, idx)}
                        className={`btn-3d h-full min-h-0 text-left px-3 py-2 rounded-xl sm:rounded-2xl border-2 flex items-center gap-2.5 transition-all ${
                          isRight
                            ? 'bg-emerald-100 border-emerald-500 ring-3 ring-emerald-300'
                            : isWrong
                            ? 'bg-rose-100 border-rose-400 animate-shake opacity-65'
                            : 'bg-slate-50 hover:bg-sky-50 border-slate-200'
                        }`}
                      >
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-200 text-amber-900 font-kids font-bold text-sm flex items-center justify-center shrink-0">
                          {['A', 'B', 'C', 'D'][idx]}
                        </span>
                        <div className="font-kids text-sm sm:text-base md:text-lg font-bold text-slate-800 leading-tight">
                          <div>
                            What&apos;s <span className="text-indigo-600">{opt.pronoun}</span>?
                          </div>
                          <div className="text-slate-600">
                            It&apos;s {opt.article} <span className="text-rose-600">{opt.toyWord}</span>.
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  className={`shrink-0 min-h-[40px] rounded-xl px-3 py-2 flex items-center justify-center text-center font-bold text-xs sm:text-sm border ${quizFeedback.style}`}
                >
                  {quizFeedback.text}
                </div>
              </section>
            )}

            {/* 模式三：組句大師 */}
            {mode === 'builder' && (
              <section className="h-full min-h-0 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-purple-200 shadow-md flex flex-col justify-between gap-2">
                <div className="shrink-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-kids text-sm sm:text-base md:text-lg font-bold text-purple-800 truncate">
                      🧩 點擊單字積木，拼出問句與答句！
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-extrabold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                      第 {builderQuestionIndex}/10 題
                    </span>
                    <button
                      onClick={() => {
                        if (builderSolved) return;
                        playTone('click');
                        setBuilderSelectedQ([]);
                        setBuilderSelectedA([]);
                        setBuilderFeedback({ text: '已清空，請重新排列積木！', style: 'text-slate-500' });
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                    >
                      ↺ 清空
                    </button>
                  </div>
                </div>

                <div className="shrink-0 bg-purple-50/70 rounded-2xl p-2.5 sm:p-3 border-2 border-dashed border-purple-300 space-y-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-h-[38px] sm:min-h-[42px]">
                    <span className="text-[11px] sm:text-xs font-black bg-purple-600 text-white px-2 py-1 rounded-lg shrink-0">
                      問 Q:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {[0, 1, 2].map((i) => {
                        const tokenId = builderSelectedQ[i];
                        const token = builderTokens.find((t) => t.id === tokenId);
                        return token ? (
                          <button
                            key={token.id}
                            onClick={() => removeBuilderToken('q', token.id)}
                            className="btn-3d px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-purple-600 text-white font-kids font-bold text-sm sm:text-base shadow-xs"
                          >
                            {token.text}
                          </button>
                        ) : (
                          <div
                            key={i}
                            className="w-12 sm:w-16 h-8 sm:h-9 rounded-lg border-2 border-dashed border-purple-300 bg-white/70"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-purple-200" />

                  <div className="flex items-center gap-1.5 sm:gap-2 min-h-[38px] sm:min-h-[42px]">
                    <span className="text-[11px] sm:text-xs font-black bg-sky-600 text-white px-2 py-1 rounded-lg shrink-0">
                      答 A:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {[0, 1, 2, 3].map((i) => {
                        const tokenId = builderSelectedA[i];
                        const token = builderTokens.find((t) => t.id === tokenId);
                        return token ? (
                          <button
                            key={token.id}
                            onClick={() => removeBuilderToken('a', token.id)}
                            className="btn-3d px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-sky-600 text-white font-kids font-bold text-sm sm:text-base shadow-xs"
                          >
                            {token.text}
                          </button>
                        ) : (
                          <div
                            key={i}
                            className="w-12 sm:w-16 h-8 sm:h-9 rounded-lg border-2 border-dashed border-sky-300 bg-white/70"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="text-[11px] font-extrabold text-slate-400 mb-1 shrink-0">
                    點擊單字卡放入空格（點擊已放入的卡片可退回）：
                  </div>
                  <div className="flex-1 min-h-0 flex flex-wrap content-center items-center justify-center gap-1.5 sm:gap-2 p-2 bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden">
                    {builderTokens.map((token) => {
                      const isUsed = usedBuilderIds.has(token.id);
                      return (
                        <button
                          key={token.id}
                          disabled={isUsed}
                          onClick={() => pickBuilderToken(token)}
                          className={`btn-3d px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-kids font-bold text-sm sm:text-base md:text-lg border-2 transition-all ${
                            isUsed
                              ? 'bg-slate-200 border-slate-200 text-slate-400 opacity-35 cursor-not-allowed shadow-none'
                              : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-800 cursor-pointer'
                          }`}
                        >
                          {token.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-between gap-2">
                  <div className={`flex-1 text-left font-bold text-xs sm:text-sm truncate ${builderFeedback.style}`}>
                    {builderFeedback.text}
                  </div>
                  <button
                    onClick={checkBuilderAnswer}
                    className="btn-3d shrink-0 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs sm:text-sm md:text-base shadow-sm"
                  >
                    ✨ 檢查句子
                  </button>
                </div>
              </section>
            )}

            {/* 模式四：拖曳挑戰 (this -> 手的前方, that -> 手的遠方) */}
            {mode === 'drag' && (
              <section className="h-full min-h-0 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-teal-200 shadow-md flex flex-col justify-between gap-2">
                <div className="shrink-0">
                  <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-600 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span>
                        拖曳進度：<span className="text-teal-600">{dragQuestionIndex}</span> / 10
                      </span>
                      <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 text-xs">
                        🔥 連勝：{streak}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        playTone('click');
                        setDragShowText((v) => !v);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                    >
                      {dragShowText ? '👁️ 顯示文字' : '🙈 純聽力中'}
                    </button>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-300"
                      style={{ width: `${dragQuestionIndex * 10}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-2xl p-2.5 border-2 border-teal-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-teal-700">
                      🎯 任務：把玩具拖曳到左側舞台的正確位置！
                    </div>
                    {dragShowText ? (
                      <div className="font-kids text-base sm:text-xl font-bold text-slate-800 truncate">
                        What&apos;s{' '}
                        <span
                          className={`${
                            dragTarget.distance === 'near' ? 'text-emerald-600' : 'text-amber-600'
                          } underline decoration-wavy`}
                        >
                          {dragTarget.distance === 'near' ? 'this' : 'that'}
                        </span>
                        ? It&apos;s {dragTarget.toy.article}{' '}
                        <span className="text-rose-600">{dragTarget.toy.word}</span>.
                      </div>
                    ) : (
                      <div className="font-kids text-base sm:text-lg font-bold text-slate-500 italic">
                        🔊 請點擊右側喇叭聽題目...
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      playTone('click');
                      const pronoun = dragTarget.distance === 'near' ? 'this' : 'that';
                      speakEnglish(`What's ${pronoun}? It's ${dragTarget.toy.article} ${dragTarget.toy.word}.`);
                    }}
                    className="btn-3d shrink-0 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1"
                  >
                    <span>🔊 聽題目</span>
                  </button>
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="text-[11px] font-extrabold text-slate-400 mb-1 shrink-0">
                    🧸 按住玩具拖曳到左邊「手的前方 (this)」或「手的遠方 (that)」：
                  </div>
                  <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-2">
                    {TOYS.map((toy) => {
                      const isBeingDragged = draggingToy?.id === toy.id;
                      const isSelected = selectedDragToy?.id === toy.id;
                      return (
                        <div
                          key={toy.id}
                          onPointerDown={(e) => handleToyPointerDown(e, toy)}
                          style={{ touchAction: 'none' }}
                          className={`btn-3d h-full min-h-0 rounded-xl sm:rounded-2xl p-1.5 border-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
                            isBeingDragged
                              ? 'opacity-35 scale-95 border-teal-400 bg-teal-50'
                              : isSelected
                              ? 'ring-3 ring-teal-400 bg-teal-50 border-teal-400'
                              : 'bg-slate-50 hover:bg-teal-50/70 border-slate-200'
                          }`}
                        >
                          <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 pointer-events-none">
                            {toy.svg}
                          </div>
                          {dragShowText && (
                            <span className="font-kids font-bold text-xs sm:text-sm md:text-base text-slate-800 leading-tight mt-0.5 pointer-events-none">
                              {toy.word}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`shrink-0 min-h-[40px] rounded-xl px-3 py-1.5 flex items-center justify-center text-center font-bold text-xs sm:text-sm border ${dragFeedback.style}`}
                >
                  {dragFeedback.text}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* 回合結算彈窗 */}
      {roundModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border-4 border-amber-300 shadow-2xl animate-bounce-in">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="font-kids text-2xl font-bold text-slate-800 mb-1">太棒了！挑戰完成！</h3>
            <p className="text-slate-600 font-bold text-sm sm:text-base mb-4">
              你完成了 10 題挑戰，共答對 {roundModal.score} 題！
            </p>
            <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 mb-5 flex justify-around">
              <div>
                <div className="text-xs font-bold text-slate-500">本輪獲得星星</div>
                <div className="font-kids text-xl font-bold text-amber-600">
                  +{roundModal.score * (mode === 'builder' ? 2 : 1)} ⭐
                </div>
              </div>
              <div className="border-l-2 border-amber-200" />
              <div>
                <div className="text-xs font-bold text-slate-500">最高連勝</div>
                <div className="font-kids text-xl font-bold text-orange-600">{maxStreak} 🔥</div>
              </div>
            </div>
            <button
              onClick={() => {
                playTone('click');
                setRoundModal({ open: false, score: 0 });
                if (mode === 'quiz') startQuizRound();
                if (mode === 'builder') startBuilderRound();
                if (mode === 'drag') startDragRound();
              }}
              className="btn-3d w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base"
            >
              再玩一輪！ 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}