import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 每次路徑 (pathname) 改變時，就將視窗捲軸移動到最左上角 (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  // 這個組件只是在背後做事，不需要渲染任何畫面
  return null; 
}