import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import ydsData from '../data/yds-words.json';

const WordContext = createContext();

export const useWords = () => {
  return useContext(WordContext);
};

export const WordProvider = ({ children }) => {
  // 1. Personal Words
  const [words, setWords] = useState(() => {
    const savedWords = localStorage.getItem('ingilizcem_words');
    return savedWords ? JSON.parse(savedWords) : [];
  });

  // 2. YDS Words Progress (Key: word ID, Value: status)
  const [ydsProgress, setYdsProgress] = useState(() => {
    const savedProgress = localStorage.getItem('ingilizcem_ydsProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  // 3. Deleted Words (Trash)
  const [deletedWords, setDeletedWords] = useState(() => {
    const savedDeleted = localStorage.getItem('ingilizcem_deletedWords');
    return savedDeleted ? JSON.parse(savedDeleted) : [];
  });

  useEffect(() => {
    localStorage.setItem('ingilizcem_words', JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem('ingilizcem_ydsProgress', JSON.stringify(ydsProgress));
  }, [ydsProgress]);

  useEffect(() => {
    localStorage.setItem('ingilizcem_deletedWords', JSON.stringify(deletedWords));
  }, [deletedWords]);

  // Combine static YDS data with user progress
  const getMergedYdsWords = useCallback(() => {
    return ydsData.map(word => ({
      ...word,
      status: ydsProgress[word.id] || word.status
    }));
  }, [ydsProgress]);

  const addWord = useCallback((english, turkish) => {
    const newWord = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      english: english.trim(),
      turkish: turkish.trim(),
      status: 'new',
    };
    setWords(prev => [...prev, newWord]);
  }, []);

  const bulkAddWords = useCallback((text) => {
    const lines = text.split('\n');
    let newWordsAddedCount = 0;
    
    setWords(prev => {
      const existingEnglishWords = new Set(prev.map(w => w.english.toLowerCase()));
      const newWords = [];

      lines.forEach((line) => {
        const match = line.match(/^([^-,:;=\t]+)[-,:;=\t]+(.+)$/);
        
        if (match) {
          const eng = match[1].trim();
          const turk = match[2].trim();
          
          if (eng && turk && !existingEnglishWords.has(eng.toLowerCase())) {
            newWords.push({
              id: Date.now().toString() + Math.random().toString(36).substring(7),
              english: eng,
              turkish: turk,
              status: 'new',
            });
            existingEnglishWords.add(eng.toLowerCase());
          }
        }
      });

      newWordsAddedCount = newWords.length;
      return newWords.length > 0 ? [...prev, ...newWords] : prev;
    });

    return newWordsAddedCount;
  }, []);

  const editWord = useCallback((id, newEnglish, newTurkish) => {
    setWords(prev => prev.map(word => 
      word.id === id 
        ? { ...word, english: newEnglish.trim(), turkish: newTurkish.trim() } 
        : word
    ));
  }, []);

  const deleteWord = useCallback((id) => {
    setWords(prev => {
      const wordToDelete = prev.find(w => w.id === id);
      if (wordToDelete) {
        setDeletedWords(prevDeleted => [...prevDeleted, wordToDelete]);
        return prev.filter(word => word.id !== id);
      }
      return prev;
    });
  }, []);

  const deleteAllWords = useCallback(() => {
    setWords(prev => {
      if (prev.length > 0) {
        setDeletedWords(prevDeleted => [...prevDeleted, ...prev]);
        return [];
      }
      return prev;
    });
  }, []);

  const restoreWord = useCallback((id) => {
    setDeletedWords(prev => {
      const wordToRestore = prev.find(w => w.id === id);
      if (wordToRestore) {
        setWords(prevWords => [...prevWords, wordToRestore]);
        return prev.filter(w => w.id !== id);
      }
      return prev;
    });
  }, []);

  const permanentlyDeleteWord = useCallback((id) => {
    setDeletedWords(prev => prev.filter(w => w.id !== id));
  }, []);

  const restoreAllWords = useCallback(() => {
    setDeletedWords(prev => {
      if (prev.length > 0) {
        setWords(prevWords => [...prevWords, ...prev]);
        return [];
      }
      return prev;
    });
  }, []);

  const emptyTrash = useCallback(() => {
    setDeletedWords([]);
  }, []);

  const updateWordStatus = useCallback((id, status) => {
    if (id.startsWith('yds-')) {
      setYdsProgress(prev => ({
        ...prev,
        [id]: status
      }));
    } else {
      setWords(prev => prev.map(word => 
        word.id === id ? { ...word, status } : word
      ));
    }
  }, []);

  // Memoize the entire context value to prevent unneeded re-renders in consumers
  const value = useMemo(() => ({
    words, 
    deletedWords,
    getMergedYdsWords,
    addWord, 
    bulkAddWords, 
    updateWordStatus,
    editWord,
    deleteWord,
    deleteAllWords,
    restoreWord,
    permanentlyDeleteWord,
    restoreAllWords,
    emptyTrash
  }), [
    words, 
    deletedWords,
    getMergedYdsWords,
    addWord, 
    bulkAddWords, 
    updateWordStatus,
    editWord,
    deleteWord,
    deleteAllWords,
    restoreWord,
    permanentlyDeleteWord,
    restoreAllWords,
    emptyTrash
  ]);

  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  );
};
