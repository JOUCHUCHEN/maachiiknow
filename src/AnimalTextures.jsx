import React from 'react';
import { MonitorPlay, FlaskConical, Sparkles, Download } from 'lucide-react';

// AdBanner 組件
const AdBanner = ({ format = 'horizontal', className = "" }) => (
    <div className={`relative flex items-center justify-center bg-sky-100/50 border-2 border-dashed border-sky-200 text-sky-400 rounded-lg overflow-hidden ${format === 'horizontal' ? 'w-full h-20 my-2' : 'w-full aspect-square max-h-[250px] my-4'} ${className}`}>
        <span className="absolute top-1 right-2 text-[10px] bg-sky-200 text-sky-600 px-1 rounded uppercase tracking-tighter font-black">AD Space</span>
        <p className="font-bold text-xs uppercase tracking-widest">ADVERTISEMENT (728 x 90)</p>
    </div>
);

// HomeCard 組件
const HomeCard = ({ icon, title, desc, color, targetUrl }) => (
    <button 
        onClick={() => window.location.href = targetUrl} 
        className={`${color} border-2 rounded-[2rem] p-4 sm:p-5 text-left flex items-center gap-4 transition-all hover:scale-[1.03] active:scale-95 group shadow-sm w-full`}
    >
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm group-hover:rotate-6 transition-transform flex-shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-lg sm:text-xl font-black text-gray-800 leading-tight">{title}</h3>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold mt-1 uppercase tracking-wider">{desc}</p>
        </div>
    </button>
);

// 主組件
export default function AnimalTextures() {
    return (
        <div className="w-full h-full bg-sky-50 flex flex-col overflow-hidden font-sans">
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scroll flex flex-col">
                <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-start text-center animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 px-4 md:px-6 pt-6 md:pt-8 pb-4">
                    
                    <div className="flex gap-4 sm:gap-6 md:gap-8 mb-6 animate-bounce justify-center">
                        <img src="https://i.ibb.co/Kx5QgzjW/scales.jpg" alt="Scales" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full shadow-lg border-4 border-white" />
                        <img src="https://i.ibb.co/VpD6SBfy/feathers.jpg" alt="Feathers" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full shadow-lg border-4 border-white" />
                        <img src="https://i.ibb.co/wZz1kC2Y/fur.jpg" alt="Fur" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full shadow-lg border-4 border-white" />
                        <img src="https://i.ibb.co/JWn0W1Gb/skin.png" alt="Skin" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full shadow-lg border-4 border-white" />
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-black text-sky-900 mb-2 tracking-tight">Animal Textures!</h2>
                    <p className="text-sm sm:text-base text-sky-700/80 mb-6 max-w-2xl font-bold leading-relaxed mx-auto px-4">
                        Explore animal textures, learn vocabulary, and play games!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-4 sm:px-6 mb-6">
                        <HomeCard icon={<MonitorPlay className="text-emerald-500" size={26} />} title="Texture Library" desc="LEARNING GALLERY" color="bg-emerald-50/50 border-emerald-200" targetUrl="texture/texture_library.html" />
                        <HomeCard icon={<FlaskConical className="text-indigo-500" size={26} />} title="Texture Lab" desc="MATCHING EXPERIMENT" color="bg-indigo-50/50 border-indigo-200" targetUrl="texture/texture_lab.html" />
                        <HomeCard icon={<Sparkles className="text-orange-500" size={26} />} title="Texture Quiz" desc="ANSWER THE CHALLENGES" color="bg-orange-50/50 border-orange-200" targetUrl="texture/texture_quiz.html" />
                        <HomeCard icon={<Download className="text-purple-500" size={26} />} title="Materials" desc="PPT & WORKSHEETS" color="bg-purple-50/50 border-purple-200" targetUrl="texture/texture_materials.html" />
                    </div>

                    <div className="mt-auto w-full max-w-3xl px-6">
                        <AdBanner format="horizontal" />
                    </div>
                </div>
            </main>
        </div>
    );
}