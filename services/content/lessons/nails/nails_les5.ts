
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les5",
  "order": 5,
  "title": "Art & Finishing",
  "description": "Sơn màu, hiệu ứng mắt mèo và hoàn thiện sản phẩm.",
  "thumbnail": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Giai đoạn sơn màu và hơ đèn. Khách hàng chọn hiệu ứng mắt mèo hạt mịn cho bộ móng của mình.",
    "goal": "Hướng dẫn khách thao tác với đèn hơ móng, thực hiện kỹ thuật mắt mèo và kiểm tra độ bóng.",
    "characters": [
      { "name": "Hân", "role": "Thợ nail" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l5_s1",
      "title": "Sơn lớp nền và Thử màu",
      "purpose": "Xác nhận màu sắc chính xác.",
      "lines": [
        {
          "id": "l5_s1_t", "speaker": "Tech",
          "text": "Let's try the color on one nail first. Is this shade okay for you?",
          "translation": "Để em thử màu trên một móng trước nhé. Tông màu này ổn với chị chứ ạ?",
          "variations": [
            { "id": "v1", "text": "I’ll apply a base gel first to protect your nails.", "translation": "Em sẽ sơn một lớp liên kết trước để bảo vệ móng của chị ạ." },
            { "id": "v2", "text": "Do you want one coat for a light look or two coats for a darker shade?", "translation": "Chị muốn sơn một lớp để nhìn nhạt hay hai lớp để màu đậm hơn ạ?" }
          ]
        },
        { "id": "l5_s1_c", "speaker": "Customer", "text": "Two coats, please. I like it a bit darker.", "translation": "Sơn hai lớp nhé. Chị thích màu đậm hơn một chút." }
      ]
    },
    {
      "id": "nails_l5_s2",
      "title": "Hướng dẫn sử dụng đèn hơ (LED/UV Lamp)",
      "purpose": "Đảm bảo kỹ thuật hơ khô.",
      "lines": [
        {
          "id": "l5_s2_t", "speaker": "Tech",
          "text": "Please put your hand in the lamp for 60 seconds. Keep it flat.",
          "translation": "Chị vui lòng cho tay vào đèn trong 60 giây nhé. Hãy để tay phẳng ạ.",
          "variations": [
            { "id": "v3", "text": "If it feels too hot, you can take your hand out for a moment.", "translation": "Nếu cảm thấy nóng quá, chị có thể đưa tay ra ngoài một lúc ạ." },
            { "id": "v4", "text": "Please put only your thumb in the lamp this time.", "translation": "Lần này chị vui lòng chỉ cho ngón cái vào đèn thôi nhé." }
          ]
        },
        { "id": "l5_s2_c", "speaker": "Customer", "text": "Okay, I'll keep my hand still.", "translation": "Được rồi, chị sẽ giữ yên tay." }
      ]
    },
    {
      "id": "nails_l5_s3",
      "title": "Thực hiện hiệu ứng mắt mèo (Cat-eye)",
      "purpose": "Vẽ trang trí nâng cao.",
      "lines": [
        {
          "id": "l5_s3_t", "speaker": "Tech",
          "text": "I'm using the magnet for the cat-eye effect. Do you like this fine grain look?",
          "translation": "Em đang dùng nam châm để tạo hiệu ứng mắt mèo. Chị có thích kiểu hạt mịn này không ạ?",
          "variations": [
            { "id": "v5", "text": "I can make the cat-eye line sharper if you prefer.", "translation": "Em có thể làm cho đường mắt mèo sắc nét hơn nếu chị muốn ạ." },
            { "id": "v6", "text": "This cat-eye effect looks amazing under the light, doesn't it?", "translation": "Hiệu ứng mắt mèo này nhìn rất tuyệt dưới ánh sáng, phải không chị?" }
          ]
        },
        { "id": "l5_s3_c", "speaker": "Customer", "text": "Wow, it looks very sparkly! I love it.", "translation": "Ồ, nhìn lấp lánh quá! Chị thích lắm." }
      ]
    },
    {
      "id": "nails_l5_s4",
      "title": "Sơn bóng và Hoàn tất (Finishing)",
      "purpose": "Kiểm tra sự hài lòng cuối cùng.",
      "lines": [
        {
          "id": "l5_s4_t", "speaker": "Tech",
          "text": "Your nails look amazing! Let me apply some top coat for a long-lasting shine.",
          "translation": "Móng của chị nhìn tuyệt quá! Để em sơn lớp bóng để giữ độ sáng lâu nhé.",
          "variations": [
            { "id": "v7", "text": "I’ll wipe off the dust and apply some cuticle oil to finish.", "translation": "Em sẽ lau sạch bụi và bôi chút dầu dưỡng để hoàn tất nhé." },
            { "id": "v8", "text": "All done! Please check if you are happy with the results.", "translation": "Xong hết rồi ạ! Chị vui lòng kiểm tra xem có hài lòng với kết quả không ạ?" }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Cat-eye", "translation": "Mắt mèo", "ipa": "/ˈkæt.aɪ/" },
    { "id": "v2", "word": "Lamp", "translation": "Đèn hơ móng", "ipa": "/læmp/" },
    { "id": "v3", "word": "Shade", "translation": "Tông màu/Sắc thái", "ipa": "/ʃeɪd/" },
    { "id": "v4", "word": "Wipe off", "translation": "Lau sạch", "ipa": "/waɪp ɒf/" },
    { "id": "v5", "word": "Shiny finish", "translation": "Lớp bóng hoàn thiện", "ipa": "/ˈʃaɪni ˈfɪnɪʃ/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Tag questions", "description": "Dùng '..., doesn't it?' để xác nhận ý kiến.", "examples": [{ "english": "It looks amazing, doesn't it?", "vietnamese": "Nhìn tuyệt quá đúng không?" }] }
  ],
  "roleplay": {
    "user_instructions": "Hướng dẫn khách dùng đèn hơ và hỏi ý kiến về mẫu mắt mèo.",
    "ai_instructions": "You are Ms. Minh. You love glitter and cat-eye effect. You are happy with the work."
  }
};
