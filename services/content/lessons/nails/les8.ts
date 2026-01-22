
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les8",
  "order": 8,
  "title": "Nail Repair & Warranty",
  "description": "Xử lý bảo hành cho móng bị mẻ sau vài ngày.",
  "thumbnail": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách quay lại vì một móng bị mẻ lớp gel.",
    "goal": "Xác nhận thời gian làm và thực hiện bảo hành miễn phí.",
    "characters": [{ "name": "Tiên", "role": "Lễ tân" }]
  },
  "steps": [
    {
      "id": "l8_s1",
      "title": "Kiểm tra chính sách",
      "purpose": "Xác nhận quyền lợi khách hàng",
      "lines": [
        { "id": "l8_l1", "speaker": "Tech", "text": "Don't worry, we have a 7-day warranty for gel nails. I'll fix it for free.", "translation": "Chị đừng lo, bên em có bảo hành 7 ngày cho móng gel. Em sẽ sửa lại miễn phí ạ." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Warranty", "translation": "Bảo hành", "ipa": "/ˈwɔːrənti/" },
    { "id": "v2", "word": "Chipped", "translation": "Bị mẻ", "ipa": "/tʃɪpt/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Negative Imperative", "description": "Câu mệnh lệnh phủ định.", "examples": [{ "english": "Don't worry about the cost.", "vietnamese": "Đừng lo lắng về chi phí." }] }
  ],
  "roleplay": {
    "user_instructions": "Trấn an khách và sắp xếp thợ sửa lại móng bị mẻ ngay lập tức.",
    "ai_instructions": "You are a customer who is disappointed because the nail chipped after only 2 days."
  }
};
