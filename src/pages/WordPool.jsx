import { useState, useMemo } from 'react';
import { useWords } from '../context/WordContext';
import { Edit2, Trash2, Check, X, RotateCcw, Ghost, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const WordPool = () => {
  const { 
    words, 
    deletedWords,
    getMergedYdsWords, 
    editWord, 
    deleteWord, 
    deleteAllWords,
    restoreWord,
    permanentlyDeleteWord,
    restoreAllWords,
    emptyTrash
  } = useWords();
  
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'yds', or 'trash'

  // Inline edit state for Personal words
  const [editingId, setEditingId] = useState(null);
  const [editEng, setEditEng] = useState('');
  const [editTurk, setEditTurk] = useState('');

  const ydsWords = useMemo(() => getMergedYdsWords(), [getMergedYdsWords]);

  // --- Personal Words Handlers ---
  const handleEditStart = (word) => {
    setEditingId(word.id);
    setEditEng(word.english);
    setEditTurk(word.turkish);
  };

  const handleEditSave = () => {
    if (editEng.trim() && editTurk.trim()) {
      editWord(editingId, editEng, editTurk);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDeleteAllPersonal = () => {
    if (words.length === 0) return;
    if (window.confirm('Tüm kelimelerinizi (tüm havuzu) silmek istediğinize DİKKAT! Emin misiniz? (Kelimeler Çöp Kutusuna taşınır)')) {
      deleteAllWords();
    }
  };

  // --- Trash Handlers ---
  const handleEmptyTrash = () => {
    if (deletedWords.length === 0) return;
    if (window.confirm('Çöp kutusunu boşaltmak istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      emptyTrash();
    }
  };

  const handleRestoreAll = () => {
    if (deletedWords.length === 0) return;
    if (window.confirm('Çöp kutusundaki tüm kelimeleri geri yüklemek istediğinize emin misiniz?')) {
      restoreAllWords();
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'known': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-400 whitespace-nowrap">Biliyorum</span>;
      case 'unknown': return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-md text-xs font-medium dark:bg-rose-900/30 dark:text-rose-400 whitespace-nowrap">Bilmiyorum</span>;
      case 'unsure': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-medium dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap">Emin Değilim</span>;
      default: return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap">Yeni</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 pb-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Kelime Havuzu</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Tüm kelimelerini buradan yönetebilir veya hazır listeleri görebilirsin.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-start sm:justify-center border-b border-gray-300 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'personal'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-500'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          Benim Kelimelerim ({words.length})
        </button>
        <button
          onClick={() => setActiveTab('yds')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'yds'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 dark:border-blue-500'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          Hazır Kelime Seti ({ydsWords.length})
        </button>
        <button
          onClick={() => setActiveTab('trash')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'trash'
              ? 'border-rose-600 text-rose-700 dark:text-rose-400 dark:border-rose-500'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          Silinenler ({deletedWords.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-300 dark:border-gray-800 overflow-hidden">
        
        {/* Personal Words Tab */}
        {activeTab === 'personal' && (
          <div>
            {words.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 flex items-center justify-between border-b border-blue-200 dark:border-blue-800/30 overflow-x-auto">
                <span className="text-blue-800 dark:text-blue-300 text-sm font-medium whitespace-nowrap">Toplu İşlemler</span>
                <button 
                  onClick={handleDeleteAllPersonal}
                  className="flex items-center gap-1 text-sm bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Tümünü Sil
                </button>
              </div>
            )}

            {words.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <Ghost className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4 animate-bounce" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Burada henüz bir şey yok</h3>
                <p className="text-gray-500 dark:text-gray-500 text-center max-w-sm mb-6">Havuzun şu an boş görünüyor. Hemen birkaç kelime ekleyerek kelime dağarcığını geliştirmeye başla!</p>
                <Link 
                  to="/" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Kelime Ekle
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-800">
                      <th className="p-4 font-semibold w-1/3">İngilizce</th>
                      <th className="p-4 font-semibold w-1/3">Türkçe</th>
                      <th className="p-4 font-semibold text-center">Durum</th>
                      <th className="p-4 font-semibold text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {words.map(word => (
                      <tr key={word.id} className="border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/30">
                        {editingId === word.id ? (
                          <>
                            <td className="p-3">
                              <input 
                                type="text" 
                                value={editEng} 
                                onChange={(e) => setEditEng(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text" 
                                value={editTurk} 
                                onChange={(e) => setEditTurk(e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                              />
                            </td>
                            <td className="p-3 text-center">{getStatusBadge(word.status)}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={handleEditSave} className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg transition-colors shadow-sm" title="Kaydet">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={handleEditCancel} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm" title="İptal">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{word.english}</td>
                            <td className="p-4 text-gray-700 dark:text-gray-300">{word.turkish}</td>
                            <td className="p-4 text-center">{getStatusBadge(word.status)}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEditStart(word)}
                                  className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent dark:border-gray-700 shadow-sm" 
                                  title="Düzenle"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteWord(word.id)}
                                  className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent dark:border-gray-700 shadow-sm" 
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* YDS Words Tab (Read Only) */}
        {activeTab === 'yds' && (
          <div className="overflow-x-auto no-scrollbar w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 font-semibold w-2/5">İngilizce</th>
                  <th className="p-4 font-semibold w-2/5">Türkçe</th>
                  <th className="p-4 font-semibold text-center w-1/5">İlerleme Durumu</th>
                </tr>
              </thead>
              <tbody>
                {ydsWords.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">Gösterilecek kelime bulunamadı.</td>
                  </tr>
                ) : (
                  ydsWords.map(word => (
                    <tr key={word.id} className="border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/30">
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{word.english}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{word.turkish}</td>
                      <td className="p-4 text-center">{getStatusBadge(word.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Trash Tab */}
        {activeTab === 'trash' && (
          <div>
            {deletedWords.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-900/20 px-4 py-3 flex items-center justify-between border-b border-rose-200 dark:border-rose-800/30 overflow-x-auto">
                <span className="text-rose-800 dark:text-rose-300 text-sm font-medium whitespace-nowrap">Çöp Kutusu</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleRestoreAll}
                    className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Tümünü Geri Yükle
                  </button>
                  <button 
                    onClick={handleEmptyTrash}
                    className="flex items-center gap-1 text-sm bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4" />
                    Çöp Kutusunu Boşalt
                  </button>
                </div>
              </div>
            )}

            {deletedWords.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 px-4">
               <FileQuestion className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
               <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Çöp kutusu bomboş</h3>
               <p className="text-gray-500 dark:text-gray-500 text-center max-w-sm">Burada silinmiş kelimeler saklanır. Şu an herhangi bir veri yok.</p>
             </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar w-full">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-800">
                      <th className="p-4 font-semibold w-1/3">İngilizce</th>
                      <th className="p-4 font-semibold w-1/3">Türkçe</th>
                      <th className="p-4 font-semibold text-center">Eski Durum</th>
                      <th className="p-4 font-semibold text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedWords.map(word => (
                      <tr key={word.id} className="border-b border-gray-100 dark:border-gray-800/50 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/30">
                        <td className="p-4 font-medium text-gray-500 dark:text-gray-400 line-through">{word.english}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-500 line-through">{word.turkish}</td>
                        <td className="p-4 text-center opacity-75">{getStatusBadge(word.status)}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => restoreWord(word.id)}
                              className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent dark:border-gray-700 shadow-sm" 
                              title="Geri Yükle"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if(window.confirm('Bu kelimeyi kalıcı olarak silmek istediğinize emin misiniz?')) {
                                  permanentlyDeleteWord(word.id);
                                }
                              }}
                              className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent dark:border-gray-700 shadow-sm" 
                              title="Kalıcı Olarak Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default WordPool;
