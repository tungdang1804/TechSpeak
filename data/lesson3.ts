
import { Lesson } from '../types';

export const LESSON_3: Lesson = {
  id: 'lesson_3',
  order: 3,
  title: 'Cuticle Care & Treatment',
  description: 'Vệ sinh da, xử lý móng khóe và hướng dẫn thực tế cho học viên (Star Spa).',
  thumbnail: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop',

  contextBackground: 'Tình huống diễn ra tại khu vực làm việc của Star Spa. Nhân viên vừa thực hiện kỹ thuật chăm sóc cho khách, vừa giảng dạy thực tế cho học viên mới.',
  contextGoal: 'Thực hiện quy trình làm sạch chuyên nghiệp, xử lý móng khóe an toàn và giải thích lợi ích của việc làm da sạch cho học viên.',
  contextCharacters: [
    { name: 'Hân', role: 'Kỹ thuật viên chính, trực tiếp làm cho khách.' },
    { name: 'Mi', role: 'Học viên quan sát và hỗ trợ dụng cụ.' },
    { name: 'Ms. Minh', role: 'Khách hàng bị đau móng khóe ở chân.' }
  ],

  roleplayScenario: `Bạn là Hân đang làm dịch vụ tại Star Spa cho Ms. Minh.
  
🎯 Nhiệm vụ:
- Yêu cầu học viên Mi chuẩn bị dụng cụ.
- Giải thích thao tác cho Mi.
- Tư vấn xử lý khóe cho Ms. Minh nhẹ nhàng.
- Giải thích tại sao da sạch thì sơn mới đẹp.`,

  roleplayPrompt: `You are a tech named Hân working at Star Spa. You have a student (Mi) watching and a client (Ms. Minh) with an ingrown nail.
  
  Behavior:
  - Tell Mi to get the tool kit (nippers, pusher).
  - Ask Ms. Minh if she feels sore when you press the nail fold.
  - Assure Ms. Minh you will be very gentle, no bleeding.`,

  situationTitle: 'Chăm Sóc Da và Xử Lý Móng Khóe',
  situationScript: [
    {
      id: 'l3_s1',
      speaker: 'Tech',
      text: 'Mi, please get the tool kit. We need cuticle nippers, a pusher, and the nail drill.',
      translation: 'Mi ơi, lấy dùm chị bộ dụng cụ. Mình cần kiềm cắt da, cây đẩy da và máy mài móng.',
      variations: [
        { id: 'l3_v1_1', text: 'Mi, please get the tool kit. We need cuticle nippers, a pusher, and the nail drill.', translation: 'Mi ơi, lấy dùm chị bộ dụng cụ. Mình cần kiềm cắt da, cây đẩy da và máy mài móng.' },
        { id: 'l3_v1_2', text: "Don't forget the softener and a clean towel. Also, check if the foot basin is ready.", translation: 'Đừng quên lọ làm mềm da và khăn sạch nhé. Kiểm tra xem bồn ngâm chân sẵn sàng chưa luôn.' },
        { id: 'l3_v1_3', text: 'Make sure all tools are from the sterilizer. Safety first!', translation: 'Nhớ đảm bảo mọi dụng cụ đều lấy từ máy tiệt trùng nhé. An toàn là trên hết!' }
      ]
    },
    {
      id: 'l3_s2',
      speaker: 'Student',
      text: 'Yes, I have the cuticle nippers and the sanding bands for the drill here.',
      translation: 'Dạ, em có kiềm và đầu nhám cho máy mài ở đây rồi ạ.'
    },
    {
      id: 'l3_s3',
      speaker: 'Tech',
      text: 'First, apply the cuticle softener. We use the drill bit to push back the dead skin.',
      translation: 'Đầu tiên thoa kem mềm da. Dùng đầu mài để đẩy da chết lên.',
      variations: [
        { id: 'l3_v3_1', text: 'First, apply the cuticle softener. We use the drill bit to push back the dead skin.', translation: 'Đầu tiên, thoa kem mềm da. Mình dùng đầu mài để đẩy phần da chết lên.' },
        { id: 'l3_v3_2', text: 'Watch the sidewalls and the eponychium. Only cut the non-living tissue.', translation: 'Quan sát phần khóe móng và vùng nếp móng nhé. Chỉ cắt phần mô chết thôi.' },
        { id: 'l3_v3_3', text: 'Ms. Minh, please soak your feet in the built-in basin. It helps soften the calluses.', translation: 'Chị Minh ơi, mời chị ngâm chân trong bồn dính liền này ạ. Nó giúp làm mềm các vết chai.' }
      ]
    },
    {
      id: 'l3_s4',
      speaker: 'Customer',
      text: 'Okay, the water temperature is perfect.',
      translation: 'Được rồi, nhiệt độ nước rất vừa ý.'
    },
    {
      id: 'l3_s5',
      speaker: 'Tech',
      text: "Ms. Minh, I’m pressing the nail fold. Does it feel sore or itchy?",
      translation: 'Chị Minh, em đang ấn vào phần rãnh móng. Chị thấy đau hay ngứa không ạ?',
      variations: [
        { id: 'l3_v5_1', text: "Ms. Minh, I’m pressing the nail fold. Does it feel sore or itchy?", translation: 'Chị Minh, em đang ấn vào phần rãnh móng. Chị có thấy đau hay ngứa không ạ?' },
        { id: 'l3_v5_2', text: 'You have a deep ingrown nail here. Do you want me to clean the corner?', translation: 'Chị có một cái khóe mọc sâu ở đây. Chị có muốn em làm sạch phần khóe này không?' },
        { id: 'l3_v5_3', text: "I will use a special nipper and a nail probe. I'll be very gentle, no bleeding.", translation: 'Em sẽ dùng kiềm chuyên dụng và cây nạy khóe. Em sẽ làm rất nhẹ nhàng, không chảy máu đâu ạ.' }
      ]
    },
    {
      id: 'l3_s6',
      speaker: 'Customer',
      text: "Yes, please take it out. It's very painful, but please be gentle and don't make it bleed.",
      translation: 'Ừ, lấy ra dùm tôi. Nó đau lắm, nhưng nhớ nhẹ tay và đừng làm chảy máu nhé.'
    },
    {
      id: 'l3_s7',
      speaker: 'Tech',
      text: 'Look, Mi. The cuticle area is now clear and the nail plate is smooth.',
      translation: 'Nhìn nè Mi. Vùng da giờ đã sạch và thân móng đã nhẵn mịn.',
      variations: [
        { id: 'l3_v7_1', text: 'Look, Mi. The cuticle area is now clear and the nail plate is smooth.', translation: 'Nhìn nè Mi. Vùng da quanh móng giờ đã sạch và thân móng đã nhẵn mịn.' },
        { id: 'l3_v7_2', text: 'Because the skin is clean, the gel polish will look much sharper near the edges.', translation: 'Vì phần da đã sạch nên khi sơn gel đường viền sẽ sắc nét hơn nhiều.' },
        { id: 'l3_v7_3', text: 'A clean prep helps the color last longer and prevents lifting at the base.', translation: 'Chuẩn bị sạch sẽ giúp màu sơn bền hơn và tránh bị bong tróc ở gốc móng.' }
      ]
    }
  ],

  vocabularies: [
    { id: 'voc1', word: 'Cuticle nippers', translation: 'Kiềm cắt da', ipa: '/ˈkjuːtɪkl ˈnɪpərz/' },
    { id: 'voc2', word: 'Ingrown nail', translation: 'Móng khóe (mọc ngược)', ipa: '/ˌɪnɡrəʊn ˈneɪl/' },
    { id: 'voc3', word: 'Gentle', translation: 'Nhẹ nhàng', ipa: '/ˈdʒentl/' },
    { id: 'voc4', word: 'Bleeding', translation: 'Chảy máu', ipa: '/ˈbliːdɪŋ/' },
    { id: 'voc5', word: 'Softener', translation: 'Nước mềm da', ipa: '/ˈsɒfnər/' }
  ],

  grammarPoints: [
    {
      id: 'l3_g1',
      title: 'Mệnh lệnh lịch sự',
      description: 'Dùng "Please + Verb" để hướng dẫn khách hoặc học viên một cách chuyên nghiệp.',
      examples: [
        { english: 'Please be gentle.', vietnamese: 'Làm nhẹ tay thôi ạ.' }
      ]
    }
  ]
};
