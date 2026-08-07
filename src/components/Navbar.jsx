import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Layers, Database, Sun, Moon, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ingilizcem_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('ingilizcem_theme', 'dark');
      // Update body bg to match
      document.body.className = 'bg-gray-900 text-gray-100 min-h-screen transition-colors duration-300';
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('ingilizcem_theme', 'light');
      // Update body bg to match
      document.body.className = 'bg-gray-50 text-gray-900 min-h-screen transition-colors duration-300';
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-blue-600 dark:text-blue-400 w-8 h-8" />
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100 tracking-tight">Your English Vocabulary</span>
          </div>
          
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Ana Sayfa</span>
            </NavLink>
            
            <NavLink
              to="/pool"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Kelime Havuzu</span>
            </NavLink>

            <NavLink
              to="/practice"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }`
              }
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Pratik Yap</span>
            </NavLink>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title={isDark ? "Açık Tema" : "Koyu Tema"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
