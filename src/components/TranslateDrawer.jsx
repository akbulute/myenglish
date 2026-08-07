import { useState, useEffect } from 'react';
import { Languages, X, ArrowRightLeft, Loader2, ChevronLeft } from 'lucide-react';

const TranslateDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [langPair, setLangPair] = useState('en|tr'); // 'en|tr' or 'tr|en'
  const [isLoading, setIsLoading] = useState(false);

  // Close drawer on outside click logic could be added, but a close button is enough for now.

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${langPair}`);
      const data = await response.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        setOutputText(data.responseData.translatedText);
      } else {
        setOutputText('Çeviri hatası.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('Bağlantı hatası.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optional: Debounce automatic translation
    const timeoutId = setTimeout(() => {
      if (inputText.trim()) {
        handleTranslate();
      } else {
        setOutputText('');
      }
    }, 800);
    return () => clearTimeout(timeoutId);
  }, [inputText, langPair]);

  const toggleLang = () => {
    setLangPair(prev => prev === 'en|tr' ? 'tr|en' : 'en|tr');
    // Swap texts
    setInputText(outputText);
    setOutputText(inputText);
  };

  const isEnToTr = langPair === 'en|tr';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-l-xl shadow-lg transition-transform z-40 flex items-center justify-center ${isOpen ? 'translate-x-full' : 'translate-x-0'}`}
        title="Çeviri"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <Languages className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
            <Languages className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Hızlı Çeviri</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-white/50 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col space-y-4 overflow-y-auto">
          {/* Language Switcher */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className={`flex-1 text-center font-medium ${isEnToTr ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
              İngilizce
            </span>
            <button 
              onClick={toggleLang}
              className="p-2 bg-white dark:bg-gray-700 shadow-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <span className={`flex-1 text-center font-medium ${!isEnToTr ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
              Türkçe
            </span>
          </div>

          {/* Input Textarea */}
          <div className="flex flex-col flex-1 max-h-[45%]">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
              {isEnToTr ? 'İngilizce Metin' : 'Türkçe Metin'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Çevirmek istediğiniz metni yazın..."
              className="w-full flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none resize-none transition-shadow text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Output Area */}
          <div className="flex flex-col flex-1 max-h-[45%] relative">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
              {isEnToTr ? 'Türkçe Çeviri' : 'İngilizce Çeviri'}
            </label>
            <div className="w-full flex-1 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-y-auto text-gray-900 dark:text-gray-100 relative min-h-[100px]">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : null}
              <p className="whitespace-pre-wrap">{outputText || <span className="text-gray-400 dark:text-gray-500 italic">Çeviri burada görünecek...</span>}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TranslateDrawer;
