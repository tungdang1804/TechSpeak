
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les4",
  "order": 4,
  "title": "Shaping & Extensions",
  "description": "Tư vấn dáng móng và thực hiện kỹ thuật nối móng/đắp bột.",
  "thumbnail": "https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Sau khi làm sạch da, Hân bắt đầu xử lý bề mặt móng để chuẩn bị gắn móng giả cho Ms. Minh.",
    "goal": "Thực hiện quy trình chuẩn bị bề mặt, tư vấn dáng móng phù hợp và kiểm tra độ cân đối.",
    "characters": [
      { "name": "Hân", "role": "Thợ nail" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l4_s1",
      "title": "Chuẩn bị bề mặt (Surface Prep)",
      "purpose": "Đảm bảo độ bền sản phẩm.",
      "lines": [
        {
          "id": "l4_s1_t", "speaker": "Tech",
          "text": "Before we start, we need to buff the surface so that the gel stays longer.",
          "translation": "Trước khi bắt đầu, em cần dũa nhám bề mặt để lớp gel bám bền hơn ạ.",
          "variations": [
            { "id": "v1", "text": "I’m applying the primer now to dehydrate the nail.", "translation": "Em đang sơn lớp chống kiềm để làm khô bề mặt móng ạ." },
            { "id": "v2", "text": "Please put on these gloves to protect your skin from the UV light.", "translation": "Chị vui lòng đeo găng tay này để bảo vệ da khỏi tia UV nhé." }
          ]
        },
        { "id": "l4_s1_c", "speaker": "Customer", "text": "Okay, I'm ready. Just let me know what to do next.", "translation": "Được rồi, tôi sẵn sàng. Cứ bảo tôi cần làm gì tiếp theo nhé." }
      ]
    },
    {
      "id": "nails_l4_s2",
      "title": "Tư vấn dáng móng (Nail Shape)",
      "purpose": "Lựa chọn kiểu dáng thẩm mỹ.",
      "lines": [
        {
          "id": "l4_s2_t", "speaker": "Tech",
          "text": "Which nail shape do you prefer: Almond, Square, or Coffin?",
          "translation": "Chị thích dáng móng nào hơn: Hạnh nhân, Vuông hay Quan tài ạ?",
          "variations": [
            { "id": "v3", "text": "I suggest Almond shape for a natural look. What do you think?", "translation": "Em đề xuất dáng hạnh nhân để nhìn tự nhiên. Chị thấy sao ạ?" },
            { "id": "v4", "text": "Since you want something elegant, Coffin shape would be perfect.", "translation": "Vì chị muốn kiểu sang trọng, dáng quan tài sẽ rất hoàn hảo ạ." }
          ]
        },
        { "id": "l4_s2_c", "speaker": "Customer", "text": "I'll go with Almond shape and Gel extensions, please.", "translation": "Cho chị dáng hạnh nhân và úp gel nhé." }
      ]
    },
    {
      "id": "nails_l4_s3",
      "title": "Xác nhận độ dài (Length Check)",
      "purpose": "Tránh cắt quá ngắn so với ý khách.",
      "lines": [
        {
          "id": "l4_s3_t", "speaker": "Tech",
          "text": "How does this length look to you? Should I cut it shorter?",
          "translation": "Chị thấy độ dài này thế nào ạ? Em có nên cắt ngắn thêm không?",
          "variations": [
            { "id": "v5", "text": "Is this length okay for you, or do you prefer it shorter?", "translation": "Độ dài này ổn với chị chưa, hay chị muốn ngắn hơn ạ?" },
            { "id": "v6", "text": "Please check the length of both hands to make sure they match.", "translation": "Chị vui lòng kiểm tra độ dài cả hai tay để đảm bảo chúng đều nhau ạ." }
          ]
        },
        { "id": "l4_s3_c", "speaker": "Customer", "text": "This length is perfect, don't cut it anymore.", "translation": "Độ dài này hoàn hảo rồi, đừng cắt thêm nữa." }
      ]
    },
    {
      "id": "nails_l4_s4",
      "title": "Kiểm tra độ thẳng & Cân đối",
      "purpose": "Hoàn thiện kỹ thuật.",
      "lines": [
        {
          "id": "l4_s4_t", "speaker": "Tech",
          "text": "Let me check if the nail tips are straight and balanced on both hands.",
          "translation": "Để em kiểm tra xem móng nối có thẳng và cân đối ở cả hai tay không nhé.",
          "variations": [
            { "id": "v7", "text": "The nails look perfectly aligned now. Are you happy with the form?", "translation": "Móng nhìn đã hoàn toàn thẳng hàng rồi ạ. Chị có hài lòng với form móng không?" },
            { "id": "v8", "text": "I will file the edges a bit more to make the shape perfect.", "translation": "Em sẽ dũa thêm các cạnh một chút để dáng móng hoàn hảo hơn." }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Almond", "translation": "Dáng hạnh nhân", "ipa": "/ˈɑːmənd/" },
    { "id": "v2", "word": "Coffin", "translation": "Dáng quan tài", "ipa": "/ˈkɒfɪn/" },
    { "id": "v3", "word": "Buff", "translation": "Dũa nhám bề mặt", "ipa": "/bʌf/" },
    { "id": "v4", "word": "Primer", "translation": "Sơn chống kiềm", "ipa": "/ˈpraɪmər/" },
    { "id": "v5", "word": "Balanced", "translation": "Cân đối", "ipa": "/ˈbælənst/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "Purpose structure (so that)", "description": "Dùng 'so that' để giải thích lý do kỹ thuật.", "examples": [{ "english": "Buff the nail so that gel stays longer.", "vietnamese": "Dũa nhám để gel bám lâu hơn." }] }
  ],
  "roleplay": {
    "user_instructions": "Tư vấn dáng móng Coffin và kiểm tra độ dài khách muốn.",
    "ai_instructions": "You are Ms. Minh. You want your nails long but not too impractical for typing."
  }
};
