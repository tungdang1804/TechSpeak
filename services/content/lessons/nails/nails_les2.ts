
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les2",
  "order": 2,
  "title": "Welcome & Consultation",
  "description": "Đón khách, mời nước và tư vấn mẫu thiết kế dựa trên trang phục/sự kiện.",
  "thumbnail": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hàng Ms. Minh đến tiệm theo lịch hẹn. Tiên tiếp đón và tư vấn mẫu móng phù hợp với đám cưới chị sắp tham dự.",
    "goal": "Tạo ấn tượng ban đầu chuyên nghiệp và xác định phong cách thiết kế.",
    "characters": [
      { "name": "Tiên", "role": "Nhân viên tư vấn" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l2_s1",
      "title": "Chào đón và xác nhận lịch hẹn",
      "purpose": "Tiếp đón khách nồng hậu.",
      "lines": [
        {
          "id": "l2_s1_t", "speaker": "Tech",
          "text": "Welcome to Star Spa, Ms. Minh! Your station is ready. Please come this way.",
          "translation": "Chào mừng chị Minh đến với Star Spa! Vị trí của chị đã sẵn sàng rồi ạ. Mời chị đi lối này.",
          "variations": [
            { "id": "v1", "text": "Good to see you again! Please follow me to your seat.", "translation": "Rất vui được gặp lại chị! Mời chị đi theo em đến chỗ ngồi ạ." },
            { "id": "v2", "text": "Hello Ms. Minh, we've been expecting you. Your technician is waiting.", "translation": "Chào chị Minh, chúng em đang đợi chị ạ. Kỹ thuật viên của chị đang chờ rồi." }
          ]
        },
        { "id": "l2_s1_c", "speaker": "Customer", "text": "Thank you. It’s a bit hot outside today.", "translation": "Cảm ơn em. Hôm nay ngoài trời hơi nóng nhỉ." }
      ]
    },
    {
      "id": "nails_l2_s2",
      "title": "Mời nước và tạo sự thoải mái",
      "purpose": "Chăm sóc trải nghiệm khách hàng.",
      "lines": [
        {
          "id": "l2_s2_t", "speaker": "Tech",
          "text": "Would you like some water or tea while we prepare your tools?",
          "translation": "Chị có muốn dùng chút nước hay trà trong lúc chúng em chuẩn bị dụng cụ không ạ?",
          "variations": [
            { "id": "v3", "text": "Can I get you a drink before we start?", "translation": "Em có thể lấy cho chị chút đồ uống trước khi mình bắt đầu không?" },
            { "id": "v4", "text": "Please relax. Would you like a cold towel to cool down?", "translation": "Chị cứ thư giãn ạ. Chị có muốn dùng khăn lạnh để giải nhiệt không?" }
          ]
        },
        { "id": "l2_s2_c", "speaker": "Customer", "text": "Just some water, please.", "translation": "Cho chị xin chút nước thôi." }
      ]
    },
    {
      "id": "nails_l2_s3",
      "title": "Tư vấn theo trang phục/sự kiện",
      "purpose": "Cá nhân hóa thiết kế.",
      "lines": [
        {
          "id": "l2_s3_t", "speaker": "Tech",
          "text": "I see you're wearing a lovely dress. Is it for a special event?",
          "translation": "Em thấy chị đang mặc một chiếc váy rất đẹp. Chị đi sự kiện đặc biệt nào ạ?",
          "variations": [
            { "id": "v5", "text": "Are you looking for something unique for the wedding this weekend?", "translation": "Chị có đang tìm kiếm mẫu nào độc đáo cho đám cưới cuối tuần này không ạ?" },
            { "id": "v6", "text": "Would you like a design that matches the color of your outfit?", "translation": "Chị có muốn một mẫu thiết kế hợp với màu trang phục của mình không ạ?" }
          ]
        },
        { "id": "l2_s3_c", "speaker": "Customer", "text": "Yes, I'm going to a wedding. I want something elegant.", "translation": "Đúng rồi, chị sắp đi đám cưới. Chị muốn kiểu gì đó sang trọng." }
      ]
    },
    {
      "id": "nails_l2_s4",
      "title": "Xác định phong cách cụ thể",
      "purpose": "Gợi ý kỹ thuật nâng cao.",
      "lines": [
        {
          "id": "l2_s4_t", "speaker": "Tech",
          "text": "What would you like to get done? Maybe some cat-eye or 3D art?",
          "translation": "Chị muốn làm gì ạ? Có lẽ là hiệu ứng mắt mèo hay vẽ 3D chăng?",
          "variations": [
            { "id": "v7", "text": "Do you have a design in mind, or should I suggest some trendy styles?", "translation": "Chị đã có mẫu nào trong đầu chưa, hay để em gợi ý một vài kiểu đang thịnh hành nhé?" },
            { "id": "v8", "text": "We have new extension styles. Would you like to try them for a total transformation?", "translation": "Bên em có các kiểu nối móng mới. Chị có muốn thử để thay đổi diện mạo hoàn toàn không?" }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Station", "translation": "Vị trí làm việc/Ghế", "ipa": "/ˈsteɪʃn/" },
    { "id": "v2", "word": "Unique", "translation": "Độc đáo", "ipa": "/juˈniːk/" },
    { "id": "v3", "word": "Transformation", "translation": "Thay đổi diện mạo", "ipa": "/ˌtrænsfəˈmeɪʃn/" },
    { "id": "v4", "word": "Wedding", "translation": "Đám cưới", "ipa": "/ˈwedɪŋ/" },
    { "id": "v5", "word": "Manicure", "translation": "Dịch vụ làm móng tay", "ipa": "/ˈmænɪkjʊə/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Polite invitations", "description": "Dùng 'Would you like...' để mời mọc khách.", "examples": [{ "english": "Would you like some tea?", "vietnamese": "Chị có muốn dùng trà không?" }] }
  ],
  "roleplay": {
    "user_instructions": "Chào đón khách và tư vấn mẫu móng cho tiệc cưới.",
    "ai_instructions": "You are Ms. Minh. You are attending a wedding and wearing a pink dress. You want elegant nails."
  }
};
