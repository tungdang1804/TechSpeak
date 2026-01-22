
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les4",
  "order": 4,
  "title": "Nail Extension & Shaping",
  "description": "Kỹ thuật gắn móng tip và tạo dáng móng (Almond, Square).",
  "thumbnail": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách muốn thay đổi dáng móng.",
    "goal": "Tư vấn dáng móng phù hợp.",
    "characters": [{ "name": "Hân", "role": "Thợ nail" }]
  },
  "steps": [
    {
      "id": "l4_s1",
      "title": "Chọn dáng móng",
      "purpose": "Xác định form móng",
      "lines": [
        { "id": "l4_l1", "speaker": "Tech", "text": "Which shape do you prefer: Almond or Square?", "translation": "Chị thích dáng móng nào hơn: Hạnh nhân hay Vuông?" }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Almond", "translation": "Dáng hạnh nhân", "ipa": "/ˈɑːmənd/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Preference", "description": "Hỏi về sở thích.", "examples": [{ "english": "Do you prefer long or short?", "vietnamese": "Chị thích dài hay ngắn?" }] }
  ],
  "roleplay": {
    "user_instructions": "Tư vấn dáng móng.",
    "ai_instructions": "You want to try something new."
  }
};
