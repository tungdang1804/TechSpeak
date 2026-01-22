
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les1",
  "order": 1,
  "title": "Proactive Booking",
  "description": "Chủ động dẫn dắt cuộc gọi đặt lịch: Dịch vụ, Thời gian, Số lượng.",
  "thumbnail": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Hân tiếp nhận cuộc gọi từ khách hàng Ms. Minh để đặt lịch hẹn dịch vụ tại Star Spa.",
    "goal": "Thu thập thông tin đặt lịch, kiểm tra khung giờ trống và chốt lịch hẹn chuyên nghiệp.",
    "characters": [
      { "name": "Hân", "role": "Nhân viên điều phối" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l1_s1",
      "title": "Chào hỏi điện thoại & Xác định mục đích",
      "purpose": "Chào hỏi chuyên nghiệp và nhận diện nhu cầu khách.",
      "lines": [
        {
          "id": "l1_s1_t", "speaker": "Tech",
          "text": "Star Spa, Hân speaking. How can I help you?",
          "translation": "Star Spa, Hân đang nghe máy ạ. Em có thể giúp gì cho chị?",
          "variations": [
            { "id": "v1", "text": "Hello, Star Spa. How may I assist you today?", "translation": "Xin chào, Star Spa xin nghe. Em có thể hỗ trợ gì cho chị hôm nay ạ?" },
            { "id": "v2", "text": "Good morning, Star Spa. Are you looking to book an appointment?", "translation": "Chào buổi sáng, Star Spa xin nghe. Chị muốn đặt lịch hẹn phải không ạ?" }
          ]
        },
        { "id": "l1_s1_c", "speaker": "Customer", "text": "Hi, I'd like to book an appointment for tomorrow.", "translation": "Chào em, chị muốn đặt lịch hẹn cho ngày mai." }
      ]
    },
    {
      "id": "nails_l1_s2",
      "title": "Xác định dịch vụ & Số lượng khách",
      "purpose": "Thu thập thông tin nhân sự cần thiết.",
      "lines": [
        {
          "id": "l1_s2_t", "speaker": "Tech",
          "text": "Is it for one person or two? And what services are you looking for?",
          "translation": "Chị đặt cho một hay hai người ạ? Và chị đang quan tâm đến dịch vụ nào?",
          "variations": [
            { "id": "v3", "text": "How many people are coming? Will you be doing both manicure and pedicure?", "translation": "Có bao nhiêu người sẽ đến ạ? Chị sẽ làm cả tay và chân luôn chứ?" },
            { "id": "v4", "text": "Who is the appointment for? Do you have any specific service in mind?", "translation": "Chị đặt hẹn cho ai ạ? Chị đã có ý định làm dịch vụ cụ thể nào chưa?" }
          ]
        },
        { "id": "l1_s2_c", "speaker": "Customer", "text": "Just for me. I want a full set of gel nails.", "translation": "Chỉ mình chị thôi. Chị muốn làm một bộ móng gel đầy đủ." }
      ]
    },
    {
      "id": "nails_l1_s3",
      "title": "Kiểm tra khung giờ trống",
      "purpose": "Chốt lịch dựa trên tình trạng tiệm.",
      "lines": [
        {
          "id": "l1_s3_t", "speaker": "Tech",
          "text": "What time would you like? We have a slot available at 3 PM.",
          "translation": "Chị muốn mấy giờ ạ? Bên em còn trống chỗ lúc 3 giờ chiều.",
          "variations": [
            { "id": "v5", "text": "When can you come? We are available in the afternoon after 2 PM.", "translation": "Khi nào chị có thể đến ạ? Bên em còn trống lịch vào buổi chiều sau 2 giờ." },
            { "id": "v6", "text": "Does 10 AM work for you, or would you prefer later in the day?", "translation": "10 giờ sáng có tiện cho chị không, hay chị thích muộn hơn trong ngày ạ?" }
          ]
        },
        { "id": "l1_s3_c", "speaker": "Customer", "text": "3 PM is perfect. Please note it down.", "translation": "3 giờ chiều thì tuyệt quá. Em ghi lại giúp chị nhé." }
      ]
    },
    {
      "id": "nails_l1_s4",
      "title": "Xác nhận lại & Kết thúc",
      "purpose": "Tránh sai sót thông tin.",
      "lines": [
        {
          "id": "l1_s4_t", "speaker": "Tech",
          "text": "Let me confirm: tomorrow at 3 PM for Ms. Minh. See you then!",
          "translation": "Để em xác nhận lại: ngày mai lúc 3 giờ chiều cho chị Minh. Hẹn gặp lại chị!",
          "variations": [
            { "id": "v7", "text": "Everything is set. We'll see you tomorrow at 3 PM. Have a nice day!", "translation": "Mọi thứ đã xong ạ. Hẹn gặp chị vào 3 giờ chiều mai. Chúc chị một ngày tốt lành!" },
            { "id": "v8", "text": "I've booked your slot. Is there anything else I can help you with?", "translation": "Em đã đặt chỗ cho chị rồi ạ. Em còn có thể giúp gì thêm cho chị không?" }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Speaking", "translation": "Đang nghe máy", "ipa": "/ˈspiːkɪŋ/" },
    { "id": "v2", "word": "Appointment", "translation": "Lịch hẹn", "ipa": "/əˈpɔɪntmənt/" },
    { "id": "v3", "word": "Available", "translation": "Còn trống/Sẵn sàng", "ipa": "/əˈveɪləbl/" },
    { "id": "v4", "word": "Slot", "translation": "Khung giờ", "ipa": "/slɒt/" },
    { "id": "v5", "word": "Confirm", "translation": "Xác nhận", "ipa": "/kənˈfɜːm/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "WH-Questions for time", "description": "Sử dụng What time/When để hỏi khung giờ.", "examples": [{ "english": "What time would you like?", "vietnamese": "Chị muốn khung giờ nào?" }] },
    { "id": "g2", "title": "Choice Questions", "description": "Cấu trúc lựa chọn A or B.", "examples": [{ "english": "One person or two?", "vietnamese": "Một người hay hai người ạ?" }] }
  ],
  "roleplay": {
    "user_instructions": "Chào khách và chốt lịch hẹn chuyên nghiệp cho ngày mai.",
    "ai_instructions": "You are Ms. Minh. You want a full set tomorrow at 3 PM. You are polite but expect a clear confirmation."
  }
};
