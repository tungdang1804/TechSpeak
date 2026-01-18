
import { Lesson } from '../types';

export const LESSON_2: Lesson = {
  id: 'lesson_2',
  order: 2,
  title: 'Welcome & Consultation',
  description: 'Đón khách, mời nước và tư vấn mẫu thiết kế (Cat-eye, 3D, extensions).',
  thumbnail: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop',

  contextBackground: 'Khách hàng Ms. Minh trực tiếp ghé Star Spa theo lịch hẹn. Không gian lúc này là tương tác trực tiếp, yêu cầu sự niềm nở và kỹ năng tư vấn thẩm mỹ.',
  contextGoal: 'Chào đón khách, mời nước và thực hiện tư vấn thiết kế chuyên sâu giúp Ms. Minh chọn được bộ móng hoàn hảo nhất cho sự kiện của mình.',
  contextCharacters: [
    { name: 'Tiên', role: 'Nhân viên phụ trách tiếp đón và tư vấn mẫu.' },
    { name: 'Ms. Minh', role: 'Khách hàng cần làm móng sang trọng để dự sự kiện.' }
  ],

  roleplayScenario: `Bạn là Tiên đón tiếp Ms. Minh tại Star Spa.
  
🎯 Nhiệm vụ:
- Chào đón niềm nở, xác nhận lịch hẹn.
- Tư vấn mẫu mã dựa trên yêu cầu đi sự kiện (Elegant/Unique).
- Nhận xét và khen ngợi mẫu khách chọn (Suit you).`,

  roleplayPrompt: `You are Ms. Minh. You have an appointment at Star Spa at 2:30.
  
  Behavior:
  - You tell the staff your name and appointment time.
  - You want something "Elegant and Unique" for a big party tonight.
  - You have a picture of a 3D powder art design.`,

  situationTitle: 'Đón Khách và Tư Vấn',
  situationScript: [
    {
      id: 'l2_s1',
      speaker: 'Customer',
      text: 'Hi, my name is Minh. I booked an appointment for 2:30.',
      translation: 'Chào bạn, tên tôi là Minh. Tôi đã đặt lịch lúc 2:30.'
    },
    {
      id: 'l2_s2',
      speaker: 'Tech',
      text: 'Welcome, Ms. Minh. Your station is ready.',
      translation: 'Chào mừng chị Minh. Chỗ ngồi của chị đã sẵn sàng rồi ạ.',
      variations: [
        { id: 'l2_v2_1', text: 'Welcome, Ms. Minh. Your station is ready.', translation: 'Chào mừng chị Minh. Chỗ ngồi của chị đã sẵn sàng rồi ạ.' },
        { id: 'l2_v2_2', text: 'Hello, Ms. Minh. Please wait in the waiting area for a few minutes. I will be right with you.', translation: 'Chào chị Minh. Vui lòng đợi ở khu vực chờ vài phút nhé. Tôi sẽ đến hỗ trợ chị ngay.' },
        { id: 'l2_v2_3', text: 'Hello, Ms. Minh. Your station is ready. Please come this way.', translation: 'Chào chị Minh. Chỗ của chị đã sẵn sàng. Mời chị đi lối này ạ.' }
      ]
    },
    {
      id: 'l2_s3',
      speaker: 'Tech',
      text: 'What would you like to get done today?',
      translation: 'Hôm nay chị muốn làm gì ạ?',
      variations: [
        { id: 'l2_v3_1', text: 'What would you like to get done today?', translation: 'Hôm nay chị muốn làm gì ạ?' },
        { id: 'l2_v3_2', text: 'Are you looking for a total transformation today?', translation: 'Chị có muốn thay đổi diện mạo hoàn toàn cho bộ móng hôm nay không?' },
        { id: 'l2_v3_3', text: 'Will you be doing both manicure and pedicure today?', translation: 'Hôm nay chị sẽ làm cả móng tay và móng chân luôn chứ ạ?' }
      ]
    },
    {
      id: 'l2_s4',
      speaker: 'Customer',
      text: "I'm attending a big event, so I need an elegant and unique nail set.",
      translation: 'Tôi chuẩn bị dự một sự kiện lớn nên cần một bộ móng sang trọng và độc đáo.'
    },
    {
      id: 'l2_s5',
      speaker: 'Tech',
      text: 'Do you have a design in mind?',
      translation: 'Chị đã có mẫu thiết kế nào trong đầu chưa?',
      variations: [
        { id: 'l2_v5_1', text: 'Do you have a design in mind?', translation: 'Chị đã có mẫu nào trong đầu chưa ạ?' },
        { id: 'l2_v5_2', text: 'We have some new sets just arrived. Would you like to take a look?', translation: 'Tiệm em vừa có vài mẫu mới về. Chị có muốn xem qua không ạ?' },
        { id: 'l2_v5_3', text: 'What do you have in mind?', translation: 'Chị đang nghĩ đến kiểu như thế nào ạ?' }
      ]
    },
    {
      id: 'l2_s6',
      speaker: 'Customer',
      text: "Let's see, here is the design I have in mind.",
      translation: 'Để xem nào, đây là mẫu tôi đang nghĩ tới.'
    },
    {
      id: 'l2_s7',
      speaker: 'Tech',
      text: 'Beautiful! This is a 3D powder art style, it suits you very well.',
      translation: 'Đẹp quá! Đây là kiểu bột nổi 3D, nó rất hợp với chị ạ.',
      variations: [
        { id: 'l2_v7_1', text: 'This is a new cat-eye look, simple yet elegant.', translation: 'Đây là mẫu mắt mèo mới, đơn giản nhưng rất sang trọng.' },
        { id: 'l2_v7_2', text: 'Beautiful! This is a 3D powder art style, it suits you very well.', translation: 'Đẹp quá! Đây là kiểu đắp bột nổi 3D, nó rất hợp với chị đấy ạ.' },
        { id: 'l2_v7_3', text: 'This design requires nail extensions and French tips.', translation: 'Mẫu này cần phải nối móng và sơn đầu móng kiểu Pháp chị nhé.' }
      ]
    }
  ],

  vocabularies: [
    { id: 'l2_voc1', word: 'Elegant', translation: 'Thanh lịch/Sang trọng', ipa: '/ˈelɪɡənt/' },
    { id: 'l2_voc2', word: 'Cat-eye', translation: 'Mắt mèo', ipa: '/kæt aɪ/' },
    { id: 'l2_voc3', word: '3D Powder Art', translation: 'Hoa bột nổi 3D', ipa: '/θriː diː ˈpaʊdə ɑːt/' },
    { id: 'l2_voc4', word: 'Suits you', translation: 'Rất hợp với bạn', ipa: '/suːts ju/' }
  ],

  grammarPoints: [
    {
      id: 'l2_g1',
      title: 'Khen ngợi khách hàng',
      description: 'Dùng "It suits you very well" hoặc "That color looks great on you" để tạo sự thiện cảm.',
      examples: [
        { english: 'It suits you very well.', vietnamese: 'Nó rất hợp với chị ạ.' }
      ]
    }
  ]
};
