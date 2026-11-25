import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const VOCAB_WORDS = [
    {
        id: 'ball',
        word: 'ball',
        zh: '球',
        emoji: '⚽',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <circle cx="60" cy="60" r="48" fill="#FF6B6B" stroke="#1E293B" stroke-width="4"/>
                <path d="M22 35 Q60 60 22 85" fill="none" stroke="#FFE66D" stroke-width="8" stroke-linecap="round"/>
                <path d="M98 35 Q60 60 98 85" fill="none" stroke="#FFE66D" stroke-width="8" stroke-linecap="round"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#1E293B" stroke-width="4"/>
                <ellipse cx="42" cy="30" rx="10" ry="5" transform="rotate(-25 42 30)" fill="#FFFFFF" opacity="0.6"/>
              </svg>`
    },
    {
        id: 'doll',
        word: 'doll',
        zh: '洋娃娃',
        emoji: '🪆',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <circle cx="30" cy="42" r="14" fill="#92400E" stroke="#1E293B" stroke-width="3.5"/>
                <circle cx="90" cy="42" r="14" fill="#92400E" stroke="#1E293B" stroke-width="3.5"/>
                <path d="M42 68 L78 68 L92 108 L28 108 Z" fill="#F472B6" stroke="#1E293B" stroke-width="4" stroke-linejoin="round"/>
                <path d="M48 68 L72 68 L76 85 L44 85 Z" fill="#FBCFE8"/>
                <circle cx="60" cy="46" r="24" fill="#FDE68A" stroke="#1E293B" stroke-width="4"/>
                <path d="M36 44 Q60 26 84 44 Q76 22 60 22 Q44 22 36 44 Z" fill="#92400E" stroke="#1E293B" stroke-width="3"/>
                <circle cx="51" cy="48" r="3" fill="#1E293B"/>
                <circle cx="69" cy="48" r="3" fill="#1E293B"/>
                <circle cx="45" cy="54" r="3.5" fill="#FB7185" opacity="0.7"/>
                <circle cx="75" cy="54" r="3.5" fill="#FB7185" opacity="0.7"/>
                <path d="M54 56 Q60 62 66 56" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: 'car',
        word: 'car',
        zh: '汽車',
        emoji: '🚗',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <path d="M32 58 L44 34 L78 34 L90 58 Z" fill="#38BDF8" stroke="#1E293B" stroke-width="4" stroke-linejoin="round"/>
                <rect x="14" y="56" width="92" height="28" rx="12" fill="#EF4444" stroke="#1E293B" stroke-width="4"/>
                <circle cx="100" cy="68" r="5" fill="#FDE047" stroke="#1E293B" stroke-width="2.5"/>
                <circle cx="36" cy="86" r="14" fill="#334155" stroke="#1E293B" stroke-width="4"/>
                <circle cx="36" cy="86" r="6" fill="#CBD5E1"/>
                <circle cx="84" cy="86" r="14" fill="#334155" stroke="#1E293B" stroke-width="4"/>
                <circle cx="84" cy="86" r="6" fill="#CBD5E1"/>
              </svg>`
    },
    {
        id: 'kite',
        word: 'kite',
        zh: '風箏',
        emoji: '🪁',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <path d="M60 82 Q75 95 55 104 Q42 110 65 114" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
                <polygon points="55,104 49,99 49,109" fill="#EF4444"/>
                <polygon points="55,104 61,99 61,109" fill="#EF4444"/>
                <polygon points="60,12 94,46 60,82 26,46" fill="#FACC15" stroke="#1E293B" stroke-width="4" stroke-linejoin="round"/>
                <polygon points="60,12 94,46 60,46" fill="#34D399"/>
                <polygon points="60,82 26,46 60,46" fill="#60A5FA"/>
                <polygon points="60,12 94,46 60,82 26,46" fill="none" stroke="#1E293B" stroke-width="4" stroke-linejoin="round"/>
                <line x1="60" y1="12" x2="60" y2="82" stroke="#1E293B" stroke-width="3"/>
                <line x1="26" y1="46" x2="94" y2="46" stroke="#1E293B" stroke-width="3"/>
              </svg>`
    },
    {
        id: 'robot',
        word: 'robot',
        zh: '機器人',
        emoji: '🤖',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <line x1="60" y1="14" x2="60" y2="28" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
                <circle cx="60" cy="12" r="6" fill="#EF4444" stroke="#1E293B" stroke-width="3"/>
                <rect x="18" y="42" width="10" height="20" rx="4" fill="#F59E0B" stroke="#1E293B" stroke-width="3.5"/>
                <rect x="92" y="42" width="10" height="20" rx="4" fill="#F59E0B" stroke="#1E293B" stroke-width="3.5"/>
                <rect x="28" y="28" width="64" height="48" rx="12" fill="#94A3B8" stroke="#1E293B" stroke-width="4"/>
                <circle cx="46" cy="48" r="8" fill="#FEF08A" stroke="#1E293B" stroke-width="3"/>
                <circle cx="74" cy="48" r="8" fill="#FEF08A" stroke="#1E293B" stroke-width="3"/>
                <circle cx="46" cy="48" r="3" fill="#1E293B"/>
                <circle cx="74" cy="48" r="3" fill="#1E293B"/>
                <rect x="44" y="62" width="32" height="7" rx="3" fill="#38BDF8" stroke="#1E293B" stroke-width="2.5"/>
                <rect x="36" y="80" width="48" height="26" rx="8" fill="#64748B" stroke="#1E293B" stroke-width="4"/>
                <circle cx="52" cy="93" r="4" fill="#4ADE80"/>
                <circle cx="68" cy="93" r="4" fill="#F43F5E"/>
              </svg>`
    },
    {
        id: 'yo-yo',
        word: 'yo-yo',
        zh: '溜溜球',
        emoji: '🪀',
        svg: `<svg viewBox="0 0 120 120" class="w-full h-full drop-shadow-sm">
                <path d="M55 62 C35 35, 78 22, 88 14" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
                <circle cx="91" cy="12" r="5" fill="none" stroke="#1E293B" stroke-width="3.5"/>
                <circle cx="64" cy="70" r="32" fill="#059669" stroke="#1E293B" stroke-width="4"/>
                <circle cx="54" cy="74" r="32" fill="#34D399" stroke="#1E293B" stroke-width="4"/>
                <circle cx="54" cy="74" r="18" fill="#FEF08A" stroke="#1E293B" stroke-width="3"/>
                <circle cx="54" cy="74" r="6" fill="#F43F5E" stroke="#1E293B" stroke-width="2.5"/>
              </svg>`
    }
];

const KEYBOARD_ROWS = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export default function ToyVocabularyGame() {
    const [mode, setMode] = useState('listening'); // 'listening' | 'spelling' | 'typing'
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [roundCorrectCount, setRoundCorrectCount] = useState(0);
    const [hadMistake, setHadMistake] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // UI states
    const [showStudy, setShowStudy] = useState(false);
    const [hideText, setHideText] = useState(false);
    const [feedback, setFeedback] = useState({
        text: '🎧 點擊喇叭聽發音，選出或拼出正確的玩具單字！',
        type: 'bg-slate-50 text-slate-500 border-slate-200'
    });
    const [showSummary, setShowSummary] = useState(false);

    // Listening choices & Spelling slots
    const [listeningChoices, setListeningChoices] = useState([]);
    const [spellingSlots, setSpellingSlots] = useState([]);
    const [spellingTiles, setSpellingTiles] = useState([]);

    // Typing mode states
    const [typedLetters, setTypedLetters] = useState(''); // stores letters only (excluding hyphens)
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const typingInputRef = useRef(null);

    const audioCtxRef = useRef(null);
    const wordAudioRef = useRef(null);

    // Audio helpers
    const playTone = (type) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioCtxRef.current && AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
            const ctx = audioCtxRef.current;
            if (ctx && ctx.state === 'suspended') ctx.resume();
            if (!ctx) return;

            const now = ctx.currentTime;
            if (type === 'correct') {
                [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.2, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.35);
                });
            } else if (type === 'wrong') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.linearRampToValueAtTime(165, now + 0.25);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.28);
            } else if (type === 'pop') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(480, now);
                osc.frequency.exponentialRampToValueAtTime(720, now + 0.07);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'win') {
                [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.11);
                    gain.gain.setValueAtTime(0.22, now + idx * 0.11);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.4);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.11);
                    osc.stop(now + idx * 0.11 + 0.4);
                });
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const speakWord = (text, rate = 0.48) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (wordAudioRef.current) {
            wordAudioRef.current.pause();
            wordAudioRef.current.currentTime = 0;
        }

        if (text === 'robot') {
            try {
                const audio = new Audio('178-robot.mp3');
                audio.playbackRate = rate < 0.4 ? 0.75 : 1.0;
                wordAudioRef.current = audio;
                audio.play().catch(() => playTone('pop'));
            } catch (e) {
                playTone('pop');
            }
            return;
        }

        if ('speechSynthesis' in window) {
            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = rate;
                utterance.pitch = 1.08;
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                playTone('pop');
            }
        } else {
            playTone('pop');
        }
    };

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // Initialize round
    const startRound = (targetMode = mode) => {
        const shuffled = shuffle(VOCAB_WORDS);
        setQueue(shuffled);
        setCurrentIndex(0);
        setRoundScore(0);
        setRoundCorrectCount(0);
        setShowSummary(false);
        setIsLocked(false);
        setupQuestion(shuffled, 0, targetMode);
    };

    const setupQuestion = (qList, idx, currentMode) => {
        const target = qList[idx];
        setHadMistake(false);
        setIsLocked(false);
        setTypedLetters('');

        const modePrompts = {
            listening: '🎧 點擊喇叭聽發音，選出正確的玩具卡片！',
            spelling: '🔤 看圖聽發音，依序點擊字母拼出單字！',
            typing: '⌨️ 看圖聽發音，用鍵盤拼打出正確的英文單字！'
        };

        setFeedback({
            text: modePrompts[currentMode],
            type: 'bg-slate-50 text-slate-500 border-slate-200'
        });

        if (currentMode === 'listening') {
            setListeningChoices(shuffle(VOCAB_WORDS));
        } else if (currentMode === 'spelling') {
            const chars = target.word.split('');
            setSpellingSlots(
                chars.map((ch) => ({
                    expected: ch,
                    char: ch === '-' ? '-' : '',
                    isHyphen: ch === '-',
                    tileIndex: null,
                    locked: ch === '-'
                }))
            );
            setSpellingTiles(
                shuffle(chars.filter((ch) => ch !== '-')).map((ch, i) => ({
                    id: i,
                    char: ch,
                    used: false
                }))
            );
        } else if (currentMode === 'typing') {
            setTimeout(() => typingInputRef.current?.focus(), 100);
        }

        setTimeout(() => speakWord(target.word, 0.48), 250);
    };

    useEffect(() => {
        startRound('listening');
    }, []);

    const handleSwitchMode = (newMode) => {
        setMode(newMode);
        startRound(newMode);
    };

    // Shared success handler
    const handleQuestionSuccess = (target, customMsg) => {
        setIsLocked(true);
        playTone('correct');
        speakWord(target.word, 0.5);

        const earned = hadMistake ? 5 : 10;
        setScore((s) => s + earned);
        setRoundScore((rs) => rs + earned);
        if (!hadMistake) setRoundCorrectCount((rc) => rc + 1);
        setStreak((st) => st + 1);

        setFeedback({
            text: `${customMsg} <strong>${target.word}</strong> (${target.zh}) +${earned} 分`,
            type: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        });
        confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });

        setTimeout(() => proceedNext(), 1400);
    };

    // Mode 1: Listening match handler
    const handleListeningClick = (item) => {
        if (isLocked || queue.length === 0) return;
        const target = queue[currentIndex];

        if (item.id === target.id) {
            handleQuestionSuccess(target, '🎉 答對了！這就是');
        } else {
            playTone('wrong');
            setHadMistake(true);
            setStreak(0);
            setFeedback({
                text: `❌ 那是 <strong>${item.word}</strong> (${item.zh})，再聽一次找找看！`,
                type: 'bg-rose-100 text-rose-800 border-rose-300'
            });
        }
    };

    // Mode 2: Spelling handlers
    const selectTile = (tileIdx) => {
        if (isLocked) return;
        const tile = spellingTiles[tileIdx];
        if (!tile || tile.used) return;

        const emptyIdx = spellingSlots.findIndex((s) => !s.isHyphen && s.char === '');
        if (emptyIdx === -1) return;

        playTone('pop');
        const newTiles = [...spellingTiles];
        newTiles[tileIdx].used = true;
        setSpellingTiles(newTiles);

        const newSlots = [...spellingSlots];
        newSlots[emptyIdx] = { ...newSlots[emptyIdx], char: tile.char, tileIndex: tileIdx };
        setSpellingSlots(newSlots);

        checkSpelling(newSlots);
    };

    const removeSlotLetter = (slotIdx) => {
        if (isLocked) return;
        const slot = spellingSlots[slotIdx];
        if (!slot || slot.isHyphen || slot.locked || !slot.char) return;

        playTone('pop');
        if (slot.tileIndex !== null) {
            const newTiles = [...spellingTiles];
            if (newTiles[slot.tileIndex]) newTiles[slot.tileIndex].used = false;
            setSpellingTiles(newTiles);
        }

        const newSlots = [...spellingSlots];
        newSlots[slotIdx] = { ...newSlots[slotIdx], char: '', tileIndex: null };
        setSpellingSlots(newSlots);
    };

    const checkSpelling = (currentSlots) => {
        if (!currentSlots.every((s) => s.char !== '')) return;
        const target = queue[currentIndex];
        const attempt = currentSlots.map((s) => s.char).join('');

        if (attempt === target.word) {
            handleQuestionSuccess(target, '🌟 拼字完全正確！');
        } else {
            playTone('wrong');
            setHadMistake(true);
            setStreak(0);
            setFeedback({
                text: `🤔 拼法不太對喔！點擊字母可以退回重試！`,
                type: 'bg-rose-100 text-rose-800 border-rose-300'
            });
        }
    };

    // Mode 3: Typing handlers
    const cleanExpectedLetters = (word) => word.replace(/[^a-zA-Z]/g, '').toLowerCase();

    const updateTypedInput = (rawValue) => {
        if (isLocked || queue.length === 0) return;
        const target = queue[currentIndex];
        const expectedClean = cleanExpectedLetters(target.word);
        const sanitized = rawValue.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, expectedClean.length);

        if (sanitized.length > typedLetters.length) {
            playTone('pop');
        }
        setTypedLetters(sanitized);

        // Auto-verify once all letter slots are filled
        if (sanitized.length === expectedClean.length) {
            if (sanitized === expectedClean) {
                handleQuestionSuccess(target, '⌨️ 拼打完全正確！');
            } else {
                playTone('wrong');
                setHadMistake(true);
                setStreak(0);
                setFeedback({
                    text: `🤔 拼法有點小錯誤喔！按退格鍵 (Backspace) 修改再試一次！`,
                    type: 'bg-rose-100 text-rose-800 border-rose-300'
                });
            }
        }
    };

    const handleTypingKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isLocked) return;
            const target = queue[currentIndex];
            const expectedClean = cleanExpectedLetters(target.word);
            if (typedLetters === expectedClean) {
                handleQuestionSuccess(target, '⌨️ 拼打完全正確！');
            } else {
                playTone('wrong');
                setHadMistake(true);
                setStreak(0);
                setFeedback({
                    text:
                        typedLetters.length < expectedClean.length
                            ? `✍️ 還沒拼完喔！這個單字共有 ${expectedClean.length} 個字母！`
                            : `🤔 拼法不太對喔！再聽一次發音檢查字母！`,
                    type: 'bg-rose-100 text-rose-800 border-rose-300'
                });
            }
        }
    };

    const handleTypingHint = () => {
        if (isLocked || queue.length === 0) return;
        const target = queue[currentIndex];
        const expectedClean = cleanExpectedLetters(target.word);

        // Find the first index where typedLetters differs or is empty
        let matchLen = 0;
        while (matchLen < typedLetters.length && typedLetters[matchLen] === expectedClean[matchLen]) {
            matchLen++;
        }

        if (matchLen < expectedClean.length) {
            setHadMistake(true);
            const nextStr = expectedClean.slice(0, matchLen + 1);
            updateTypedInput(nextStr);
            typingInputRef.current?.focus();
        }
    };

    const proceedNext = () => {
        const nextIdx = currentIndex + 1;
        if (nextIdx >= queue.length) {
            setShowSummary(true);
            playTone('win');
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } else {
            setCurrentIndex(nextIdx);
            setupQuestion(queue, nextIdx, mode);
        }
    };

    if (queue.length === 0) return null;
    const currentWord = queue[currentIndex];

    // Helper to map typedLetters onto visual slots (preserving '-')
    const renderTypingSlots = () => {
        let letterPointer = 0;
        return currentWord.word.split('').map((ch, idx) => {
            if (ch === '-') {
                return (
                    <span key={idx} className="text-2xl font-black text-slate-400 px-0.5">
                        -
                    </span>
                );
            }
            const userChar = typedLetters[letterPointer] || '';
            const isCurrentCursor = letterPointer === typedLetters.length && !isLocked;
            letterPointer++;

            return (
                <div
                    key={idx}
                    onClick={() => typingInputRef.current?.focus()}
                    className={`w-11 h-14 sm:w-12 sm:h-14 rounded-2xl border-2 text-2xl font-black flex items-center justify-center shadow-sm transition cursor-text select-none
                        ${
                            userChar
                                ? isLocked
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                    : 'bg-teal-50 border-teal-500 text-teal-900'
                                : isCurrentCursor
                                ? 'bg-white border-teal-400 ring-4 ring-teal-100 text-slate-300'
                                : 'bg-slate-100 border-dashed border-slate-300 text-transparent'
                        }`}
                >
                    {userChar || (isCurrentCursor ? '|' : '_')}
                </div>
            );
        });
    };

    return (
        <section className="w-full max-w-4xl mx-auto my-4 bg-gradient-to-br from-yellow-50 via-sky-50 to-pink-50 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-white flex flex-col gap-3 relative font-sans">
            {/* Top Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-md border-2 border-white flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-lg text-white shadow">
                        🧸
                    </div>
                    <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-800 leading-tight">玩具英文單字大挑戰</h2>
                        <p className="text-[10px] font-bold text-slate-400">Toy Vocabulary Game</p>
                    </div>
                </div>

                {/* Mode Switcher Tabs (3 Modes) */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => handleSwitchMode('listening')}
                        className={`px-2.5 py-1.5 rounded-lg font-black text-xs transition ${
                            mode === 'listening' ? 'bg-sky-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        🎧 聽力
                    </button>
                    <button
                        onClick={() => handleSwitchMode('spelling')}
                        className={`px-2.5 py-1.5 rounded-lg font-black text-xs transition ${
                            mode === 'spelling' ? 'bg-purple-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        🔤 拼字
                    </button>
                    <button
                        onClick={() => handleSwitchMode('typing')}
                        className={`px-2.5 py-1.5 rounded-lg font-black text-xs transition ${
                            mode === 'typing' ? 'bg-teal-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        ⌨️ 拼打
                    </button>
                </div>

                {/* Status Score & Streak */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setShowStudy(!showStudy)}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 px-2.5 py-1 rounded-xl font-black text-xs"
                    >
                        📖 單字卡
                    </button>
                    <div className="bg-amber-100 border border-amber-300 px-2 py-1 rounded-xl flex items-center gap-1 text-xs font-black text-amber-900">
                        <span>⭐</span> {score}
                    </div>
                    <div className="bg-rose-100 border border-rose-300 px-2 py-1 rounded-xl flex items-center gap-1 text-xs font-black text-rose-900">
                        <span>🔥</span> {streak}
                    </div>
                </div>
            </div>

            {/* Vocabulary Card Popover */}
            {showStudy && (
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-3 shadow-xl border-2 border-indigo-200 z-30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-indigo-700">🔊 點擊卡片聆聽發音（拼打前可先複習喔！）</span>
                        <button onClick={() => setShowStudy(false)} className="text-xs font-black text-slate-400 hover:text-slate-700">
                            ✕ 關閉
                        </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {VOCAB_WORDS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => speakWord(item.word, 0.48)}
                                className="bg-white hover:bg-indigo-50 border-2 border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center transition"
                            >
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-xs font-black text-slate-800">{item.word}</span>
                                <span className="text-[10px] text-slate-400">{item.zh}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Game Card */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-white flex flex-col gap-3.5 relative">
                {/* Progress & Feedback */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                            <div
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-0.5 rounded-full">
                            第 {currentIndex + 1} / {queue.length} 題
                        </span>
                    </div>

                    <div
                        className={`w-full py-2 px-3 rounded-xl text-center font-black text-xs sm:text-sm border transition-all ${feedback.type}`}
                        dangerouslySetInnerHTML={{ __html: feedback.text }}
                    ></div>
                </div>

                {/* Mode 1: Listening View */}
                {mode === 'listening' && (
                    <div className="flex flex-col gap-3.5">
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                            <button
                                onClick={() => speakWord(currentWord.word, 0.5)}
                                className="bg-sky-500 hover:bg-sky-600 text-white border-b-4 border-sky-700 px-5 py-2 rounded-2xl font-black text-sm flex items-center gap-2 shadow transition active:translate-y-1"
                            >
                                <span className="text-lg">🔊</span> 播放發音 (Listen)
                            </button>
                            <button
                                onClick={() => speakWord(currentWord.word, 0.32)}
                                className="bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 px-3.5 py-2 rounded-2xl font-extrabold text-xs sm:text-sm shadow transition active:translate-y-1"
                            >
                                🐢 慢速
                            </button>
                            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-2xl border">
                                <input
                                    type="checkbox"
                                    checked={hideText}
                                    onChange={(e) => setHideText(e.target.checked)}
                                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                                />
                                <span className="text-xs font-extrabold text-slate-700">🙈 純聽力模式</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {listeningChoices.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleListeningClick(item)}
                                    className="bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-300 rounded-3xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                                >
                                    <div className="w-16 h-16 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: item.svg }} />
                                    {!hideText ? (
                                        <div className="text-center">
                                            <div className="text-base font-black text-slate-800">{item.word}</div>
                                            <div className="text-xs font-bold text-slate-400">{item.zh}</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">❓ 聽音辨字</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mode 2: Spelling (Tile Selection) View */}
                {mode === 'spelling' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-5 bg-purple-50 px-6 py-3 rounded-3xl border-2 border-purple-100 w-full max-w-md justify-center">
                            <div
                                className="w-20 h-20 bg-white rounded-2xl shadow-sm border-2 border-purple-200 flex items-center justify-center p-2"
                                dangerouslySetInnerHTML={{ __html: currentWord.svg }}
                            />
                            <div className="flex flex-col items-start gap-1.5">
                                <div className="text-xl font-black text-slate-800">
                                    {currentWord.emoji} {currentWord.zh}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => speakWord(currentWord.word, 0.5)}
                                        className="bg-purple-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                                    >
                                        🔊 發音
                                    </button>
                                    <button
                                        onClick={() => speakWord(currentWord.word, 0.32)}
                                        className="bg-amber-400 text-amber-950 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                                    >
                                        🐢 慢速
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Letter Slots */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {spellingSlots.map((slot, idx) =>
                                slot.isHyphen ? (
                                    <span key={idx} className="text-2xl font-black text-slate-400">
                                        -
                                    </span>
                                ) : (
                                    <button
                                        key={idx}
                                        onClick={() => removeSlotLetter(idx)}
                                        disabled={!slot.char}
                                        className={`w-12 h-14 rounded-2xl border-2 text-2xl font-black flex items-center justify-center shadow-sm transition ${
                                            slot.char
                                                ? 'bg-purple-100 border-purple-500 text-purple-900 cursor-pointer'
                                                : 'bg-slate-100 border-dashed border-slate-300 text-transparent'
                                        }`}
                                    >
                                        {slot.char || '_'}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Letter Tiles */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
                            {spellingTiles.map((tile, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectTile(idx)}
                                    disabled={tile.used}
                                    className={`w-12 h-14 rounded-2xl bg-amber-300 border-b-4 border-amber-600 text-slate-900 text-2xl font-black flex items-center justify-center shadow transition active:translate-y-1 ${
                                        tile.used ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-400'
                                    }`}
                                >
                                    {tile.char}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setupQuestion(queue, currentIndex, 'spelling')}
                            className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-slate-300"
                        >
                            🔄 清除重拼
                        </button>
                    </div>
                )}

                {/* Mode 3: Typing (Active Recall Spelling) View */}
                {mode === 'typing' && (
                    <div className="flex flex-col items-center gap-3.5">
                        {/* Visual + Audio Prompt Card */}
                        <div className="flex items-center gap-5 bg-teal-50 px-6 py-3 rounded-3xl border-2 border-teal-100 w-full max-w-md justify-center">
                            <div
                                className="w-20 h-20 bg-white rounded-2xl shadow-sm border-2 border-teal-200 flex items-center justify-center p-2"
                                dangerouslySetInnerHTML={{ __html: currentWord.svg }}
                            />
                            <div className="flex flex-col items-start gap-1.5">
                                <div className="text-xl font-black text-slate-800">
                                    {currentWord.emoji} {currentWord.zh}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            speakWord(currentWord.word, 0.5);
                                            typingInputRef.current?.focus();
                                        }}
                                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                                    >
                                        🔊 發音
                                    </button>
                                    <button
                                        onClick={() => {
                                            speakWord(currentWord.word, 0.32);
                                            typingInputRef.current?.focus();
                                        }}
                                        className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                                    >
                                        🐢 慢速
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Accessible Input linked to Visual Letter Boxes */}
                        <div className="relative flex flex-col items-center gap-2">
                            <input
                                ref={typingInputRef}
                                type="text"
                                value={typedLetters}
                                onChange={(e) => updateTypedInput(e.target.value)}
                                onKeyDown={handleTypingKeyDown}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                aria-label="請輸入英文單字"
                                className="opacity-0 absolute inset-0 w-full h-full cursor-text"
                            />
                            <div className="flex flex-wrap items-center justify-center gap-2 z-10">{renderTypingSlots()}</div>
                            <span className="text-[11px] font-bold text-slate-400">
                                直接用鍵盤輸入英文字母（共 {cleanExpectedLetters(currentWord.word).length} 個字母）
                            </span>
                        </div>

                        {/* Helper Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={handleTypingHint}
                                disabled={isLocked}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl font-black text-xs transition"
                            >
                                💡 提示一字
                            </button>
                            <button
                                onClick={() => {
                                    setTypedLetters('');
                                    typingInputRef.current?.focus();
                                }}
                                disabled={isLocked}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3.5 py-1.5 rounded-xl font-bold text-xs transition"
                            >
                                🔄 清除重打
                            </button>
                            <button
                                onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border transition ${
                                    showVirtualKeyboard
                                        ? 'bg-teal-600 text-white border-teal-700'
                                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                                }`}
                            >
                                ⌨️ {showVirtualKeyboard ? '隱藏螢幕鍵盤' : '螢幕鍵盤'}
                            </button>
                        </div>

                        {/* Optional On-Screen Keyboard for Tablets/Touchscreens */}
                        {showVirtualKeyboard && (
                            <div className="w-full max-w-lg bg-slate-100 p-2 rounded-2xl border border-slate-200 flex flex-col gap-1.5 select-none">
                                {KEYBOARD_ROWS.map((row, rIdx) => (
                                    <div key={rIdx} className="flex justify-center gap-1">
                                        {row.map((keyChar) => (
                                            <button
                                                key={keyChar}
                                                type="button"
                                                onClick={() => updateTypedInput(typedLetters + keyChar)}
                                                className="w-8 h-9 sm:w-10 sm:h-10 bg-white hover:bg-teal-50 active:bg-teal-200 rounded-lg border-b-2 border-slate-300 font-black text-sm sm:text-base text-slate-800 shadow-sm"
                                            >
                                                {keyChar}
                                            </button>
                                        ))}
                                        {rIdx === 2 && (
                                            <button
                                                type="button"
                                                onClick={() => setTypedLetters((prev) => prev.slice(0, -1))}
                                                className="px-2.5 h-9 sm:h-10 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg border-b-2 border-rose-300 font-black text-xs shadow-sm"
                                            >
                                                ⌫ 退格
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Summary Modal */}
            {showSummary && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-3 rounded-3xl">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-amber-200 flex flex-col items-center text-center animate-pop">
                        <div className="text-5xl mb-2">🏆</div>
                        <h3 className="text-2xl font-black text-slate-800">太棒了！完成本輪挑戰！</h3>
                        <p className="text-sm text-slate-500 font-bold mb-4">你已經完成全部 6 個玩具單字練習！</p>

                        <div className="grid grid-cols-2 gap-3 w-full mb-5">
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
                                <div className="text-xs font-bold text-amber-700">本輪得分</div>
                                <div className="text-2xl font-black text-amber-600">+{roundScore}</div>
                            </div>
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3">
                                <div className="text-xs font-bold text-emerald-700">一次答對</div>
                                <div className="text-2xl font-black text-emerald-600">{roundCorrectCount} / 6</div>
                            </div>
                        </div>

                        <div className="flex w-full gap-2">
                            <button
                                onClick={() => startRound(mode)}
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-black text-sm shadow transition"
                            >
                                🔁 再玩一次
                            </button>
                            <button
                                onClick={() => {
                                    const nextMode =
                                        mode === 'listening' ? 'spelling' : mode === 'spelling' ? 'typing' : 'listening';
                                    handleSwitchMode(nextMode);
                                }}
                                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-2xl font-black text-sm shadow transition"
                            >
                                🚀 下一種模式
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}