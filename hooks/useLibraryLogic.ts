
import { useState, useMemo } from 'react';
import { Lesson } from '../types';

export const useLibraryLogic = (lessons: Lesson[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const roadmapVocab = useMemo(() => {
    const all = lessons.flatMap(l => l.vocabularies || []);
    const unique = Array.from(new Map(all.map(item => [item.word, item])).values());
    const filtered = searchQuery 
      ? unique.filter(v => v.word.toLowerCase().includes(searchQuery.toLowerCase()) || v.translation.toLowerCase().includes(searchQuery.toLowerCase()))
      : unique;
    return filtered.sort((a, b) => a.word.localeCompare(b.word));
  }, [lessons, searchQuery]);

  const grammarPoints = useMemo(() => {
    const all = lessons.flatMap(l => l.grammar_points || []);
    return searchQuery
      ? all.filter(gp => gp.title.toLowerCase().includes(searchQuery.toLowerCase()) || gp.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : all;
  }, [lessons, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    roadmapVocab,
    grammarPoints
  };
};
