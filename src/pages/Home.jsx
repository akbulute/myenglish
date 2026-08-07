import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWords } from '../context/WordContext';
import StatsCard from '../components/StatsCard';
import { PlusCircle, CheckCircle2, XCircle, HelpCircle, ListPlus, X, Volume2, Rocket } from 'lucide-react';

const ModalWordRow = React.memo(({ word, modalStatus, handleUpdateStatus }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const playAudio = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <li 
      className={`flex flex-col p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 transition-all duration-300 ${!isRevealed ? 'cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-slate-500' : 'shadow-sm'}`}
      onClick={() => { if (!isRevealed) setIsRevealed(true); }}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-900 dark:text-white text-lg">{word.english}</span>
          <button 
            onClick={playAudio}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
            title="Dinle"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Action Buttons (Only visible when revealed) */}
        {isRevealed && (
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(word.id, 'known'); }}
              className={`p-2 rounded-xl transition-colors border ${modalStatus === 'known' ? 'bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-700/50 dark:text-emerald-400' : 'bg-white border-gray-200 text-emerald-600 hover:bg-emerald-50 dark:bg-slate-700 dark:border-slate-600 dark:text-emerald-400 dark:hover:bg-emerald-900/30'}`}
              title="Biliyorum"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(word.id, 'unsure'); }}
              className={`p-2 rounded-xl transition-colors border ${modalStatus === 'unsure' ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-700/50 dark:text-amber-400' : 'bg-white border-gray-200 text-amber-600 hover:bg-amber-50 dark:bg-slate-700 dark:border-slate-600 dark:text-amber-400 dark:hover:bg-amber-900/30'}`}
              title="Emin Değilim"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(word.id, 'unknown'); }}
              className={`p-2 rounded-xl transition-colors border ${modalStatus === 'unknown' ? 'bg-rose-100 border-rose-300 text-rose-700 dark:bg-rose-900/40 dark:border-rose-700/50 dark:text-rose-400' : 'bg-white border-gray-200 text-rose-600 hover:bg-rose-50 dark:bg-slate-700 dark:border-slate-600 dark:text-rose-400 dark:hover:bg-rose-900/30'}`}
              title="Bilmiyorum"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {/* Turkish Meaning & Hint */}
      <div className={`mt-2 transition-all duration-300 overflow-hidden ${isRevealed ? 'max-h-20 opacity-100' : 'max-h-10 opacity-70'}`}>
        {isRevealed ? (
          <span className="text-gray-600 dark:text-gray-400 font-medium text-base block border-t border-gray-200 dark:border-slate-700 pt-2">
            {word.turkish}
          </span>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic block">
            Anlamını görmek için tıkla...
          </span>
        )}
      </div>
    </li>
  );
});

// Explicit display name for debugging
ModalWordRow.displayName = 'ModalWordRow';

const Home = () => {
  const navigate = useNavigate();
  const { words, addWord, bulkAddWords, getMergedYdsWords, updateWordStatus } = useWords();
  
  const [english, setEnglish] = useState('');
  const [turkish, setTurkish] = useState('');
  const [bulkText, setBulkText] = useState('');

  // Interactive Modal State
  const [modalState, setModalState] = useState({ isOpen: false, status: null, title: '' });

  // Single word submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (english.trim() && turkish.trim()) {
      addWord(english, turkish);
      setEnglish(''); 
      setTurkish(''); 
    }
  }, [english, turkish, addWord]);

  // Bulk word submit
  const handleBulkSubmit = useCallback(() => {
    if (bulkText.trim()) {
      const addedCount = bulkAddWords(bulkText);
      alert(`${addedCount} yeni kelime başarıyla eklendi! (Mevcut olanlar veya hatalı formattakiler atlandı)`);
      setBulkText(''); 
    }
  }, [bulkText, bulkAddWords]);

  // Optimized Derived State
  const ydsWords = useMemo(() => getMergedYdsWords(), [getMergedYdsWords]);
  const allWords = useMemo(() => [...words, ...ydsWords], [words, ydsWords]);

  const knownWords = useMemo(() => allWords.filter(w => w.status === 'known'), [allWords]);
  const unknownWords = useMemo(() => allWords.filter(w => w.status === 'unknown'), [allWords]);
  const unsureWords = useMemo(() => allWords.filter(w => w.status === 'unsure'), [allWords]);

  const handleOpenModal = useCallback((status, title) => {
    setModalState({ isOpen: true, status, title });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, status: null, title: '' });
  }, []);

  const handleUpdateStatus = useCallback((id, newStatus) => {
    updateWordStatus(id, newStatus);
  }, [updateWordStatus]);

  // Get active modal words dynamically (memoized)
  const activeModalWords = useMemo(() => {
    return allWords.filter(w => w.status === modalState.status);
  }, [allWords, modalState.status]);

  const handleQuickPractice = () => {
    navigate('/practice', { state: { defaultSource: 'mixed' } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Landing Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl flex flex-col items-center mt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">İngilizcem'e Hoş Geldin</h1>
        <p className="text-blue-100 max-w-lg mb-8 text-lg">Kelime dağarcığını yönet, genişlet ve aralıklı tekrar sistemiyle kalıcı olarak hafızana kazı.</p>
        <button 
          onClick={handleQuickPractice}
          className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <Rocket className="w-6 h-6" />
          Hızlı Pratik Yap
        </button>
      </div>

      {/* Add Word Sections (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        
        {/* Single Add Form */}
        <div className="bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Tekli Ekle
          </h2>
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4 flex-grow">
            <div>
              <label htmlFor="english" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">İngilizce</label>
              <input
                type="text"
                id="english"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="Örn: Serendipity"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="turkish" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Türkçe Anlamı</label>
              <input
                type="text"
                id="turkish"
                value={turkish}
                onChange={(e) => setTurkish(e.target.value)}
                placeholder="Örn: Mutlu tesadüf"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                required
              />
            </div>
            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={!english.trim() || !turkish.trim()}
                className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Kelimeyi Ekle</span>
              </button>
            </div>
          </form>
        </div>

        {/* Bulk Add Form */}
        <div className="bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full transition-colors">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ListPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Toplu Ekle
          </h2>
          <div className="relative z-10 flex flex-col gap-4 flex-grow">
            <div className="flex-grow flex flex-col">
              <label htmlFor="bulk" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Otomatik Ayrıştırıcı ( - , : ; = veya TAB )
              </label>
              <textarea
                id="bulk"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Apple - Elma&#10;Car = Araba&#10;Book ; Kitap"
                className="w-full flex-grow min-h-[120px] px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-sm"
              ></textarea>
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={handleBulkSubmit}
                disabled={!bulkText.trim()}
                className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Toplu Ekle</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Statistics Section (Combined) */}
      <div className="space-y-4 px-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
          <span>Genel İstatistikler</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-300 dark:border-slate-700">Toplam Havuz: {allWords.length} kelime</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Biliyorum" 
            count={knownWords.length} 
            onClick={() => handleOpenModal('known', 'Biliyorum')}
            colorClass="text-emerald-700 dark:text-emerald-400"
            bgClass="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/10 border border-emerald-200 dark:border-none shadow-lg dark:shadow-none"
            icon={CheckCircle2}
          />
          <StatsCard 
            title="Emin Değilim" 
            count={unsureWords.length} 
            onClick={() => handleOpenModal('unsure', 'Emin Değilim')}
            colorClass="text-amber-700 dark:text-amber-400"
            bgClass="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 border border-amber-200 dark:border-none shadow-lg dark:shadow-none"
            icon={HelpCircle}
          />
          <StatsCard 
            title="Bilmiyorum" 
            count={unknownWords.length} 
            onClick={() => handleOpenModal('unknown', 'Bilmiyorum')}
            colorClass="text-rose-700 dark:text-rose-400"
            bgClass="bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-900/40 dark:to-rose-900/10 border border-rose-200 dark:border-none shadow-lg dark:shadow-none"
            icon={XCircle}
          />
        </div>
      </div>

      {/* Interactive Modal */}
      {modalState.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col transform transition-all border border-transparent dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {modalState.title}
                <span className="text-sm bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-1 px-3 rounded-full font-semibold">
                  {activeModalWords.length}
                </span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="overflow-y-auto p-2 sm:p-5 flex-grow no-scrollbar">
              {activeModalWords.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  Bu kategoride herhangi bir kelime bulunmuyor.
                </div>
              ) : (
                <ul className="space-y-3">
                  {activeModalWords.map((word) => (
                    <ModalWordRow 
                      key={word.id} 
                      word={word} 
                      modalStatus={modalState.status} 
                      handleUpdateStatus={handleUpdateStatus} 
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Home;
