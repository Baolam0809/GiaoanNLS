// --- DANH SÁCH MÔN HỌC (GDPT 2018) ---
export const SUBJECTS = [
  "Ngữ văn", "Toán", "Ngoại ngữ (Tiếng Anh)", "Vật lý", "Hóa học", "Sinh học", 
  "Lịch sử", "Địa lý", "Giáo dục công dân", "Công nghệ", "Tin học", 
  "Giáo dục địa phương", "Hoạt động trải nghiệm", "Âm nhạc", "Mỹ thuật", 
  "Giáo dục thể chất", "STEM", "Giáo dục ngoài giờ lên lớp", "Kỹ năng sống"
];

// --- HỆ THỐNG PHÂN CẤP NĂNG LỰC SỐ ---
export const NLS_LEVELS_MAP: Record<string, string> = {
  "Lớp 1-3 (CB1)": "CB1",
  "Lớp 4-5 (CB2)": "CB2",
  "Lớp 6-7 (TC1)": "TC1",
  "Lớp 8-9 (TC2)": "TC2",
  "Lớp 10-12 (NC1)": "NC1"
};

export const NLS_DOMAINS = [
  "1. Khai thác dữ liệu và thông tin",
  "2. Giao tiếp và Hợp tác",
  "3. Sáng tạo nội dung số",
  "4. An toàn",
  "5. Giải quyết vấn đề",
  "6. Ứng dụng trí tuệ nhân tạo"
];

export const NLS_COMPONENTS_BY_DOMAIN: Record<string, string[]> = {
  "1. Khai thác dữ liệu và thông tin": [
    "1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số",
    "1.2. Đánh giá dữ liệu, thông tin và nội dung số",
    "1.3. Quản lý dữ liệu, thông tin và nội dung số"
  ],
  "2. Giao tiếp và Hợp tác": [
    "2.1. Tương tác thông qua công nghệ số",
    "2.2. Chia sẻ thông tin và nội dung thông qua công nghệ số",
    "2.3. Sử dụng công nghệ số để thực hiện trách nhiệm công dân",
    "2.4. Hợp tác thông qua công nghệ số",
    "2.5. Quy tắc ứng xử trên mạng",
    "2.6. Quản lý danh tính số"
  ],
  "3. Sáng tạo nội dung số": [
    "3.1. Phát triển nội dung số",
    "3.2. Tích hợp và tạo lập lại nội dung số",
    "3.3. Thực thi bản quyền và giấy phép",
    "3.4. Lập trình"
  ],
  "4. An toàn": [
    "4.1. Bảo vệ thiết bị",
    "4.2. Bảo vệ dữ liệu cá nhân và quyền riêng tư",
    "4.3. Bảo vệ sức khỏe và an sinh số",
    "4.4. Bảo vệ môi trường"
  ],
  "5. Giải quyết vấn đề": [
    "5.1. Giải quyết các vấn đề kỹ thuật",
    "5.2. Xác định nhu cầu và giải pháp công nghệ",
    "5.3. Sử dụng sáng tạo công nghệ số",
    "5.4. Xác định các vấn đề cần cải thiện về NLS"
  ],
  "6. Ứng dụng trí tuệ nhân tạo": [
    "6.1. Hiểu biết về trí tuệ nhân tạo",
    "6.2. Sử dụng trí tuệ nhân tạo",
    "6.3. Đánh giá trí tuệ nhân tạo"
  ]
};

// --- CƠ SỞ DỮ LIỆU MÃ HÓA NLS ĐẦY ĐỦ 100% CÁC KHỐI & CÁC LĨNH VỰC ---
export const EXACT_COMPETENCY_DB: Record<string, string> = {
  // === LĨNH VỰC 1 ===
  "1.1.CB1a": "Xác định được nhu cầu thông tin, tìm kiếm dữ liệu qua tìm kiếm đơn giản trong môi trường số.",
  "1.1.CB2a": "Tìm được dữ liệu, thông tin và nội dung thông qua tìm kiếm đơn giản độc lập.",
  "1.1.TC1a": "Giải thích được nhu cầu thông tin.",
  "1.1.TC1b": "Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số.",
  "1.1.TC2a": "Minh họa được nhu cầu thông tin.",
  "1.1.TC2b": "Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số.",
  "1.1.NC1a": "Đáp ứng được nhu cầu thông tin phức tạp, áp dụng kỹ thuật tìm kiếm nâng cao.",
  
  "1.2.CB1a": "Phát hiện được độ tin cậy và độ chính xác cơ bản của các nguồn dữ liệu.",
  "1.2.CB2a": "Đánh giá được tính xác thực của thông tin từ các nguồn quen thuộc.",
  "1.2.TC1a": "Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của các nguồn dữ liệu đã được tổ chức rõ ràng.",
  "1.2.TC2a": "Thực hiện phân tích, so sánh, đánh giá được độ tin cậy của đa dạng các nguồn dữ liệu số.",
  "1.2.NC1a": "Đánh giá phản biện và tổng hợp thông tin từ các nguồn dữ liệu phức tạp.",
  
  "1.3.CB1a": "Xác định được cách tổ chức, lưu trữ dữ liệu đơn giản.",
  "1.3.CB2a": "Thực hành lưu trữ và phân loại các tệp tin cơ bản trên máy tính.",
  "1.3.TC1a": "Lựa chọn được dữ liệu, thông tin để tổ chức, lưu trữ và truy xuất thường xuyên trong môi trường số.",
  "1.3.TC2a": "Tổ chức, lưu trữ và truy xuất được dữ liệu có cấu trúc hệ thống.",
  "1.3.NC1a": "Thiết lập hệ thống quản lý dữ liệu cá nhân hiệu quả, an toàn.",

  // === LĨNH VỰC 2 ===
  "2.1.CB1a": "Lựa chọn được các công nghệ số đơn giản để tương tác.",
  "2.1.CB2a": "Sử dụng các công cụ giao tiếp số cơ bản có sự hướng dẫn.",
  "2.1.TC1a": "Thực hiện được các tương tác được xác định rõ ràng và thường xuyên với các công nghệ số.",
  "2.1.TC2a": "Lựa chọn được nhiều công nghệ số để tương tác phù hợp với bối cảnh.",
  "2.1.NC1a": "Chủ động điều phối và tương tác đa nền tảng một cách chuyên nghiệp.",

  "2.2.CB1a": "Nhận biết được các công nghệ số phù hợp để chia sẻ dữ liệu.",
  "2.2.CB2a": "Thực hành chia sẻ tệp tin và nội dung số cho bạn bè.",
  "2.2.TC1a": "Lựa chọn các công nghệ số phù hợp được xác định rõ để trao đổi dữ liệu, thông tin và nội dung số.",
  "2.2.TC1b": "Minh họa rõ ràng và thường xuyên các phương pháp tham chiếu và ghi chú nguồn.",
  "2.2.TC2a": "Sử dụng được nhiều công nghệ số để trao đổi dữ liệu hiệu quả.",
  "2.2.NC1a": "Tối ưu hóa quy trình chia sẻ và phân phối thông tin số có bản quyền.",

  "2.3.CB1a": "Tham gia vào các hoạt động trực tuyến có định hướng.",
  "2.3.CB2a": "Biết cách sử dụng dịch vụ công trực tuyến ở mức độ cơ bản.",
  "2.3.TC1a": "Tham gia vào các hoạt động trực tuyến để thực hiện trách nhiệm công dân.",
  "2.3.TC2a": "Tổ chức các hoạt động trực tuyến để giải quyết vấn đề cộng đồng nhỏ.",
  "2.3.NC1a": "Đề xuất giải pháp và lan tỏa ý thức công dân số trong cộng đồng lớn.",

  "2.4.CB1a": "Sử dụng công nghệ số để hợp tác với bạn bè trong nhóm nhỏ.",
  "2.4.CB2a": "Sử dụng nền tảng trực tuyến để cùng làm bài tập nhóm.",
  "2.4.TC1a": "Sử dụng công nghệ số để hợp tác với người khác một cách hiệu quả.",
  "2.4.TC2a": "Đánh giá hiệu quả của việc hợp tác qua nền tảng số.",
  "2.4.NC1a": "Tổ chức và quản lý các dự án làm việc nhóm trực tuyến chuyên nghiệp.",

  "2.5.CB1a": "Biết cách xưng hô lịch sự khi sử dụng mạng Internet.",
  "2.5.CB2a": "Áp dụng các quy tắc an toàn và lịch sự khi nhắn tin.",
  "2.5.TC1a": "Áp dụng các quy tắc ứng xử trên mạng trong giao tiếp.",
  "2.5.TC2a": "Phân tích và giải quyết các xung đột phát sinh trên môi trường mạng.",
  "2.5.NC1a": "Thực hành quy chuẩn văn hóa số nâng cao, phòng chống bắt nạt mạng.",

  "2.6.CB1a": "Biết thông tin nào có thể chia sẻ và thông tin nào cần giữ kín.",
  "2.6.CB2a": "Nhận biết được rủi ro khi tiết lộ danh tính số.",
  "2.6.TC1a": "Quản lý và bảo vệ danh tính số của bản thân.",
  "2.6.TC2a": "Xây dựng hình ảnh và danh tính số tích cực.",
  "2.6.NC1a": "Quản trị danh tiếng trực tuyến và thiết lập hệ thống bảo mật cá nhân đa lớp.",

  // === LĨNH VỰC 3 ===
  "3.1.CB1a": "Biết cách gõ văn bản và chèn hình ảnh cơ bản.",
  "3.1.CB2a": "Tạo ra các bài trình chiếu đơn giản.",
  "3.1.TC1a": "Tạo ra các nội dung số đơn giản (văn bản, hình ảnh, video).",
  "3.1.TC1b": "Sử dụng các công cụ cơ bản để định dạng nội dung số.",
  "3.1.TC2a": "Phát triển các nội dung số phức hợp, đa phương tiện.",
  "3.1.NC1a": "Sáng tạo các sản phẩm số chuyên nghiệp, có giá trị ứng dụng cao.",

  "3.2.CB1a": "Biết cách sao chép và dán nội dung số.",
  "3.2.CB2a": "Chỉnh sửa nội dung văn bản dựa trên thông tin thu thập được.",
  "3.2.TC1a": "Chỉnh sửa và tích hợp các nội dung số hiện có thành sản phẩm mới.",
  "3.2.TC2a": "Sáng tạo sản phẩm mới dựa trên việc tổng hợp nhiều nguồn nội dung số.",
  "3.2.NC1a": "Remix và tái cấu trúc thông tin số tuân thủ nghiêm ngặt tính bản quyền.",

  "3.3.CB1a": "Biết khái niệm về tác giả và tác phẩm.",
  "3.3.CB2a": "Nhận thức được việc không được tự ý sử dụng sản phẩm của người khác.",
  "3.3.TC1a": "Tuân thủ các quy định về bản quyền khi sử dụng nội dung số.",
  "3.3.TC2a": "Áp dụng các giấy phép mở (Creative Commons) cho sản phẩm của mình.",
  "3.3.NC1a": "Phân tích và hướng dẫn người khác về luật sở hữu trí tuệ trên không gian mạng.",

  "3.4.CB1a": "Làm quen với các trò chơi tư duy logic, xếp hình khối.",
  "3.4.CB2a": "Hiểu logic của lập trình kéo thả (như Scratch) cơ bản.",
  "3.4.TC1a": "Hiểu và viết được các đoạn mã lệnh cơ bản (Block-based hoặc Text-based cơ bản).",
  "3.4.TC2a": "Lập trình được các ứng dụng hoặc trò chơi đơn giản.",
  "3.4.NC1a": "Sử dụng ngôn ngữ lập trình bậc cao để giải quyết các bài toán thực tiễn.",

  // === LĨNH VỰC 4 ===
  "4.1.CB1a": "Biết cách bật/tắt thiết bị an toàn.",
  "4.1.CB2a": "Sử dụng mật khẩu cơ bản để bảo vệ thiết bị.",
  "4.1.TC1a": "Thực hiện các biện pháp cơ bản để bảo vệ thiết bị khỏi phần mềm độc hại.",
  "4.1.TC2a": "Đánh giá các rủi ro bảo mật và áp dụng biện pháp bảo vệ thiết bị nâng cao.",
  "4.1.NC1a": "Thiết lập hệ thống tường lửa cá nhân và chống xâm nhập mạng.",

  "4.2.CB1a": "Biết giữ bí mật mật khẩu.",
  "4.2.CB2a": "Không chia sẻ thông tin địa chỉ nhà, trường học cho người lạ trên mạng.",
  "4.2.TC1a": "Cài đặt quyền riêng tư trên các tài khoản mạng xã hội.",
  "4.2.TC2a": "Quản lý rủi ro rò rỉ dữ liệu cá nhân trên môi trường số.",
  "4.2.NC1a": "Áp dụng công nghệ mã hóa để bảo vệ tuyệt đối thông tin và quyền riêng tư.",

  "4.3.CB1a": "Biết nghỉ ngơi sau một khoảng thời gian sử dụng thiết bị số.",
  "4.3.CB2a": "Ngồi đúng tư thế và giữ khoảng cách với màn hình.",
  "4.3.TC1a": "Nhận biết các dấu hiệu nghiện Internet và ảnh hưởng đến sức khỏe.",
  "4.3.TC2a": "Áp dụng các chiến lược cân bằng giữa thời gian trực tuyến và ngoại tuyến.",
  "4.3.NC1a": "Xây dựng lối sống số lành mạnh và hỗ trợ tư vấn tâm lý học đường.",

  "4.4.CB1a": "Biết tiết kiệm điện khi sử dụng thiết bị số.",
  "4.4.CB2a": "Tắt thiết bị khi không sử dụng.",
  "4.4.TC1a": "Nhận thức được tác động của công nghệ số đến môi trường.",
  "4.4.TC2a": "Thực hành tối ưu hóa việc sử dụng năng lượng của thiết bị số.",
  "4.4.NC1a": "Khuyến khích và đề xuất các giải pháp công nghệ xanh, bảo vệ môi trường.",

  // === LĨNH VỰC 5 ===
  "5.1.CB1a": "Nhận diện được khi thiết bị mất kết nối mạng hoặc hết pin.",
  "5.1.CB2a": "Tự cắm sạc hoặc khởi động lại phần mềm khi bị treo.",
  "5.1.TC1a": "Nhận diện và giải quyết các sự cố kỹ thuật đơn giản.",
  "5.1.TC2a": "Khắc phục các sự cố phần mềm và phần cứng thường gặp.",
  "5.1.NC1a": "Chẩn đoán và tự sửa chữa các lỗi hệ thống phần mềm phức tạp.",

  "5.2.CB1a": "Biết chọn đúng phần mềm (ví dụ chọn trình duyệt để vào mạng).",
  "5.2.CB2a": "Lựa chọn được công cụ hỗ trợ cho việc học tập hàng ngày.",
  "5.2.TC1a": "Xác định được công cụ số phù hợp để giải quyết nhiệm vụ cụ thể.",
  "5.2.TC2a": "Đánh giá và lựa chọn giải pháp công nghệ tối ưu cho một vấn đề.",
  "5.2.NC1a": "Thiết kế các giải pháp công nghệ tùy chỉnh để tự động hóa công việc.",

  "5.3.CB1a": "Sử dụng công nghệ số theo hướng dẫn của giáo viên.",
  "5.3.CB2a": "Tạo ra các sản phẩm kỹ thuật số nhỏ lẻ (tranh vẽ, slide).",
  "5.3.TC1a": "Sử dụng công nghệ số để tạo ra kiến thức và sản phẩm đổi mới.",
  "5.3.TC2a": "Áp dụng được các công cụ và công nghệ số khác nhau để tạo ra quy trình và sản phẩm đổi mới.",
  "5.3.NC1a": "Tích hợp đa công nghệ số để sáng chế mô hình khởi nghiệp/sản phẩm sáng tạo.",

  "5.4.CB1a": "Hỏi giáo viên khi không biết cách sử dụng máy tính.",
  "5.4.CB2a": "Nhận biết được những kỹ năng máy tính mình còn yếu.",
  "5.4.TC1a": "Nhận biết được lĩnh vực NLS của bản thân cần cải thiện.",
  "5.4.TC2a": "Thảo luận về lĩnh vực NLS của bản thân cần được cải thiện hoặc cập nhật.",
  "5.4.TC2b": "Chỉ ra được cách hỗ trợ người khác phát triển NLS của họ.",
  "5.4.NC1a": "Tự định hướng học tập suốt đời, chủ động cập nhật các xu hướng công nghệ mới.",

  // === LĨNH VỰC 6 ===
  "6.1.CB1a": "Xác định được các khái niệm cơ bản của AI. Nhớ lại được các ứng dụng đơn giản của AI.",
  "6.1.CB2a": "Giải thích được nguyên tắc hoạt động cơ bản của AI.",
  "6.1.TC1a": "Áp dụng được các nguyên tắc cơ bản của AI để giải quyết vấn đề đơn giản.",
  "6.1.TC1b": "Thực hiện được các thao tác cơ bản trên các công cụ AI.",
  "6.1.TC2a": "Giải thích được các nguyên tắc cơ bản của AI để giải quyết vấn đề.",
  "6.1.NC1a": "Phân tích được cách AI hoạt động trong các ứng dụng cụ thể. So sánh hệ thống AI.",

  "6.2.CB1a": "Nhận diện được các công cụ AI đơn giản.",
  "6.2.CB2a": "Thực hiện được các thao tác cơ bản với các công cụ AI theo hướng dẫn.",
  "6.2.TC1a": "Sử dụng được các công cụ AI trong công việc và học tập hàng ngày.",
  "6.2.TC1b": "Thực hành được các kỹ năng sử dụng AI thông qua các bài tập và dự án nhỏ.",
  "6.2.TC2a": "Tối ưu hóa việc sử dụng các công cụ AI để đạt hiệu quả cao hơn.",
  "6.2.TC2b": "Quản lý được việc triển khai các công cụ AI trong các dự án nhỏ.",
  "6.2.NC1a": "Phát triển được các ứng dụng AI tùy chỉnh để giải quyết các vấn đề cụ thể.",

  "6.3.CB1a": "Nhớ được rằng không phải mọi thông tin từ máy móc đều đúng.",
  "6.3.CB2a": "Nhận diện được các yếu tố cơ bản của hệ thống AI cần được đánh giá.",
  "6.3.TC1a": "Giải thích được cách thức hoạt động của các hệ thống AI đơn giản.",
  "6.3.TC2a": "Đánh giá được độ chính xác và tin cậy của các hệ thống AI.",
  "6.3.NC1a": "Đánh giá và giảm thiểu rủi ro đạo đức, tính thiên lệch của các hệ thống AI."
};

export const competencyDataLookup = [
  {
    id: 1, title: "1. Khai thác dữ liệu và thông tin",
    criteria: [
      { id: "1.1", name: "Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Xác định được nhu cầu thông tin, tìm kiếm dữ liệu qua tìm kiếm đơn giản trong môi trường số." } ] },
      { id: "1.2", name: "Đánh giá dữ liệu, thông tin và nội dung số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Phát hiện được độ tin cậy và độ chính xác cơ bản của các nguồn dữ liệu." } ] },
      { id: "1.3", name: "Quản lý dữ liệu, thông tin và nội dung số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Xác định được cách tổ chức, lưu trữ dữ liệu đơn giản." } ] }
    ]
  },
  {
    id: 2, title: "2. Giao tiếp và Hợp tác",
    criteria: [
      { id: "2.1", name: "Tương tác thông qua công nghệ số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Lựa chọn được các công nghệ số đơn giản để tương tác." } ] },
      { id: "2.2", name: "Chia sẻ thông tin và nội dung thông qua công nghệ số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Nhận biết được các công nghệ số phù hợp để chia sẻ dữ liệu." } ] },
      { id: "2.3", name: "Sử dụng công nghệ số để thực hiện trách nhiệm công dân", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Tham gia vào các hoạt động trực tuyến có định hướng." } ] },
      { id: "2.4", name: "Hợp tác thông qua công nghệ số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Sử dụng công nghệ số để hợp tác với bạn bè trong nhóm nhỏ." } ] },
      { id: "2.5", name: "Quy tắc ứng xử trên mạng", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết cách xưng hô lịch sự khi sử dụng mạng Internet." } ] },
      { id: "2.6", name: "Quản lý danh tính số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết thông tin nào có thể chia sẻ và thông tin nào cần giữ kín." } ] }
    ]
  },
  {
    id: 3, title: "3. Sáng tạo nội dung số",
    criteria: [
      { id: "3.1", name: "Phát triển nội dung số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết cách gõ văn bản và chèn hình ảnh cơ bản." } ] },
      { id: "3.2", name: "Tích hợp và tạo lập lại nội dung số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết cách sao chép và dán nội dung số." } ] },
      { id: "3.3", name: "Thực thi bản quyền và giấy phép", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết khái niệm về tác giả và tác phẩm." } ] },
      { id: "3.4", name: "Lập trình", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Làm quen với các trò chơi tư duy logic, xếp hình khối." } ] }
    ]
  },
  {
    id: 4, title: "4. An toàn",
    criteria: [
      { id: "4.1", name: "Bảo vệ thiết bị", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết cách bật/tắt thiết bị an toàn." } ] },
      { id: "4.2", name: "Bảo vệ dữ liệu cá nhân và quyền riêng tư", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết giữ bí mật mật khẩu." } ] },
      { id: "4.3", name: "Bảo vệ sức khỏe và an sinh số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết nghỉ ngơi sau một khoảng thời gian sử dụng thiết bị số." } ] },
      { id: "4.4", name: "Bảo vệ môi trường", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết tiết kiệm điện khi sử dụng thiết bị số." } ] }
    ]
  },
  {
    id: 5, title: "5. Giải quyết vấn đề",
    criteria: [
      { id: "5.1", name: "Giải quyết các vấn đề kỹ thuật", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Nhận diện được khi thiết bị mất kết nối mạng hoặc hết pin." } ] },
      { id: "5.2", name: "Xác định nhu cầu và giải pháp công nghệ", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Biết chọn đúng phần mềm (ví dụ chọn trình duyệt để vào mạng)." } ] },
      { id: "5.3", name: "Sử dụng sáng tạo công nghệ số", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Sử dụng công nghệ số theo hướng dẫn của giáo viên." } ] },
      { id: "5.4", name: "Xác định các vấn đề cần cải thiện về NLS", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Hỏi giáo viên khi không biết cách sử dụng máy tính." } ] }
    ]
  },
  {
    id: 6, title: "6. Ứng dụng trí tuệ nhân tạo",
    criteria: [
      { id: "6.1", name: "Hiểu biết về trí tuệ nhân tạo", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Xác định được các khái niệm cơ bản của AI. Nhớ lại được các ứng dụng đơn giản của AI." } ] },
      { id: "6.2", name: "Sử dụng trí tuệ nhân tạo", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Nhận diện được các công cụ AI đơn giản." } ] },
      { id: "6.3", name: "Đánh giá trí tuệ nhân tạo", levels: [ { level: "Lớp 1-3 (CB1)", desc: "Nhớ được rằng không phải mọi thông tin từ máy móc đều đúng." } ] }
    ]
  }
];
