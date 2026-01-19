
import { Lesson } from '../types';

export const LESSON_4: Lesson = {
  id: 'lesson_4',
  order: 4,
  title: 'Nail Extension & Shaping',
  description: 'Kỹ thuật dũa nhám, gắn móng tip, đắp gel và tạo dáng móng (Almond, Square, Coffin).',
  thumbnail: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80&w=400&auto=format&fit=crop',
  
  contextBackground: 'Sau khi làm sạch da ở Bài 3, Hân bắt đầu xử lý bề mặt móng để chuẩn bị gắn móng giả. Đây là giai đoạn kỹ thuật then chốt tại Star Spa để đảm bảo độ bền (không bị bong tróc) và tạo ra hình dáng móng (form) hoàn hảo theo ý khách.',
  contextGoal: 'Thực hiện quy trình chuẩn bị bề mặt (buff móng, chống kiềm), tư vấn và thực hiện các kỹ thuật nối móng (Tips, Acrylic, Gel Extensions), đồng thời kiểm tra độ cân đối giữa hai bàn tay trước khi sơn màu.',
  contextCharacters: [
    { name: 'Hân', role: 'Kỹ thuật viên thực hiện kỹ thuật chính.' },
    { name: 'Mi', role: 'Học viên quan sát và hỗ trợ kiểm tra độ cân đối.' },
    { name: 'Ms. Minh', role: 'Khách hàng tham gia chọn dáng móng và độ dài.' }
  ],

  steps: [
    {
      id: 'l4_step1',
      title: 'Bước 1: Chuẩn bị bề mặt (Surface Prep)',
      purpose: 'Mục đích: Giải thích lý do phải mài nhám và lau acetol để tăng độ bám dính, đồng thời hướng dẫn khách bảo vệ da khỏi đèn UV',
      lines: [
        {
          id: 'l4_s1_tech',
          speaker: 'Tech',
          text: 'Before we start, we need to buff the surface and use acetone so that the gel stays longer.',
          translation: 'Trước khi bắt đầu, mình cần dũa nhám bề mặt và dùng acetol để lớp gel bám bền hơn.',
          variations: [
            { id: 'l4_v1_1', text: 'Please put on these gloves. They will protect your skin from the UV light.', translation: 'Chị vui lòng đeo găng tay này vào. Chúng sẽ bảo vệ da chị khỏi tia UV.' },
            { id: 'l4_v1_2', text: 'I’m applying the primer now to dehydrate the nail.', translation: 'Em đang sơn lớp chống kiềm để làm khô bề mặt móng.' }
          ]
        },
        {
          id: 'l4_s1_cust',
          speaker: 'Customer',
          text: 'Okay, I’m ready. Just let me know what to do next.',
          translation: 'Được rồi, tôi sẵn sàng. Cứ bảo tôi cần làm gì tiếp theo nhé.'
        }
      ]
    },
    {
      id: 'l4_step2',
      title: 'Bước 2: Tư vấn kỹ thuật và Chọn Form (Technique & Shape)',
      purpose: 'Mục đích: Tư vấn loại móng giả phù hợp với sự kiện của khách và xác định hình dáng móng mong muốn',
      lines: [
        {
          id: 'l4_s2_tech',
          speaker: 'Tech',
          text: 'Which nail shape do you prefer: Almond, Square, or Coffin?',
          translation: 'Chị thích dáng móng nào hơn: Hạnh nhân, Vuông hay Quan tài?',
          variations: [
            { id: 'l4_v2_1', text: 'For your event, I suggest gel extensions or acrylic for a natural look.', translation: 'Với sự kiện của chị, em đề xuất úp gel hoặc đắp bột để nhìn tự nhiên.' }
          ]
        },
        {
          id: 'l4_s2_cust',
          speaker: 'Customer',
          text: "I'll go with Almond shape and Gel extensions, please.",
          translation: 'Cho tôi dáng hạnh nhân và úp gel nhé.'
        }
      ]
    },
    {
      id: 'l4_step3',
      title: 'Bước 3: Xác nhận độ dài và Kiểm tra độ cân đối (Length & Balance)',
      purpose: 'Mục đích: Chốt độ dài móng trước khi dũa và kiểm tra kỹ thuật để đảm bảo 10 ngón tay thẳng và đều nhau',
      lines: [
        {
          id: 'l4_s3_tech',
          speaker: 'Tech',
          text: 'Let me check if the nail tips are straight and balanced on both hands.',
          translation: 'Để em kiểm tra xem móng tip có thẳng và cân đối ở cả hai bàn tay không nhé.',
          variations: [
            { id: 'l4_v3_1', text: 'Is this length okay for you, or should I cut it shorter?', translation: 'Độ dài này ổn với chị chưa, hay em nên cắt ngắn thêm ạ?' },
            { id: 'l4_v3_2', text: 'How does the form look to you? Are you happy with it?', translation: 'Chị thấy form móng thế nào? Chị có hài lòng không?' }
          ]
        },
        {
          id: 'l4_s3_stu',
          speaker: 'Student',
          text: 'The nails look perfectly straight and aligned now.',
          translation: 'Móng nhìn đã hoàn toàn thẳng và đều nhau rồi ạ.'
        }
      ]
    }
  ],

  vocabularies: [
    { id: 'l4_v1', word: 'Buff', translation: 'Dũa nhám bề mặt', ipa: '/bʌf/' },
    { id: 'l4_v2', word: 'Acetone', translation: 'Nước rửa móng/Acetol', ipa: '/ˈæsɪtəʊn/' },
    { id: 'l4_v3', word: 'Stay longer', translation: 'Bám lâu / Bền', ipa: '/steɪ ˈlɒŋɡər/' },
    { id: 'l4_v4', word: 'UV Gloves', translation: 'Găng tay chống UV', ipa: '/ˌjuː ˈviː ɡlʌvz/' },
    { id: 'l4_v5', word: 'Primer', translation: 'Sơn chống kiềm', ipa: '/ˈpraɪmər/' },
    { id: 'l4_v6', word: 'Almond shape', translation: 'Dáng hạnh nhân', ipa: '/ˈɑːmənd ʃeɪp/' },
    { id: 'l4_v7', word: 'Straight & Balanced', translation: 'Thẳng và cân đối', ipa: '/streɪt ænd ˈbælənst/' },
    { id: 'l4_v8', word: 'Aligned', translation: 'Thẳng hàng/Đều nhau', ipa: '/əˈlaɪnd/' }
  ],

  grammarPoints: [
    {
      id: 'l4_g1',
      title: 'Cấu trúc mục đích',
      description: 'Dùng cấu trúc "[Hành động] + so that + [Kết quả]" để giải thích quy trình.',
      examples: [
        { english: 'I buff the surface so that the gel stays longer.', vietnamese: 'Em mài nhám để gel bền hơn.' }
      ]
    },
    {
      id: 'l4_g2',
      title: 'Câu hỏi lựa chọn',
      description: 'Dùng "Which [Danh từ] do you prefer: A, B or C?" để tư vấn.',
      examples: [
        { english: 'Which nail shape do you prefer: Almond or Square?', vietnamese: 'Chị thích dáng móng nào hơn: Hạnh nhân hay Vuông?' }
      ]
    },
    {
      id: 'l4_g3',
      title: 'Câu hỏi xin ý kiến',
      description: 'Dùng "How does [Something] look to you?" để kiểm tra sự hài lòng.',
      examples: [
        { english: 'How does the form look to you?', vietnamese: 'Chị thấy form móng thế nào?' }
      ]
    }
  ],
  
  roleplayScenario: `Bạn là Hân đang tạo form móng cho Ms. Minh tại Star Spa. 
  
🎯 Nhiệm vụ:
- Giải thích việc dũa nhám và đeo găng tay UV.
- Tư vấn dáng Almond cho sự kiện.
- Kiểm tra độ thẳng và xác nhận độ dài với khách.`,

  roleplayPrompt: `You are Ms. Minh. Behavior: You want a specific length (medium). You are curious about why you need to wear gloves. You want to make sure your nails are not crooked (straight).`
};
