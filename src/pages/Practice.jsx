import { useState, useEffect } from 'react';
import { useWords } from '../context/WordContext';
import WordCard from '../components/WordCard';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Zap, BookOpen, Database, Layers } from 'lucide-react';

const Practice = () => {
  const { words, getMergedYdsWords, updateWordStatus } = useWords();
  
  const [selectedSource, setSelectedSource] = useState(null); // 'personal', 'yds', 'mixed'
  const [queue, setQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);
  const [evaluationCount, setEvaluationCount] = useState(0); // For forcing WordCard reset if same word repeats

  const location = useLocation();

  useEffect(() => {
    if (location.state?.defaultSource && !selectedSource) {
      setSelectedSource(location.state.defaultSource);
      // Temizle ki geri gelindiğinde tekrar zorla başlatmasın
      window.history.replaceState({}, document.title);
    }
  }, [location, selectedSource]);

  // Initialize practice queue when source is selected
  useEffect(() => {
    if (!selectedSource) return;

    let sourceWords = [];
    if (selectedSource === 'personal') {
      sourceWords = [...words];
    } else if (selectedSource === 'yds') {
      sourceWords = [...getMergedYdsWords()];
    } else if (selectedSource === 'mixed') {
      sourceWords = [...words, ...getMergedYdsWords()];
    }

    const practiceWords = sourceWords.filter(w => w.status !== 'known');
    let listToPractice = practiceWords.length > 0 ? practiceWords : sourceWords;
    
    const shuffled = [...listToPractice].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setInitialCount(shuffled.length);
    setEvaluationCount(0);
  }, [selectedSource, words]);

  const currentWord = queue[0];

  const handleEvaluate = (status) => {
    if (!currentWord) return;

    // 1. Update the context state (handles both personal and yds automatically via ID)
    updateWordStatus(currentWord.id, status);

    // 2. Handle Spaced Repetition (Standard Queue Management)
    setTimeout(() => {
      let newQueue = [...queue];
      const evaluatedWord = newQueue.shift(); // Always remove the first item

      if (status !== 'known') {
        // If unknown or unsure, push it to the END of the queue
        newQueue.push(evaluatedWord);
      }

      setQueue(newQueue);
      setEvaluationCount(prev => prev + 1);
    }, 400); 
  };

  const handleBackToSelection = () => {
    setSelectedSource(null);
    setQueue([]);
    setInitialCount(0);
  };

  const progressPercentage = initialCount > 0
    ? Math.min(100, Math.round(((initialCount - queue.length) / initialCount) * 100)) 
    : 100;

  // Source Selection Screen
  if (!selectedSource) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center py-12 px-4 animate-in fade-in duration-500">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Pratik Modu Seçimi</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-center max-w-md">Hangi kelime havuzu üzerinde çalışmak istediğinizi seçin.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <button 
            onClick={() => setSelectedSource('personal')}
            className="flex flex-col items-center p-8 bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 rounded-3xl hover:-translate-y-1 hover:shadow-xl dark:hover:border-blue-500 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Benim Kelimelerim</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Kendi eklediğin kelimelerle çalış.</p>
          </button>

          <button 
            onClick={() => setSelectedSource('yds')}
            className="flex flex-col items-center p-8 bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 rounded-3xl hover:-translate-y-1 hover:shadow-xl dark:hover:border-teal-500 transition-all group"
          >
            <div className="w-16 h-16 bg-teal-50 dark:bg-slate-700/50 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Hazır Set</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">YDS kelimeleriyle çalış.</p>
          </button>

          <button 
            onClick={() => setSelectedSource('mixed')}
            className="flex flex-col items-center p-8 bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 rounded-3xl hover:-translate-y-1 hover:shadow-xl dark:hover:border-indigo-500 transition-all group"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">İkisi Karışık</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Tüm havuzu birleştir.</p>
          </button>
        </div>
      </div>
    );
  }

  // Practice Screen
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center py-8 px-4 animate-in fade-in duration-500 pb-10">
      
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={handleBackToSelection} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Kaynak Seçimi</span>
        </button>
        <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800/50">
          <Zap className="w-5 h-5" />
          <span>Pratik Modu</span>
        </div>
      </div>

      {queue.length > 0 ? (
        <div className="w-full mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
            <span>Kalan Kelime: {queue.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-gray-300 dark:border-slate-700">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      ) : null}

      <div className="w-full mt-4 relative">
        {queue.length > 0 && currentWord ? (
          <WordCard key={`${currentWord.id}-${evaluationCount}`} word={currentWord} onEvaluate={handleEvaluate} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 rounded-3xl p-8 text-center w-full max-w-md mx-auto animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-50 dark:bg-slate-700/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-sm border border-transparent dark:border-slate-600">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Harika İş Çıkardın!</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Seçtiğin listedeki tüm kelimeleri bitirdin.</p>
            <button 
              onClick={handleBackToSelection}
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-semibold shadow-md"
            >
              Başka Bir Kaynak Seç
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Practice;
