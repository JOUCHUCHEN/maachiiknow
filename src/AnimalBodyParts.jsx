import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Volume2, Download, FileText, FileAudio, Layout } from 'lucide-react';

const vocabData = {
    parts: [
        { s: 'head', p: 'heads', emoji: '🦁', single: true },
        { s: 'ear', p: 'ears', emoji: '🐘', single: false },
        { s: 'leg', p: 'legs', emoji: '🐾', single: false },
        { s: 'claw', p: 'claws', emoji: '🦅', single: false },
        { s: 'tail', p: 'tails', emoji: '🐎', single: true },
        { s: 'tusk', p: 'tusks', emoji: '𓄏', single: false },
        { s: 'nose', p: 'noses', emoji: '🐽', single: true },
        { s: 'wing', p: 'wings', emoji: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1fabd.svg', single: false },
        { s: 'horn', p: 'horns', emoji: '🦏', single: false },
        { s: 'neck', p: 'necks', emoji: '🦒', single: true },
        { s: 'tongue', p: 'tongues', emoji: '🐍', single: true },
        { s: 'fin', p: 'fins', emoji: '🐟', single: false }
    ],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    colors: [
        { word: 'red', hex: '#ef4444', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-red.mp3' },
        { word: 'blue', hex: '#3b82f6', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-blue.mp3' },
        { word: 'green', hex: '#22c55e', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-green.mp3' },
        { word: 'yellow', hex: '#eab308', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-yellow.mp3' },
        { word: 'orange', hex: '#f97316', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-orange.mp3' },
        { word: 'purple', hex: '#a855f7', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-purple.mp3' },
        { word: 'pink', hex: '#ec4899', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-pink.mp3' },
        { word: 'black', hex: '#1e293b', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-blcak.mp3' },
        { word: 'white', hex: '#e2e8f0', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-white.mp3' },
        { word: 'brown', hex: '#78350f', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/color/1309-brown.mp3' },
        { word: 'gray', hex: '#9ca3af' },
        { word: 'golden', hex: '#fbbf24' },
        { word: 'colorful', hex: 'linear-gradient(45deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)' }
    ],
    adjectives: [
        { word: 'large', icon: '🐘' },
        { word: 'small', icon: '🐭' },
        { word: 'long', icon: '📏' },
        { word: 'short', icon: '📐' },
        { word: 'sharp', icon: '🗡️' },
        { word: 'curly', icon: '➰', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/C/1309-curly.mp3' },
        { word: 'pointed', icon: '🔺' },
        { word: 'round', icon: '🔴' },
        { word: 'furry', icon: '🐻' }
    ]
};

const baseAnimals = [
    { word: 'dog', emoji: '🐕', parts: [
        { id: 'ear', sentence: 'Dogs have cute ears.', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/sentence/1309-dogs_have_cute_ears.mp3' }, 
        { id: 'tail', sentence: 'Dogs have wagging tails.' }, 
        { id: 'nose', sentence: 'Dogs have wet noses.' } 
    ]},
    { word: 'horse', emoji: '🐎', parts: [
        { id: 'neck', sentence: 'Horses have strong necks.' }, 
        { id: 'tail', sentence: 'Horses have beautiful long tails.', audioUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/sentence/1309-Horses_have_beautiful_long_tails.mp3' },
        { id: 'head', sentence: 'Horses have majestic heads.' }
    ]},
    { word: 'elephant', emoji: '🐘', parts: [
        { id: 'ear', sentence: 'Elephants have large ears like fans.' }, 
        { id: 'tusk', sentence: 'Elephants have long white tusks.' }, 
        { id: 'nose', sentence: 'Elephants have long noses called trunks.' }  
    ]},
    { word: 'lion', emoji: '🦁', parts: [ 
        { id: 'head', sentence: 'Lions have big heads with manes.' },
        { id: 'tail', sentence: 'Lions have long tails.' }, 
        { id: 'leg', sentence: 'Lions have powerful legs for running.' }  
    ]},
    { word: 'snake', emoji: '🐍', parts: [
        { id: 'tongue', sentence: 'Snakes have forked tongues.' },
        { id: 'tail', sentence: 'Snakes have pointed tails.' }, 
        { id: 'body', sentence: 'Snakes have long, flexible bodies.' }  
    ]},
    { word: 'human', emoji: '🧑', parts: [
        { id: 'eye', sentence: 'Humans have two bright eyes.' },
        { id: 'nose', sentence: 'Humans have small noses.' },
        { id: 'ear', sentence: 'Humans have two ears to hear with.' }
    ]},
    { word: 'crow', icon: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f426-200d-2b1b.svg', parts: [ 
        { id: 'claw', sentence: 'Crows have sharp claws.' }, 
        { id: 'wing', sentence: 'Crows have black wings.' },
        { id: 'mouth', sentence: 'Crows have hard beaks for mouths.' }
    ]},
    { word: 'eagle', emoji: '🦅', parts: [
        { id: 'claw', sentence: 'Eagles have powerful claws to catch fish.' }, 
        { id: 'wing', sentence: 'Eagles have wide wings to fly high.' },
        { id: 'eye', sentence: 'Eagles have very sharp eyes.' }
    ]},
    { word: 'whale', emoji: '🐋', parts: [
        { id: 'tail', sentence: 'Whales have huge tails for swimming.' }, 
        { id: 'head', sentence: 'Whales have massive heads.' },
        { id: 'fin', sentence: 'Whales have strong fins.' }  
    ]},
    { word: 'seal', icon: 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f9ad.svg', parts: [
        { id: 'body', sentence: 'Seals have smooth, slippery bodies.' },
        { id: 'tail', sentence: 'Seals have short tails.' }, 
        { id: 'head', sentence: 'Seals have round, cute heads.' }
    ]}
];

const apiKey = ""; 
let currentAudio = null;
const audioCache = {};
const fetchPromises = {};

const preloadAudio = async (url) => {
    if (audioCache[url]) return audioCache[url];
    if (fetchPromises[url]) return fetchPromises[url];
    fetchPromises[url] = fetch(url).then(res => res.ok ? res.blob() : Promise.reject())
        .then(blob => {
            const audio = new Audio(URL.createObjectURL(new Blob([blob], { type: 'audio/mpeg' })));
            audio.preload = 'auto'; audioCache[url] = audio; return audio;
        }).catch(() => { const audio = new Audio(url); audioCache[url] = audio; return audio; });
    return fetchPromises[url];
};

const playExternalAudio = async (url, fallbackText = null) => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    try {
        let audio = audioCache[url] || await preloadAudio(url);
        currentAudio = audio; currentAudio.currentTime = 0; await currentAudio.play();
    } catch (e) { if (fallbackText) speakWithBackoff(fallbackText); }
};

const playAudioFromPCM = (base64Data, sampleRate) => {
    return new Promise((resolve, reject) => {
        try {
            if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
            const binaryString = atob(base64Data); const len = binaryString.length;
            const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
            const wavHeader = new ArrayBuffer(44); const view = new DataView(wavHeader);
            view.setUint32(0, 0x52494646, false); view.setUint32(4, 36 + len, true);
            view.setUint32(8, 0x57415645, false); view.setUint32(12, 0x666d7420, false); 
            view.setUint16(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); 
            view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true); view.setUint16(34, 16, true);
            view.setUint32(36, 0x64617461, false); view.setUint32(40, len, true);
            currentAudio = new Audio(URL.createObjectURL(new Blob([wavHeader, bytes], { type: 'audio/wav' })));
            currentAudio.playbackRate = 0.75; currentAudio.onended = resolve; currentAudio.onerror = reject;
            currentAudio.play().catch(reject);
        } catch (e) { reject(e); }
    });
};

const speakWithBackoff = async (text, setIsLoading) => {
    if (!text) return; if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    if (setIsLoading) setIsLoading(true);

    window._currentUtterance = null;
    let fallbackTimeoutId = null;

    const cleanup = () => { 
        if (setIsLoading) setIsLoading(false); 
        window._currentUtterance = null;
        if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
    };
    
    if (!apiKey) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.75;
            window._currentUtterance = utterance;

            utterance.onend = cleanup;
            utterance.onerror = cleanup;
            window.speechSynthesis.speak(utterance);
            
            fallbackTimeoutId = setTimeout(cleanup, 3000);
        } else {
            cleanup();
        }
        return;
    }

    const delays = [1000, 2000, 4000];
    let success = false;

    for (let i = 0; i <= delays.length; i++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: text }] }], generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } } })
            });
            if (response.ok) {
                const result = await response.json(); const pcmData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (pcmData) {
                    const sampleRate = parseInt(result.candidates[0].content.parts[0].inlineData.mimeType.split('rate=')[1]) || 24000;
                    await playAudioFromPCM(pcmData, sampleRate);
                    success = true;
                    break;
                }
            }
        } catch (e) {}
        if (i < delays.length) await new Promise(r => setTimeout(r, delays[i]));
    }

    if (!success && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text); 
        utterance.lang = 'en-US'; 
        utterance.rate = 0.75;
        window._currentUtterance = utterance; 
        utterance.onend = cleanup; 
                utterance.onerror = cleanup;
        window.speechSynthesis.speak(utterance);
        fallbackTimeoutId = setTimeout(cleanup, 3000);
    } else { cleanup(); }
};

const PhonicsWord = ({ word, firstLetterColor = "text-orange-500", restColor = "text-emerald-700", phonicsUrl = null, wordUrl = null, capitalize = false, setIsSpeaking }) => {
    const first = word.charAt(0); const rest = word.slice(1);
    const textSizeClass = "text-[2rem] md:text-[2.5rem] lg:text-[1.65rem] xl:text-[2.15rem]";

    return (
        <div className="flex items-center gap-0.5 justify-center font-sans w-full px-1">
            <div className={`font-black ${textSizeClass} flex items-baseline leading-none tracking-tight shrink min-w-0`}>
                <button onClick={(e) => { e.stopPropagation(); if (phonicsUrl) playExternalAudio(phonicsUrl, first); else speakWithBackoff(first, setIsSpeaking); }} className={`${firstLetterColor} hover:scale-110 transition-transform`}>{capitalize ? first.toUpperCase() : first}</button>
                <span onClick={(e) => { e.stopPropagation(); if (wordUrl) playExternalAudio(wordUrl, word); else speakWithBackoff(word, setIsSpeaking); }} className={`${restColor} cursor-pointer hover:opacity-80`}>{rest}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); if (wordUrl) playExternalAudio(wordUrl, word); else speakWithBackoff(word, setIsSpeaking); }} className="text-slate-400 hover:text-indigo-600 p-1 md:p-1.5 bg-slate-100 rounded-full shrink-0 ml-0.5">
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4" />
            </button>
        </div>
    );
};

export default function AnimalBodyParts({ backToHome }) {
    const [activeTab, setActiveTab] = useState('animals');
    const [toastMsg, setToastMsg] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [grammarSentence, setGrammarSentence] = useState(null);
    const [selectedPartDetail, setSelectedPartDetail] = useState(null);

    const customAudioMap = {
        'dog': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/D/phonic-d.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/D/1309_dog.mp3', firstLetterColor: 'text-pink-600' },
        'horse': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/phonic-h.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/1309_horse.mp3', firstLetterColor: 'text-orange-500' },
        'elephant': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/E/phonic-e.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/E/1309_elephant.mp3', firstLetterColor: 'text-indigo-500' },
        'lion': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/L/phonic-l.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/L/1309_lion.mp3', firstLetterColor: 'text-amber-600' },
        'snake': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/S/phonic-s.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/S/1309_snake.mp3', firstLetterColor: 'text-green-600' },
        'human': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/phonic-h.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/1309_human.mp3', firstLetterColor: 'text-rose-500' },
        'crow': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/C/phonic-c.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/C/1309_crow.mp3', firstLetterColor: 'text-slate-800' },
        'eagle': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/E/phonic-e.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/E/1309_eagle.mp3', firstLetterColor: 'text-yellow-600' },
        'whale': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/W/phonic-wh.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/W/1309_whale.mp3', firstLetterColor: 'text-blue-600' },
        'seal': { phonicUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/S/phonic-s.mp3', wordUrl: 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/S/1309_seal.mp3', firstLetterColor: 'text-cyan-600' }
    };

    const getCustomAudio = (word) => {
        const lowerWord = word.toLowerCase();
        const firstChar = lowerWord.charAt(0);
        
        const specificUrls = {
            'claw': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/C/1309-claw.mp3',
            'neck': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/N/1309-neck.mp3',
            'fin': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/F/1309-fin.mp3',
            'head': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/1309-head.mp3',
            'ear': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/E/1309-ear.mp3',
            'tail': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/T/1309-tail.mp3',
            'tusk': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/T/1309-tusk.mp3',
            'nose': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/N/1309-nose.mp3',
            'tongue': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/T/1309-tongue.mp3',
            'horn': 'https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/H/1309-horn.mp3'
        };

        if (specificUrls[lowerWord]) {
            const phonicName = (firstChar === 'w' && lowerWord.startsWith('w')) ? 'wh' : firstChar;
            return {
                phonicUrl: `https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/${firstChar.toUpperCase()}/phonic-${phonicName}.mp3`,
                wordUrl: specificUrls[lowerWord]
            };
        }

        if (['h', 'e', 'l', 'c', 'w'].includes(firstChar)) {
            const phonicName = (firstChar === 'w' && lowerWord.startsWith('w')) ? 'wh' : firstChar;
            return {
                phonicUrl: `https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/${firstChar.toUpperCase()}/phonic-${phonicName}.mp3`,
                wordUrl: `https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/Sound/${firstChar.toUpperCase()}/vocabulary-${lowerWord}.mp3`
            };
        }
        return null;
    };

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3500); };

    const handlePartClick = (animalWord, partObj) => {
        const partInfo = vocabData.parts.find(v => v.s.toLowerCase() === partObj.id.toLowerCase() || v.p.toLowerCase() === partObj.id.toLowerCase()) || { s: partObj.id, p: partObj.id };
        const partAudio = getCustomAudio(partInfo.s);
        const animalObj = baseAnimals.find(a => a.word === animalWord);
        setSelectedPartDetail({ word: partInfo.s.toLowerCase(), sentence: partObj.sentence, audioObj: partAudio, sentenceAudioUrl: partObj.audioUrl, animalObj });
        if (partAudio) playExternalAudio(partAudio.wordUrl, partInfo.s);
        else speakWithBackoff(partInfo.s, setIsSpeaking);
    };

    const generateGrammar = useCallback(() => {
        const adj = vocabData.adjectives[Math.floor(Math.random() * vocabData.adjectives.length)];
        const color = vocabData.colors[Math.floor(Math.random() * vocabData.colors.length)];
        const partObj = vocabData.parts[Math.floor(Math.random() * vocabData.parts.length)];
        const isVowel = /^[aeiou]/i.test(adj.word);
        const article = isVowel ? 'an' : 'a';

        setGrammarSentence({ 
            adj, 
            color, 
            partWord: partObj.single ? partObj.s : partObj.p, 
            article: partObj.single ? article : '', 
            isSingle: partObj.single
        });
    }, []);
    
    useEffect(() => generateGrammar(), [generateGrammar]);

    const tabs = [
        { id: 'animals', label: 'Animals' },
        { id: 'body_part', label: 'Body Parts' },
        { id: 'grammar', label: 'Grammar' },
        { id: 'materials', label: 'Materials' }
    ];

    const handleDownload = (itemName) => {
        showToast(`Preparing to download ${itemName}...`);
    };

    return (
        <div className="flex flex-col w-full h-full bg-indigo-50 font-sans relative">
            <main className="flex-1 w-full p-4 md:p-6 flex flex-col items-center relative">
                {/* Tab Menu */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 md:gap-2 mb-8 shadow-inner overflow-x-auto w-full max-w-4xl custom-scrollbar flex-nowrap shrink-0">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-2 px-4 md:px-6 rounded-xl font-bold transition-all text-sm md:text-base tracking-wide flex-1 ${activeTab === tab.id ? 'active-tab shadow-md scale-105' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* PART 1: ANIMALS */}
                <section className={`${activeTab === 'animals' ? 'block' : 'hidden'} w-full max-w-[1200px]`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                        {baseAnimals.map(animal => {
                            const custom = customAudioMap[animal.word];
                            return (
                                <div key={animal.word} className="bg-white rounded-[1.5rem] border border-indigo-50 overflow-hidden relative flex flex-col items-center p-4 min-h-[380px] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-full flex flex-col items-center flex-1">
                                        <div className="h-[140px] flex items-center justify-center mb-3 mt-1">
                                            <button onClick={() => custom ? playExternalAudio(custom.wordUrl, animal.word) : speakWithBackoff(animal.word, setIsSpeaking)} className="transition-transform hover:scale-105 active:scale-95 flex items-center justify-center">
                                                {animal.icon ? <img src={animal.icon} className="w-28 h-28 object-contain" /> : <span className="text-[7rem] leading-none drop-shadow-sm">{animal.emoji}</span>}
                                            </button>
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm px-2 py-2 rounded-full border border-slate-100 mb-4 shadow-sm w-full flex justify-center scale-95 origin-top mx-auto overflow-hidden">
                                            <PhonicsWord word={animal.word} firstLetterColor={custom?.firstLetterColor || "text-sky-500"} restColor="text-indigo-800" phonicsUrl={custom?.phonicUrl} wordUrl={custom.wordUrl} setIsSpeaking={setIsSpeaking} />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full mt-auto">
                                            {animal.parts.map(p => {
                                                const partInfo = vocabData.parts.find(v => v.s.toLowerCase() === p.id.toLowerCase() || v.p.toLowerCase() === p.id.toLowerCase()) || { s: p.id, p: p.id };
                                                return (
                                                    <button key={p.id} onClick={() => handlePartClick(animal.word, p)} className="w-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-[1.1rem] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 text-center shadow-sm">
                                                        {partInfo.s.toLowerCase()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* PART 2: BODY PARTS */}
                <section className={`${activeTab === 'body_part' ? 'block' : 'hidden'} w-full max-w-4xl space-y-6`}>
                    <div className="bg-white p-6 rounded-3xl border-t-4 border-indigo-500">
                        <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">🐾 Body Parts</h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {vocabData.parts.map(p => {
                                const customAudio = getCustomAudio(p.s);
                                return (
                                    <div key={p.s} className="vocab-card bg-indigo-50 p-4 rounded-2xl text-center border border-indigo-100 cursor-pointer flex flex-col items-center justify-center animate-all" onClick={() => customAudio ? playExternalAudio(customAudio.wordUrl, p.s) : speakWithBackoff(p.s, setIsSpeaking)}>
                                        {p.emoji && p.emoji.startsWith('http') ? <img src={p.emoji} alt={p.s} className="w-9 h-9 mx-auto mb-1 object-contain opacity-80" /> : <span className="text-3xl mb-1 block">{p.emoji}</span>}
                                        <span className="font-bold text-lg text-indigo-900">{p.s}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl border-t-4 border-emerald-500">
                        <h3 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">🎨 Colors</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {vocabData.colors.map(color => (
                                <div key={color.word} className="vocab-card bg-slate-50 p-4 rounded-2xl text-center border border-slate-200 cursor-pointer flex flex-col items-center justify-center" onClick={() => color.audioUrl ? playExternalAudio(color.audioUrl, color.word) : speakWithBackoff(color.word, setIsSpeaking)}>
                                    <div className="w-8 h-8 rounded-full mb-2 shadow-inner border border-slate-300" style={{ background: color.hex }}></div>
                                    <span className="font-bold text-sm text-slate-700">{color.word}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border-t-4 border-amber-500">
                        <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">📏 Features</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {vocabData.adjectives.map(adj => (
                                <div key={adj.word} className="vocab-card bg-amber-50 p-4 rounded-2xl text-center border border-amber-100 cursor-pointer flex flex-col items-center justify-center" onClick={() => adj.audioUrl ? playExternalAudio(adj.audioUrl, adj.word) : speakWithBackoff(adj.word, setIsSpeaking)}>
                                    {adj.icon && adj.icon.startsWith('http') ? <img src={adj.icon} alt={adj.word} className="w-9 h-9 mx-auto mb-1 object-contain" /> : <span className="text-3xl mb-1 block">{adj.icon}</span>}
                                    <span className="font-bold text-lg text-amber-800">{adj.word}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PART 3: GRAMMAR */}
                <section className={`${activeTab === 'grammar' ? 'block' : 'hidden'} w-full max-w-4xl`}>
                    <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-lg border border-slate-200">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-indigo-700">📚 Sentence Builder</h2>
                            <p className="text-slate-500 font-medium mt-2">Sentence structure: Adjectives come before nouns! Use 'a' or 'an' for singular parts.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 max-w-4xl mx-auto shadow-sm overflow-x-auto">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 text-center">Grammar Formula</h3>
                            <div className="flex items-center justify-center gap-2 md:gap-4 font-bold min-w-max pb-2">
                                <div className="flex flex-col items-center">
                                    <span className="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm md:text-lg">It has</span>
                                    <span className="text-xs text-slate-400 mt-2">Subject + Verb</span>
                                </div>
                                <span className="text-slate-300 font-black">+</span>
                                <div className="flex flex-col items-center">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl shadow-sm border border-slate-200 text-sm md:text-lg">(a/an)</span>
                                    <span className="text-xs text-slate-400 mt-2">Article (Singular)</span>
                                </div>
                                <span className="text-slate-300 font-black">+</span>
                                <div className="flex flex-col items-center">
                                    <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl shadow-sm border border-amber-200 text-sm md:text-lg">Feature</span>
                                    <span className="text-xs text-amber-500 mt-2">Adjective</span>
                                </div>
                                <span className="text-slate-300 font-black">+</span>
                                <div className="flex flex-col items-center">
                                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow-sm border border-emerald-200 text-sm md:text-lg">Color</span>
                                    <span className="text-xs text-emerald-500 mt-2">Adjective</span>
                                </div>
                                <span className="text-slate-300 font-black">+</span>
                                <div className="flex flex-col items-center">
                                    <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-xl shadow-sm border border-pink-200 text-sm md:text-lg">Part</span>
                                    <span className="text-xs text-pink-500 mt-2">Noun</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-8 md:p-12 rounded-[2rem] border-2 border-indigo-100 text-center shadow-inner mb-8 max-w-4xl mx-auto min-h-[220px] flex items-center justify-center">
                            {grammarSentence && (
                                <div className="flex flex-wrap justify-center items-end gap-x-3 md:gap-x-5 gap-y-8 text-3xl md:text-[2.75rem] font-black text-indigo-900 leading-none">
                                    <div className="flex flex-col items-center">
                                        <span>It has</span>
                                        <span className="text-sm text-slate-400 font-medium mt-4">Subject + Verb</span>
                                    </div>
                                    {grammarSentence.article && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-slate-500 border-b-4 border-slate-300 pb-1">{grammarSentence.article}</span>
                                            <span className="text-sm text-slate-400 font-medium mt-3">Article</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center">
                                        <span className="text-amber-500 border-b-4 border-amber-300 pb-1">{grammarSentence.adj.word.toLowerCase()}</span>
                                        <span className="text-sm text-amber-600/70 font-medium mt-3">Adjective</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5 md:gap-2 border-b-4 pb-1" style={{ borderColor: grammarSentence.color.word === 'white' ? '#cbd5e1' : (grammarSentence.color.word === 'colorful' ? 'transparent' : grammarSentence.color.hex) }}>
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm border border-slate-300 shrink-0" style={{background: grammarSentence.color.hex}}></div>
                                            <span style={{ color: grammarSentence.color.word === 'white' ? '#475569' : (grammarSentence.color.word === 'colorful' ? '#ec4899' : grammarSentence.color.hex) }}>
                                                {grammarSentence.color.word.toLowerCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm text-emerald-600/70 font-medium mt-3">Adjective</span>
                                    </div>

                                    <div className="flex flex-col items-center relative">
                                        <span className="text-pink-500 border-b-4 border-pink-300 pb-1">{grammarSentence.partWord.toLowerCase()}</span>
                                        <span className="text-sm text-pink-600/70 font-medium mt-3">Noun</span>
                                    </div>
                                    <span>.</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-4">
                            <button onClick={generateGrammar} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                                🎲 Spin
                            </button>
                            <button onClick={() => {
                                const sentence = `It has ${grammarSentence.article ? grammarSentence.article + ' ' : ''}${grammarSentence.adj.word} ${grammarSentence.color.word} ${grammarSentence.partWord}.`;
                                speakWithBackoff(sentence, setIsSpeaking);
                            }} className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-md hover:bg-emerald-600 hover:-translate-y-1 transition-all">
                                🔊 Listen
                            </button>
                        </div>
                    </div>
                </section>

                {/* PART 4: MATERIALS */}
                <section className={`${activeTab === 'materials' ? 'block' : 'hidden'} w-full max-w-4xl`}>
                    <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-lg border border-slate-200">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-indigo-700">📚 Materials & Resources</h2>
                            <p className="text-slate-500 font-medium mt-2">Download worksheets, flashcards, and more supplementary materials!</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex items-start gap-4 hover:border-indigo-300 transition-colors group">
                                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform"><Layout size={32} /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">Vocabulary Flashcards</h3>
                                    <p className="text-sm text-slate-500 mb-4">Printable flashcards for animals, body parts, and adjectives.</p>
                                    <button onClick={() => handleDownload('Flashcards')} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:text-indigo-800 transition-colors"><Download size={16} /> Download PDF</button>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl flex items-start gap-4 hover:border-emerald-300 transition-colors group">
                                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={32} /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-800 mb-1">Grammar Worksheet</h3>
                                    <p className="text-sm text-slate-500 mb-4">Practice "It has + adj + color + noun" sentence structure.</p>
                                    <button onClick={() => handleDownload('Grammar Worksheet')} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:text-emerald-800 transition-colors"><Download size={16} /> Download PDF</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modal */}
                {selectedPartDetail && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-5xl w-full shadow-2xl flex flex-col md:flex-row gap-8 items-stretch">
                            <div className="md:w-2/5 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center p-8 min-h-[250px]">
                                {selectedPartDetail.animalObj?.icon ? (
                                    <img src={selectedPartDetail.animalObj.icon} alt="animal" className="w-48 h-48 md:w-full md:h-full max-h-[280px] object-contain" />
                                ) : (
                                    <span className="text-[10rem] md:text-[12rem] leading-none drop-shadow-sm">{selectedPartDetail.animalObj?.emoji}</span>
                                )}
                            </div>
                            
                            <div className="md:w-3/5 flex flex-col justify-center text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <h3 className="text-6xl md:text-7xl font-black text-indigo-600 tracking-tight">{selectedPartDetail.word}</h3>
                                    <button onClick={() => selectedPartDetail.audioObj ? playExternalAudio(selectedPartDetail.audioObj.wordUrl, selectedPartDetail.word) : speakWithBackoff(selectedPartDetail.word, setIsSpeaking)} className="text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-3 rounded-full transition shrink-0">
                                        <Volume2 size={36} />
                                    </button>
                                </div>
                                <div className="w-24 h-1.5 bg-indigo-100 rounded-full mb-8"></div>
                                
                                <div className="flex flex-row items-center justify-between gap-6 mb-10 bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
                                    <p className="text-2xl md:text-3xl font-bold text-slate-700 whitespace-nowrap overflow-x-auto custom-scrollbar">{selectedPartDetail.sentence}</p>
                                    <button onClick={() => selectedPartDetail.sentenceAudioUrl ? playExternalAudio(selectedPartDetail.sentenceAudioUrl, selectedPartDetail.sentence) : speakWithBackoff(selectedPartDetail.sentence, setIsSpeaking)} className="text-emerald-500 hover:text-white bg-emerald-100 hover:bg-emerald-500 p-4 rounded-full shadow-sm shrink-0">
                                        <Volume2 size={40} />
                                    </button>
                                </div>
                                
                                <div className="mt-auto">
                                    <button onClick={() => setSelectedPartDetail(null)} className="w-full bg-slate-800 text-white font-bold text-2xl rounded-2xl py-4 hover:bg-slate-700 transition shadow-md">Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full font-bold transition-opacity z-50 ${toastMsg ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{toastMsg}</div>
            
            {isSpeaking && (<div className="fixed bottom-6 right-6 bg-white p-3 rounded-xl border flex items-center gap-2 z-50 text-slate-800"><div className="loading-ring !block"></div><span className="font-bold text-xs text-indigo-800 tracking-tight">Speaking...</span></div>)}
        </div>
    );
}