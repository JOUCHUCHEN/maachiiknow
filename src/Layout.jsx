import React, { useState, useEffect, useRef } from 'react'; // ✨ 加入了 useEffect 和 useRef
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const containerClasses = "max-w-7xl 3xl:max-w-[1920px] 4xl:max-w-[2800px] mx-auto px-4 w-full";

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✨ 1. 建立一個虛擬的手指 (ref)，準備精準指著我們的滾動容器
  const scrollRef = useRef(null);

  // ✨ 2. 終極殺手鐧：只要網址一變換，立刻把容器的捲軸歸零！
  useEffect(() => {
    if (scrollRef.current) {
      // 雙重保險寫法，確保所有瀏覽器都乖乖聽話
      scrollRef.current.scrollTo(0, 0); 
      scrollRef.current.scrollTop = 0;
    }
  }, [location.pathname]); // 監聽 location.pathname 的變化

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    const scrollContainer = document.getElementById('main-scroll-container');
    if (element && scrollContainer) {
      const offset = 20;
      const elementRect = element.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const offsetPosition = elementRect.top - containerRect.top + scrollContainer.scrollTop - offset;
      scrollContainer.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>

      <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
        {/* Navbar */}
        <nav className="bg-white shadow-sm h-20 border-b z-50 flex-shrink-0 relative font-roboto">
          <div className={`${containerClasses} h-full flex justify-between items-center`}>
            
            <div onClick={() => navigate('/')} className="flex flex-row items-center cursor-pointer group shrink-0">
              <img src="https://i.ibb.co/CFC5v9L/Machi-Know-Logo.png" alt="Maachiiknow Logo" className="w-16 h-16 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all relative -top-1 left-0 z-0" />
              <span className="font-logo font-black text-3xl text-gray-900 tracking-tighter relative z-10 ml-0">
                Maachii<span className="text-orange-600">Know</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-12 shrink-0">
              <button onClick={() => navigate('/')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Home</button>
              <button onClick={() => handleNavClick('elementary')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">ENGLISH</button>
              <button onClick={() => handleNavClick('steam')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Bricks</button>
              <button onClick={() => handleNavClick('scratch')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Scratch</button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 p-2">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white shadow-xl border-b md:hidden flex flex-col p-6 space-y-4 z-40 text-left">
              <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="font-bold text-gray-700 text-left">Home</button>
              <button onClick={() => handleNavClick('elementary')} className="font-bold text-gray-700 text-left">ENGLISH</button>
              <button onClick={() => handleNavClick('steam')} className="font-bold text-gray-700 text-left">Bricks</button>
              <button onClick={() => handleNavClick('scratch')} className="font-bold text-gray-700 text-left">Scratch</button>
            </div>
          )}
        </nav>

        {/* 內容區：✨ 3. 將剛剛做好的 scrollRef 綁定到這裡 */}
        <main ref={scrollRef} id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scroll w-full">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t py-4 text-center flex-shrink-0 relative z-50 w-full font-roboto">
          <div className={containerClasses}>
            <p className="text-[10px] sm:text-xs text-gray-400 font-black uppercase tracking-[0.3em]">
              © 2026 MaachiiKnow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}