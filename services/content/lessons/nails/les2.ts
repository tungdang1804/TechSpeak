
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les2",
  "order": 2,
  "title": "Welcome & Consultation",
  "description": "Đón khách và tư vấn mẫu thiết kế (Cat-eye, 3D).",
  "thumbnail": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hàng Ms. Minh trực tiếp ghé tiệm theo lịch hẹn.",
    "goal": "Chào đón khách và thực hiện tư vấn thiết kế phù hợp sự kiện.",
    "characters": [
      { "name": "Tiên", "role": "Nhân viên tư vấn." },
      { "name": "Ms. Minh", "role": "Khách hàng dự sự kiện." }
    ]
  },
  "steps": [
    {
      "id": "l2_step1",
      "title": "Chào đón & Kiểm tra lịch",
      "purpose": "Xác nhận lịch hẹn",
      "lines": [
        { "id": "l2_s1_c", "speaker": "Customer", "text": "Hi, my name is Minh. I booked an appointment for 2:30.", "translation": "Chào bạn, tôi là Minh. Tôi đã có lịch lúc 2:30." },
        { "id": "l2_s1_t", "speaker": "Tech", "text": "Welcome to Star Spa, Ms. Minh. Your station is ready.", "translation": "Chào mừng chị Minh. Chỗ ngồi của chị đã sẵn sàng." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Station", "translation": "Vị trí làm việc", "ipa": "/ˈsteɪʃn/" },
    { "id": "v2", "word": "Elegant", "translation": "Sang trọng", "ipa": "/ˈelɪɡənt/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Polite Request", "description": "Dùng 'Would you like to' để mời khách.", "examples": [{ "english": "Would you like to take a look?", "vietnamese": "Chị có muốn xem qua không?" }] }
  ],
  "roleplay": {
    "user_instructions": "Chào khách và tư vấn mẫu móng sang trọng cho tiệc cưới.",
    "ai_instructions": "You are Ms. Minh. You want something elegant for a wedding."
  }
};
