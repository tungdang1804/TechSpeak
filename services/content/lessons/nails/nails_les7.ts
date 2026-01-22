
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les7",
  "order": 7,
  "title": "Checkout & Reviews",
  "description": "Thanh toán, xin Tip và nhờ khách đánh giá 5 sao.",
  "thumbnail": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hài lòng và ra quầy.",
    "goal": "Xin đánh giá.",
    "characters": [{ "name": "Tiên", "role": "Thu ngân" }]
  },
  "steps": [
    {
      "id": "l7_s1",
      "title": "Xin Review",
      "purpose": "Phát triển thương hiệu",
      "lines": [
        { "id": "l7_l1", "speaker": "Tech", "text": "If you are happy, please leave us a 5-star review.", "translation": "Nếu chị hài lòng, cho tụi em xin 5 sao nhé." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Total", "translation": "Tổng cộng", "ipa": "/ˈtəʊtl/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Conditional If", "description": "Câu điều kiện.", "examples": [{ "english": "If you like it, tell us.", "vietnamese": "Nếu chị thích, hãy nói với tụi em." }] }
  ],
  "roleplay": {
    "user_instructions": "Thanh toán và xin review.",
    "ai_instructions": "You are happy with the service."
  }
};
