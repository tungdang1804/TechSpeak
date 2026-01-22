
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "bartender_les1",
  "order": 1,
  "title": "Intro to Mixology",
  "description": "Làm quen với dụng cụ cơ bản.",
  "thumbnail": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Học cách dùng bình lắc.",
    "goal": "Nắm tên gọi dụng cụ.",
    "characters": [{ "name": "Alex", "role": "Quản lý" }]
  },
  "steps": [
    {
      "id": "b1_s1",
      "title": "Dụng cụ",
      "purpose": "Giao tiếp",
      "lines": [
        { "id": "b1_l1", "speaker": "Tech", "text": "Pass me the shaker, please.", "translation": "Đưa tôi bình lắc với." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Shaker", "translation": "Bình lắc", "ipa": "/ˈʃeɪkər/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Requests", "description": "Yêu cầu.", "examples": [{ "english": "Pass me the ice.", "vietnamese": "Đưa tôi đá." }] }
  ],
  "roleplay": {
    "user_instructions": "Chuẩn bị dụng cụ.",
    "ai_instructions": "You are a bar manager."
  }
};
