
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les6",
  "order": 6,
  "title": "Handling Complaints",
  "description": "Giải quyết khiếu nại: Xử lý tình huống khách không hài lòng ngay tại chỗ.",
  "thumbnail": "https://images.unsplash.com/photo-1590008828475-577319bbc832?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Dịch vụ hoàn tất nhưng khách hàng cảm thấy màu sơn đậm hơn mẫu và bị đau ở ngón tay.",
    "goal": "Lắng nghe phàn nàn, xin lỗi chuyên nghiệp và đưa ra giải pháp khắc phục.",
    "characters": [
      { "name": "Tiên", "role": "Quản lý" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l6_s1",
      "title": "Lắng nghe và Xác định vấn đề",
      "purpose": "Xoa dịu cảm xúc ban đầu.",
      "lines": [
        {
          "id": "l6_s1_t", "speaker": "Tech",
          "text": "I'm sorry to hear that, Ms. Minh. What seems to be the problem?",
          "translation": "Em rất tiếc khi nghe điều đó, chị Minh. Dạ có vấn đề gì vậy ạ?",
          "variations": [
            { "id": "v1", "text": "I apologize for the discomfort. Could you please show me which part you don't like?", "translation": "Em xin lỗi vì sự khó chịu này. Chị có thể chỉ cho em phần nào chị chưa ưng ý không ạ?" },
            { "id": "v2", "text": "I'm sorry, is the shape too sharp or is the color wrong?", "translation": "Em xin lỗi, dáng móng bị nhọn quá hay màu sắc bị sai ạ?" }
          ]
        },
        { "id": "l6_s1_c", "speaker": "Customer", "text": "The color is much darker than the sample and this finger is sore.", "translation": "Màu này đậm hơn mẫu nhiều quá và ngón tay này bị đau." }
      ]
    },
    {
      "id": "nails_l6_s2",
      "title": "Xử lý cảm giác đau (Sensation Issue)",
      "purpose": "Đảm bảo an toàn sức khỏe.",
      "lines": [
        {
          "id": "l6_s2_t", "speaker": "Tech",
          "text": "I'm so sorry, let me clean that for you right away. I'll be very gentle.",
          "translation": "Em vô cùng xin lỗi, để em làm sạch vết đó cho chị ngay lập tức. Em sẽ làm rất nhẹ nhàng ạ.",
          "variations": [
            { "id": "v3", "text": "I apologize. I will use a sterilized tool to fix it carefully.", "translation": "Em xin lỗi ạ. Em sẽ dùng dụng cụ đã tiệt trùng để xử lý cẩn thận cho chị." },
            { "id": "v4", "text": "Does it feel better now? I will make sure it's safe and clean.", "translation": "Giờ chị thấy đỡ hơn chưa ạ? Em sẽ đảm bảo nó an toàn và sạch sẽ." }
          ]
        },
        { "id": "l6_s2_c", "speaker": "Customer", "text": "It's a bit better now, but please be careful.", "translation": "Giờ thấy đỡ hơn một chút rồi, nhưng làm ơn hãy cẩn thận." }
      ]
    },
    {
      "id": "nails_l6_s3",
      "title": "Đề xuất giải pháp sửa chữa (Fixing)",
      "purpose": "Đề xuất các phương án khắc phục.",
      "lines": [
        {
          "id": "l6_s3_t", "speaker": "Tech",
          "text": "If you don't like the shade, I can wipe it off and re-apply a lighter color.",
          "translation": "Nếu chị không thích tông màu này, em có thể lau đi và sơn lại màu nhạt hơn cho chị ạ.",
          "variations": [
            { "id": "v5", "text": "Would you like me to reshape the nails or shorten the length for you?", "translation": "Chị có muốn em dũa lại form móng hay cắt ngắn độ dài đi cho chị không ạ?" },
            { "id": "v6", "text": "I'll fix this for you right now. It won't take long.", "translation": "Em sẽ sửa lại phần này cho chị ngay bây giờ. Sẽ không mất nhiều thời gian đâu ạ." }
          ]
        },
        { "id": "l6_s3_c", "speaker": "Customer", "text": "Please change it to a lighter shade.", "translation": "Làm ơn đổi sang tông màu nhạt hơn giúp chị." }
      ]
    },
    {
      "id": "nails_l6_s4",
      "title": "Xác nhận hài lòng và Bồi thường",
      "purpose": "Khôi phục lòng tin.",
      "lines": [
        {
          "id": "l6_s4_t", "speaker": "Tech",
          "text": "Are you happy with the new color? Since you had a bad experience, I’d like to offer you a 10% discount.",
          "translation": "Chị có hài lòng với màu mới này không ạ? Vì chị đã có trải nghiệm không tốt, em xin phép giảm giá 10% cho chị ạ.",
          "variations": [
            { "id": "v7", "text": "I've made it right for you. Is there anything else I can do to help?", "translation": "Em đã khắc phục xong cho chị rồi ạ. Em còn có thể giúp gì thêm không ạ?" },
            { "id": "v8", "text": "I apologize again. We hope you will give us another chance.", "translation": "Em xin lỗi chị một lần nữa. Bên em hy vọng chị sẽ cho chúng em thêm cơ hội ạ." }
          ]
        },
        { "id": "l6_s4_c", "speaker": "Customer", "text": "Yes, this is much better. Thank you for fixing it.", "translation": "Vâng, thế này tốt hơn nhiều rồi. Cảm ơn em đã sửa lại nhé." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Apologize", "translation": "Xin lỗi", "ipa": "/əˈpɒlədʒaɪz/" },
    { "id": "v2", "word": "Sore", "translation": "Đau nhức", "ipa": "/sɔːr/" },
    { "id": "v3", "word": "Sample", "translation": "Mẫu màu", "ipa": "/ˈsɑːmpl/" },
    { "id": "v4", "word": "Bleeding", "translation": "Chảy máu", "ipa": "/ˈbliːdɪŋ/" },
    { "id": "v5", "word": "Discount", "translation": "Giảm giá", "ipa": "/ˈdɪskaʊnt/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Polite Apologies", "description": "Cách xin lỗi và nhận trách nhiệm.", "examples": [{ "english": "I apologize for the discomfort.", "vietnamese": "Em xin lỗi vì sự khó chịu này." }] }
  ],
  "roleplay": {
    "user_instructions": "Xin lỗi khách về lỗi màu sơn và đề nghị giảm giá bồi thường.",
    "ai_instructions": "You are Ms. Minh. You are frustrated. You want a lighter shade and a fix for your sore finger."
  }
};
