
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les1",
  "order": 1,
  "title": "Proactive Booking",
  "description": "Chủ động dẫn dắt cuộc gọi đặt lịch: Dịch vụ, Thời gian, Số lượng.",
  "thumbnail": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Tình huống diễn ra qua điện thoại khi khách hàng gọi đến tiệm để hỏi lịch hẹn.",
    "goal": "Nhân viên chủ động chốt: Dịch vụ, thời gian và số lượng người.",
    "characters": [
      { "name": "Tiên", "role": "Nhân viên điều phối." },
      { "name": "Ms. Minh", "role": "Khách hàng." }
    ]
  },
  "steps": [
    {
      "id": "l1_step1",
      "title": "Lời chào và Nhu cầu",
      "purpose": "Khẳng định sự chuyên nghiệp",
      "lines": [
        { "id": "l1_s1_t", "speaker": "Tech", "text": "Hello, Star Spa speaking. How can I help you today?", "translation": "Xin chào, Star Spa xin nghe. Tôi có thể giúp gì cho bạn?" },
        { "id": "l1_s1_c", "speaker": "Customer", "text": "Hi, I want to book an appointment for tomorrow.", "translation": "Chào bạn, tôi muốn đặt lịch cho ngày mai." }
      ]
    },
    {
      "id": "l1_step2",
      "title": "Xác định dịch vụ & Số người",
      "purpose": "Thu thập thông tin để chuẩn bị thợ",
      "lines": [
        { "id": "l1_s2_t", "speaker": "Tech", "text": "And how many people are you? What service do you want?", "translation": "Nhóm mình đi mấy người ạ? Và bạn muốn làm dịch vụ gì?" },
        { "id": "l1_s2_c", "speaker": "Customer", "text": "I want a full set and a pedicure.", "translation": "Tôi muốn làm một bộ đầy đủ và làm móng chân." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Speaking", "translation": "Đang nghe máy", "ipa": "/ˈspiːkɪŋ/" },
    { "id": "v2", "word": "Appointment", "translation": "Lịch hẹn", "ipa": "/əˈpɔɪntmənt/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "WH-Questions", "description": "Hỏi thông tin cụ thể.", "examples": [{ "english": "What time would you like?", "vietnamese": "Bạn muốn mấy giờ?" }] }
  ],
  "roleplay": {
    "user_instructions": "Chào khách và chốt lịch hẹn cho ngày mai.",
    "ai_instructions": "You are Ms. Minh. You want a full set tomorrow at 2:30."
  }
};
