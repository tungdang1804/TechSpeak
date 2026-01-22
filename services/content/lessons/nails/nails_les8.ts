
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les8",
  "order": 8,
  "title": "Warranty & Repair",
  "description": "Xác minh và sửa chữa móng: Bảo hành trong vòng 7 ngày.",
  "thumbnail": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hàng quay lại với một chiếc móng bị bong lớp sơn gel sau 5 ngày. Tiên thực hiện quy trình kiểm tra lịch sử để xác định quyền lợi bảo hành.",
    "goal": "Xác minh nguồn gốc dịch vụ, thời gian sử dụng và báo chi phí sửa chữa (miễn phí bảo hành).",
    "characters": [
      { "name": "Tiên", "role": "Lễ tân" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l8_s1",
      "title": "Xác minh nguồn gốc dịch vụ",
      "purpose": "Nhận diện khách cũ.",
      "lines": [
        {
          "id": "l8_s1_t", "speaker": "Tech",
          "text": "Oh, I see the problem. Did you get these nails done at Star Spa or another salon?",
          "translation": "Ồ, em đã thấy vấn đề rồi. Bộ móng này chị làm tại Star Spa hay ở tiệm khác ạ?",
          "variations": [
            { "id": "v1", "text": "To help you better, could you tell me which technician did your nails?", "translation": "Để hỗ trợ chị tốt hơn, chị có thể cho em biết nhân viên nào đã làm móng cho mình không ạ?" },
            { "id": "v2", "text": "Let me check our system to see your service history.", "translation": "Để em kiểm tra hệ thống xem lịch sử dịch vụ của chị nhé." }
          ]
        },
        { "id": "l8_s1_c", "speaker": "Customer", "text": "I did it here last week. I think the girl's name was Hân.", "translation": "Chị làm ở đây tuần trước. Chị nhớ tên bạn đó là Hân." }
      ]
    },
    {
      "id": "nails_l8_s2",
      "title": "Kiểm tra thời gian & Bảo hành",
      "purpose": "Áp dụng chính sách tiệm.",
      "lines": [
        {
          "id": "l8_s2_t", "speaker": "Tech",
          "text": "How many days ago did you have them done? We offer free repair within 7 days.",
          "translation": "Chị đã làm bộ móng này cách đây bao nhiêu ngày rồi ạ? Bên em bảo hành sửa miễn phí trong vòng 7 ngày ạ.",
          "variations": [
            { "id": "v3", "text": "Was it within the last week? Technical issues are covered by our warranty.", "translation": "Có phải trong vòng tuần qua không ạ? Các lỗi kỹ thuật đều được bảo hành bên em ạ." },
            { "id": "v4", "text": "Let me confirm the date. If it's within 7 days, there's no charge.", "translation": "Để em xác nhận lại ngày. Nếu trong vòng 7 ngày thì sẽ không tính phí ạ." }
          ]
        },
        { "id": "l8_s2_c", "speaker": "Customer", "text": "It was exactly 5 days ago. The gel is peeling off.", "translation": "Chính xác là cách đây 5 ngày. Lớp gel bị bong ra." }
      ]
    },
    {
      "id": "nails_l8_s3",
      "title": "Xác định nguyên nhân & Nhu cầu",
      "purpose": "Phân loại lỗi kỹ thuật hay lỗi khách hàng.",
      "lines": [
        {
          "id": "l8_s3_t", "speaker": "Tech",
          "text": "Is the nail chipped by itself, or would you like to change the whole set?",
          "translation": "Móng bị tróc tự nhiên hay chị muốn đổi cả bộ mới luôn ạ?",
          "variations": [
            { "id": "v5", "text": "Did you have an accident, or is the gel peeling off on this finger?", "translation": "Chị vô tình gặp sự cố hay lớp gel tự bong ra ở ngón này ạ?" },
            { "id": "v6", "text": "Are you fixing just this one, or do you want to switch to a new style?", "translation": "Chị chỉ sửa chiếc này thôi, hay chị muốn đổi sang kiểu mới luôn ạ?" }
          ]
        },
        { "id": "l8_s3_c", "speaker": "Customer", "text": "I just want to fix this one, please. I didn't hit anything.", "translation": "Chị chỉ muốn sửa chiếc này thôi. Chị không va quẹt vào đâu cả." }
      ]
    },
    {
      "id": "nails_l8_s4",
      "title": "Báo dịch vụ & Chi phí",
      "purpose": "Chốt phương án sửa chữa.",
      "lines": [
        {
          "id": "l8_s4_t", "speaker": "Tech",
          "text": "Since it's within 7 days, we will re-apply the gel for free of charge.",
          "translation": "Vì vẫn trong vòng 7 ngày, bên em sẽ sơn lại gel hoàn toàn miễn phí cho chị ạ.",
          "variations": [
            { "id": "v7", "text": "I will buff the surface and fix the nail for you right now.", "translation": "Em sẽ dũa nhám bề mặt và sửa lại móng cho chị ngay bây giờ nhé." },
            { "id": "v8", "text": "If you want a new color, there will be a small repair fee.", "translation": "Nếu chị muốn đổi màu mới, sẽ có một khoản phí sửa chữa nhỏ ạ." }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Warranty", "translation": "Bảo hành", "ipa": "/ˈwɒrənti/" },
    { "id": "v2", "word": "Chipped", "translation": "Bị mẻ/Tróc nhẹ", "ipa": "/tʃɪpt/" },
    { "id": "v3", "word": "Peeling off", "translation": "Bị bong tróc", "ipa": "/ˈpiːlɪŋ ɒf/" },
    { "id": "v4", "word": "Free of charge", "translation": "Miễn phí", "ipa": "/friː əv tʃɑːdʒ/" },
    { "id": "v5", "word": "Technician", "translation": "Kỹ thuật viên", "ipa": "/tekˈnɪʃn/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "How many days ago...?", "description": "Hỏi về khoảng thời gian trong quá khứ.", "examples": [{ "english": "How many days ago was it?", "vietnamese": "Cách đây mấy ngày rồi ạ?" }] }
  ],
  "roleplay": {
    "user_instructions": "Xác nhận lịch sử làm móng của khách và báo sửa miễn phí.",
    "ai_instructions": "You are Ms. Minh. You are slightly annoyed. You did your nails 5 days ago and one gel nail peeled off. You expect it to be free."
  }
};
