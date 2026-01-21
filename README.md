# 📚 TechSpeak Master - Technical Documentation (v3.0)

TechSpeak Master là một nền tảng học tiếng Anh chuyên ngành được xây dựng theo kiến trúc **Layered Modular Architecture**, tối ưu hóa cho hiệu năng cao và độ ổn định (Production-Ready).

## 🚀 1. Các Cải tiến Hiệu năng & Ổn định (Performance & Stability)

Hệ thống đã được nâng cấp các cơ chế "lớp phòng vệ" để đảm bảo trải nghiệm người dùng mượt mà nhất:

- **Request Throttling (Điều tiết yêu cầu)**: Triển khai hàng đợi thông minh với khoảng nghỉ `MIN_GAP_MS` (500ms). Ngăn chặn tình trạng gửi request dồn dập, giúp bảo vệ API Key khỏi các giới hạn tần suất.
- **Exponential Backoff (Thử lại thông minh)**: Khi gặp lỗi `429 (Too Many Requests)`, hệ thống tự động đóng băng hàng đợi và thử lại sau một khoảng thời gian tăng dần, giúp ứng dụng tự phục hồi mà không cần tải lại trang.
- **Persistent Caching (Lưu trữ bền vững)**: Sử dụng **IndexedDB** thay vì RAM cho bộ nhớ đệm âm thanh. 
    - *Lợi ích*: Giảm 90% quota AI sau lần học đầu tiên, hỗ trợ học offline và tốc độ phản hồi tức thì (<10ms) cho các từ đã học.
- **Mobile UI Optimization**: Giao diện Popup IPA và các Modal được thiết kế với cơ chế `overscroll-contain` và `fixed positioning`, đảm bảo hoạt động hoàn hảo trên các thiết bị iPhone (Dynamic Island) và Android có thanh điều hướng tùy biến.

## 🌳 2. Cấu trúc Phân cấp (Architecture Hierarchy)

```text
ROOT (index.html / App.tsx)
│
├── 🧱 LAYER 1: Orchestration & Navigation
│   ├── [Module] MainHeader (Branding, Points, User Profile Sync)
│   ├── [Module] TabNavigation (Tab switching logic)
│   └── [Layer] Global Overlays (UnlockModal, Loading States)
│
├── 🧱 LAYER 2: Major Feature Modules (Pages)
│   │
│   ├── 📁 Dashboard (Trải nghiệm cá nhân hóa)
│   ├── 📁 Lesson Engine (Hệ thống bài học tương tác)
│   │   └── [Unit] InteractiveText (Lookup Engine)
│   ├── 📁 Library (Thư viện tri thức chuyên ngành)
│   │   ├── [Module] Vocabulary (Persistent Store)
│   │   ├── [Module] IPALab (Mobile Optimized UI)
│   │   └── [Module] Grammar (AI Correction Store)
│   └── 📁 Challenge Hub (Gamification)
│
├── ⚙️ LAYER 3: Business Logic (Custom Hooks)
│   ├── useUserProgress (Firestore Real-time Sync)
│   ├── useAudioRecorder (Native & Web Audio Bridge)
│   └── useRoleplayLogic (Gemini Pro AI State Machine)
│
└── 🛠️ LAYER 4: Infrastructure (Low-level Services)
    ├── [AI] conversation / assessment / dictionary services
    ├── [Storage] IndexedDB Audio Cache Provider
    └── [Utils] audioUtils (Throttling & Backoff Engine)
```

## 🏗️ 3. Quy trình Xử lý Dữ liệu (Data Pipeline)

### Luồng Âm thanh (Audio Pipeline):
1. **Request**: Người dùng chạm vào nút phát âm thanh.
2. **Cache Check**: Kiểm tra `IndexedDB`. Nếu thấy, phát ngay lập tức.
3. **Queueing**: Nếu không thấy, đẩy yêu cầu vào `RequestQueue`.
4. **Throttling**: Chờ đến lượt xử lý (đảm bảo gap 500ms).
5. **AI Generation**: Gọi Gemini TTS API.
6. **Persistence**: Lưu kết quả vào `IndexedDB` và phát ra loa.

## 📈 4. Công nghệ sử dụng chính

| Phạm vi | Công nghệ | Mục đích |
|:---|:---|:---|
| **Runtime** | React 19 + TypeScript | Xây dựng ứng dụng bền vững |
| **Storage** | IndexedDB | Lưu trữ cache âm thanh vĩnh viễn |
| **AI** | Gemini 3 Flash/Pro | Chấm điểm & Hội thoại thực chiến |
| **Backend** | Firebase Suite | Auth, Firestore, Cloud Storage |
| **UI** | Tailwind CSS | JIT Animation & Responsive Layout |

---
*Tài liệu này được cập nhật theo phiên bản kiến trúc v3.0 (Production Optimized).*