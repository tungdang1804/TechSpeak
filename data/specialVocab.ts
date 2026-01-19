
export interface SpecialVocabItem {
  id: string;
  text: string;
  sub: string;
  ipa?: string;
  tag?: string;
}

export interface SpecialVocabGroup {
  title: string;
  icon: string;
  subGroups: {
    name: string;
    items: SpecialVocabItem[];
  }[];
}

export const SPECIALIZED_VOCAB: SpecialVocabGroup[] = [
  {
    title: "MÀU SẮC (THE COLORS)",
    icon: "🎨",
    subGroups: [
      {
        name: "Cơ bản (Basic Colors)",
        items: [
          { id: 'sc_1', text: 'Solid color', sub: 'Màu sơn đặc, không bóng/nhũ', ipa: '/ˈsɒlɪd ˈkʌlər/' },
          { id: 'sc_2', text: 'Nude / Neutral', sub: 'Tông màu da, trung tính', ipa: '/nuːd / ˈnjuːtrəl/' },
          { id: 'sc_3', text: 'Pastel', sub: 'Màu phấn nhạt, dịu nhẹ', ipa: '/ˈpæstel/' },
          { id: 'sc_4', text: 'Neon / Bright', sub: 'Màu dạ quang, rực rỡ', ipa: '/ˈniːɒn / braɪt/' },
          { id: 'sc_5', text: 'Primary colors', sub: 'Các màu cơ bản (Đỏ, Xanh, Vàng)', ipa: '/ˈpraɪməri ˈkʌlərz/' },
        ]
      },
      {
        name: "Nâng cao (Advanced Effects)",
        items: [
          { id: 'sc_6', text: 'Fine grain Cat-eye', sub: 'Mắt mèo hạt mịn', ipa: '/faɪn ɡreɪn kæt aɪ/' },
          { id: 'sc_7', text: 'Coarse grain Cat-eye', sub: 'Mắt mèo hạt to', ipa: '/kɔːrs ɡreɪn kæt aɪ/' },
          { id: 'sc_8', text: 'Quail egg effect', sub: 'Hiệu ứng trứng cúc (đốm đen)', ipa: '/kweɪl eɡ ɪˈfekt/' },
          { id: 'sc_9', text: 'Glossy Brown', sub: 'Màu nâu bóng', ipa: '/ˈɡlɒsi braʊn/' },
          { id: 'sc_10', text: 'Matte finish', sub: 'Sơn lì (không bóng)', ipa: '/mæt ˈfɪnɪʃ/' },
          { id: 'sc_11', text: 'Chrome / Mirror effect', sub: 'Hiệu ứng tráng gương', ipa: '/krəʊm / ˈmɪrər ɪˈfekt/' },
          { id: 'sc_12', text: 'Glitter / Shimmer', sub: 'Màu nhũ / Kim tuyến', ipa: '/ˈɡlɪtər / ˈʃɪmər/' },
          { id: 'sc_13', text: 'Ombré / Gradient', sub: 'Màu chuyển sắc', ipa: '/ˈɒmbreɪ / ˈɡreɪdiənt/' },
        ]
      }
    ]
  },
  {
    title: "HÌNH DÁNG (NAIL SHAPES)",
    icon: "📐",
    subGroups: [
      {
        name: "Phổ biến (Common Shapes)",
        items: [
          { id: 'ss_1', text: 'Square', sub: 'Móng vuông (đầu bằng, cạnh vuông)', ipa: '/skweər/' },
          { id: 'ss_2', text: 'Round', sub: 'Móng tròn (đường cong tự nhiên)', ipa: '/raʊnd/' },
          { id: 'ss_3', text: 'Oval', sub: 'Móng bầu dục (dài và bầu hơn tròn)', ipa: '/ˈəʊvl/' },
          { id: 'ss_4', text: 'Squoval', sub: 'Móng vuông bầu', ipa: '/ˈskwəʊvl/' },
        ]
      },
      {
        name: "Thời thượng (Trendy Shapes)",
        items: [
          { id: 'ss_5', text: 'Almond', sub: 'Móng hạnh nhân (đầu nhọn nhẹ)', ipa: '/ˈɑːmənd/' },
          { id: 'ss_6', text: 'Coffin / Ballerina', sub: 'Móng quan tài (đầu bằng, cạnh nhọn)', ipa: '/ˈkɒfɪn / ˌbæləˈriːnə/' },
          { id: 'ss_7', text: 'Stiletto', sub: 'Móng nhọn hoắt (rất dài)', ipa: '/stɪˈletəʊ/' },
          { id: 'ss_8', text: 'Pointed', sub: 'Móng nhọn vừa phải', ipa: '/ˈpɔɪntɪd/' },
        ]
      }
    ]
  }
];
