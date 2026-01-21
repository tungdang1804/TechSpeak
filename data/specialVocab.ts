
export interface SpecialVocabItem {
  id: string;
  text: string;
  sub: string;
  ipa?: string;
  tag?: string;
}

export interface SpecialVocabGroup {
  industry: string; // 'common' | 'nails' | 'bartender' | 'flooring' | 'mechanic'
  title: string;
  icon: string;
  subGroups: {
    name: string;
    items: SpecialVocabItem[];
  }[];
}

export const SPECIALIZED_VOCAB: SpecialVocabGroup[] = [
  // --- 0. DÙNG CHUNG (COMMON POOL) ---
  {
    industry: 'common',
    title: "GIAO TIẾP CƠ BẢN",
    icon: "💬",
    subGroups: [
      {
        name: "Chào hỏi & Tiếp đón",
        items: [
          { id: 'com_1', text: 'How can I help you?', sub: 'Tôi có thể giúp gì cho bạn?' },
          { id: 'com_2', text: 'Welcome to our shop', sub: 'Chào mừng quý khách đến tiệm' },
          { id: 'com_3', text: 'Please have a seat', sub: 'Mời bạn ngồi' },
        ]
      },
      {
        name: "Thanh toán",
        items: [
          { id: 'com_4', text: 'Cash or Card?', sub: 'Tiền mặt hay dùng thẻ?' },
          { id: 'com_5', text: 'Do you want a receipt?', sub: 'Bạn có muốn lấy hóa đơn không?' },
        ]
      }
    ]
  },

  // --- 1. NGÀNH NAILS & SPA ---
  {
    industry: 'nails',
    title: "HÌNH DÁNG MÓNG (SHAPES)",
    icon: "📐",
    subGroups: [
      {
        name: "Các dáng phổ biến",
        items: [
          { id: 'ns_1', text: 'Square', sub: 'Móng vuông' },
          { id: 'ns_2', text: 'Round', sub: 'Móng tròn' },
          { id: 'ns_3', text: 'Almond', sub: 'Móng hạnh nhân' },
          { id: 'ns_4', text: 'Coffin', sub: 'Móng quan tài' },
          { id: 'ns_5', text: 'Stiletto', sub: 'Móng nhọn' },
        ]
      }
    ]
  },
  {
    industry: 'nails',
    title: "KỸ THUẬT & DỤNG CỤ",
    icon: "⚙️",
    subGroups: [
      {
        name: "Dụng cụ vệ sinh",
        items: [
          { id: 'tl_1', text: 'Cuticle nippers', sub: 'Kiềm cắt da' },
          { id: 'tl_2', text: 'Nail drill', sub: 'Máy mài móng' },
          { id: 'tl_3', text: 'Buffer', sub: 'Cục chà nhám' },
        ]
      }
    ]
  },

  // --- 2. NGÀNH BARTENDER ---
  {
    industry: 'bartender',
    title: "DỤNG CỤ PHA CHẾ",
    icon: "🍸",
    subGroups: [
      {
        name: "Dụng cụ cơ bản",
        items: [
          { id: 'bt_1', text: 'Shaker', sub: 'Bình lắc' },
          { id: 'bt_2', text: 'Jigger', sub: 'Ly đong' },
          { id: 'bt_3', text: 'Strainer', sub: 'Dụng cụ lọc' },
        ]
      }
    ]
  },

  // --- 3. NGÀNH FLOORING / CONSTRUCTION ---
  {
    industry: 'flooring',
    title: "VẬT LIỆU XÂY DỰNG",
    icon: "🧱",
    subGroups: [
      {
        name: "Các loại sàn",
        items: [
          { id: 'fl_1', text: 'Hardwood', sub: 'Gỗ cứng' },
          { id: 'fl_2', text: 'Laminate', sub: 'Gỗ công nghiệp' },
          { id: 'fl_3', text: 'Ceramic Tile', sub: 'Gạch men' },
        ]
      }
    ]
  }
];
