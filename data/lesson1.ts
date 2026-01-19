
import { Lesson } from '../types';

export const LESSON_1: Lesson = {
  id: 'lesson_1',
  order: 1,
  title: 'Proactive Booking',
  description: 'Chủ động dẫn dắt cuộc gọi đặt lịch: Dịch vụ, Thời gian, Số lượng (Star Spa).',
  thumbnail: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=400&auto=format&fit=crop',
  
  contextBackground: 'Tình huống diễn ra qua điện thoại khi khách hàng gọi đến tiệm để hỏi lịch hẹn. Đây là bước tiếp xúc đầu tiên, yêu cầu sự chuyên nghiệp và khả năng điều phối của nhân viên.',
  contextGoal: 'Nhân viên chủ động dẫn dắt cuộc hội thoại để chốt nhanh 3 thông tin then chốt: Loại dịch vụ, thời gian cụ thể và số lượng người. Cuối cùng, thực hiện xác nhận lại toàn bộ thông tin lịch hẹn một cách lịch sự.',
  contextCharacters: [
    { name: 'Tiên', role: 'Nhân viên tiếp nhận cuộc gọi và điều phối lịch.' },
    { name: 'Ms. Minh', role: 'Khách hàng gọi điện đặt lịch.' }
  ],

  steps: [
    {
      id: 'l1_step1',
      title: 'Bước 1: Lời chào thương hiệu và Xác định nhu cầu',
      purpose: 'Mục đích: Khẳng định sự chuyên nghiệp của tiệm và mở đầu cuộc hội thoại bằng cách sẵn sàng hỗ trợ khách hàng',
      lines: [
        {
          id: 'l1_s1_tech',
          speaker: 'Tech',
          text: 'Hello, Star Spa speaking. How can I help you today?',
          translation: 'Xin chào, tiệm Star Spa xin nghe. Tôi có thể giúp gì cho bạn hôm nay ạ?',
          variations: [
            { id: 'l1_v1_1', text: 'Hello, Star Spa speaking. How can I help you today?', translation: 'Xin chào, tiệm Star Spa xin nghe. Tôi có thể giúp gì cho bạn hôm nay ạ?' },
            { id: 'l1_v1_2', text: 'Hi! This is Star Spa. Would you like to book an appointment?', translation: 'Chào bạn! Đây là tiệm Star Spa. Bạn muốn đặt lịch hẹn phải không ạ?' }
          ]
        },
        {
          id: 'l1_s1_cust',
          speaker: 'Customer',
          text: 'Hi, I want to book an appointment for tomorrow.',
          translation: 'Chào bạn, tôi muốn đặt lịch hẹn cho ngày mai.'
        }
      ]
    },
    {
      id: 'l1_step2',
      title: 'Bước 2: Xác định dịch vụ và Số lượng người',
      purpose: 'Mục đích: Thu thập thông tin chi tiết về quy mô nhóm và loại dịch vụ để chuẩn bị kỹ thuật viên phù hợp',
      lines: [
        {
          id: 'l1_s2_tech',
          speaker: 'Tech',
          text: 'And how many people are you? What service do you want?',
          translation: 'Nhóm mình đi mấy người ạ? Và bạn muốn làm dịch vụ gì?',
          variations: [
            { id: 'l1_v2_1', text: 'And how many people are you? What service do you want?', translation: 'Nhóm mình đi mấy người ạ? Và bạn muốn làm dịch vụ gì?' },
            { id: 'l1_v2_2', text: 'Is it for one person or two? Do you want a full set or just a pedicure?', translation: 'Bạn đặt cho một hay hai người ạ? Bạn muốn làm trọn bộ hay chỉ làm móng chân thôi?' }
          ]
        },
        {
          id: 'l1_s2_cust',
          speaker: 'Customer',
          text: 'I want a full set and a pedicure.',
          translation: 'Tôi muốn làm một bộ đầy đủ và làm móng chân.'
        }
      ]
    },
    {
      id: 'l1_step3',
      title: 'Bước 3: Chốt thời gian và Tên khách hàng',
      purpose: 'Mục đích: Tìm khung giờ trống phù hợp và lưu thông tin cá nhân khách hàng vào sổ đặt hẹn',
      lines: [
        {
          id: 'l1_s3_tech',
          speaker: 'Tech',
          text: 'What time can you come? Is 2 PM available for you?',
          translation: 'Bạn có thể ghé lúc mấy giờ? 2 giờ chiều có tiện cho bạn không?',
          variations: [
            { id: 'l1_v3_1', text: 'What time can you come? Is 2 PM available for you?', translation: 'Bạn có thể ghé lúc mấy giờ? 2 giờ chiều có tiện cho bạn không?' },
            { id: 'l1_v3_2', text: 'I have a slot at 2:30. Can I have your name, please?', translation: 'Tôi còn trống lịch lúc 2:30. Cho tôi xin tên của bạn nhé?' }
          ]
        },
        {
          id: 'l1_s3_cust',
          speaker: 'Customer',
          text: 'My name is Minh. 2:30 is perfect.',
          translation: 'Tên tôi là Minh. 2:30 là khung giờ tuyệt vời.'
        }
      ]
    },
    {
      id: 'l1_step4',
      title: 'Bước 4: Cảm ơn và Xác nhận lại lịch (Chốt thông tin)',
      purpose: 'Mục đích: Kiểm tra chéo thông tin một lần cuối để tránh nhầm lẫn và kết thúc cuộc gọi một cách lịch sự',
      lines: [
        {
          id: 'l1_s4_tech',
          speaker: 'Tech',
          text: 'Thank you for booking. Let me confirm: Ms. Minh, one full set and a pedicure at 2:30 tomorrow. See you then!',
          translation: 'Cám ơn bạn đã đặt lịch. Để tôi xác nhận lại: Chị Minh, một bộ đầy đủ và móng chân vào 2:30 ngày mai. Hẹn gặp lại chị nhé!',
          variations: [
            { id: 'l1_v4_1', text: 'Thank you for booking. Let me confirm: Ms. Minh, one full set and a pedicure at 2:30 tomorrow. See you then!', translation: 'Cám ơn bạn đã đặt lịch. Để tôi xác nhận lại: Chị Minh, một bộ đầy đủ và móng chân vào 2:30 ngày mai. Hẹn gặp lại chị nhé!' },
            { id: 'l1_v4_2', text: 'Got it! So, that’s Ms. Minh for a full set and pedicure at 2:30. Thank you, see you soon!', translation: 'Đã xong ạ! Vậy là chị Minh làm một bộ đầy đủ và móng chân lúc 2:30. Cám ơn chị, hẹn sớm gặp lại!' }
          ]
        }
      ]
    }
  ],

  vocabularies: [
    { id: 'voc1', word: 'Appointment', translation: 'Lịch hẹn', ipa: '/əˈpɔɪntmənt/' },
    { id: 'voc2', word: 'Available', translation: 'Còn trống', ipa: '/əˈveɪləbl/' },
    { id: 'voc3', word: 'Full set', translation: 'Bộ móng trọn bộ', ipa: '/fʊl set/' },
    { id: 'voc4', word: 'Pedicure', translation: 'Làm móng chân', ipa: '/ˈpedɪkjʊər/' },
    { id: 'voc5', word: 'Confirm', translation: 'Xác nhận', ipa: '/kənˈfɜːm/' },
    { id: 'voc6', word: 'Speaking', translation: 'Đang nghe máy', ipa: '/ˈspiːkɪŋ/' }
  ],

  grammarPoints: [
    {
      id: 'g1',
      title: 'Cấu trúc hỏi nhu cầu',
      description: 'Dùng "What service do you want?" để hỏi trực tiếp dịch vụ khách cần.',
      examples: [
        { english: 'What service do you want?', vietnamese: 'Bạn muốn làm dịch vụ gì?' }
      ]
    },
    {
      id: 'g2',
      title: 'Câu hỏi lựa chọn',
      description: 'Dùng cấu trúc "A or B?" để đưa ra các gợi ý dịch vụ.',
      examples: [
        { english: 'Do you want a full set or just a pedicure?', vietnamese: 'Bạn muốn làm trọn bộ hay chỉ làm móng chân thôi?' }
      ]
    }
  ],

  roleplayScenario: `Bạn là nhân viên Tiên đang trực điện thoại tại Star Spa.
  
🎯 Nhiệm vụ:
- Chào hỏi đúng thương hiệu "Star Spa".
- Chốt nhanh: Dịch vụ, Số lượng khách, Thời gian.
- Xác nhận lại toàn bộ thông tin để tránh nhầm lẫn.`,

  roleplayPrompt: `You are Ms. Minh calling Star Spa.
  Behavior:
  - You want to book for tomorrow at 2:30.
  - You want a full set and a pedicure.
  - You only provide your name (Minh) when asked.`
};
