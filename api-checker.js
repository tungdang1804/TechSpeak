// api-checker.js
const API_KEY = "DÁN_MÃ_API_CỦA_TÙNG_VÀO_ĐÂY"; // Lấy từ dự án TechSpeak-Experimental
const MODEL = "gemini-1.5-flash";

async function checkGeminiStatus() {
  console.log("🚀 Đang kiểm tra kết nối tới Google Gemini API...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: "Phản hồi ngắn gọn: OK" }] }]
  };

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (response.ok) {
      console.log("✅ KẾT QUẢ: THÀNH CÔNG!");
      console.log(`⏱️  Thời gian phản hồi: ${duration}ms`);
      console.log(`💬 AI nói: ${data.candidates[0].content.parts[0].text}`);
    } else {
      console.error("❌ KẾT QUẢ: THẤT BẠI!");
      console.error(`🔴 Mã lỗi (Status): ${response.status}`);
      console.error(`⚠️  Thông báo: ${data.error.message}`);
      
      // Phân tích lỗi cụ thể cho Tùng
      if (response.status === 429) {
        console.log("👉 Giải thích: Bạn đã hết hạn mức (Quota) hoặc bị khóa do lỗi Billing.");
      }
    }
  } catch (error) {
    console.error("🚨 Lỗi kết nối mạng hoặc sai cấu trúc Code:", error.message);
  }
}

checkGeminiStatus();