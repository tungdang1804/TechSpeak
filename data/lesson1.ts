
import { Lesson } from '../types';

export const LESSON_1: Lesson = {
  id: 'lesson_1',
  order: 1,
  title: 'Proactive Booking',
  description: 'Chủ động dẫn dắt cuộc gọi đặt lịch: Dịch vụ, Thời gian, Số lượng (Star Spa).',
  thumbnail: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop',
  
  contextBackground: 'Tình huống diễn ra qua điện thoại khi khách hàng gọi đến để hỏi lịch hẹn. Đây là bước tiếp xúc đầu tiên, yêu cầu sự chuyên nghiệp và khả năng điều phối lịch trình của nhân viên ngay từ lời chào thương hiệu.',
  contextGoal: 'Nhân viên chủ động dẫn dắt cuộc hội thoại để chốt nhanh 3 thông tin then chốt: Loại dịch vụ, thời gian cụ thể và số lượng người đi cùng. Xác nhận lại toàn bộ thông tin để chốt lịch hẹn.',
  contextCharacters: [
    { name: 'Tiên', role: 'Nhân viên tiếp nhận cuộc gọi và điều phối lịch.' },
    { name: 'Ms. Minh', role: 'Khách hàng gọi điện đặt lịch.' }
  ],

  roleplayScenario: `Bạn là nhân viên Tiên đang trực điện thoại tại Star Spa.
  
🎯 Nhiệm vụ:
- Chào hỏi đúng thương hiệu "Star Spa".
- Chốt nhanh: Dịch vụ, Số lượng khách, Thời gian.
- Xác nhận lại (Confirmation) trước khi kết thúc cuộc gọi.`,

  roleplayPrompt: `You are Ms. Minh calling Star Spa.
  
  Behavior:
  - You want to book an appointment for tomorrow.
  - You only give information when asked.
  - You want a "Full set" and a "Pedicure".
  - You prefer coming around "2:30 PM".`,
  
  situationTitle: 'Đặt Lịch Hẹn Chủ Động',
  situationScript: [
    { 
      id: 'l1_s1', 
      speaker: 'Tech', 
      text: 'Hello, Star Spa speaking. How can I help you today?', 
      translation: 'Xin chào, Star Spa xin nghe. Tôi có thể giúp gì cho bạn hôm nay ạ?',
      variations: [
        { id: 'v1_1', text: 'Hello, Star Spa speaking. How can I help you today?', translation: 'Xin chào, tiệm Star Spa xin nghe. Tôi có thể giúp gì cho bạn hôm nay ạ?' },
        { id: 'v1_2', text: 'Hi! This is Star Spa. Would you like to book an appointment?', translation: 'Chào bạn! Đây là tiệm Star Spa. Bạn muốn đặt lịch hẹn phải không ạ?' }
      ]
    },
    { 
      id: 'l1_s2', 
      speaker: 'Customer', 
      text: 'Hi, I want to book an appointment for tomorrow.', 
      translation: 'Chào bạn, tôi muốn đặt lịch hẹn cho ngày mai.' 
    },
    { 
      id: 'l1_s3', 
      speaker: 'Tech', 
      text: 'And how many people are you? What service do you want?', 
      translation: 'Nhóm mình đi mấy người ạ? Và bạn muốn làm dịch vụ gì?',
      variations: [
        { id: 'v3_1', text: 'And how many people are you? What service do you want?', translation: 'Nhóm mình đi mấy người ạ? Và bạn muốn làm dịch vụ gì?' },
        { id: 'v3_2', text: 'Is it for one person or two? Do you want a full set or just a pedicure?', translation: 'Bạn đặt cho một hay hai người ạ? Bạn muốn làm trọn bộ hay chỉ làm móng chân thôi?' }
      ]
    },
    { 
      id: 'l1_s4', 
      speaker: 'Customer', 
      text: 'I want a full set and a pedicure.', 
      translation: 'Tôi muốn làm một bộ đầy đủ và móng chân.' 
    },
    { 
      id: 'l1_s5', 
      speaker: 'Tech', 
      text: 'What time can you come? Is 2 PM available for you?', 
      translation: 'Bạn có thể ghé lúc mấy giờ? 2 giờ chiều có tiện cho bạn không?',
      variations: [
        { id: 'v5_1', text: 'What time can you come? Is 2 PM available for you?', translation: 'Bạn có thể ghé lúc mấy giờ? 2 giờ chiều có tiện cho bạn không?' },
        { id: 'v5_2', text: 'I have a slot at 2:30. Can I have your name, please?', translation: 'Tôi còn trống lịch lúc 2:30. Cho tôi xin tên của bạn nhé?' }
      ]
    },
    { 
      id: 'l1_s6', 
      speaker: 'Customer', 
      text: 'My name is Minh. 2:30 is perfect.', 
      translation: 'Tên tôi là Minh. 2:30 là khung giờ tuyệt vời.' 
    },
    { 
      id: 'l1_s7', 
      speaker: 'Tech', 
      text: 'Thank you for booking. Ms. Minh, one full set and a pedicure at 2:30 tomorrow. See you then!', 
      translation: 'Cám ơn bạn đã đặt lịch. Để tôi xác nhận lại: Chị Minh, một bộ đầy đủ và móng chân vào 2:30 ngày mai. Hẹn gặp lại chị!',
      variations: [
        { id: 'v7_1', text: 'Thank you for booking. Let me confirm: Ms. Minh, one full set and a pedicure at 2:30 tomorrow. See you then!', translation: 'Cám ơn bạn đã đặt lịch. Để tôi xác nhận lại: Chị Minh, một bộ đầy đủ và móng chân vào 2:30 ngày mai. Hẹn gặp lại chị nhé!' },
        { id: 'v7_2', text: 'Got it! So, that’s Ms. Minh for a full set and pedicure at 2:30. Thank you, see you soon!', translation: 'Đã xong ạ! Vậy là chị Minh làm một bộ đầy đủ và móng chân lúc 2:30. Cám ơn chị, hẹn sớm gặp lại!' }
      ]
    },
  ],

  vocabularies: [
    { id: 'voc1', word: 'Appointment', translation: 'Lịch hẹn', ipa: '/əˈpɔɪntmənt/' },
    { id: 'voc2', word: 'Available', translation: 'Còn trống', ipa: '/əˈveɪləbl/' },
    { id: 'voc3', word: 'Full set', translation: 'Bộ móng trọn bộ', ipa: '/fʊl set/' },
    { id: 'voc4', word: 'Pedicure', translation: 'Làm móng chân', ipa: '/ˈpedɪkjʊər/' },
    { id: 'voc5', word: 'Confirm', translation: 'Xác nhận', ipa: '/kənˈfɜːm/' }
  ],

  grammarPoints: [
    {
      id: 'g1',
      title: 'Hỏi nhu cầu lịch sự',
      description: 'Dùng "How can I help you?" hoặc "Would you like...?" để mở đầu.',
      examples: [
        { english: 'How can I help you today?', vietnamese: 'Tôi có thể giúp gì cho bạn hôm nay ạ?' }
      ]
    }
  ]
};
