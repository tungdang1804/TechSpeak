
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
    title: "1. HÌNH DÁNG MÓNG (NAIL SHAPES)",
    icon: "📐",
    subGroups: [
      {
        name: "Các dáng phổ biến",
        items: [
          { id: 'ns_1', text: 'Square', sub: 'Móng vuông' },
          { id: 'ns_2', text: 'Round', sub: 'Móng tròn' },
          { id: 'ns_3', text: 'Oval', sub: 'Móng bầu dục' },
          { id: 'ns_4', text: 'Squoval', sub: 'Móng vuông bầu' },
          { id: 'ns_5', text: 'Almond', sub: 'Móng hạnh nhân' },
          { id: 'ns_6', text: 'Coffin / Ballerina', sub: 'Móng quan tài' },
          { id: 'ns_7', text: 'Stiletto', sub: 'Móng nhọn hoắt' },
        ]
      }
    ]
  },
  {
    title: "2. DỤNG CỤ & THIẾT BỊ (TOOLS)",
    icon: "⚙️",
    subGroups: [
      {
        name: "Dụng cụ vệ sinh & mài",
        items: [
          { id: 'tl_1', text: 'Cuticle nippers', sub: 'Kiềm cắt da' },
          { id: 'tl_2', text: 'Pusher', sub: 'Cây đẩy da' },
          { id: 'tl_3', text: 'Nail drill / Drill bit', sub: 'Máy mài móng / Đầu mài' },
          { id: 'tl_4', text: 'Sanding bands', sub: 'Đầu nhám cho máy mài' },
          { id: 'tl_5', text: 'Sterilizer', sub: 'Máy tiệt trùng' },
          { id: 'tl_6', text: 'LED / UV Lamp', sub: 'Đèn hơ móng' },
          { id: 'tl_7', text: 'Foot basin', sub: 'Bồn ngâm chân' },
          { id: 'tl_8', text: 'Nail probe', sub: 'Cây nạy khóe móng' },
        ]
      }
    ]
  },
  {
    title: "3. MÀU SẮC & HIỆU ỨNG (EFFECTS)",
    icon: "🎨",
    subGroups: [
      {
        name: "Sơn & Trang trí",
        items: [
          { id: 'ce_1', text: 'Gel polish', sub: 'Sơn gel' },
          { id: 'ce_2', text: 'Base gel / Top coat', sub: 'Sơn liên kết / Sơn bóng lớp cuối' },
          { id: 'ce_3', text: 'Cat-eye (Fine/Coarse grain)', sub: 'Mắt mèo (hạt mịn/hạt to)' },
          { id: 'ce_4', text: 'Matte finish', sub: 'Sơn lì (không bóng)' },
          { id: 'ce_5', text: 'Chrome / Mirror effect', sub: 'Hiệu ứng tráng gương' },
          { id: 'ce_6', text: 'French tips', sub: 'Sơn đầu móng kiểu Pháp' },
          { id: 'ce_7', text: 'Quail egg / Speckled', sub: 'Hiệu ứng trứng cúc' },
        ]
      }
    ]
  },
  {
    title: "4. KỸ THUẬT & TÌNH TRẠNG (TECH)",
    icon: "🧤",
    subGroups: [
      {
        name: "Dịch vụ nâng cao",
        items: [
          { id: 'kt_1', text: 'Nail tips / Acrylic / Gel extensions', sub: 'Móng giả / Đắp bột / Úp gel' },
          { id: 'kt_2', text: 'Cuticle care', sub: 'Chăm sóc da quanh móng' },
          { id: 'kt_3', text: 'Ingrown nail', sub: 'Móng khóe' },
          { id: 'kt_4', text: 'Nail fold / Sidewalls', sub: 'Rãnh móng / Khóe móng' },
          { id: 'kt_5', text: 'Primer', sub: 'Sơn chống kiềm / Lớp lót khô móng' },
        ]
      }
    ]
  }
];
