import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { EXACT_COMPETENCY_DB, NLS_COMPONENTS_BY_DOMAIN } from "./src/data/competencyDb.js";

dotenv.config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";
const hasSupabaseConfig = !!(supabaseUrl && supabaseKey);

if (hasSupabaseConfig) {
  console.log("Connected to Supabase project:", supabaseUrl);
} else {
  console.warn("⚠️ CẢNH BÁO: SUPABASE_URL hoặc SUPABASE_KEY chưa được cấu hình. Đang chạy ở chế độ fallback file JSON.");
}

const supabase = createClient(supabaseUrl, supabaseKey);


const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Data storage files
const DATA_DIR = path.join(process.cwd(), "data");
const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");
const LESSONS_FILE = path.join(DATA_DIR, "lessons.json");
const COMPETENCIES_FILE = path.join(DATA_DIR, "custom_competencies.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pre-seeded Templates
const DEFAULT_TEMPLATES = [
  {
    id: "tpl-1",
    title: "Chủ đề 1: Khai thác AI cơ bản",
    subject: "Tin học",
    grade: "10",
    author: "Thầy Nguyễn Văn A",
    lessonPlan: {
      id: "tpl-1-plan",
      lessonNumber: "Bài 1",
      title: "Khai thác AI cơ bản",
      subject: "Tin học",
      grade: "10",
      numberOfPeriods: "1 tiết",
      generalObjectives: "Học sinh hiểu được khái niệm cơ bản về trí tuệ nhân tạo (AI), nhận diện được các ứng dụng của AI trong đời sống thực tế và biết cách khai thác một số công cụ AI cơ bản phục vụ việc học tập một cách thông thái.",
      materials: "Phòng máy tính có kết nối Internet, máy chiếu, tài liệu hướng dẫn sử dụng ChatGPT/Gemini.",
      competencies: [
        {
          level: "6.1.CB1a",
          desc: "Xác định được các khái niệm cơ bản của AI. Nhớ lại được các ứng dụng đơn giản của AI.",
          componentTitle: "6.1. Hiểu biết về trí tuệ nhân tạo"
        },
        {
          level: "6.2.CB2a",
          desc: "Thực hiện được các thao tác cơ bản với các công cụ AI theo hướng dẫn.",
          componentTitle: "6.2. Sử dụng trí tuệ nhân tạo"
        }
      ],
      activities: [
        {
          id: 101,
          name: "Hoạt động 1: Khởi động (Trò chơi Đoán AI)",
          content: "Mục tiêu: Kích thích sự tò mò của học sinh về AI.\nTổ chức thực hiện: Giáo viên trình chiếu một số tác phẩm (tranh vẽ, bài thơ) và yêu cầu học sinh đoán xem tác phẩm nào do con người làm, tác phẩm nào do AI thực hiện."
        },
        {
          id: 102,
          name: "Hoạt động 2: Hình thành kiến thức (AI là gì?)",
          content: "Mục tiêu: Giúp học sinh nắm được khái niệm AI.\nTổ chức thực hiện: Học sinh thảo luận nhóm, xem video ngắn về lịch sử AI và trả lời câu hỏi khái niệm AI cơ bản."
        }
      ]
    }
  },
  {
    id: "tpl-2",
    title: "Chủ đề 2: Kỹ năng tìm kiếm thông tin an toàn",
    subject: "Giáo dục công dân",
    grade: "8",
    author: "Cô Lê Thị B",
    lessonPlan: {
      id: "tpl-2-plan",
      lessonNumber: "Bài 5",
      title: "Kỹ năng tìm kiếm thông tin an toàn",
      subject: "Giáo dục công dân",
      grade: "8",
      numberOfPeriods: "1 tiết",
      generalObjectives: "Trang bị cho học sinh các quy tắc cơ bản khi duyệt web, phân biệt các thông tin thật-giả trên môi trường mạng và bảo vệ thông tin cá nhân khỏi các nguy cơ lừa đảo trực tuyến.",
      materials: "Tài liệu in ấn về cẩm nang an toàn mạng, phiếu học tập thảo luận nhóm.",
      competencies: [
        {
          level: "1.1.TC1b",
          desc: "Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số.",
          componentTitle: "1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số"
        },
        {
          level: "4.2.TC1a",
          desc: "Cài đặt quyền riêng tư trên các tài khoản mạng xã hội.",
          componentTitle: "4.2. Bảo vệ dữ liệu cá nhân và quyền riêng tư"
        }
      ],
      activities: [
        {
          id: 201,
          name: "Hoạt động 1: Tình huống thực tế (Mất tài khoản mạng xã hội)",
          content: "Giáo viên nêu câu chuyện một bạn học sinh bị lừa mất tài khoản do click vào link lạ. Học sinh thảo luận bài học rút ra."
        }
      ]
    }
  }
];

// Load templates (local fallback)
function getTemplates() {
  if (!fs.existsSync(TEMPLATES_FILE)) {
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(DEFAULT_TEMPLATES, null, 2));
    return DEFAULT_TEMPLATES;
  }
  try {
    return JSON.parse(fs.readFileSync(TEMPLATES_FILE, "utf-8"));
  } catch (e) {
    return DEFAULT_TEMPLATES;
  }
}

// Save templates (local fallback)
function saveTemplates(templates: any[]) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

// Load saved lessons (local fallback)
function getLessons() {
  if (!fs.existsSync(LESSONS_FILE)) {
    fs.writeFileSync(LESSONS_FILE, "[]");
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(LESSONS_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

// Save lessons (local fallback)
function saveLessons(lessons: any[]) {
  fs.writeFileSync(LESSONS_FILE, JSON.stringify(lessons, null, 2));
}

// Asynchronous Supabase Helper Functions
async function fetchTemplatesFromDb() {
  if (!hasSupabaseConfig) {
    return getTemplates();
  }
  try {
    const { data, error } = await supabase.from("templates").select("*").order("id", { ascending: true });
    if (error) {
      console.error("Lỗi khi lấy mẫu giáo án từ Supabase:", error);
      return getTemplates();
    }
    
    // Seed templates if DB is empty
    if (!data || data.length === 0) {
      console.log("Database 'templates' trống. Đang gieo mầm (seeding) dữ liệu mặc định...");
      await seedTemplatesToDb();
      return DEFAULT_TEMPLATES;
    }
    
    // Map db row format to frontend format (ensuring lessonPlan case matching)
    return data.map(row => ({
      id: row.id,
      title: row.title,
      subject: row.subject,
      grade: row.grade,
      author: row.author,
      lessonPlan: row.lessonPlan
    }));
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    return getTemplates();
  }
}

async function seedTemplatesToDb() {
  if (!hasSupabaseConfig) return;
  try {
    const templatesToInsert = DEFAULT_TEMPLATES.map(t => ({
      id: t.id,
      title: t.title,
      subject: t.subject,
      grade: t.grade,
      author: t.author,
      lessonPlan: t.lessonPlan
    }));
    const { error } = await supabase.from("templates").insert(templatesToInsert);
    if (error) {
      console.error("Lỗi gieo mầm templates:", error);
    } else {
      console.log("Đã gieo mầm kho giáo án mẫu mặc định thành công vào Supabase!");
    }
  } catch (err) {
    console.error("Lỗi gieo mầm templates:", err);
  }
}

async function saveTemplateToDb(newTemplate: any) {
  if (!hasSupabaseConfig) {
    const templates = getTemplates();
    templates.push(newTemplate);
    saveTemplates(templates);
    return templates;
  }
  
  try {
    const { error } = await supabase.from("templates").insert({
      id: newTemplate.id,
      title: newTemplate.title,
      subject: newTemplate.subject,
      grade: newTemplate.grade,
      author: newTemplate.author,
      lessonPlan: newTemplate.lessonPlan
    });
    
    if (error) {
      console.error("Lỗi khi lưu mẫu giáo án vào Supabase:", error);
      const templates = getTemplates();
      templates.push(newTemplate);
      saveTemplates(templates);
      return templates;
    }
    
    return await fetchTemplatesFromDb();
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    const templates = getTemplates();
    templates.push(newTemplate);
    saveTemplates(templates);
    return templates;
  }
}

async function deleteTemplateFromDb(id: string) {
  if (!hasSupabaseConfig) {
    let templates = getTemplates();
    templates = templates.filter(t => t.id !== id);
    saveTemplates(templates);
    return templates;
  }
  
  try {
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (error) {
      console.error("Lỗi khi xóa mẫu giáo án trên Supabase:", error);
      let templates = getTemplates();
      templates = templates.filter(t => t.id !== id);
      saveTemplates(templates);
      return templates;
    }
    
    return await fetchTemplatesFromDb();
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    let templates = getTemplates();
    templates = templates.filter(t => t.id !== id);
    saveTemplates(templates);
    return templates;
  }
}

async function fetchLessonsFromDb() {
  if (!hasSupabaseConfig) {
    return getLessons();
  }
  
  try {
    const { data, error } = await supabase.from("lessons").select("*");
    if (error) {
      console.error("Lỗi khi lấy danh sách giáo án từ Supabase:", error);
      return getLessons();
    }
    
    // Map database properties back to camelCase object structure for the frontend
    const mapped = (data || []).map(row => ({
      id: row.id,
      lessonNumber: row.lessonNumber,
      title: row.title,
      subject: row.subject,
      grade: row.grade,
      numberOfPeriods: row.numberOfPeriods,
      duration: row.duration,
      generalObjectives: row.generalObjectives,
      competencies: row.competencies || [],
      materials: row.materials,
      activities: row.activities || [],
      attachments: row.attachments || []
    }));
    
    return mapped;
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    return getLessons();
  }
}

async function saveLessonToDb(newPlan: any) {
  if (!hasSupabaseConfig) {
    const lessons = getLessons();
    const index = lessons.findIndex((l: any) => l.id === newPlan.id);
    if (index !== -1) {
      lessons[index] = newPlan;
    } else {
      lessons.push(newPlan);
    }
    saveLessons(lessons);
    return lessons;
  }
  
  try {
    const { data: existing } = await supabase.from("lessons").select("id").eq("id", newPlan.id).maybeSingle();
    
    const dbRow = {
      id: newPlan.id,
      lessonNumber: newPlan.lessonNumber || "",
      title: newPlan.title,
      subject: newPlan.subject,
      grade: newPlan.grade,
      numberOfPeriods: newPlan.numberOfPeriods || newPlan.duration || "",
      duration: newPlan.duration || "",
      generalObjectives: newPlan.generalObjectives || "",
      competencies: newPlan.competencies || [],
      materials: newPlan.materials || "",
      activities: newPlan.activities || [],
      attachments: newPlan.attachments || []
    };
    
    let error;
    if (existing) {
      const { error: err } = await supabase.from("lessons").update(dbRow).eq("id", newPlan.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("lessons").insert(dbRow);
      error = err;
    }
    
    if (error) {
      console.error("Lỗi khi lưu giáo án vào Supabase:", error);
      const lessons = getLessons();
      const index = lessons.findIndex((l: any) => l.id === newPlan.id);
      if (index !== -1) {
        lessons[index] = newPlan;
      } else {
        lessons.push(newPlan);
      }
      saveLessons(lessons);
      return lessons;
    }
    
    return await fetchLessonsFromDb();
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    const lessons = getLessons();
    const index = lessons.findIndex((l: any) => l.id === newPlan.id);
    if (index !== -1) {
      lessons[index] = newPlan;
    } else {
      lessons.push(newPlan);
    }
    saveLessons(lessons);
    return lessons;
  }
}

async function deleteLessonFromDb(id: string) {
  if (!hasSupabaseConfig) {
    let lessons = getLessons();
    lessons = lessons.filter((l: any) => l.id !== id);
    saveLessons(lessons);
    return lessons;
  }
  
  try {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) {
      console.error("Lỗi khi xóa giáo án trên Supabase:", error);
      let lessons = getLessons();
      lessons = lessons.filter((l: any) => l.id !== id);
      saveLessons(lessons);
      return lessons;
    }
    
    return await fetchLessonsFromDb();
  } catch (err) {
    console.error("Lỗi kết nối Supabase, fallback về file:", err);
    let lessons = getLessons();
    lessons = lessons.filter((l: any) => l.id !== id);
    saveLessons(lessons);
    return lessons;
  }
}


// Lazy Gemini Initialization
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("Vui lòng cấu hình API Key trong Secrets để kích hoạt tính năng AI");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// API Routes

// Admin Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    return res.json({
      success: true,
      token: "admin-secret-session-token",
      user: { username: "admin", name: "Quản trị viên" }
    });
  }
  return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác!" });
});

// Templates CRUD
app.get("/api/templates", async (req, res) => {
  try {
    const templates = await fetchTemplatesFromDb();
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi lấy danh sách mẫu giáo án" });
  }
});

app.post("/api/templates", async (req, res) => {
  try {
    const newTemplate = req.body;
    if (!newTemplate.title || !newTemplate.lessonPlan) {
      return res.status(400).json({ error: "Dữ liệu mẫu giáo án không hợp lệ!" });
    }
    const templates = await saveTemplateToDb(newTemplate);
    res.json({ success: true, templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi lưu mẫu giáo án" });
  }
});

app.delete("/api/templates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const templates = await deleteTemplateFromDb(id);
    res.json({ success: true, templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi xóa mẫu giáo án" });
  }
});

// Saved Lesson Plans
app.get("/api/lessons", async (req, res) => {
  try {
    const lessons = await fetchLessonsFromDb();
    res.json(lessons);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi lấy danh sách giáo án" });
  }
});

app.post("/api/lessons", async (req, res) => {
  try {
    const newPlan = req.body;
    if (!newPlan.id || !newPlan.title) {
      return res.status(400).json({ error: "Thiếu thông tin giáo án!" });
    }
    const lessons = await saveLessonToDb(newPlan);
    res.json({ success: true, lessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi lưu giáo án" });
  }
});

app.delete("/api/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lessons = await deleteLessonFromDb(id);
    res.json({ success: true, lessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi khi xóa giáo án" });
  }
});

// AI analysis and mapping
app.post("/api/analyze-lesson", async (req, res) => {
  const { originalPlan, pastedText, fileData, mimeType, requireNLS, grade, subject, isEnglish } = req.body;

  try {
    const ai = getGeminiClient();

    // Prepare contextual competency database list for the prompt
    let formattedCompetencyDb = "";
    Object.entries(EXACT_COMPETENCY_DB).forEach(([key, val]) => {
      // find component title
      let componentTitle = "";
      for (const [domain, list] of Object.entries(NLS_COMPONENTS_BY_DOMAIN)) {
        const comp = list.find(c => c.startsWith(key.substring(0, 3)));
        if (comp) {
          componentTitle = comp;
          break;
        }
      }
      formattedCompetencyDb += `- Mã: ${key} | Tên thành phần: ${componentTitle} | Chỉ báo: ${val}\n`;
    });

    const userInstructionsPrompt = `
Hãy là một giáo viên chuyên gia và chuyên gia công nghệ giáo dục (EdTech) tại Việt Nam.
Nhiệm vụ của bạn là phân tích kế hoạch bài dạy (KHBD) hoặc tài liệu sách giáo khoa được cung cấp, tối ưu hóa nội dung theo chuẩn GDPT 2018 (hoặc chuẩn quốc tế nếu là tiếng Anh), đồng thời tự động lựa chọn và tích hợp từ 1 đến 3 mục tiêu NĂNG LỰC SỐ (NLS) phù hợp nhất từ cơ sở dữ liệu năng lực số được cung cấp dưới đây.

Lớp: ${grade || "Không chỉ định"}
Môn: ${subject || "Không chỉ định"}
Ngôn ngữ viết giáo án: ${isEnglish ? "Tiếng Anh (English)" : "Tiếng Việt"}

Dưới đây là cơ sở dữ liệu mã hóa Năng lực số GDPT 2018 của Việt Nam:
${formattedCompetencyDb}

LƯU Ý QUAN TRỌNG KHI TÍCH HỢP NĂNG LỰC SỐ:
1. Bạn phải lựa chọn các mã năng lực số phù hợp một cách logic và thực tế với nội dung bài dạy.
2. Trích xuất đúng Mã (ví dụ: '1.1.CB1a' hoặc '6.2.TC1a') và đúng Chỉ báo gốc được cung cấp trong CSDL. Không tự sáng tác mã hoặc viết sai tả chỉ báo.
3. Nếu ngôn ngữ viết giáo án là Tiếng Anh, hãy dịch nội dung mục tiêu chung, thiết bị dạy học và tiến trình dạy học sang Tiếng Anh, nhưng phần Năng lực số vẫn giữ nguyên mã hóa và bạn có thể dịch mô tả chỉ báo sang Tiếng Anh ở trường 'desc' để đồng bộ.

Hãy phân tích kỹ tài liệu đầu vào:
${pastedText ? `Nội dung văn bản dán:\n${pastedText}` : ""}
${originalPlan ? `Thông tin kế hoạch gốc:\n${JSON.stringify(originalPlan)}` : ""}

Hãy xuất kết quả phân tích theo đúng cấu trúc JSON sau:
{
  "lessonNumber": "Ví dụ: 'Bài 1' hoặc 'Chủ đề 2' (nếu có)",
  "title": "Tên bài học đã được làm rõ hoặc chuẩn hóa",
  "subject": "Môn học",
  "grade": "Khối lớp",
  "numberOfPeriods": "Số tiết học (ví dụ: '1 tiết')",
  "generalObjectives": "Mục tiêu chung (Kiến thức, Phẩm chất, Kỹ năng) viết rõ ràng, mạch lạc, khoa học",
  "materials": "Thiết bị dạy học và học liệu chi tiết",
  "competencies": [
    {
      "level": "Mã năng lực số được chọn, ví dụ: '6.1.CB1a'",
      "desc": "Chỉ báo năng lực số tương ứng bằng ngôn ngữ yêu cầu",
      "componentTitle": "Tên thành phần năng lực tương ứng"
    }
  ],
  "activities": [
    {
      "name": "Tên hoạt động (ví dụ: 'Hoạt động 1: Khởi động')",
      "content": "Mô tả chi tiết mục tiêu, nội dung, sản phẩm học tập và cách thức tổ chức hoạt động một cách sư phạm và lôi cuốn"
    }
  ]
}
`;

    let contents: any[] = [];
    if (fileData && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: fileData
        }
      });
    }
    contents.push({
      text: userInstructionsPrompt
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lessonNumber: { type: Type.STRING },
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            grade: { type: Type.STRING },
            numberOfPeriods: { type: Type.STRING },
            generalObjectives: { type: Type.STRING },
            materials: { type: Type.STRING },
            competencies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  desc: { type: Type.STRING },
                  componentTitle: { type: Type.STRING }
                },
                required: ["level", "desc"]
              }
            },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["name", "content"]
              }
            }
          },
          required: ["title", "subject", "grade", "generalObjectives", "materials", "activities", "competencies"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Không nhận được phản hồi từ AI");
    }

    const parsedPlan = JSON.parse(resultText);
    res.json(parsedPlan);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message || "Lỗi xử lý AI" });
  }
});

async function startServer() {
  // Only setup Vite middleware and listen on port if not in Vercel Serverless environment
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

startServer();

export default app;

