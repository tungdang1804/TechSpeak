
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les7",
  "order": 7,
  "title": "Checkout & Reviews",
  "description": "Thanh toán, xin Tip và nhờ khách đánh giá 5 sao.",
  "thumbnail": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hài lòng và đang ra quầy thu ngân.",
    "goal": "Hoàn tất thủ tục và xin đánh giá tích cực.",
    "characters": [{ "name": "Tiên", "role": "Thu ngân" }]
  },
  "steps": [
    {
      "id": "l7_s1",
      "title": "Xin Review",
      "purpose": "Phát triển thương hiệu",
      "lines": [
        { "id": "l7_l1", "speaker": "Tech", "text": "If you are happy with the service, please leave us a 5-star review on Google.", "translation": "Nếu chị hài lòng với dịch vụ, vui lòng cho tụi em đánh giá 5 sao trên Google nhé." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Total", "translation": "Tổng cộng", "ipa": "/ˈtəʊtl/" },
    { "id": "v2", "word": "Feedback", "translation": "Phản hồi", "ipa": "/ˈfiːdbæk/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Conditional If", "description": "Câu điều kiện loại 1.", "examples": [{ "english": "If you like it, tell your friends!", "vietnamese": "Nếu chị thích, hãy nói với bạn bè nhé!" }] }
  ],
  "roleplay": {
    "user_instructions": "Thanh toán cho khách và khéo léo nhờ khách để lại review tốt.",
    "ai_instructions": "You are a very happy customer who wants to leave a generous tip."
  }
};
