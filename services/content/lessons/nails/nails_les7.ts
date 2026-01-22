
import { Lesson } from '../../../../types';

export const lesson: Lesson = {
  "id": "nails_les7",
  "order": 7,
  "title": "Checkout & Reviews",
  "description": "Thanh toán, gợi ý Tip và xin đánh giá trên Google/Facebook/Instagram.",
  "thumbnail": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
  "context": {
    "background": "Khách hàng hoàn tất dịch vụ và tiến hành thanh toán tại quầy. Tiên thực hiện thu ngân và tối ưu hóa hiện diện trực tuyến cho tiệm.",
    "goal": "Thực hiện giao dịch tài chính chuyên nghiệp và khéo léo nhờ khách hàng để lại phản hồi tốt.",
    "characters": [
      { "name": "Tiên", "role": "Thu ngân" },
      { "name": "Ms. Minh", "role": "Khách hàng" }
    ]
  },
  "steps": [
    {
      "id": "nails_l7_s1",
      "title": "Tổng kết hóa đơn & Phương thức thanh toán",
      "purpose": "Thu tiền dịch vụ.",
      "lines": [
        {
          "id": "l7_s1_t", "speaker": "Tech",
          "text": "Your total today is $50. How would you like to pay?",
          "translation": "Tổng chi phí hôm nay là 50 đô ạ. Chị muốn thanh toán thế nào ạ?",
          "variations": [
            { "id": "v1", "text": "Do you want to pay by cash, credit card, or Apple Pay?", "translation": "Chị muốn trả bằng tiền mặt, thẻ tín dụng hay Apple Pay ạ?" },
            { "id": "v2", "text": "The total service fee is $50. Will you be paying by card?", "translation": "Tổng phí dịch vụ là 50 đô. Chị sẽ thanh toán bằng thẻ phải không ạ?" }
          ]
        },
        { "id": "l7_s1_c", "speaker": "Customer", "text": "I'll pay by credit card. Can I add a tip on the machine?", "translation": "Chị trả bằng thẻ. Chị có thể thêm tiền tip trên máy luôn không?" }
      ]
    },
    {
      "id": "nails_l7_s2",
      "title": "Gợi ý Tiền Tip & Hoàn tất giao dịch",
      "purpose": "Hỗ trợ khách thực hiện tiền thưởng.",
      "lines": [
        {
          "id": "l7_s2_t", "speaker": "Tech",
          "text": "Yes, you can select the tip amount on the screen. Thank you so much!",
          "translation": "Dạ được, chị có thể chọn số tiền tip trên màn hình ạ. Em cảm ơn chị rất nhiều!",
          "variations": [
            { "id": "v3", "text": "Please select your preferred tip percentage and sign here.", "translation": "Vui lòng chọn tỷ lệ phần trăm tip chị muốn và ký tên vào đây ạ." },
            { "id": "v4", "text": "Here is your receipt. I've included the tip as you requested.", "translation": "Đây là hóa đơn của chị ạ. Em đã gộp cả tiền tip như chị yêu cầu rồi ạ." }
          ]
        },
        { "id": "l7_s2_c", "speaker": "Customer", "text": "All done. Here is your receipt back.", "translation": "Xong rồi đây. Gửi lại em hóa đơn này." }
      ]
    },
    {
      "id": "nails_l7_s3",
      "title": "Xin đánh giá trên mạng xã hội",
      "purpose": "Marketing truyền miệng.",
      "lines": [
        {
          "id": "l7_s3_t", "speaker": "Tech",
          "text": "If you are happy with our service, could you please leave a review on Google Maps?",
          "translation": "Nếu chị hài lòng với dịch vụ, chị có thể để lại đánh giá trên Google Maps giúp bên em không ạ?",
          "variations": [
            { "id": "v5", "text": "We would love to see your nails on Instagram. Please tag Star Spa in your story!", "translation": "Bên em rất muốn thấy bộ móng của chị trên Instagram. Chị nhớ gắn thẻ Star Spa vào story nhé!" },
            { "id": "v6", "text": "You will get a 5% discount for your next visit if you follow us on Facebook.", "translation": "Chị sẽ được giảm giá 5% cho lần tới nếu chị theo dõi bên em trên Facebook ạ." }
          ]
        },
        { "id": "l7_s3_c", "speaker": "Customer", "text": "Sure! I'll post a photo and tag you guys.", "translation": "Chắc chắn rồi! Chị sẽ đăng ảnh và gắn thẻ các em." }
      ]
    },
    {
      "id": "nails_l7_s4",
      "title": "Hẹn lịch lần tới & Chào tạm biệt",
      "purpose": "Giữ chân khách hàng.",
      "lines": [
        {
          "id": "l7_s4_t", "speaker": "Tech",
          "text": "Would you like to re-book for next month now? We are filling up fast.",
          "translation": "Chị có muốn đặt lịch luôn cho tháng tới không ạ? Lịch bên em đang kín dần rồi ạ.",
          "variations": [
            { "id": "v7", "text": "Thank you for choosing Star Spa. Have a wonderful day!", "translation": "Cảm ơn chị đã chọn Star Spa. Chúc chị một ngày tuyệt vời ạ!" },
            { "id": "v8", "text": "We look forward to seeing you again soon. Take care!", "translation": "Chúng em rất mong sớm được gặp lại chị. Chị đi cẩn thận nhé!" }
          ]
        }
      ]
    }
  ],
  "vocabularies": [
    { "id": "v1", "word": "Total", "translation": "Tổng số/Tổng tiền", "ipa": "/ˈtəʊtl/" },
    { "id": "v2", "word": "Receipt", "translation": "Hóa đơn", "ipa": "/rɪˈsiːt/" },
    { "id": "v3", "word": "Tip amount", "translation": "Số tiền thưởng", "ipa": "/tɪp əˈmaʊnt/" },
    { "id": "v4", "word": "Review", "translation": "Đánh giá/Phản hồi", "ipa": "/rɪˈvjuː/" },
    { "id": "v5", "word": "Tag", "translation": "Gắn thẻ", "ipa": "/tæɡ/" }
  ],
  "grammar_points": [
    { "id": "g1", "title": "How would you like to pay?", "description": "Câu hỏi phương thức thanh toán chuẩn.", "examples": [{ "english": "Cash or card?", "vietnamese": "Tiền mặt hay thẻ?" }] }
  ],
  "roleplay": {
    "user_instructions": "Tính tiền cho khách và xin review 5 sao trên Google Maps.",
    "ai_instructions": "You are Ms. Minh. You are very happy. You want to pay by card and give a 20% tip."
  }
};
