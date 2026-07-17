export interface Competency {
  level: string; // e.g., "1.1.CB1a"
  desc: string;  // description of the competency
  componentTitle?: string; // e.g., "1.1. Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số"
}

export interface Activity {
  id: number;
  name: string;
  content: string;
}

export interface Attachment {
  name: string;
  type: string;
  dataUrl: string; // base64 representation of the file
}

export interface LessonPlan {
  id: string;
  lessonNumber?: string;
  title: string;
  subject: string;
  grade: string;
  numberOfPeriods?: string;
  duration?: string;
  generalObjectives: string;
  competencies: Competency[];
  materials: string;
  activities: Activity[];
  attachments?: Attachment[];
}

export interface Template {
  id: string;
  title: string;
  subject: string;
  grade: string;
  author: string;
  lessonPlan: LessonPlan;
}
