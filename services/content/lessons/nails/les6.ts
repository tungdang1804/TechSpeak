
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les6",
  "order": 6,
  "title": "Handling Complaints",
  "description": "Giải quyết khiếu nại về màu sắc và xin lỗi chuyên nghiệp.",
  "thumbnail": "https://images.unsplash.com/photo-1590008828475-577319bbc832?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách thấy màu sơn thực tế đậm hơn trong bảng màu.",
    "goal": "Xoa dịu khách và đề xuất giải pháp sửa lại.",
    "characters": [{ "name": "Tiên", "role": "Quản lý" }]
  },
  "steps": [
    {
      "id": "l6_s1",
      "title": "Xin lỗi và Lắng nghe",
      "purpose": "Xây dựng lại lòng tin",
      "lines": [
        { "id": "l6_l1", "speaker": "Tech", "text": "I'm sorry it's not what you expected. We can change it right now.", "translation": "Em rất tiếc vì nó không như chị mong đợi. Chúng em có thể sửa lại ngay bây giờ." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Apologize", "translation": "Xin lỗi", "ipa": "/əˈpɒlədʒaɪz/" },
    { "id": "v2", "word": "Expectation", "translation": "Sự mong đợi", "ipa": "/ˌekspekˈteɪʃn/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Formal Apology", "description": "Cấu trúc xin lỗi chuyên nghiệp.", "examples": [{ "english": "We apologize for the inconvenience.", "vietnamese": "Chúng tôi xin lỗi vì sự bất tiện này." }] }
  ],
  "roleplay": {
    "user_instructions": "Xin lỗi khách và đề nghị sơn lại một tông màu nhạt hơn miễn phí.",
    "ai_instructions": "You are an angry customer who is late for a party and the nails look too dark."
  }
};
