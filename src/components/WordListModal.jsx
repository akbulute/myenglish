import { X } from 'lucide-react';

const WordListModal = ({ isOpen, onClose, title, words }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col transform transition-all border border-transparent dark:border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title} ({words.length})</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
          {words.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Bu kategoride henüz kelime yok.
            </div>
          ) : (
            <ul className="space-y-2">
              {words.map((word) => (
                <li key={word.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{word.english}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1 sm:mt-0">{word.turkish}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordListModal;
