import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 初始遊戲資料與設定 (Initial Game Data)
// ==========================================
const TILE_SIZE = 32;

const INITIAL_CATS = [
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

const INITIAL_MAP = [
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

export default function PawsAndPlay() {
  // ==========================================
  // React 狀態管理 (State Management)
  // ==========================================
  const [gameState, setGameState] = useState('START'); // START, MAP, MINIGAME, PROFILE, CREATOR, VOCAB
  const [activeCat, setActiveCat] = useState(null);
  
  // 餵奶小遊戲狀態
  const [feedStep, setFeedStep] = useState(1); // 1: Observe, 2: Heat, 3: Feed, 4: Blanket
  const [temperature, setTemperature] = useState(0);
  const [isHeating, setIsHeating] = useState(false);
  const [tempMsg, setTempMsg] = useState('');
  
  // 引擎蓋小遊戲狀態
  const [carStep, setCarStep] = useState(1); // 1: Tap, 2: Food

  // Creator 表單狀態
  const [creatorForm, setCreatorForm] = useState({
    name: 'Happy',
    danger: 'feed',
    story: 'Happy was ALONE. No mother cat around. He was cold and hungry in the rain.',
    x: 16,
    y: 3,
    element: '4' // Box
  });

  // ==========================================
  // Refs (維持 Canvas 高效能)
  // ==========================================
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const keysRef = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false });
  const gameDataRef = useRef({ cats: [...INITIAL_CATS], map: JSON.parse(JSON.stringify(INITIAL_MAP)) });
  
  const playerRef = useRef({
    x: 7, y: 17, 
    pixelX: 7 * 32, pixelY: 17 * 32,
    targetX: 7, targetY: 17, 
    moving: false, speed: 2
  });

  // ==========================================
  // 語音發音與 AI 提示詞生成器
  // ==========================================
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
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

  // ==========================================
  // 遊戲邏輯控制
  // ==========================================
  const startMiniGame = (cat) => {
    for (let k in keysRef.current) keysRef.current[k] = false; // 清空按鍵避免暴衝
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
    gameDataRef.current.cats = gameDataRef.current.cats.filter(c => c.id !== activeCat.id);
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

  // ==========================================
  // Canvas 渲染與實體引擎
  // ==========================================
  const drawMap = (ctx) => {
    const data = gameDataRef.current;
    for (let y = 0; y < data.map.length; y++) {
      for (let x = 0; x < data.map[y].length; x++) {
        const tile = data.map[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Base Layer
        if (tile === 1) { 
          ctx.fillStyle = '#9ca3af'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#d1d5db'; ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#f3f4f6'; ctx.fillRect(px + 14, py + 14, 4, 4);
        } else { 
          ctx.fillStyle = '#86efac'; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#4ade80'; ctx.fillRect(px + 4, py + 4, 4, 4);
          ctx.fillRect(px + 24, py + 20, 4, 4); ctx.fillRect(px + 10, py + 26, 4, 4);
        }

        // Obstacles Layer
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

    // Cats
    const bounce = Math.sin(Date.now() / 300) * 2;
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    data.cats.forEach(cat => {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(cat.mapX * TILE_SIZE + 16, cat.mapY * TILE_SIZE + 24, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(cat.emoji, cat.mapX * TILE_SIZE + 16, cat.mapY * TILE_SIZE + 16 + bounce);
    });
  };

  const drawPlayer = (ctx) => {
    const p = playerRef.current;
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(p.pixelX + 16, p.pixelY + 28, 10, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Body & Backpack
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(p.pixelX + 10, p.pixelY + 16, 12, 12);
    ctx.fillStyle = '#92400e'; ctx.fillRect(p.pixelX + 6, p.pixelY + 18, 4, 8); 
    
    // Head & Eyes
    ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(p.pixelX + 16, p.pixelY + 10, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#451a03'; ctx.beginPath(); ctx.arc(p.pixelX + 16, p.pixelY + 8, 8, 0, Math.PI, true); ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.fillRect(p.pixelX + 12, p.pixelY + 8, 2, 2); ctx.fillRect(p.pixelX + 18, p.pixelY + 8, 2, 2);
    
    // Legs
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
      // 撞擊觸發判定
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
    gameDataRef.current.cats.push(newCat);
    if (creatorForm.element !== '0' && gameDataRef.current.map[creatorForm.y]?.[creatorForm.x] !== undefined) {
      gameDataRef.current.map[creatorForm.y][creatorForm.x] = Number(creatorForm.element);
    }
    setGameState('MAP');
  };

  // ==========================================
  // Render (畫面渲染)
  // ==========================================
  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-gray-900 overflow-hidden select-none font-sans">
      <style>{`
        @keyframes shake { 0% { transform: translate(1px, 1px) rotate(0deg); } 25% { transform: translate(-1px, -2px) rotate(-5deg); } 50% { transform: translate(-3px, 0px) rotate(5deg); } 75% { transform: translate(3px, 2px) rotate(0deg); } 100% { transform: translate(1px, -1px) rotate(0deg); } }
        .shaking { animation: shake 0.5s infinite; }
      `}</style>

      {/* 頂部控制列 */}
      {gameState === 'MAP' && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button onClick={() => setGameState('CREATOR')} className="bg-white/90 border-2 border-indigo-500 text-indigo-600 font-black py-2 px-4 rounded-xl shadow hover:bg-indigo-50 transition transform hover:scale-105">
            🛠️ AI Creator
          </button>
          <button onClick={() => setGameState('VOCAB')} className="bg-white/90 border-2 border-yellow-500 text-yellow-600 font-black py-2 px-4 rounded-xl shadow hover:bg-yellow-50 transition transform hover:scale-105">
            📚 Mission Deck
          </button>
        </div>
      )}

      <canvas ref={canvasRef} width={640} height={640} className="max-w-full max-h-full rounded-xl shadow-2xl bg-gray-800" style={{ imageRendering: 'pixelated' }} />

      {/* 手機控制器 */}
      {gameState === 'MAP' && (
        <div className="absolute bottom-5 right-5 grid grid-cols-3 grid-rows-3 gap-2 md:hidden z-10">
          <div className="col-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-12 h-12 text-2xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowUp')}>▲</div>
          <div className="col-start-1 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-12 h-12 text-2xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowLeft')}>◀</div>
          <div className="col-start-3 row-start-2 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-12 h-12 text-2xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowRight')}>▶</div>
          <div className="col-start-2 row-start-3 flex justify-center items-center bg-white/30 border-2 border-white/60 text-white rounded-full w-12 h-12 text-2xl active:bg-white/60 cursor-pointer backdrop-blur-sm" {...dpadProps('ArrowDown')}>▼</div>
        </div>
      )}

      {/* 覆蓋式 UI 層 */}
      {gameState !== 'MAP' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-20 overflow-y-auto py-10">
          
          {/* Start Screen */}
          {gameState === 'START' && (
            <div className="bg-white p-8 rounded-2xl w-11/12 max-w-sm text-center shadow-2xl border-4 border-indigo-500">
              <h1 className="text-3xl font-black text-indigo-600 mb-2">Paws & Play</h1>
              <p className="text-gray-600 font-bold mb-6">Street Cat Heroes MVP</p>
              <div className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <p>🎮 <b>How to play:</b></p>
                <p>1. Use Keyboard (WASD/Arrows) or buttons.</p>
                <p>2. Find the stray cat (🐈) on the map.</p>
                <p>3. Complete the rescue mission!</p>
              </div>
              <button onClick={() => setGameState('MAP')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition">Start Game 🚀</button>
            </div>
          )}

          {/* Mini-Game: Feeding */}
          {gameState === 'MINIGAME' && activeCat?.rescueType === 'feed' && (
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-2xl border-4 border-blue-400 relative">
              <div className="absolute top-3 right-4 text-lg font-bold text-gray-700 tracking-widest">🐟 ({feedStep - 1}/4)</div>
              <h2 className="text-2xl font-black text-blue-800 mb-2 mt-6">Feeding & Care</h2>
              <div className={`text-7xl mb-4 flex justify-center transition-transform ${feedStep <= 2 ? 'shaking' : ''}`}>{feedStep <= 2 ? '🐱📦' : feedStep === 3 ? '🐱🍼' : '🐱🛌'}</div>
              {feedStep === 1 && (
                <>
                  <p className="text-gray-600 mb-4 text-sm font-bold">Step 1: Observe! Is the mother cat here?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setTempMsg("DON'T TOUCH! The mother cat will abandon the kitten.")} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-2 rounded-xl text-sm shadow">👀 Yes</button>
                    <button onClick={() => { setTempMsg("Good! The kitten is alone."); setTimeout(() => setFeedStep(2), 2000); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-2 rounded-xl text-sm shadow">🚫 No</button>
                  </div>
                  <p className={`text-sm font-bold mt-2 h-10 ${tempMsg.includes("DON'T") ? 'text-red-600' : 'text-green-600'}`}>{tempMsg}</p>
                </>
              )}
              {feedStep === 2 && (
                <>
                  <p className="text-gray-600 mb-4 text-sm font-bold">Step 2: Heat the milk!</p>
                  <div className="w-full h-6 bg-gray-200 rounded-full mb-4 relative overflow-hidden border-2 border-gray-400">
                    <div className="absolute left-[40%] w-[20%] h-full bg-green-500/40 border-l-2 border-r-2 border-dashed border-gray-700" />
                    <div className={`h-full transition-all duration-100 ${temperature < 40 ? 'bg-blue-500' : temperature <= 60 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${temperature}%` }} />
                  </div>
                  <button onMouseDown={() => setIsHeating(true)} onMouseUp={() => setIsHeating(false)} onMouseLeave={() => setIsHeating(false)} onTouchStart={() => setIsHeating(true)} onTouchEnd={() => setIsHeating(false)} disabled={tempMsg.includes('Perfect')} className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow active:scale-95 disabled:opacity-50">🔥 Heat (Hold)</button>
                  <p className={`text-sm font-bold mt-2 h-5 ${temperature > 60 ? 'text-red-600' : temperature >= 40 ? 'text-green-600' : 'text-blue-600'}`}>{tempMsg}</p>
                </>
              )}
              {feedStep === 3 && (
                <>
                  <p className="text-gray-600 mb-4 text-sm font-bold">Step 3: Aim for a mouth.</p>
                  <button onClick={() => setFeedStep(4)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow active:scale-95">🍼 Use Bottle on a mouth</button>
                </>
              )}
              {feedStep === 4 && (
                <>
                  <p className="text-gray-600 mb-4 text-sm font-bold">Step 4: Keep a tummy warm.</p>
                  <button onClick={finishMiniGame} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow active:scale-95">🛌 Put Blanket on a tummy</button>
                </>
              )}
            </div>
          )}

          {/* Mini-Game: Car Engine */}
          {gameState === 'MINIGAME' && activeCat?.rescueType === 'car_engine' && (
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-sm text-center shadow-2xl border-4 border-red-400 relative">
              <h2 className="text-2xl font-black text-red-800 mb-2">Car Rescue!</h2>
              <p className="text-gray-600 mb-4 text-sm font-bold">{carStep === 1 ? "The cat is under the hood! Very dangerous! First, alert her." : "Great! She peeked out. Now use wet food to lure her out!"}</p>
              <div className="text-6xl mb-6 transition-transform" style={{ transform: carStep === 2 ? 'scale(1.2)' : 'none' }}>{carStep === 1 ? '🚗' : '🐈💕'}</div>
              <div className="flex gap-2">
                <button onClick={() => setCarStep(2)} disabled={carStep === 2} className={`flex-1 font-bold py-3 px-2 rounded-xl shadow ${carStep === 1 ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>👋 Tap Hood</button>
                <button onClick={finishMiniGame} disabled={carStep === 1} className={`flex-1 font-bold py-3 px-2 rounded-xl shadow ${carStep === 2 ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>🐟 Use Food</button>
              </div>
            </div>
          )}

          {/* Profile Card & Prompt Generator (RPG Character Unlocked) */}
          {gameState === 'PROFILE' && activeCat && (
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md text-center shadow-2xl border-4 border-indigo-500 relative max-h-[90vh] overflow-y-auto">
              
              <div className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
                🎉 RPG Character Unlocked!
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">{activeCat.profile.name}</h2>
              
              {/* Magic Sentences 區塊 */}
              <div className="text-left bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700 leading-relaxed border border-gray-200">
                <span className="font-bold text-indigo-600 block mb-1">✨ Magic Sentences (故事):</span>
                {activeCat.profile.story}
              </div>

              {/* AI 圖像生成指令 區塊 */}
              <div className="text-left bg-indigo-50 p-4 rounded-lg mb-4 text-sm border-2 border-indigo-200">
                <span className="font-bold text-indigo-800 block mb-2">🖼️ 圖像生成指令 (Image Prompt):</span>
                <p className="text-gray-600 italic mb-4 bg-white p-2 rounded border border-indigo-100 select-all">
                  "{generateImagePrompt(activeCat)}"
                </p>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generateImagePrompt(activeCat));
                    alert("已複製指令！現在可以貼上給 Gemini 囉！(Copied!)");
                  }}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition mb-3 flex justify-center items-center gap-2"
                >
                  📋 複製 prompt 給 Gemini
                </button>
                
                <a 
                  href="https://gemini.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition text-center"
                >
                  點擊這裡開啟 Gemini 並貼上生成圖片 ➔
                </a>
              </div>
              
              <button 
                onClick={() => { setActiveCat(null); setGameState('MAP'); }} 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition"
              >
                Back to Map (回到地圖)
              </button>
            </div>
          )}

          {/* Creator Panel */}
          {gameState === 'CREATOR' && (
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-md text-left shadow-2xl border-4 border-indigo-500 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black text-indigo-600">🛠️ Cat Story Creator</h2>
                <button onClick={() => setGameState('MAP')} className="text-gray-500 hover:text-red-500 font-bold text-xl">✕</button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">Cat's Name</label>
                  <input type="text" value={creatorForm.name} onChange={e => setCreatorForm({...creatorForm, name: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">1. Danger (Situation)</label>
                  <select value={creatorForm.danger} onChange={e => setCreatorForm({...creatorForm, danger: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none">
                    <option value="feed">Cold & Alone (Lost Kitten)</option>
                    <option value="car_engine">Trapped in Car Engine (Street Cat)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">3. Story (Magic Sentences)</label>
                  <textarea value={creatorForm.story} onChange={e => setCreatorForm({...creatorForm, story: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 text-sm">Map X (0-19)</label>
                    <input type="number" min="0" max="19" value={creatorForm.x} onChange={e => setCreatorForm({...creatorForm, x: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1 text-sm">Map Y (0-19)</label>
                    <input type="number" min="0" max="19" value={creatorForm.y} onChange={e => setCreatorForm({...creatorForm, y: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1 text-sm">5. Add Map Element</label>
                  <select value={creatorForm.element} onChange={e => setCreatorForm({...creatorForm, element: e.target.value})} className="w-full p-2 border-2 border-gray-300 rounded-lg outline-none">
                    <option value="0">None (Grass)</option>
                    <option value="4">📦 Cardboard Box</option>
                    <option value="5">🚗 Car</option>
                  </select>
                </div>
                <button onClick={handleDeploy} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow hover:bg-green-600 transition mt-2">🚀 Deploy to Game!</button>
              </div>
            </div>
          )}

          {/* Mission Deck: Vocab & Grammar (Grade 3 Countermeasures) */}
          {gameState === 'VOCAB' && (
            <div className="bg-white p-6 rounded-2xl w-11/12 max-w-4xl text-left shadow-2xl border-4 border-yellow-400 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 border-b-2">
                <h2 className="text-3xl font-black text-yellow-600">📚 Mission Deck: Vocab & Grammar</h2>
                <button onClick={() => setGameState('MAP')} className="text-gray-500 hover:text-red-500 font-bold text-2xl">✕</button>
              </div>
              
              <div className="text-gray-600 mb-4 font-bold text-sm bg-yellow-50 p-3 rounded-lg">
                💡 點擊任何英文單字或句子，都可以聽發音喔！(Click to listen)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Block 1: Feeding */}
                <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">🍼 1. Feeding & Care</h3>
                  <div className="flex flex-wrap gap-2 mb-3 border-b border-blue-200 pb-3">
                    {['Warm', 'Cold', 'Bottle', 'Milk', 'Blanket'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded-full text-sm font-bold shadow hover:bg-blue-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-blue-600 mb-2">Grade 3 Grammar (應對措施)</h4>
                  <ul className="space-y-2">
                    <li onClick={() => speak('Happy was cold.')} className="bg-white p-2 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 text-sm font-bold text-gray-700">
                      Happy was <span className="text-blue-600">cold</span>. (狀態)
                    </li>
                    <li onClick={() => speak('Heat the milk!')} className="bg-white p-2 rounded border border-blue-100 cursor-pointer hover:bg-blue-100 text-sm font-bold text-gray-700">
                      <span className="text-blue-600">Heat</span> the milk! (處置指令)
                    </li>
                    <li onClick={() => speak('Don\'t touch the kitten!')} className="bg-white p-2 rounded border border-blue-100 cursor-pointer hover:bg-red-100 text-sm font-bold text-red-700">
                      <span className="text-red-600">Don't</span> touch the kitten! (警告禁忌)
                    </li>
                  </ul>
                </div>

                {/* Block 2: Medical */}
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-green-800 mb-2">🩹 2. Medical Rescue</h3>
                  <div className="flex flex-wrap gap-2 mb-3 border-b border-green-200 pb-3">
                    {['Bandage', 'Medicine', 'Vet', 'Clean', 'Heal'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-green-300 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow hover:bg-green-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-green-600 mb-2">Grade 3 Grammar (應對措施)</h4>
                  <ul className="space-y-2">
                    <li onClick={() => speak('Mimi was hurt.')} className="bg-white p-2 rounded border border-green-100 cursor-pointer hover:bg-green-100 text-sm font-bold text-gray-700">
                      Mimi was <span className="text-green-600">hurt</span>. (狀態)
                    </li>
                    <li onClick={() => speak('Clean a tail!')} className="bg-white p-2 rounded border border-green-100 cursor-pointer hover:bg-green-100 text-sm font-bold text-gray-700">
                      <span className="text-green-600">Clean</span> a tail! (處置指令)
                    </li>
                    <li onClick={() => speak('Don\'t use human medicine!')} className="bg-white p-2 rounded border border-green-100 cursor-pointer hover:bg-red-100 text-sm font-bold text-red-700">
                      <span className="text-red-600">Don't</span> use human medicine! (警告禁忌)
                    </li>
                  </ul>
                </div>

                {/* Block 3: Tool */}
                <div className="border-2 border-amber-200 bg-amber-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">🪜 3. Tool Rescue</h3>
                  <div className="flex flex-wrap gap-2 mb-3 border-b border-amber-200 pb-3">
                    {['Ladder', 'Flashlight', 'Treat', 'Up', 'Down'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-amber-300 text-amber-700 px-3 py-1 rounded-full text-sm font-bold shadow hover:bg-amber-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-amber-600 mb-2">Grade 3 Grammar (應對措施)</h4>
                  <ul className="space-y-2">
                    <li onClick={() => speak('The cat is up in the tree.')} className="bg-white p-2 rounded border border-amber-100 cursor-pointer hover:bg-amber-100 text-sm font-bold text-gray-700">
                      The cat is <span className="text-amber-600">UP in</span> the tree. (狀態)
                    </li>
                    <li onClick={() => speak('Use a ladder!')} className="bg-white p-2 rounded border border-amber-100 cursor-pointer hover:bg-amber-100 text-sm font-bold text-gray-700">
                      <span className="text-amber-600">Use</span> a ladder! (處置指令)
                    </li>
                    <li onClick={() => speak('Don\'t scare the cat!')} className="bg-white p-2 rounded border border-amber-100 cursor-pointer hover:bg-red-100 text-sm font-bold text-red-700">
                      <span className="text-red-600">Don't</span> scare the cat! (警告禁忌)
                    </li>
                  </ul>
                </div>

                {/* Block 4: TNR */}
                <div className="border-2 border-indigo-200 bg-indigo-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">🥅 4. TNR (誘捕)</h3>
                  <div className="flex flex-wrap gap-2 mb-3 border-b border-indigo-200 pb-3">
                    {['Safe', 'Wait', 'Catch', 'Release'].map(w => (
                      <button key={w} onClick={() => speak(w)} className="bg-white border border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold shadow hover:bg-indigo-100">{w}</button>
                    ))}
                  </div>
                  <h4 className="text-sm font-black text-indigo-600 mb-2">Grade 3 Grammar (應對措施)</h4>
                  <ul className="space-y-2">
                    <li onClick={() => speak('The cat is safe.')} className="bg-white p-2 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100 text-sm font-bold text-gray-700">
                      The cat is <span className="text-indigo-600">safe</span>. (狀態)
                    </li>
                    <li onClick={() => speak('Wait for the cat!')} className="bg-white p-2 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100 text-sm font-bold text-gray-700">
                      <span className="text-indigo-600">Wait</span> for the cat! (處置指令)
                    </li>
                    <li onClick={() => speak('Don\'t open the cage!')} className="bg-white p-2 rounded border border-indigo-100 cursor-pointer hover:bg-red-100 text-sm font-bold text-red-700">
                      <span className="text-red-600">Don't</span> open the cage! (警告禁忌)
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