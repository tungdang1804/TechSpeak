
import { Lesson } from '../types';

export const fetchLessonsFromManifest = async (): Promise<Lesson[]> => {
  try {
    // Sử dụng đường dẫn tương đối ./ để tránh bị chặn bởi chính sách CORS của AI Studio
    const manifestResponse = await fetch('./lessons_manifest.json');
    if (!manifestResponse.ok) throw new Error('Failed to load lessons manifest');
    
    const manifestData = await manifestResponse.json();
    const lessonPaths: string[] = manifestData.lessons;

    // Fetch tất cả các file JSON bài học
    const lessonPromises = lessonPaths.map(async (path) => {
      // Đảm bảo path là tương đối
      const cleanPath = path.startsWith('/') ? `.${path}` : `./${path}`;
      const response = await fetch(cleanPath);
      if (!response.ok) {
        console.error(`Failed to load lesson at ${cleanPath}`);
        return null;
      }
      return response.json();
    });

    const lessonsResults = await Promise.all(lessonPromises);
    
    return lessonsResults
      .filter((lesson): lesson is Lesson => lesson !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Data Service Error:', error);
    return [];
  }
};
