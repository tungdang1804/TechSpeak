
/**
 * Classroom Asset Registry
 * Quản lý danh mục vật phẩm 2D cho phòng học ảo.
 */

export interface RoomItem {
  id: string;
  type: 'furniture' | 'tool' | 'decor' | 'interaction_node';
  name: string;
  image: string;
  position: { x: number; y: number; z: number }; // z dùng để quản lý layer
  industry: string[];
  action?: string; // Ví dụ: 'open_lessons', 'open_library', 'start_ai_tutor'
}

export const ROOM_ASSETS: Record<string, RoomItem> = {
  // --- NAILS INDUSTRY ---
  nail_desk_standard: {
    id: 'nail_desk_standard',
    type: 'furniture',
    name: 'Bàn Nail Cơ Bản',
    image: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1737452812/furniture/nail_desk_01.png',
    position: { x: 50, y: 30, z: 2 },
    industry: ['nails'],
    action: 'open_lessons'
  },
  nail_polish_rack: {
    id: 'nail_polish_rack',
    type: 'decor',
    name: 'Kệ Sơn Tường',
    image: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1737452812/furniture/rack_01.png',
    position: { x: 80, y: 60, z: 1 },
    industry: ['nails'],
    action: 'open_library'
  },
  
  // --- COMMON ---
  ai_tutor_robot: {
    id: 'ai_tutor_robot',
    type: 'interaction_node',
    name: 'AI Tutor Bot',
    image: 'https://res.cloudinary.com/dzwvawf87/image/upload/v1737452812/interactive/bot_01.png',
    position: { x: 20, y: 40, z: 5 },
    industry: ['nails', 'bartender', 'mechanic'],
    action: 'start_ai_chat'
  }
};

export const getIndustryAssets = (industryId: string) => 
  Object.values(ROOM_ASSETS).filter(item => item.industry.includes(industryId));
