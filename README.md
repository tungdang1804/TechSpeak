# 📚 TechSpeak Master - Technical Documentation

TechSpeak Master là một nền tảng học tiếng Anh chuyên ngành được xây dựng theo kiến trúc **Layered Modular Architecture**. Hệ thống tách biệt rõ ràng giữa Giao diện, Logic nghiệp vụ và Hạ tầng dịch vụ.

## 🌳 1. Cấu trúc Phân cấp (Architecture Hierarchy)

Cây phân cấp dưới đây thể hiện luồng từ **Entry Point** (Vỏ ngoài) -> **Main Orchestrator** (Điều phối) -> **Functional Modules** (Module chức năng) -> **Atomic Components** (Thành phần nhỏ nhất).

```text
ROOT (index.html / App.tsx)
│
├── 🧱 LAYER 1: Orchestration & Navigation (App.tsx + useAppNavigation)
│   ├── [Module] MainHeader (Branding, Points, User Profile Trigger)
│   ├── [Module] TabNavigation (Bottom bar: Home, Roadmap, Library, Profile)
│   └── [Layer] Global Overlays (UnlockModal, GlobalLoading)
│
├── 🧱 LAYER 2: Major Feature Modules (Pages)
│   │
│   ├── 📁 Dashboard (Home)
│   │   ├── [Sub] ProgressBanner (Hành trình học tập)
│   │   ├── [Sub] StatGrid (Points, Star Level)
│   │   ├── [Sub] LessonCard (Lối tắt bài học tiếp theo)
│   │   └── [Sub] IndustryScroll (Nail, Spa, Massage...)
│   │
│   ├── 📁 Lesson Engine (LessonPage + useLessonLogic)
│   │   ├── [Tab] LessonSituationView (Bối cảnh & Hội thoại)
│   │   │   └── [Unit] InteractiveText (Click-to-lookup engine)
│   │   ├── [Tab] LessonVocabView (Flashcards & Word list)
│   │   ├── [Tab] LessonGrammarView (Mẫu câu ứng dụng)
│   │   └── [Overlay] NailSpeakScore (Phòng Lab phát âm AI)
│   │
│   ├── 📁 Library (Library + useLibraryLogic)
│   │   ├── [Module] VocabularyModule (Chuyên ngành & A-Z)
│   │   ├── [Module] GrammarModule (Thư viện mẫu câu đã lưu)
│   │   └── [Module] IPAModule (Bảng phiên âm quốc tế)
│   │
│   ├── 📁 Challenge Hub (Gamification Center)
│   │   ├── [Game] Star Detective (Listening Game + useDetectiveLogic)
│   │   │   └── [Unit] DetectiveChoiceGrid (Ma trận lựa chọn)
│   │   └── [Game] AI Roleplay Combat (Hội thoại thực chiến + useRoleplayLogic)
│   │       ├── [View] RoleplayMessageList (Luồng chat)
│   │       └── [View] RoleplaySummaryView (Báo cáo & Chấm điểm)
│   │
│   └── 📁 Profile (User Center)
│       ├── [Module] AIQuotaCard (Hạn mức sử dụng hàng ngày)
│       ├── [Module] AuthModule (Login/Register + useAuthForm)
│       └── [Module] Settings (Voice Gender, Language)
│
├── ⚙️ LAYER 3: Business Logic (Custom Hooks)
│   ├── useUserProgress (Firebase Sync)       ──> [Service] firebase/firestore
│   ├── useAudioRecorder (Media Management)   ──> [Web API] MediaRecorder
│   └── useLesson/Game/Roleplay (Local State) ──> [API] Gemini GenAI
│
└── 🛠️ LAYER 4: Infrastructure (Domain Services)
    ├── [AI] conversationService / assessmentService / dictionaryService
    ├── [Backend] authService / userService / usageService
    └── [Utils] audioUtils / eventService / dataService
```

## 🏗️ 2. Chi tiết các Lớp (Layer Details)

### 🔵 Layer 1: Giao diện (Presentation Layer)
- **Framework**: React 19 (Functional Components).
- **Styling**: Tailwind CSS (JIT Engine).
- **Iconography**: Lucide React.
- **Thư viện ngoài**: `framer-motion` (dự kiến cho animation mượt mà hơn).

### 🟢 Layer 2: Nghiệp vụ (Logic Layer - Hooks)
- **Tách biệt**: Mỗi Module lớn đều có 1 Hook tương ứng (ví dụ: `useLessonLogic`) để quản lý State mà không làm "bẩn" code UI.
- **Data Flow**: Một chiều (Unidirectional), từ Hooks đẩy dữ liệu xuống Component qua Props.

### 🟡 Layer 3: Dịch vụ (Service Layer)
- **AI Domain**: Tách nhỏ Service để tối ưu Token và Model.
    - `gemini-3-flash`: Cho các phản hồi dưới 2 giây (Chấm điểm, Tra từ).
    - `gemini-3-pro`: Cho các phân tích sâu (Tổng kết hội thoại).
- **Storage & Cache**: Sử dụng `localStorage` cho Voice Preference và `Firebase Storage` cho Audio Cache.

### 🔴 Layer 4: Dữ liệu (Data Layer)
- **Offline First**: Một số dữ liệu bài học được lưu tại `public/lessons/*.json` để load nhanh.
- **Real-time**: Dữ liệu người dùng (Points, Best Scores) đồng bộ qua Firebase Firestore `onSnapshot`.

## 📈 3. Công nghệ sử dụng chính

| Phạm vi | Công nghệ | Mục đích |
|:---|:---|:---|
| **Runtime** | React 19 + TypeScript | Xây dựng ứng dụng bền vững |
| **AI** | Google Gemini SDK | Chấm điểm phát âm & Chatbot thực chiến |
| **Database** | Firebase Firestore | Lưu trữ tiến trình học tập |
| **Auth** | Firebase Auth | Đăng nhập ẩn danh & nâng cấp Email |
| **Media** | Web Audio API | Xử lý âm thanh PCM từ Gemini TTS |
| **UI** | Tailwind CSS | Thiết kế giao diện PWA cực nhanh |

---
*Tài liệu này được cập nhật theo phiên bản kiến trúc v2.5 (Modular Refactor).*