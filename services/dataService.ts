
import { Lesson } from '../types';
import { getIndustryInfo } from './content/industry';

/**
 * Data Service
 * Quản lý việc tải dữ liệu bài học động từ hệ thống file JSON.
 * Cấu trúc: lessons/{industry_id}/lesson{n}.json
 */

export const fetchLessonsByIndustry = async (industryId: string = 'nails'): Promise<Lesson[]> => {
  try {
    const industry = getIndustryInfo(industryId);
    if (industry.status === 'coming_soon' && industryId !== 'nails') return [];

    // 1. Tải manifest tổng
    const manifestResponse = await fetch('./lessons_manifest.json');
    if (!manifestResponse.ok) throw new Error('Could not load lessons_manifest.json');
    
    const manifestData = await manifestResponse.json();
    const industryData = manifestData.industries.find((i: any) => i.id === industryId);
    
    if (!industryData || !industryData.lessons || industryData.lessons.length === 0) {
      console.warn(`No lessons found for industry: ${industryId}`);
      return [];
    }

    // 2. Tải song song các bài học theo đường dẫn trong manifest
    const lessonPromises = industryData.lessons.map(async (path: string) => {
      // Đảm bảo đường dẫn chuẩn xác
      const cleanPath = path.startsWith('./') ? path : `./${path}`;
      try {
        const response = await fetch(cleanPath);
        if (!response.ok) return null;
        return await response.json();
      } catch (err) {
        console.error(`Failed to fetch lesson at ${cleanPath}:`, err);
        return null;
      }
    });

    const results = await Promise.all(lessonPromises);
    
    // 3. Lọc bài học hợp lệ và sắp xếp
    return results
      .filter((l): l is Lesson => l !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Data Service Error:', error);
    return [];
  }
};
