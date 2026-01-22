
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les8",
  "order": 8,
  "title": "Nail Repair & Warranty",
  "description": "Xử lý bảo hành cho móng bị mẻ sau vài ngày.",
  "thumbnail": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Móng bị mẻ sau 2 ngày.",
    "goal": "Thực hiện bảo hành.",
    "characters": [{ "name": "Tiên", "role": "Lễ tân" }]
  },
  "steps": [
    {
      "id": "l8_s1",
      "title": "Kiểm tra chính sách",
      "purpose": "Xác nhận quyền lợi",
      "lines": [
        { "id": "l8_l1", "speaker": "Tech", "text": "We have a 7-day warranty. I'll fix it for free.", "translation": "Bên em bảo hành 7 ngày. Em sửa miễn phí ạ." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Warranty", "translation": "Bảo hành", "ipa": "/ˈwɔːrənti/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Imperative", "description": "Câu mệnh lệnh.", "examples": [{ "english": "Don't worry.", "vietnamese": "Đừng lo." }] }
  ],
  "roleplay": {
    "user_instructions": "Trấn an khách.",
    "ai_instructions": "You are disappointed the nail chipped."
  }
};
