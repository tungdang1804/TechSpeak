
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les5",
  "order": 5,
  "title": "Nail Art & Finishing",
  "description": "Nghệ thuật sơn gel và hơ đèn đúng cách.",
  "thumbnail": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Công đoạn sơn màu.",
    "goal": "Hướng dẫn khách hơ đèn.",
    "characters": [{ "name": "Tiên", "role": "Thợ nail" }]
  },
  "steps": [
    {
      "id": "l5_s1",
      "title": "Hơ đèn gel",
      "purpose": "Đảm bảo gel khô",
      "lines": [
        { "id": "l5_l1", "speaker": "Tech", "text": "Please put your hand in the lamp for 60 seconds.", "translation": "Vui lòng đặt tay chị vào đèn trong 60 giây." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Coat", "translation": "Lớp sơn", "ipa": "/kəʊt/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Duration", "description": "Nói về khoảng thời gian.", "examples": [{ "english": "Wait for one minute.", "vietnamese": "Đợi trong một phút." }] }
  ],
  "roleplay": {
    "user_instructions": "Hướng dẫn hơ đèn.",
    "ai_instructions": "You are a customer who is in a hurry."
  }
};
