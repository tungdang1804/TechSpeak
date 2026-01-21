
import { Industry } from "../../types";

/**
 * Industry Registry
 * Nguồn dữ liệu duy nhất cho các ngành nghề trong toàn hệ thống.
 */
export const INDUSTRIES: Industry[] = [
  { 
    id: 'nails', 
    name: 'Nail & Spa', 
    emoji: '💅', 
    description: 'Chuyên viên Nail, Massage, Skincare',
    status: 'available' 
  },
  { 
    id: 'bartender', 
    name: 'Bartender', 
    emoji: '🍷', 
    description: 'Pha chế, Phục vụ nhà hàng/bar',
    status: 'coming_soon' 
  },
  { 
    id: 'flooring', 
    name: 'Xây dựng', 
    emoji: '🔨', 
    description: 'Lót sàn, Thợ mộc, Điện nước',
    status: 'coming_soon' 
  },
  { 
    id: 'mechanic', 
    name: 'Cơ khí', 
    emoji: '🔧', 
    description: 'Sửa chữa ô tô, Vận hành máy',
    status: 'coming_soon' 
  }
];

export const getAvailableIndustries = () => INDUSTRIES.filter(i => i.status === 'available');

export const getIndustryInfo = (id: string): Industry => 
  INDUSTRIES.find(i => i.id === id) || INDUSTRIES[0];
