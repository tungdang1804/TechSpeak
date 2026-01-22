
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "bartender_les1",
  "order": 1,
  "title": "Intro to Mixology",
  "description": "Làm quen với dụng cụ và các loại đồ uống cơ bản.",
  "thumbnail": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Nhân viên mới bắt đầu học cách sử dụng bình lắc (shaker).",
    "goal": "Nắm vững tên gọi dụng cụ và cách pha chế cơ bản.",
    "characters": [{ "name": "Alex", "role": "Quản lý" }]
  },
  "steps": [
    {
      "id": "b1_s1",
      "title": "Nhận diện dụng cụ",
      "purpose": "Giao tiếp trong quầy bar",
      "lines": [
        { "id": "b1_l1", "speaker": "Tech", "text": "Pass me the shaker and the jigger, please.", "translation": "Đưa cho tôi bình lắc và ly đong với." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Shaker", "translation": "Bình lắc", "ipa": "/ˈʃeɪkər/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Direct Requests", "description": "Yêu cầu trực tiếp.", "examples": [{ "english": "Pass me the ice.", "vietnamese": "Đưa tôi đá với." }] }
  ],
  "roleplay": {
    "user_instructions": "Làm theo chỉ dẫn của quản lý để chuẩn bị dụng cụ pha Martini.",
    "ai_instructions": "You are Alex, a very fast-paced bar manager."
  }
};
