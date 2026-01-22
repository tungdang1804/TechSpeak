
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les3",
  "order": 3,
  "title": "Cuticle Care & Safety",
  "description": "Vệ sinh da và xử lý móng khóe an toàn.",
  "thumbnail": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Kỹ thuật viên đang chuẩn bị làm sạch da cho khách.",
    "goal": "Hướng dẫn khách các bước vệ sinh và đảm bảo an toàn.",
    "characters": [{ "name": "Hân", "role": "Thợ nail" }]
  },
  "steps": [
    {
      "id": "l3_s1",
      "title": "Kiểm tra tình trạng móng",
      "purpose": "Xác định vùng da cần xử lý",
      "lines": [
        { "id": "l3_l1", "speaker": "Tech", "text": "I will clean your cuticles now. Does it feel tender here?", "translation": "Em sẽ làm sạch da cho chị bây giờ. Chỗ này chị có thấy đau không?" }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Cuticle", "translation": "Da móng", "ipa": "/ˈkjuːtɪkl/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Future with Will", "description": "Nói về hành động sắp làm.", "examples": [{ "english": "I will soak your hands.", "vietnamese": "Em sẽ ngâm tay chị." }] }
  ],
  "roleplay": {
    "user_instructions": "Thông báo việc làm sạch da.",
    "ai_instructions": "You are a customer with sensitive skin."
  }
};
