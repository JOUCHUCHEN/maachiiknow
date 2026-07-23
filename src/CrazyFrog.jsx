import React from 'react';
import { PlayCircle, Tv, ExternalLink, Download, FileDown, AlertCircle, Lightbulb } from 'lucide-react';

// 廣告區塊組件 (若您已在其他檔案獨立抽出，可改為 import 引入)
const AdBanner = ({ format = 'horizontal', className = "" }) => (
  <div className={`relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl overflow-hidden ${format === 'horizontal' ? 'w-full h-20 my-2' : 'w-full aspect-square max-h-[250px] my-4'} ${className}`}>
    <span className="absolute top-2 right-3 text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">AD Space</span>
    <p className="font-bold text-xs opacity-50">{format === 'horizontal' ? '728 x 90' : '300 x 250'}</p>
  </div>
);

export default function CrazyFrog() {
  // 影片 URL 與 下載 URL
  const bilibiliUrl = "https://www.bilibili.com/video/BV12gDjB7ELB/";
  const downloadUrl = "https://raw.githubusercontent.com/JOUCHUCHEN/maachiiknow/main/steam/crazyfrog/Crazy_Frog.io";

  // 用於防止 iframe 圓角被切掉的樣式
  const videoMaskStyle = {
    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
    maskImage: 'radial-gradient(white, black)'
  };

  return (
    <div className="w-full font-sans">
      <main className="w-full">
        <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full flex flex-col">
          
          {/* 專案標題區 */}
          <div className="mb-10 text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">LEGO 9686 SPM: Crazy Frog</h2>
            <div className="flex items-center justify-start gap-2 text-slate-400 font-bold tracking-wider uppercase text-xs">
              <PlayCircle size={14} className="text-orange-500" />
              <span>STEAM Project Learning</span>
              <span className="text-slate-200 mx-1">•</span>
              <span className="text-indigo-600 font-bold">Creative Engineering Design</span>
            </div>
          </div>

          {/* 影片容器 */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-[3rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white p-3 md:p-4 rounded-[3.5rem] shadow-2xl border border-slate-100">
              <div 
                className="aspect-video w-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-inner"
                style={videoMaskStyle}
              >
                <iframe 
                  src="//player.bilibili.com/player.html?isOutside=true&aid=116368330463292&bvid=BV12gDjB7ELB&cid=37334682595&p=1" 
                  scrolling="no" 
                  frameBorder="0" 
                  allowFullScreen={true}
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* 按鈕動作區 */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <a 
                href={bilibiliUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base font-bold text-white px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-[0_10px_30px_-10px_rgba(59,130,246,0.4)] transition-all hover:scale-105 active:scale-95 group w-full sm:w-auto justify-center"
              >
                <Tv size={20} className="group-hover:animate-pulse" /> 
                Watch on Bilibili 
                <ExternalLink size={16} className="opacity-70" />
              </a>

              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                download="CrazyFrog.io"
                className="flex items-center gap-3 text-base font-bold text-white px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 group w-full sm:w-auto justify-center"
              >
                <Download size={20} className="group-hover:animate-bounce" /> 
                Download .io File
                <FileDown size={16} className="opacity-70" />
              </a>
            </div>

            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] bg-rose-50 px-3 py-1 rounded-full">
              <AlertCircle size={12} className="stroke-[3]" /> Playback or Download Issues?
            </div>
          </div>

          {/* 專案介紹區 */}
          <div className="mt-16 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                 <Lightbulb size={120} className="text-orange-600" />
               </div>
               <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-orange-600 tracking-tight">
                 <span className="p-2 bg-orange-50 rounded-xl"><Lightbulb className="text-orange-600" size={24} /></span>
                 Project Overview
               </h3>
               <p className="text-slate-600 leading-loose text-lg font-medium relative z-10">
                 In this lesson, we will learn how to build a motorized mechanical frog using the Lego 9686 set! Through hands-on practice, students will explore gear transmission, motorized mechanisms, and the structural design needed to convert rotational motion into a walking action. Join us as we bring engineering principles to life!
               </p>
            </div>
            <div className="flex flex-col">
               <AdBanner format="square" className="!my-0 w-full h-full min-h-[300px] border-slate-200" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}