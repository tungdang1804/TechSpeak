
import { Lesson } from '../types';

export const LESSON_2: Lesson = {
  id: 'lesson_2',
  order: 2,
  title: 'Welcome & Consultation',
  description: 'Đón khách, mời nước và tư vấn mẫu thiết kế (Cat-eye, 3D, extensions).',
  thumbnail: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop',

  contextBackground: 'Khách hàng Ms. Minh trực tiếp ghé tiệm theo lịch hẹn đã đặt trước qua điện thoại. Không gian lúc này là tương tác trực tiếp, yêu cầu sự niềm nở và kỹ năng tư vấn thẩm mỹ chuyên sâu để hiện thực hóa ý tưởng của khách hàng.',
  contextGoal: 'Chào đón khách, mời ngồi vào vị trí làm việc và thực hiện tư vấn thiết kế (màu sắc, hình dáng, kỹ thuật trang trí) giúp Ms. Minh chọn được bộ móng sang trọng, độc đáo cho sự kiện lớn sắp tới.',
  contextCharacters: [
    { name: 'Tiên', role: 'Nhân viên phụ trách tiếp đón, kiểm tra lịch hẹn và tư vấn thiết kế.' },
    { name: 'Ms. Minh', role: 'Khách hàng đã có lịch hẹn, cần sự tư vấn chuyên nghiệp cho bộ móng dự sự kiện.' }
  ],

  steps: [
    {
      id: 'l2_step1',
      title: 'Bước 1: Đón Khách và Kiểm tra Lịch hẹn',
      purpose: 'Mục đích: Xác nhận danh tính khách hàng và mời khách vào vị trí làm việc để bắt đầu dịch vụ một cách chu đáo',
      lines: [
        {
          id: 'l2_s1_cust',
          speaker: 'Customer',
          text: 'Hi, my name is Minh. I booked an appointment for 2:30.',
          translation: 'Chào bạn, tên tôi là Minh. Tôi đã đặt lịch lúc 2:30.'
        },
        {
          id: 'l2_s1_tech',
          speaker: 'Tech',
          text: 'Welcome to Star Spa, Ms. Minh. Your station is ready.',
          translation: 'Chào mừng chị Minh đến với Star Spa. Chỗ ngồi của chị đã sẵn sàng rồi ạ.',
          variations: [
            { id: 'l2_v1_1', text: 'Welcome to Star Spa, Ms. Minh. Your station is ready.', translation: 'Chào mừng chị Minh đến với Star Spa. Chỗ ngồi của chị đã sẵn sàng rồi ạ.' },
            { id: 'l2_v1_2', text: 'Hello, Ms. Minh. Please wait in the waiting area for a few minutes. I will be right with you.', translation: 'Chào chị Minh. Vui lòng đợi ở khu vực chờ vài phút nhé. Tôi sẽ đến hỗ trợ chị ngay.' },
            { id: 'l2_v1_3', text: 'Hello, Ms. Minh. Your station is ready. Please come this way.', translation: 'Chào chị Minh. Chỗ của chị đã sẵn sàng. Mời chị đi lối này ạ.' }
          ]
        }
      ]
    },
    {
      id: 'l2_step2',
      title: 'Bước 2: Hỏi Nhu cầu và Ý định',
      purpose: 'Mục đích: Tìm hiểu mục đích sử dụng bộ móng của khách hàng để đưa ra những gợi ý phù hợp với trang phục và hoàn cảnh',
      lines: [
        {
          id: 'l2_s2_tech',
          speaker: 'Tech',
          text: 'What would you like to get done today?',
          translation: 'Hôm nay chị muốn làm gì ạ?',
          variations: [
            { id: 'l2_v2_1', text: 'What would you like to get done today?', translation: 'Hôm nay chị muốn làm gì ạ?' },
            { id: 'l2_v2_2', text: 'Are you looking for a total transformation today?', translation: 'Chị có muốn thay đổi diện mạo hoàn toàn cho bộ móng hôm nay không?' },
            { id: 'l2_v2_3', text: 'Will you be doing both manicure and pedicure today?', translation: 'Hôm nay chị sẽ làm cả móng tay và móng chân luôn chứ ạ?' }
          ]
        },
        {
          id: 'l2_s2_cust',
          speaker: 'Customer',
          text: "I'm attending a big event, so I need an elegant and unique nail set.",
          translation: 'Tôi chuẩn bị dự một sự kiện lớn nên cần một bộ móng sang trọng và độc đáo.'
        }
      ]
    },
    {
      id: 'l2_step3',
      title: 'Bước 3: Tư vấn Thiết kế và Xác nhận Mẫu',
      purpose: 'Mục đích: Giới thiệu các kỹ thuật đặc trưng và xác nhận mẫu thiết kế cuối cùng trước khi nhân viên kỹ thuật bắt đầu thao tác',
      lines: [
        {
          id: 'l2_s3_tech_1',
          speaker: 'Tech',
          text: 'Do you have a design in mind?',
          translation: 'Chị đã có mẫu nào trong đầu chưa ạ?',
          variations: [
            { id: 'l2_v3_1', text: 'Do you have a design in mind?', translation: 'Chị đã có mẫu nào trong đầu chưa ạ?' },
            { id: 'l2_v3_2', text: 'We have some new sets just arrived. Would you like to take a look?', translation: 'Tiệm em vừa có vài mẫu mới về. Chị có muốn xem qua không ạ?' },
            { id: 'l2_v3_3', text: 'What do you have in mind?', translation: 'Chị đang nghĩ đến kiểu như thế nào ạ?' }
          ]
        },
        {
          id: 'l2_s3_cust',
          speaker: 'Customer',
          text: "Let's see, here is the design I have in mind.",
          translation: 'Để xem nào, đây là mẫu mà tôi đang nghĩ tới.'
        },
        {
          id: 'l2_s3_tech_2',
          speaker: 'Tech',
          text: 'Beautiful! This is a 3D powder art style, it suits you very well.',
          translation: 'Đẹp quá! Đây là kiểu đắp bột nổi 3D, nó rất hợp với chị đấy ạ.',
          variations: [
            { id: 'l2_v3_4', text: 'This is a new cat-eye look, simple yet elegant.', translation: 'Đây là mẫu mắt mèo mới, đơn giản nhưng rất sang trọng.' },
            { id: 'l2_v3_5', text: 'Beautiful! This is a 3D powder art style, it suits you very well.', translation: 'Đẹp quá! Đây là kiểu đắp bột nổi 3D, nó rất hợp với chị đấy ạ.' },
            { id: 'l2_v3_6', text: 'This design requires nail extensions and French tips.', translation: 'Mẫu này cần phải nối móng và sơn đầu móng kiểu Pháp chị nhé.' }
          ]
        }
      ]
    }
  ],

  vocabularies: [
    { id: 'l2_voc1', word: 'Station', translation: 'Vị trí/Ghế làm việc', ipa: '/ˈsteɪʃn/' },
    { id: 'l2_voc2', word: 'Transformation', translation: 'Sự thay đổi diện mạo', ipa: '/ˌtrænsfəˈmeɪʃn/' },
    { id: 'l2_voc3', word: 'Elegant', translation: 'Sang trọng/Thanh lịch', ipa: '/ˈelɪɡənt/' },
    { id: 'l2_voc4', word: 'Cat-eye', translation: 'Mắt mèo (hiệu ứng)', ipa: '/kæt aɪ/' },
    { id: 'l2_voc5', word: '3D Powder Art', translation: 'Đắp bột nổi 3D', ipa: '/θriː diː ˈpaʊdə ɑːt/' },
    { id: 'l2_voc6', word: 'Nail extensions', translation: 'Nối móng', ipa: '/neɪl ɪkˈstenʃnz/' },
    { id: 'l2_voc7', word: 'Suits', translation: 'Phù hợp/Hợp với', ipa: '/suːts/' }
  ],

  grammarPoints: [
    {
      id: 'l2_g1',
      title: 'Đề nghị lịch sự',
      description: 'Dùng "Would you like to... ?" để đưa ra gợi ý hoặc đề nghị dịch vụ.',
      examples: [
        { english: 'Would you like to take a look?', vietnamese: 'Chị có muốn xem qua không ạ?' }
      ]
    },
    {
      id: 'l2_g2',
      title: 'Hỏi về ý định',
      description: 'Dùng "Are you looking for... ?" để tìm hiểu mong muốn của khách.',
      examples: [
        { english: 'Are you looking for a total transformation today?', vietnamese: 'Chị có muốn thay đổi diện mạo hoàn toàn cho bộ móng hôm nay không?' }
      ]
    },
    {
      id: 'l2_g3',
      title: 'Xác nhận kế hoạch',
      description: 'Dùng "Will you be doing... ?" để xác nhận dịch vụ khách sẽ thực hiện.',
      examples: [
        { english: 'Will you be doing both manicure and pedicure today?', vietnamese: 'Hôm nay chị sẽ làm cả móng tay và móng chân luôn chứ ạ?' }
      ]
    }
  ],
  
  roleplayScenario: `Bạn là nhân viên Tiên đón tiếp Ms. Minh tại Star Spa. 
  
🎯 Nhiệm vụ:
- Chào đón niềm nở, xác nhận lịch hẹn 2:30.
- Tư vấn mẫu móng cho sự kiện lớn (Cat-eye hoặc 3D).
- Xác nhận các kỹ thuật đi kèm (Extensions, French tips).`,

  roleplayPrompt: `You are Ms. Minh. Behavior: You have an appointment at 2:30. You want something elegant for a wedding. You are interested in a unique 3D powder art design.`
};
