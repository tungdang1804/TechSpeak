
import { Lesson } from '../types';

export const LESSON_5: Lesson = {
  id: 'lesson_5',
  order: 5,
  title: 'Nail Art & Finishing',
  description: 'Nghệ thuật sơn gel, vẽ trang trí (French tips, charms) và phủ bóng hoàn thiện.',
  thumbnail: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',
  
  // Fix: Group context properties into a context object
  context: {
    background: 'Móng đã có form chuẩn. Hân bắt đầu quy trình sơn gel và trang trí nghệ thuật. Đây là giai đoạn tương tác mạnh về màu sắc và yêu cầu khách hàng phối hợp thao tác với thiết bị (đèn LED/UV).',
    goal: 'Sử dụng các câu mệnh lệnh để điều hướng khách hơ đèn, thực hiện thử màu (Color test) và xác nhận các chi tiết trang trí. Đồng thời, nhân viên cần biết cách trấn an khi khách lo lắng về kỹ thuật.',
    characters: [
      { name: 'Hân', role: 'Kỹ thuật viên trang trí móng.' },
      { name: 'Ms. Minh', role: 'Khách hàng chọn màu và đính đá.' },
      { name: 'Mi', role: 'Học viên quan sát lớp bóng hoàn thiện.' }
    ],
  },

  steps: [
    {
      id: 'l5_step1',
      title: 'Bước 1: Sơn Base và Mệnh lệnh hơ đèn (Base Coat & Lamp)',
      purpose: 'Mục đích: Hướng dẫn khách hàng thao tác với máy hơ để làm khô lớp sơn liên kết và trấn an khách về nhiệt độ thiết bị',
      lines: [
        {
          id: 'l5_s1_tech',
          speaker: 'Tech',
          text: 'Please put your hand in the lamp for 60 seconds.',
          translation: 'Vui lòng đặt tay chị vào đèn trong 60 giây.',
          variations: [
            { id: 'l5_v1_1', text: 'Put only your thumb in the lamp, please?', translation: 'Chị vui lòng đặt ngón tay cái vào đèn thôi nhé.' },
            { id: 'l5_v1_2', text: 'Your hand, please.', translation: 'Chị đưa tay cho em ạ.' },
            { id: 'l5_v1_3', text: 'If it feels hot, please take your hand out for a second.', translation: 'Nếu chị thấy nóng, chị cứ lấy tay ra một chút nhé.' },
            { id: 'l5_v1_4', text: "Don't worry, it won't be hot.", translation: 'Dạ yên tâm, không nóng đâu ạ.' }
          ]
        },
        {
          id: 'l5_s1_cust',
          speaker: 'Customer',
          text: 'Sure. Is the light too hot for my skin?',
          translation: 'Được. Đèn này có quá nóng cho da tôi không?'
        }
      ]
    },
    {
      id: 'l5_step2',
      title: 'Bước 2: Thử màu và Xác nhận độ đậm nhạt (Color Test)',
      purpose: 'Mục đích: Cho khách xem thử màu thực tế trên móng để đảm bảo khách hài lòng with tông màu trước khi sơn toàn bộ',
      lines: [
        {
          id: 'l5_s2_tech',
          speaker: 'Tech',
          text: 'Let’s try the color on your pinky finger first. Do you like this shade?',
          translation: 'Mình thử màu trên ngón út trước nhé. Chị có thích tông màu này không?',
          variations: [
            { id: 'l5_v2_1', text: 'If it’s too light, I can apply two coats to make it darker.', translation: 'Nếu màu hơi nhạt, em có thể sơn hai lớp cho đậm hơn.' }
          ]
        },
        {
          id: 'l5_s2_cust',
          speaker: 'Customer',
          text: 'It looks a bit light. Can we do two coats, please?',
          translation: 'Nhìn hơi nhạt. Làm ơn sơn hai lớp cho tôi nhé?'
        }
      ]
    },
    {
      id: 'l5_step3',
      title: 'Bước 3: Trang trí và Nghiệm thu (Art & Final Finish)',
      purpose: 'Mục đích: Thực hiện các chi tiết vẽ nghệ thuật, phủ bóng bảo vệ và làm sạch bụi bẩn lần cuối để bàn giao bộ móng hoàn hảo',
      lines: [
        {
          id: 'l5_s3_tech',
          speaker: 'Tech',
          text: 'I will add some charms and do the French tips now.',
          translation: 'Bây giờ em sẽ đính đá và vẽ đầu móng kiểu Pháp.',
          variations: [
            { id: 'l5_v3_1', text: 'I’m applying the top coat for a long-lasting shine. One last time in the lamp!', translation: 'Em đang sơn lớp bóng để giữ độ sáng bóng lâu dài. Một lần cuối trong đèn nhé!' },
            { id: 'l5_v3_2', text: 'Let me wipe off the dust with acetone. All done!', translation: 'Để em lau sạch bụi bằng acetol. Đã xong hết rồi ạ!' }
          ]
        },
        {
          id: 'l5_s3_stu',
          speaker: 'Student',
          text: 'The design is beautiful. The shiny finish looks perfect.',
          translation: 'Mẫu thiết kế rất đẹp. Lớp bóng hoàn hảo quá.'
        }
      ]
    }
  ],

  vocabularies: [
    { id: 'l5_v1', word: 'Pinky finger', translation: 'Ngón út', ipa: '/ˈpɪŋki ˈfɪŋɡər/' },
    { id: 'l5_v2', word: 'Thumb', translation: 'Ngón cái', ipa: '/θʌm/' },
    { id: 'l5_v3', word: 'Shade', translation: 'Tông màu/Sắc thái', ipa: '/ʃeɪd/' },
    { id: 'l5_v4', word: 'Two coats', translation: 'Hai lớp sơn', ipa: '/tuː kəʊts/' },
    { id: 'l5_v5', word: 'Take your hand out', translation: 'Lấy tay ra', ipa: '/teɪk jɔːr hænd aʊt/' },
    { id: 'l5_v6', word: 'Charms', translation: 'Phụ kiện / Đá khối', ipa: '/tʃɑːmz/' },
    { id: 'l5_v7', word: 'Shiny finish', translation: 'Lớp bóng hoàn thiện', ipa: '/ˈʃaɪni ˈfɪnɪʃ/' },
    { id: 'l5_v8', word: 'Wipe off', translation: 'Lau sạch', ipa: '/waɪp ɒf/' }
  ],

  // Fix: Rename grammarPoints to grammar_points
  grammar_points: [
    {
      id: 'l5_g1',
      title: 'Mệnh lệnh lịch sự',
      description: 'Dùng "Please + [Động từ]" để hướng dẫn khách thao tác.',
      examples: [
        { english: 'Please put your hand in the lamp.', vietnamese: 'Vui lòng đặt tay vào đèn ạ.' }
      ]
    },
    {
      id: 'l5_g2',
      title: 'Câu điều kiện Trấn an',
      description: 'Dùng cấu trúc "If it feels [tính từ], please [hành động]" để hướng dẫn khách khi họ lo lắng.',
      examples: [
        { english: 'If it feels hot, please take your hand out.', vietnamese: 'Nếu chị thấy nóng, cứ lấy tay ra nhé.' }
      ]
    }
  ],

  // Fix: Group roleplay properties into a roleplay object
  roleplay: {
    ai_instructions: `Bạn là Hân đang trang trí móng cho Ms. Minh. 
  
🎯 Nhiệm vụ:
- Hướng dẫn khách hơ đèn (bao gồm hơ riêng ngón cái).
- Trấn an khách về độ nóng của đèn.
- Thử màu và thực hiện trang trí French tips.`,
    user_instructions: `You are Ms. Minh. Behavior: Picky about color shade, worried about LED heat, loves charms.`
  }
};
