import { IPASound } from '../types';

export const IPA_SOUNDS: IPASound[] = [
  // I. Nguyên Âm Đơn (Monophthongs)
  {
    symbol: 'iː',
    type: 'vowel',
    name: 'Âm "i" dài',
    description: 'Môi căng ngang, lưỡi nâng cao. Kéo dài âm.',
    examples: [
      { word: 'Clean', meaning: 'Làm sạch', ipa: '/kliːn/' },
      { word: 'Deep', meaning: 'Sâu (deep tissue)', ipa: '/diːp/' }
    ]
  },
  {
    symbol: 'ɪ',
    type: 'vowel',
    name: 'Âm "i" ngắn',
    description: 'Môi thả lỏng, lưỡi thấp và lùi hơn /iː/. Âm thanh ngắn.',
    examples: [
      { word: 'Finish', meaning: 'Hoàn thành', ipa: '/ˈfɪnɪʃ/' },
      { word: 'Tip', meaning: 'Tiền boa', ipa: '/tɪp/' }
    ]
  },
  {
    symbol: 'e',
    type: 'vowel',
    name: 'Âm "e" ngắn',
    description: 'Miệng mở vừa, lưỡi nằm giữa.',
    examples: [
      { word: 'Gel', meaning: 'Sơn Gel', ipa: '/dʒel/' },
      { word: 'Neck', meaning: 'Cổ', ipa: '/nek/' }
    ]
  },
  {
    symbol: 'æ',
    type: 'vowel',
    name: 'Âm "a" bẹt',
    description: 'Miệng mở rộng ngang, lưỡi hạ thấp và phẳng.',
    examples: [
      { word: 'Wax', meaning: 'Sáp tẩy lông', ipa: '/wæks/' },
      { word: 'Black', meaning: 'Màu đen', ipa: '/blæk/' }
    ]
  },
  {
    symbol: 'ʌ',
    type: 'vowel',
    name: 'Âm "ă" ngắn',
    description: 'Môi thả lỏng, lưỡi ở giữa miệng. Âm ngắn, dứt khoát.',
    examples: [
      { word: 'Buff', meaning: 'Chà nhám', ipa: '/bʌf/' },
      { word: 'Cut', meaning: 'Cắt da/móng', ipa: '/kʌt/' }
    ]
  },
  {
    symbol: 'ɒ',
    type: 'vowel',
    name: 'Âm "o" ngắn',
    description: 'Môi hơi tròn, lưỡi hạ thấp và lùi. Âm ngắn.',
    examples: [
      { word: 'Soft', meaning: 'Mềm mại', ipa: '/sɒft/' },
      { word: 'Hot', meaning: 'Nóng (khăn nóng)', ipa: '/hɒt/' }
    ]
  },
  {
    symbol: 'ɔː',
    type: 'vowel',
    name: 'Âm "o" dài',
    description: 'Môi hơi tròn và chu nhẹ. Lưỡi lùi về sau. Kéo dài âm.',
    examples: [
      { word: 'Warm', meaning: 'Ấm', ipa: '/wɔːm/' },
      { word: 'Short', meaning: 'Ngắn', ipa: '/ʃɔːt/' }
    ]
  },
  {
    symbol: 'uː',
    type: 'vowel',
    name: 'Âm "u" dài',
    description: 'Môi chu tròn nhỏ, lưỡi nâng cao và lùi. Kéo dài âm.',
    examples: [
      { word: 'Blue', meaning: 'Màu xanh', ipa: '/bluː/' },
      { word: 'Glue', meaning: 'Keo dán móng', ipa: '/gluː/' }
    ]
  },
  {
    symbol: 'ʊ',
    type: 'vowel',
    name: 'Âm "u" ngắn',
    description: 'Môi chu tròn lỏng lẻo. Lưỡi thấp hơn /uː/. Âm ngắn.',
    examples: [
      { word: 'Push', meaning: 'Đẩy (da)', ipa: '/pʊʃ/' },
      { word: 'Foot', meaning: 'Chân', ipa: '/fʊt/' }
    ]
  },
  {
    symbol: 'ə',
    type: 'vowel',
    name: 'Âm Schwa',
    description: 'Âm nhẹ nhất, môi lưỡi trung tính, thả lỏng.',
    examples: [
      { word: 'Appointment', meaning: 'Lịch hẹn', ipa: '/əˈpɔɪntmənt/' },
      { word: 'Open', meaning: 'Mở cửa', ipa: '/ˈəʊpən/' }
    ]
  },
  {
    symbol: 'ɜː',
    type: 'vowel',
    name: 'Âm "ơ" dài',
    description: 'Môi hơi căng. Lưỡi ở vị trí trung tâm, hơi cong lên. Kéo dài âm.',
    examples: [
      { word: 'Service', meaning: 'Dịch vụ', ipa: '/ˈsɜːvɪs/' },
      { word: 'Work', meaning: 'Làm việc', ipa: '/wɜːk/' }
    ]
  },
  {
    symbol: 'ɑː',
    type: 'vowel',
    name: 'Âm "a" dài',
    description: 'Miệng mở rộng, lưỡi hạ thấp nhất và lùi. Âm sâu, kéo dài.',
    examples: [
      { word: 'Spa', meaning: 'Spa', ipa: '/spɑː/' },
      { word: 'Card', meaning: 'Thẻ thanh toán', ipa: '/kɑːd/' }
    ]
  },
  // II. Nguyên Âm Đôi (Diphthongs)
  {
    symbol: 'eɪ',
    type: 'diphthong',
    name: 'Âm "ei"',
    description: 'Bắt đầu bằng âm /e/ lướt nhanh về /ɪ/.',
    examples: [
      { word: 'Shape', meaning: 'Dáng móng', ipa: '/ʃeɪp/' },
      { word: 'Pay', meaning: 'Thanh toán', ipa: '/peɪ/' }
    ]
  },
  {
    symbol: 'aɪ',
    type: 'diphthong',
    name: 'Âm "ai"',
    description: 'Bắt đầu bằng âm /a/ lướt nhanh về /ɪ/.',
    examples: [
      { word: 'Wipe', meaning: 'Lau', ipa: '/waɪp/' },
      { word: 'Dry', meaning: 'Làm khô', ipa: '/draɪ/' }
    ]
  },
  {
    symbol: 'ɔɪ',
    type: 'diphthong',
    name: 'Âm "oi"',
    description: 'Bắt đầu bằng âm /ɔː/ lướt nhanh về /ɪ/.',
    examples: [
      { word: 'Oil', meaning: 'Dầu (Cuticle oil)', ipa: '/ɔɪl/' },
      { word: 'Foil', meaning: 'Giấy bạc', ipa: '/fɔɪl/' }
    ]
  },
  {
    symbol: 'əʊ',
    type: 'diphthong',
    name: 'Âm "âu"',
    description: 'Bắt đầu bằng âm /ə/ lướt nhanh về /ʊ/.',
    examples: [
      { word: 'Coat', meaning: 'Lớp sơn (Top coat)', ipa: '/kəʊt/' },
      { word: 'Toe', meaning: 'Ngón chân', ipa: '/təʊ/' }
    ]
  },
  {
    symbol: 'aʊ',
    type: 'diphthong',
    name: 'Âm "au"',
    description: 'Bắt đầu bằng âm /a/ lướt nhanh về /ʊ/.',
    examples: [
      { word: 'Powder', meaning: 'Bột', ipa: '/ˈpaʊdə/' },
      { word: 'Down', meaning: 'Xuống (nhìn xuống)', ipa: '/daʊn/' }
    ]
  },
  // III. Phụ Âm (Consonants)
  {
    symbol: 'p',
    type: 'consonant',
    description: 'Môi khép lại hoàn toàn, bật hơi mạnh (vô thanh).',
    examples: [
      { word: 'Pink', meaning: 'Màu hồng', ipa: '/pɪŋk/' },
      { word: 'Polish', meaning: 'Nước sơn', ipa: '/ˈpɒlɪʃ/' }
    ]
  },
  {
    symbol: 'b',
    type: 'consonant',
    description: 'Môi khép lại, bật hơi và rung dây thanh quản (hữu thanh).',
    examples: [
      { word: 'Base', meaning: 'Lớp nền', ipa: '/beɪs/' },
      { word: 'Back', meaning: 'Lưng', ipa: '/bæk/' }
    ]
  },
  {
    symbol: 't',
    type: 'consonant',
    description: 'Đầu lưỡi chạm lợi hàm trên, bật hơi mạnh (vô thanh).',
    examples: [
      { word: 'Top', meaning: 'Lớp trên', ipa: '/tɒp/' },
      { word: 'Tip', meaning: 'Đầu móng', ipa: '/tɪp/' }
    ]
  },
  {
    symbol: 'd',
    type: 'consonant',
    description: 'Đầu lưỡi chạm lợi hàm trên, bật hơi và rung dây thanh quản (hữu thanh).',
    examples: [
      { word: 'Dip', meaning: 'Nhúng (bột)', ipa: '/dɪp/' },
      { word: 'Dry', meaning: 'Khô', ipa: '/draɪ/' }
    ]
  },
  {
    symbol: 'k',
    type: 'consonant',
    description: 'Sau lưỡi chạm vòm mềm, bật hơi mạnh (vô thanh).',
    examples: [
      { word: 'Cut', meaning: 'Cắt', ipa: '/kʌt/' },
      { word: 'Color', meaning: 'Màu sắc', ipa: '/ˈkʌlər/' }
    ]
  },
  {
    symbol: 'g',
    type: 'consonant',
    description: 'Sau lưỡi chạm vòm mềm, bật hơi và rung dây thanh quản (hữu thanh).',
    examples: [
      { word: 'Gold', meaning: 'Màu vàng kim', ipa: '/gəʊld/' },
      { word: 'Glove', meaning: 'Găng tay', ipa: '/glʌv/' }
    ]
  },
  {
    symbol: 'f',
    type: 'consonant',
    description: 'Răng trên chạm môi dưới, đẩy hơi liên tục (ma sát vô thanh).',
    examples: [
      { word: 'File', meaning: 'Dũa móng', ipa: '/faɪl/' },
      { word: 'Foot', meaning: 'Bàn chân', ipa: '/fʊt/' }
    ]
  },
  {
    symbol: 'v',
    type: 'consonant',
    description: 'Răng trên chạm môi dưới, đẩy hơi ra và rung dây thanh quản (hữu thanh).',
    examples: [
      { word: 'Removal', meaning: 'Tháo/Gỡ', ipa: '/rɪˈmuːvl/' },
      { word: 'Seven', meaning: 'Số 7', ipa: '/ˈsevn/' }
    ]
  },
  {
    symbol: 'θ',
    type: 'consonant',
    name: 'th (vô thanh)',
    description: 'Đầu lưỡi giữa hai hàm răng. Thổi hơi qua khe, không rung dây thanh.',
    examples: [
      { word: 'Thin', meaning: 'Mỏng', ipa: '/θɪn/' },
      { word: 'Thick', meaning: 'Dày', ipa: '/θɪk/' }
    ]
  },
  {
    symbol: 'ð',
    type: 'consonant',
    name: 'th (hữu thanh)',
    description: 'Vị trí lưỡi giống /θ/, rung dây thanh quản.',
    examples: [
      { word: 'This', meaning: 'Cái này', ipa: '/ðɪs/' },
      { word: 'Smooth', meaning: 'Mịn màng', ipa: '/smuːð/' }
    ]
  },
  {
    symbol: 's',
    type: 'consonant',
    description: 'Lưỡi cong nhẹ, đẩy hơi tạo âm "xì" (vô thanh).',
    examples: [
      { word: 'Skin', meaning: 'Da', ipa: '/skɪn/' },
      { word: 'Set', meaning: 'Bộ móng', ipa: '/set/' }
    ]
  },
  {
    symbol: 'z',
    type: 'consonant',
    description: 'Vị trí lưỡi giống /s/, rung dây thanh quản (hữu thanh).',
    examples: [
      { word: 'Size', meaning: 'Kích cỡ', ipa: '/saɪz/' },
      { word: 'Please', meaning: 'Vui lòng', ipa: '/pliːz/' }
    ]
  },
  {
    symbol: 'ʃ',
    type: 'consonant',
    name: 'sh',
    description: 'Môi hơi chu, lưỡi nâng gần vòm miệng. Đẩy hơi tạo âm "suýt" dài.',
    examples: [
      { word: 'Shape', meaning: 'Dáng móng', ipa: '/ʃeɪp/' },
      { word: 'Wash', meaning: 'Rửa', ipa: '/wɒʃ/' }
    ]
  },
  {
    symbol: 'tʃ',
    type: 'consonant',
    name: 'ch',
    description: 'Bắt đầu bằng /t/, nhanh chóng chuyển sang /ʃ/.',
    examples: [
      { word: 'Chip', meaning: 'Mẻ (móng)', ipa: '/tʃɪp/' },
      { word: 'Change', meaning: 'Thay đổi', ipa: '/tʃeɪndʒ/' }
    ]
  },
  {
    symbol: 'dʒ',
    type: 'consonant',
    name: 'j',
    description: 'Bắt đầu bằng /d/, nhanh chóng chuyển sang /ʒ/.',
    examples: [
      { word: 'Gel', meaning: 'Gel', ipa: '/dʒel/' },
      { word: 'Job', meaning: 'Công việc', ipa: '/dʒɒb/' }
    ]
  },
  {
    symbol: 'm',
    type: 'consonant',
    description: 'Môi khép, hơi thoát qua mũi.',
    examples: [
      { word: 'Mask', meaning: 'Mặt nạ', ipa: '/mɑːsk/' },
      { word: 'More', meaning: 'Thêm', ipa: '/mɔːr/' }
    ]
  },
  {
    symbol: 'n',
    type: 'consonant',
    description: 'Đầu lưỡi chạm lợi hàm trên, hơi thoát qua mũi.',
    examples: [
      { word: 'Nail', meaning: 'Móng tay', ipa: '/neɪl/' },
      { word: 'Clean', meaning: 'Sạch', ipa: '/kliːn/' }
    ]
  },
  {
    symbol: 'ŋ',
    type: 'consonant',
    description: 'Sau lưỡi chạm vòm mềm, hơi thoát qua mũi.',
    examples: [
      { word: 'Long', meaning: 'Dài', ipa: '/lɒŋ/' },
      { word: 'Ring', meaning: 'Nhẫn (ngón đeo nhẫn)', ipa: '/rɪŋ/' }
    ]
  },
  {
    symbol: 'h',
    type: 'consonant',
    description: 'Họng mở, hơi thở ra không bị cản trở.',
    examples: [
      { word: 'Hand', meaning: 'Bàn tay', ipa: '/hænd/' },
      { word: 'Hot', meaning: 'Nóng', ipa: '/hɒt/' }
    ]
  },
  {
    symbol: 'l',
    type: 'consonant',
    description: 'Đầu lưỡi chạm lợi hàm trên, hơi thoát ra hai bên lưỡi.',
    examples: [
      { word: 'Light', meaning: 'Đèn/Nhẹ', ipa: '/laɪt/' },
      { word: 'Leg', meaning: 'Chân', ipa: '/leg/' }
    ]
  },
  {
    symbol: 'r',
    type: 'consonant',
    description: 'Lưỡi cuộn nhẹ về sau, không chạm vòm miệng.',
    examples: [
      { word: 'Red', meaning: 'Màu đỏ', ipa: '/red/' },
      { word: 'Relax', meaning: 'Thư giãn', ipa: '/rɪˈlæks/' }
    ]
  },
  {
    symbol: 'j',
    type: 'consonant',
    description: 'Giữa lưỡi nâng cao về phía vòm miệng (bán nguyên âm).',
    examples: [
      { word: 'Yellow', meaning: 'Màu vàng', ipa: '/ˈjeləʊ/' },
      { word: 'Use', meaning: 'Sử dụng', ipa: '/juːz/' }
    ]
  },
  {
    symbol: 'w',
    type: 'consonant',
    description: 'Môi chu tròn và nhanh chóng mở ra (bán nguyên âm).',
    examples: [
      { word: 'Wet', meaning: 'Ướt', ipa: '/wet/' },
      { word: 'White', meaning: 'Màu trắng', ipa: '/waɪt/' }
    ]
  },
];