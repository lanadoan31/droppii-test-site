// Sample quiz content for the Droppii Seller AI Knowledge Test.
// All Vietnamese. The seed question (#7) is the one provided by the user.

window.QUIZ = {
  test: {
    title: "Bài kiểm tra Kiến thức AI cho Nhà bán hàng",
    subtitle: "Chứng nhận năng lực tư vấn TPCN với hỗ trợ AI",
    code: "DRP-AI-2026",
    duration_min: 30,
    questions_total: 20,
    pass_score: 70, // %
    cohort: "Đợt T05/2026",
  },
  seller: {
    name: "Nguyễn Thị Mai Anh",
    id: "DRP-58294",
    region: "Khu vực Hà Nội",
    avatar_initials: "MA",
  },
  // A representative sample of the 20 questions
  questions: [
    {
      id: 1,
      type: "single",
      topic: "Cơ bản về AI",
      time_sec: 60,
      stem: "Trong vai trò Nhà bán hàng Droppii, AI hỗ trợ bạn HIỆU QUẢ NHẤT ở khâu nào?",
      options: [
        "Thay thế hoàn toàn việc tư vấn của nhà bán hàng cho khách",
        "Gợi ý sản phẩm phù hợp dựa trên nhu cầu và lịch sử của khách",
        "Tự động đặt hàng giúp khách mà không cần xác nhận",
        "Quyết định liều dùng và phác đồ điều trị cho khách",
      ],
      correct: [1],
      explain:
        "AI là công cụ HỖ TRỢ — gợi ý cá nhân hoá, phân loại nhu cầu, tóm tắt thông tin sản phẩm. Mọi quyết định tư vấn cuối cùng và liều dùng phải do nhà bán hàng (và bác sĩ khi cần) đưa ra.",
    },
    {
      id: 2,
      type: "multi",
      topic: "Đạo đức & Tuân thủ",
      time_sec: 75,
      stem: "Khi sử dụng AI để soạn nội dung tư vấn cho khách, điều nào BẮT BUỘC phải làm?",
      options: [
        "Kiểm tra lại tính chính xác trước khi gửi cho khách",
        "Không chia sẻ thông tin sức khoẻ cá nhân của khách vào công cụ AI bên ngoài",
        "Chỉ dùng nguyên văn câu trả lời của AI cho nhanh",
        "Ghi rõ nguồn nếu trích dẫn nghiên cứu / số liệu",
      ],
      correct: [0, 1, 3],
      explain:
        "AI có thể sai (\"hallucination\"). Thông tin sức khoẻ của khách là dữ liệu nhạy cảm — không nhập vào công cụ công khai. Trích dẫn nguồn giúp khách tin tưởng và bảo vệ bạn.",
    },
    {
      id: 7,
      type: "single",
      topic: "Tình huống lâm sàng",
      time_sec: 120,
      stem:
        "Nam, 55 tuổi, đái tháo đường type 2 đang điều trị theo phác đồ: Metformin 1000mg/ngày kết hợp kiểm soát chế độ ăn. Bệnh nhân được tư vấn thêm chế độ ăn giàu chất xơ (yến mạch, rau xanh), hạn chế tinh bột tinh chế, và bổ sung TPCN chứa Omega-3 và Magnesium. Sau 4 tháng, chỉ số đường huyết ổn định hơn và giảm đề kháng insulin.\n\nNhận định nào đúng nhất?",
      options: [
        "Có thể ngừng thuốc vì đã dùng TPCN",
        "TPCN và chế độ ăn giúp hỗ trợ phác đồ điều trị, cải thiện kết quả",
        "Chỉ cần dùng TPCN và chế độ ăn thì không cần uống thuốc",
        "Không cần duy trì chế độ ăn nếu đã dùng TPCN và thuốc",
      ],
      correct: [1],
      explain:
        "TPCN (Thực phẩm chức năng) là HỖ TRỢ — không thay thế thuốc điều trị. Bệnh nhân tiểu đường type 2 cần duy trì cả ba: thuốc theo phác đồ bác sĩ, chế độ ăn, và TPCN bổ sung. Đáp án A, C, D đều sai vì khuyến cáo ngừng thuốc hoặc bỏ chế độ ăn — điều này có thể gây nguy hiểm cho bệnh nhân.",
    },
  ],
};
