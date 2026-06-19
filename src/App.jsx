import React, { useState } from 'react';
import { Menu, X, LayoutGrid, Rocket, Gamepad2, Sparkles } from 'lucide-react';
import AnimalBodyParts from './AnimalBodyParts';
import AmazingAnimals from "./AmazingAnimals.jsx";

const containerClasses = "max-w-7xl 3xl:max-w-[1920px] 4xl:max-w-[2800px] mx-auto px-4 w-full";

const stemProjects = [
    { id: 'p2', title: 'Bow & Arrow', link: '/steam_bow&arrow.html', cover: 'https://i.ibb.co/bjhp6x9d/image.png', desc: 'Mechanical structure & logic', tags: ['SPM', 'Basic']},
    { id: 2, title: 'Rubber Band Car', link: '/steam_rubberbandcar.html', cover: 'https://i.ibb.co/LD5jgtpF/45.png', desc: 'Mechanical structure & logic', tags: ['SPM', 'Basic'] },
    { id: 6, title: 'Crazy Frog', link: '/steam_crazyfrog.html', cover: 'https://i.ibb.co/Pz66fwj9/cover.jpg', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 23, title: 'Auto Grabber', link: '/steam_autograbber.html', cover: 'https://i.ibb.co/V0c4fgDf/IMG-2482.jpg', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 'p1', title: 'Ping Pong Launcher', link: '/steam_pingponglauncher.html', cover: 'https://i.ibb.co/dsnqrs3k/Ping-Pong-Ball-Machine-Wedo2.png', desc: 'From Mechanics to Robotic Systems', tags: ['SPM', 'Wedo 2.0'] },
    { id: 3, title: 'Gun', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 4, title: 'Tesla', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 7, title: 'Rebound LEGO Car', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 8, title: 'Pac-Man Car', desc: 'Mechanical structure & logic', tags: ['SPM'] },
    { id: 9, title: 'Basic Crane Mechanism', desc: 'Mechanical structure & logic', tags: ['SPM'] },
];

const StemProjectsGrid = () => {
    const themes = ["from-teal-600 to-emerald-900", "from-violet-600 to-purple-900", "from-slate-600 to-gray-900", "from-blue-600 to-indigo-900"];
    return (
        <React.Fragment>
            {stemProjects.map((project, index) => {
                const themeClass = themes[index % 4];
                return (
                    <a key={project.id} href={project.link || `/stem_l1_u1_${project.id}.html`} target="_blank" rel="noopener noreferrer" className={`bg-gradient-to-br ${themeClass} rounded-[2.5rem] p-6 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all relative overflow-hidden ${project.link ? 'flex' : 'hidden'} flex-col group shadow-xl min-h-[16.5rem]`}>
                        <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-white/10 flex items-center justify-center relative">
                            {project.cover ? <img src={project.cover} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" /> : <span className="text-[6rem]">⚙️</span>}
                        </div>
                        <div className="relative z-10 flex-1 flex flex-col text-left">
                            <h3 className="text-lg font-black mb-1 drop-shadow-md leading-tight">{project.title}</h3>
                            <p className="text-white/80 text-xs font-medium line-clamp-2 mb-2 opacity-90">{project.desc}</p>
                            <div className="mt-auto flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <div key={tag} className="flex items-center text-[10px] font-black uppercase tracking-widest bg-black/30 px-2.5 py-1 rounded-lg">
                                        <span className={tag === 'SPM' ? 'text-yellow-300' : 'text-cyan-300'}>{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </a>
                );
            })}
        </React.Fragment>
    );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' 代表首頁，'animal_parts' 代表動物遊戲頁面
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    setIsMobileMenuOpen(false);
  };

    if (currentPage === 'animal_parts') {
        return <AnimalBodyParts backToHome={() => setCurrentPage('home')} />;
      }

      // 👇 新增第二個警衛：判斷是不是 Amazing Animals 遊戲
      if (currentPage === 'amazing_animals') {
        return <AmazingAnimals backToHome={() => setCurrentPage('home')} />;
      }

      return (
        <div className="flex flex-col h-full bg-gray-50 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm h-20 border-b z-50 flex-shrink-0 relative font-roboto">
        <div className={`${containerClasses} h-full flex justify-between items-center`}>
          <div className="flex items-center cursor-pointer group" onClick={() => window.location.reload()}>
            <img src="https://i.ibb.co/CFC5v9L/Machi-Know-Logo.png" alt="Maachiiknow Logo" className="w-16 h-16 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all relative -top-1 left-0 z-0" />
            <span className="font-logo font-black text-3xl text-gray-900 tracking-tighter relative z-10 ml-0">
              Maachii<span className="text-orange-600">Know</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <button onClick={() => window.location.reload()} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Home</button>
            <button onClick={() => scrollToSection('elementary')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">ENGLISH</button>
            <button onClick={() => scrollToSection('steam')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Bricks</button>
            <button onClick={() => scrollToSection('scratch')} className="font-bold text-base text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Scratch</button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 p-2">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-xl border-b md:hidden flex flex-col p-6 space-y-4 z-40 text-left">
            <button onClick={() => window.location.reload()} className="font-bold text-gray-700 text-left">Home</button>
            <button onClick={() => scrollToSection('elementary')} className="font-bold text-gray-700 text-left">ENGLISH</button>
            <button onClick={() => scrollToSection('steam')} className="font-bold text-gray-700 text-left">Bricks</button>
            <button onClick={() => scrollToSection('scratch')} className="font-bold text-gray-700 text-left">Scratch</button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main id="main-scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scroll w-full">
        <div className={`${containerClasses} py-8`}>
          <div className="relative flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 rounded-lg overflow-hidden w-full h-20 my-2">
            <span className="absolute top-1 right-2 text-[10px] bg-gray-200 text-gray-500 px-1 rounded uppercase font-bold">AD Space</span>
            <p className="font-semibold text-xs">728 x 90</p>
          </div>

          <header className="py-6 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">Creative Resource Hub</h1>
            <p className="text-gray-500 text-base md:text-lg font-bold max-w-3xl mx-auto opacity-80">Providing free, professional English and STEAM teaching resources for educators worldwide.</p>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-4/5 w-full">
              
              {/* ENGLISH Section */}
              <section id="elementary" className="mb-14 pt-10">
                <div className="flex items-center mb-6 text-left">
                  <LayoutGrid className="text-orange-600 mr-4" size={28} />
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Elementary English</h2>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border-4 border-orange-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-orange-50 to-transparent pointer-events-none"></div>

                    <div className="relative flex items-center mb-6 pb-4 border-b-2 border-orange-100/60">
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-[1rem] mr-4 shadow-md text-white">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-orange-500 font-black text-[10px] uppercase tracking-widest mb-0.5">Theme Unit</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Amazing Animals</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                      <button onClick={() => setCurrentPage('amazing_animals')} className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-[2rem] p-6 text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[11rem] shadow-md hover:shadow-xl group w-full text-left">
                        <div className="absolute -right-2 -bottom-4 opacity-[0.15] group-hover:scale-110 transition-transform duration-700">
                            <span className="text-[9rem] leading-none">🦁</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className="text-2xl font-black mb-1 drop-shadow-md">🐾 Amazing Animals</h3>
                            <p className="text-orange-50 text-sm font-bold opacity-95">Interactive audio games & fun TPR activities</p>
                        </div>
                      </button>
                      <a href="/english_texture.html" target="_blank" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[11rem] shadow-md hover:shadow-xl group">
                        <div className="absolute -right-2 -bottom-4 opacity-[0.15] group-hover:scale-110 transition-transform duration-700">
                            <span className="text-[9rem] leading-none">🐍</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className="text-2xl font-black mb-1 drop-shadow-md">🌿 Animal Texture</h3>
                            <p className="text-emerald-50 text-sm font-bold opacity-95">Learn: Scales, Feathers, Fur, and Skin.</p>
                        </div>
                      </a>
                      <button onClick={() => setCurrentPage('animal_parts')} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-6 text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[11rem] shadow-md hover:shadow-xl group w-full">
                        <div className="absolute -right-2 -bottom-4 opacity-[0.15] group-hover:scale-110 transition-transform duration-700">
                            <span className="text-[9rem] leading-none">🦒</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className="text-2xl font-black mb-1 drop-shadow-md">🦒 Animal Body Parts</h3>
                            <p className="text-blue-50 text-sm font-bold opacity-95">Learn about horns, tails, wings and more!</p>
                        </div>
                      </button>
                      <a href="/english_animals_body_parts_game.html" target="_blank" className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-[2rem] p-6 text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[11rem] shadow-md hover:shadow-xl group">
                        <div className="absolute -right-2 -bottom-4 opacity-[0.15] group-hover:scale-110 transition-transform duration-700">
                            <span className="text-[9rem] leading-none">🦄</span>
                        </div>
                        <div className="relative z-10 text-left">
                            <h3 className="text-2xl font-black mb-1 drop-shadow-md">🎨 Create Animals</h3>
                            <p className="text-purple-50 text-sm font-bold opacity-95">Mix and match to create your own animal!</p>
                        </div>
                      </a>
                    </div>
                </div>
              </section>

              {/* Bricks Section */}
              <section id="steam" className="mb-14 pt-10">
                <div className="flex items-center mb-6 text-left">
                  <Rocket className="text-orange-600 mr-4" size={28} />
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Bricks & Robotics</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"><StemProjectsGrid /></div>
              </section>

              {/* Scratch Section */}
              <section id="scratch" className="mb-14 pt-10 pb-20">
                <div className="flex items-center mb-6 text-left">
                  <Gamepad2 className="text-orange-600 mr-4" size={28} />
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Scratch Interactive</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  <a href="/scratch_cat_match.html" target="_blank" className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2.5rem] p-6 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all aspect-square relative overflow-hidden flex flex-col justify-between group shadow-lg">
                    <div className="relative z-10 text-left"><h3 className="text-xl font-black mb-1 leading-tight">🐾 貓翻翻樂</h3><p className="text-yellow-50 text-sm font-bold opacity-90 mt-1">Time Expressions Game</p></div>
                    <div className="mb-0 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                       <span className="text-[6.5rem] opacity-30 group-hover:opacity-60">🐱</span>
                    </div>
                  </a>
                </div>
              </section>
            </div>

            <aside className="w-full lg:w-1/5 xl:w-[300px] shrink-0">
              <div className="sticky top-10 flex flex-col gap-4">
                <div className="relative flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 rounded-lg w-full aspect-square max-h-[250px]">
                  <span className="absolute top-1 right-2 text-[10px] font-bold">AD Space</span>
                  <p className="font-semibold text-xs">300 x 250</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
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
  );
}

export default App;