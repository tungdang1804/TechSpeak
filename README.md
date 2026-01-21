# 📚 TechSpeak Master - Enterprise Technical Specification (v8.1 - Beta 0.7)

TechSpeak Master được xây dựng dựa trên triết lý **"Zero-Classroom English"**, tập trung vào việc mô phỏng môi trường làm việc thực tế thông qua AI. Kiến trúc hệ thống tuân thủ mô hình **Clean Architecture** kết hợp với **Vertical Slice** để đảm bảo tính cô lập và khả năng mở rộng (Scalability).

## 🚀 Phiên bản hiện tại: Beta 0.7
- **Mô-đun Từ vựng Thông minh**: Phân loại Specialized vs General.
- **AI Roleplay Engine**: Tích hợp chấm điểm chuyên sâu.
- **Phòng học ảo 2D**: Visualizing tiến trình học tập.
- **Hệ thống Audio Pipeline**: Giảm thiểu độ trễ TTS.

## 🏗️ Deep Module Tree (Full Hierarchy)

```text
.
├── 🏛️ app/                         # APPLICATION ENTRY & ROUTING
│   ├── App.tsx                    # Root Component & Global Navigation Registry
│   ├── index.tsx                  # Application bootstrap
│   ├── types.ts                   # Centralized Domain Type Definitions (Source of Truth)
│   └── constants.ts               # Global assets & configuration flags
│
├── 🚀 features/                    # VERTICAL SLICES (Feature-centric logic & UI)
│   ├── 🎭 roleplay/               # AI Interaction Domain
│   │   ├── RoleplayChat.tsx       # Smart Chat Container
│   │   ├── useRoleplayLogic.ts    # State machine for AI turns
│   │   └── RoleplaySummaryView.ts # Post-session analysis UI
│   ├── 🕵️ detective/              # Gamification (Listening Skills)
│   │   ├── StarDetective.tsx      # Main game engine UI
│   │   ├── useDetectiveLogic.ts   # Audio-sync & scoring logic
│   │   └── DetectiveChoiceGrid.ts # Dynamic choice rendering
│   ├── 📚 library/                 # Knowledge Base Module
│   │   ├── VocabularyModule.tsx   # Dynamic industry filtering
│   │   ├── GrammarModule.tsx      # Real-world patterns
│   │   └── IPAModule.tsx          # Phonetic lab
│   └── 🛠️ onboarding/              # User Initiation Flow
│       └── OnboardingWizard.tsx   # Multi-step profile setup
│
├── 🎯 domain/                      # BUSINESS LOGIC LAYER (Pure Domain Services)
│   ├── 💰 economy/                # Economy & Progression
│   │   └── economy.ts             # Star Points, Leveling, Star-rating logic
│   ├── 🏥 industry/               # Industry Intelligence
│   │   └── industry.ts            # Industry Registry & Contextual Resolvers
│   └── 🔤 vocabulary/             # Knowledge Intelligence
│       └── filterService.ts       # Dynamic Segregation (Specialized vs General)
│
├── 🛡️ core/                        # FOUNDATIONAL LAYER (Infrastructure)
│   ├── 🧠 ai/                     # Gemini AI Integration Layer
│   │   ├── base.ts                # API Client Initialization
│   │   ├── dictionaryService.ts   # Contextual Meaning Resolver
│   │   ├── assessmentService.ts   # Pronunciation Scoring Engine
│   │   └── conversationService.ts # Roleplay Orchestrator
│   ├── 🔊 audio/                  # Audio Pipeline Engine
│   │   ├── engine.ts              # PCM Decoding & AudioContext Management
│   │   ├── storage.ts             # IndexedDB Persistent Cache
│   │   ├── queueManager.ts        # Throttling & Priority Queue
│   │   └── api.ts                 # Gemini TTS Bridge
│   └── 📡 firebase/               # Persistence & Auth Bridge
│       ├── authService.ts         # User session & Account Upgrading
│       └── userService.ts         # Cloud Profile Synchronizer
│
├── 📂 content/                     # KNOWLEDGE REPOSITORY (JSON/Static)
│   ├── 📖 lessons/                # Hierarchical JSON Lesson Files
│   │   ├── nails/                 # Specialized Nail Lessons
│   │   └── bartender/             # Specialized Bartender Lessons
│   ├── 📊 data/                   # Static Datasets (IPA, Global Vocab)
│   └── lessons_manifest.json      # Dynamic Content Registry (Catalog)
│
└── 🧩 shared/                      # CROSS-CUTTING CONCERNS
    ├── components/                # UI Kit (Atomic: Flashcards, Recorders)
    ├── hooks/                     # Common hooks (AppNavigation, AudioRecorder)
    └── utils/                     # Generic Helpers (Base64, Formatting)
```

## 🛠️ Key Design Patterns Applied

### 1. The "Push & Persist" Pattern (Vocabulary Intelligence)
Hệ thống không bao giờ xóa dữ liệu. Khi người dùng chuyển đổi ngành nghề (`primaryIndustry`), logic tại `domain/vocabulary/filterService.ts` sẽ:
- Đưa từ vựng ngành hiện tại vào **Specialized Pool**.
- Tự động gộp toàn bộ từ vựng của các ngành cũ vào **General Pool** (Kho chung).
=> Giúp người dùng tích lũy kiến thức đa ngành mà không bị rối loạn tiêu điểm.

### 2. Audio Processing Pipeline (Latency Optimization)
Để đạt độ trễ thấp nhất trong AI Conversation, chúng tôi áp dụng quy trình:
`Gemini API (Base64) -> QueueManager (Prioritization) -> Storage (IndexedDB) -> Engine (PCM Decoding)`.

### 3. Content Manifest Injection
Thay vì load cứng toàn bộ bài học, `services/dataService.ts` chỉ fetch `lessons_manifest.json` và tải các module bài học theo yêu cầu (Lazy Loading), giúp giảm 80% lưu lượng mạng ban đầu.

---
*TechSpeak Master: Architecture built for professional excellence.*