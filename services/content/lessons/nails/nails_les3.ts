
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les3",
  "order": 3,
  "title": "Cuticle Care & Treatment",
  "description": "Vệ sinh da, xử lý móng khóe và hướng dẫn thực tế cho học viên.",
  "thumbnail": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Hân đang thực hiện vệ sinh da cho khách, đồng thời hướng dẫn học viên Mi về cách sử dụng dụng cụ an toàn.",
    "goal": "Sử dụng đúng thuật ngữ dụng cụ, xử lý móng khóe an toàn và hỏi thăm cảm giác của khách.",
    "characters": [
      { "name": "Hân", "role": "Kỹ thuật viên chính" },
      { "name": "Mi", "role": "Học viên" },
      { "name": "Khách", "role": "Ms. Minh" }
    ]
  },
  "steps": [
    {
      "id": "nails_l3_s1",
      "title": "Chuẩn bị dụng cụ & Ngâm chân",
      "purpose": "Thiết lập quy trình vệ sinh.",
      "lines": [
        {
          "id": "l3_s1_t", "speaker": "Tech",
          "text": "Mi, please get the tool kit and the sterilized nippers.",
          "translation": "Mi, lấy giúp chị bộ dụng cụ và kiềm đã tiệt trùng nhé.",
          "variations": [
            { "id": "v1", "text": "Please bring me the cuticle pusher and the nail drill.", "translation": "Lấy giúp chị cây đẩy da và máy mài móng nhé." },
            { "id": "v2", "text": "First, let's soak your feet in the basin to soften the skin.", "translation": "Đầu tiên, hãy ngâm chân trong bồn để làm mềm da nhé." }
          ]
        },
        { "id": "l3_s1_c", "speaker": "Customer", "text": "Everything is ready. I'll put some softener in the water.", "translation": "Mọi thứ sẵn sàng rồi ạ. Em sẽ cho thêm chút thuốc làm mềm vào nước." }
      ]
    },
    {
      "id": "nails_l3_s2",
      "title": "Xử lý khóe & Kiểm tra cảm giác",
      "purpose": "Hỏi thăm khách khi thao tác vùng nhạy cảm.",
      "lines": [
        {
          "id": "l3_s2_t", "speaker": "Tech",
          "text": "Does it feel sore? I’m cleaning the ingrown nail now.",
          "translation": "Chị có thấy đau không? Em đang xử lý phần móng khóe ạ.",
          "variations": [
            { "id": "v3", "text": "Is it too hot? I'm using the drill for the dead skin.", "translation": "Có bị nóng quá không ạ? Em đang dùng máy mài để xử lý da chết." },
            { "id": "v4", "text": "Please let me know if you feel any discomfort.", "translation": "Vui lòng báo cho em biết nếu chị thấy khó chịu nhé." }
          ]
        },
        { "id": "l3_s2_c", "speaker": "Customer", "text": "It's a bit sore, but I can handle it.", "translation": "Hơi đau một chút, nhưng tôi chịu được." }
      ]
    },
    {
      "id": "nails_l3_s3",
      "title": "Trấn an khách hàng",
      "purpose": "Xây dựng sự an tâm.",
      "lines": [
        {
          "id": "l3_s3_t", "speaker": "Tech",
          "text": "Don't worry, I'll be very gentle. I'll use a smaller drill bit.",
          "translation": "Đừng lo lắng ạ, em sẽ làm rất nhẹ nhàng. Em sẽ dùng đầu mài nhỏ hơn.",
          "variations": [
            { "id": "v5", "text": "I'm almost done. I'll make sure there is no bleeding.", "translation": "Em sắp xong rồi ạ. Em sẽ đảm bảo không bị chảy máu." },
            { "id": "v6", "text": "I'll apply some antiseptic to make sure it's safe.", "translation": "Em sẽ bôi chút thuốc sát trùng để đảm bảo an toàn ạ." }
          ]
        },
        { "id": "l3_s3_c", "speaker": "Customer", "text": "Okay, thank you. I feel much safer now.", "translation": "Được rồi, cảm ơn em. Giờ tôi thấy an tâm hơn rồi." }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Cuticle nippers", "translation": "Kiềm cắt da", "ipa": "/ˈkjuːtɪkl ˈnɪpəz/" },
    { "id": "v2", "word": "Nail drill", "translation": "Máy mài móng", "ipa": "/neɪl drɪl/" },
    { "id": "v3", "word": "Ingrown nail", "translation": "Móng khóe", "ipa": "/ˌɪn.ɡrəʊn ˈneɪl/" },
    { "id": "v4", "word": "Sterilized", "translation": "Đã tiệt trùng", "ipa": "/ˈsterəlaɪzd/" },
    { "id": "v5", "word": "Sore", "translation": "Đau nhức/Ê", "ipa": "/sɔːr/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Sensation check questions", "description": "Hỏi về cảm giác của khách trong lúc làm.", "examples": [{ "english": "Does it feel sore?", "vietnamese": "Chị có thấy đau không?" }] }
  ],
  "roleplay": {
    "user_instructions": "Thông báo xử lý khóe và trấn an khách.",
    "ai_instructions": "You are Ms. Minh. You have a very sensitive ingrown nail. You worry about pain."
  }
};
