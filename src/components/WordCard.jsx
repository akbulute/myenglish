import { useState, useEffect } from 'react';
import { CheckCircle2, HelpCircle, XCircle, Volume2 } from 'lucide-react';

const WordCard = ({ word, onEvaluate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when a new word comes in
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const playPronunciation = (e) => {
    e.stopPropagation(); // Kartın dönmesini engelle

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Biraz daha anlaşılır olması için hızı %15 düşürüyoruz
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
    }
  };

  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-200 dark:border-gray-800 p-8 text-center">
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">Çalışılacak kelime kalmadı!</h3>
        <p className="text-gray-400 dark:text-gray-500 mt-2">Yeni kelimeler ekleyerek pratiğe devam edebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Flip Card Container */}
      <div 
        className="relative w-full h-72 cursor-pointer group perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front of Card (English) */}
          <div className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center backface-hidden p-6 transition-colors">
            <span className="text-sm font-medium text-blue-500 dark:text-blue-400 tracking-wider uppercase mb-4 opacity-80">İngilizce</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 text-center break-words w-full px-4">{word.english}</h2>
            
            {/* Pronunciation Icon */}
            <button 
              onClick={playPronunciation}
              className="absolute top-6 right-6 p-3 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 hover:scale-110 transition-all shadow-sm border border-transparent dark:border-gray-600"
              title="Kelimeyi Seslendir"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            {!isFlipped && (
              <p className="absolute bottom-6 text-sm text-gray-400 dark:text-gray-500 animate-pulse">Çevirisi için karta tıklayın</p>
            )}
          </div>

          {/* Back of Card (Turkish) */}
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl shadow-lg border border-transparent dark:border-indigo-500/30 flex flex-col items-center justify-center backface-hidden rotate-y-180 p-6 text-white">
            <span className="text-sm font-medium text-blue-100 dark:text-blue-200 tracking-wider uppercase mb-4 opacity-80">Türkçe</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center break-words w-full">{word.turkish}</h2>
          </div>
          
        </div>
      </div>

      {/* Evaluation Buttons - Only visible after flip */}
      <div className={`mt-8 w-full transition-all duration-500 ease-in-out transform ${isFlipped ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Bu kelimeyi ne kadar iyi biliyorsun?</p>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onEvaluate('known')}
            className="flex flex-col items-center justify-center py-4 bg-emerald-50 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-gray-700 text-emerald-700 dark:text-emerald-400 rounded-2xl transition-all border border-emerald-200 dark:border-emerald-900/50 shadow-sm"
          >
            <CheckCircle2 className="w-8 h-8 mb-2" />
            <span className="font-semibold text-sm">Biliyorum</span>
          </button>
          
          <button 
            onClick={() => onEvaluate('unsure')}
            className="flex flex-col items-center justify-center py-4 bg-amber-50 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-gray-700 text-amber-700 dark:text-amber-400 rounded-2xl transition-all border border-amber-200 dark:border-amber-900/50 shadow-sm"
          >
            <HelpCircle className="w-8 h-8 mb-2" />
            <span className="font-semibold text-sm">Emin Değilim</span>
          </button>

          <button 
            onClick={() => onEvaluate('unknown')}
            className="flex flex-col items-center justify-center py-4 bg-rose-50 dark:bg-gray-800 hover:bg-rose-100 dark:hover:bg-gray-700 text-rose-700 dark:text-rose-400 rounded-2xl transition-all border border-rose-200 dark:border-rose-900/50 shadow-sm"
          >
            <XCircle className="w-8 h-8 mb-2" />
            <span className="font-semibold text-sm">Bilmiyorum</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
