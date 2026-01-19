
import { Lesson } from '../types';

export const fetchLessonsFromManifest = async (): Promise<Lesson[]> => {
  try {
    // 1. Fetch manifest file
    const manifestResponse = await fetch('/lessons_manifest.json');
    if (!manifestResponse.ok) throw new Error('Failed to load lessons manifest');
    
    const manifestData = await manifestResponse.json();
    const lessonPaths: string[] = manifestData.lessons;

    // 2. Fetch all lesson JSONs in parallel
    const lessonPromises = lessonPaths.map(async (path) => {
      const response = await fetch(`/${path}`);
      if (!response.ok) {
        console.error(`Failed to load lesson at ${path}`);
        return null;
      }
      return response.json();
    });

    const lessonsResults = await Promise.all(lessonPromises);
    
    // 3. Filter out any failed loads and sort by order
    return lessonsResults
      .filter((lesson): lesson is Lesson => lesson !== null)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Data Service Error:', error);
    return [];
  }
};
