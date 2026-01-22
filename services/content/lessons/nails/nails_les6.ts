
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les6",
  "order": 6,
  "title": "Handling Complaints",
  "description": "Giải quyết khiếu nại về màu sắc và xin lỗi chuyên nghiệp.",
  "thumbnail": "https://images.unsplash.com/photo-1590008828475-577319bbc832?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách thấy màu sơn đậm hơn thực tế.",
    "goal": "Xoa dịu khách.",
    "characters": [{ "name": "Tiên", "role": "Quản lý" }]
  },
  "steps": [
    {
      "id": "l6_s1",
      "title": "Xin lỗi và Lắng nghe",
      "purpose": "Xây dựng lại lòng tin",
      "lines": [
        { "id": "l6_l1", "speaker": "Tech", "text": "I'm sorry it's not what you expected. We can change it.", "translation": "Em xin lỗi vì nó không như chị đợi. Tụi em có thể đổi ạ." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Apologize", "translation": "Xin lỗi", "ipa": "/əˈpɒlədʒaɪz/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Apology", "description": "Xin lỗi chuyên nghiệp.", "examples": [{ "english": "Sorry for the wait.", "vietnamese": "Xin lỗi vì phải đợi." }] }
  ],
  "roleplay": {
    "user_instructions": "Xin lỗi và đề nghị giải pháp.",
    "ai_instructions": "You are disappointed with the color."
  }
};
