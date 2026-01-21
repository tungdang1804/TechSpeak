
import { SPECIALIZED_VOCAB, SpecialVocabGroup, SpecialVocabItem } from '../../data/specialVocab';

/**
 * Vocabulary Intelligence Engine
 * Chịu trách nhiệm điều phối toàn bộ từ vựng trong hệ thống.
 */

export interface FilteredVocabResult {
  specialized: SpecialVocabGroup[];
  general: SpecialVocabGroup[];
}

/**
 * Phân tách từ vựng theo ngành nghề
 * @param currentIndustryId ID ngành nghề hiện tại (nails, bartender...)
 * @returns Object chứa danh sách từ vựng chuyên sâu và từ vựng chung
 */
export const getFilteredVocab = (currentIndustryId: string): FilteredVocabResult => {
  const specialized: SpecialVocabGroup[] = [];
  const general: SpecialVocabGroup[] = [];

  SPECIALIZED_VOCAB.forEach(group => {
    if (group.industry === currentIndustryId) {
      specialized.push(group);
    } else if (group.industry === 'common') {
      // Nhóm dùng chung luôn nằm ở kho General nhưng ưu tiên lên đầu
      general.unshift(group);
    } else {
      // Từ vựng các ngành khác được đẩy vào kho General để tra cứu chéo
      general.push(group);
    }
  });

  return { specialized, general };
};

/**
 * Hợp nhất và chuẩn hóa từ vựng A-Z
 * Kết hợp từ kho đặc thù và từ vựng thu thập được trong quá trình học bài.
 */
export const getAllVocabItems = (industryId: string, lessonVocab: any[]): any[] => {
  // 1. Thu thập từ kho đặc thù
  const specializedItems = SPECIALIZED_VOCAB.flatMap(g => 
    g.subGroups.flatMap(sg => sg.items.map(item => ({ ...item, source: 'dictionary' })))
  );
  
  // 2. Thu thập từ bài học
  const mappedLessonVocab = lessonVocab.map(v => ({
    id: v.id,
    text: v.word,
    sub: v.translation,
    ipa: v.ipa,
    source: 'lesson'
  }));

  const combined = [...specializedItems, ...mappedLessonVocab];
  
  // 3. Loại bỏ trùng lặp và sắp xếp
  return Array.from(new Map(combined.map(item => [item.text.toLowerCase(), item])).values())
    .sort((a, b) => a.text.localeCompare(b.text));
};
