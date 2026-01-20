
import { Lesson } from '../types';

export const LESSON_3: Lesson = {
  id: 'lesson_3',
  order: 3,
  title: 'Cuticle Care & Treatment',
  description: 'Vệ sinh da, xử lý móng khóe và hướng dẫn thực tế cho học viên (Star Spa).',
  thumbnail: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',

  // Fix: Group context properties into a context object
  context: {
    background: 'Tình huống diễn ra tại khu vực làm việc của Star Spa. Kỹ thuật viên Hân vừa thực hiện các bước vệ sinh móng cho Ms. Minh, vừa giảng dạy thực tế cho học viên Mi về cách sử dụng dụng cụ và xử lý các vấn đề chuyên sâu như móng khóe.',
    goal: 'Thực hiện quy trình làm sạch da chuyên nghiệp, sử dụng máy mài móng an toàn và xử lý móng khóe (ingrown nail) một cách nhẹ nhàng. Đồng thời, giải thích cho học viên và khách hàng về lợi ích của việc chuẩn bị móng sạch sẽ.',
    characters: [
      { name: 'Hân', role: 'Kỹ thuật viên chính và hướng dẫn kỹ thuật.' },
      { name: 'Mi', role: 'Học viên quan sát, hỗ trợ dụng cụ.' },
      { name: 'Ms. Minh', role: 'Khách hàng đang gặp vấn đề đau nhức do móng khóe ở chân.' }
    ],
  },

  steps: [
    {
      id: 'l3_step1',
      title: 'Bước 1: Chuẩn bị và Giới thiệu Dụng cụ',
      purpose: 'Mục đích: Đảm bảo đầy đủ dụng cụ cần thiết và khẳng định tiêu chuẩn vệ sinh an toàn tại Star Spa',
      lines: [
        {
          id: 'l3_s1_tech',
          speaker: 'Tech',
          text: 'Mi, please get the tool kit. We need cuticle nippers, a pusher, and the nail drill.',
          translation: 'Mi ơi, lấy dùm chị bộ dụng cụ. Mình cần kiềm cắt da, cây đẩy da và máy mài móng.',
          variations: [
            { id: 'l3_v1_1', text: 'Mi, please get the tool kit. We need cuticle nippers, a pusher, and the nail drill.', translation: 'Mi ơi, lấy dùm chị bộ dụng cụ. Mình cần kiềm cắt da, cây đẩy da và máy mài móng.' },
            { id: 'l3_v1_2', text: "Don't forget the softener and a clean towel.", translation: 'Đừng quên lọ làm mềm da và khăn sạch nhé.' },
            { id: 'l3_v1_3', text: 'Make sure all tools are from the sterilizer. Safety first!', translation: 'Nhớ đảm bảo mọi dụng cụ đều lấy từ máy tiệt trùng nhé. An toàn là trên hết!' }
          ]
        },
        {
          id: 'l3_s1_stu',
          speaker: 'Student',
          text: 'Yes, I have the cuticle nippers and the sanding bands for the drill here.',
          translation: 'Dạ, em có kiềm và đầu nhám cho máy mài ở đây rồi ạ.'
        }
      ]
    },
    {
      id: 'l3_step2',
      title: 'Bước 2: Thao tác trên da và Giải thích kỹ thuật',
      purpose: 'Mục đích: Hướng dẫn học viên cách xử lý da chết đúng cách và tạo sự thoải mái cho khách hàng khi sử dụng bồn ngâm',
      lines: [
        {
          id: 'l3_s2_tech',
          speaker: 'Tech',
          text: 'First, apply the cuticle softener. We use the drill bit to push back the dead skin.',
          translation: 'Đầu tiên, thoa kem làm mềm da. Mình dùng đầu mài để đẩy phần da chết lên.',
          variations: [
            { id: 'l3_v2_1', text: 'First, apply the cuticle softener. We use the drill bit to push back the dead skin.', translation: 'Đầu tiên, thoa kem làm mềm da. Mình dùng đầu mài để đẩy phần da chết lên.' },
            { id: 'l3_v2_2', text: 'Watch the sidewalls. Only cut the non-living tissue to avoid bleeding.', translation: 'Quan sát phần khóe móng nhé. Chỉ cắt phần mô chết để tránh chảy máu.' },
            { id: 'l3_v2_3', text: 'Ms. Minh, please soak your feet in the basin. It helps soften the calluses.', translation: 'Chị Minh ơi, mời chị ngâm chân trong bồn ạ. Nó giúp làm mềm các vết chai.' }
          ]
        },
        {
          id: 'l3_s2_cust',
          speaker: 'Customer',
          text: 'Okay, the water temperature is perfect.',
          translation: 'Được rồi, nhiệt độ nước rất vừa ý.'
        }
      ]
    },
    {
      id: 'l3_step3',
      title: 'Bước 3: Kiểm tra khóe và Tư vấn xử lý',
      purpose: 'Mục đích: Xác định tình trạng móng khóe của khách và xin phép thực hiện thủ thuật xử lý một cách nhẹ nhàng nhất',
      lines: [
        {
          id: 'l3_s3_tech',
          speaker: 'Tech',
          text: 'Ms. Minh, I’m pressing the nail fold. Does it feel sore or itchy?',
          translation: 'Chị Minh, em đang ấn vào phần rãnh móng. Chị có thấy đau hay ngứa không ạ?',
          variations: [
            { id: 'l3_v3_1', text: 'Ms. Minh, I’m pressing the nail fold. Does it feel sore or itchy?', translation: 'Chị Minh, em đang ấn vào phần rãnh móng. Chị có thấy đau hay ngứa không ạ?' },
            { id: 'l3_v3_2', text: 'You have a deep ingrown nail here. Do you want me to clean the corner?', translation: 'Chị có một cái khóe mọc sâu ở đây. Chị có muốn em làm sạch phần khóe này không?' },
            { id: 'l3_v3_3', text: "I'll be very gentle, no bleeding. Don't worry.", translation: 'Em sẽ làm rất nhẹ nhàng, không chảy máu đâu ạ. Chị yên tâm.' }
          ]
        },
        {
          id: 'l3_s3_cust',
          speaker: 'Customer',
          text: "Yes, please take it out. It's very painful, but please be gentle.",
          translation: 'Ừ, lấy ra dùm tôi. Nó đau lắm, nhưng nhớ nhẹ tay nhé.'
        }
      ]
    },
    {
      id: 'l3_step4',
      title: 'Bước 4: Đánh giá kết quả và Lợi ích thẩm mỹ',
      purpose: 'Mục đích: Tổng kết bài học cho học viên và tạo sự tin tưởng cho khách hàng về chất lượng sau khi làm sạch',
      lines: [
        {
          id: 'l3_s4_tech',
          speaker: 'Tech',
          text: 'Look, Mi. The cuticle area is now clear and the nail plate is smooth.',
          translation: 'Nhìn nè Mi. Vùng da quanh móng giờ đã sạch và thân móng đã nhẵn mịn.',
          variations: [
            { id: 'l3_v4_1', text: 'Look, Mi. The cuticle area is now clear and the nail plate is smooth.', translation: 'Nhìn nè Mi. Vùng da quanh móng giờ đã sạch và thân móng đã nhẵn mịn.' },
            { id: 'l3_v4_2', text: 'A clean prep helps the gel color last longer and look much sharper.', translation: 'Chuẩn bị sạch sẽ giúp màu gel bền hơn và nhìn sắc nét hơn nhiều.' }
          ]
        },
        {
          id: 'l3_s4_stu',
          speaker: 'Student',
          text: 'I see, Han! The cuticle line looks so sharp and tidy now.',
          translation: 'Em hiểu rồi chị Hân! Đường viền da nhìn thật sắc sảo và gọn gàng.'
        }
      ]
    }
  ],

  vocabularies: [
    { id: 'l3_voc1', word: 'Cuticle nippers', translation: 'Kiềm cắt da', ipa: '/ˈkjuːtɪkl ˈnɪpərz/' },
    { id: 'l3_voc2', word: 'Nail drill', translation: 'Máy mài móng', ipa: '/neɪl drɪl/' },
    { id: 'l3_voc3', word: 'Sterilizer', translation: 'Máy tiệt trùng', ipa: '/ˈsterəlaɪzər/' },
    { id: 'l3_voc4', word: 'Softener', translation: 'Chất làm mềm', ipa: '/ˈsɒfnər/' },
    { id: 'l3_voc5', word: 'Ingrown nail', translation: 'Móng khóe', ipa: '/ˌɪnɡrəʊn ˈneɪl/' },
    { id: 'l3_voc6', word: 'Sore', translation: 'Đau nhức', ipa: '/sɔːr/' },
    { id: 'l3_voc7', word: 'Itchy', translation: 'Ngứa', ipa: '/ˈɪtʃi/' },
    { id: 'l3_voc8', word: 'Nail fold', translation: 'Rãnh móng', ipa: '/neɪl fəʊld/' },
    { id: 'l3_voc9', word: 'Calluses', translation: 'Vết chai chân', ipa: '/ˈkæləsɪz/' }
  ],

  // Fix: Rename grammarPoints to grammar_points
  grammar_points: [
    {
      id: 'l3_g1',
      title: 'Câu sai khiến/nhờ vả',
      description: 'Dùng "Please + [Động từ] + [Tân ngữ]" để hướng dẫn hoặc nhờ vả lịch sự.',
      examples: [
        { english: 'Please soak your feet in the basin.', vietnamese: 'Vui lòng ngâm chân trong bồn ạ.' }
      ]
    },
    {
      id: 'l3_g2',
      title: 'Câu hỏi về cảm giác',
      description: 'Dùng "Does it feel + [Tính từ]?" để kiểm tra phản ứng của khách.',
      examples: [
        { english: 'Does it feel sore or itchy?', vietnamese: 'Chị có thấy đau hay ngứa không ạ?' }
      ]
    },
    {
      id: 'l3_g3',
      title: 'Câu khẳng định mục đích',
      description: 'Dùng cấu trúc "[Something] helps + [Verb]" để giải thích lợi ích kỹ thuật.',
      examples: [
        { english: 'It helps soften the calluses.', vietnamese: 'Nó giúp làm mềm các vết chai.' }
      ]
    }
  ],
  
  // Fix: Group roleplay properties into a roleplay object
  roleplay: {
    ai_instructions: `Bạn là Hân đang xử lý móng khóe cho Ms. Minh tại Star Spa. 
  
🎯 Nhiệm vụ:
- Hướng dẫn học viên Mi chuẩn bị dụng cụ.
- Trấn an khách hàng khi xử lý khóe sâu.
- Giải thích lợi ích của việc làm da sạch đối với độ bền của gel.`,
    user_instructions: `You are Ms. Minh. Behavior: You have a very painful ingrown nail on your big toe. You are nervous and keep asking the technician to be gentle. You also like the water temperature.`
  }
};
