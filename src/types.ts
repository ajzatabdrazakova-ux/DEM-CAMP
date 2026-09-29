export type Language = 'ky' | 'ru' | 'en';
export type UserRole = 'student' | 'teacher' | 'admin';

export type ActiveTab = 
  | 'overview'
  | 'practice'
  | 'campus-map'
  | 'resource-center'
  | 'start-together'
  | 'office-hours'
  | 'your-voice'
  | 'dialogue'
  | 'we-heard'
  | 'mentors'
  | 'online'
  | 'admin';

export interface AdaptationEvent {
  id: string;
  day: string;
  dayNumber: number;
  time: string;
  titleKy: string;
  titleRu: string;
  descKy: string;
  descRu: string;
  location: string;
  format: 'offline' | 'online' | 'hybrid';
  speakers: string[];
  attendeesCount: number;
  tags: string[];
}

export interface StudentExpectation {
  id: string;
  author: string;
  role: 'first-year' | 'senior' | 'teacher';
  textKy: string;
  textRu: string;
  likes: number;
  faculty: string;
  date: string;
  responseFromTeacher?: string;
}

export interface TeacherProfile {
  id: string;
  nameKy: string;
  nameRu: string;
  titleKy: string;
  titleRu: string;
  departmentKy: string;
  departmentRu: string;
  facultyKy: string;
  facultyRu: string;
  avatar: string;
  email: string;
  officeRoom: string;
  isOnlineAvailable: boolean;
  availableHours: {
    dayOfWeekKy: string;
    dayOfWeekRu: string;
    slots: string[];
  }[];
  bioKy: string;
  bioRu: string;
  topicsKy: string[];
  topicsRu: string[];
  rating: number;
  reviewsCount: number;
}

export interface OfficeHourBooking {
  id: string;
  ticketNumber: string;
  teacherId: string;
  teacherName: string;
  studentName: string;
  studentEmail: string;
  studentIdCard?: string;
  faculty: string;
  date: string;
  timeSlot: string;
  format: 'offline' | 'online';
  topic: string;
  questionDetail: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FeedbackSubmission {
  id: string;
  trackingCode: string; // e.g. #KOP-4821
  isAnonymous: boolean;
  studentName?: string;
  faculty: string;
  category: 'academic' | 'infrastructure' | 'dormitory' | 'assessment' | 'ethics' | 'initiative';
  title: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'received' | 'reviewing' | 'resolved' | 'clarification';
  submittedAt: string;
  officialResponse?: {
    responderName: string;
    responderRole: string;
    responseText: string;
    respondedAt: string;
  };
  upvotes: number;
}

export interface DialogueTopic {
  id: string;
  titleKy: string;
  titleRu: string;
  descriptionKy: string;
  descriptionRu: string;
  votes: number;
  hasVoted?: boolean;
  proposedBy: string;
  category: string;
}

export interface DialogueEvent {
  id: string;
  titleKy: string;
  titleRu: string;
  date: string;
  time: string;
  location: string;
  moderators: string[];
  descriptionKy: string;
  descriptionRu: string;
  agendaKy: string[];
  agendaRu: string[];
  registeredCount: number;
  maxCapacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface WeHeardItem {
  id: string;
  titleKy: string;
  titleRu: string;
  problemKy: string;
  problemRu: string;
  actionTakenKy: string;
  actionTakenRu: string;
  status: 'implemented' | 'in_progress' | 'explained';
  departmentKy: string;
  departmentRu: string;
  dateResolved: string;
  impactKy: string;
  impactRu: string;
  category: string;
  likes: number;
}

export interface MentorProfile {
  id: string;
  name: string;
  year: number; // 3 or 4
  facultyKy: string;
  facultyRu: string;
  majorKy: string;
  majorRu: string;
  avatar: string;
  helpTagsKy: string[];
  helpTagsRu: string[];
  bioKy: string;
  bioRu: string;
  languages: string[];
  sessionsCompleted: number;
  contactTelegram?: string;
  contactEmail: string;
  isAvailable: boolean;
}

export interface OnlineQuestion {
  id: string;
  authorName: string;
  authorFaculty: string;
  isAnonymous: boolean;
  questionKy: string;
  questionRu: string;
  category: string;
  date: string;
  likes: number;
  answers: {
    id: string;
    authorName: string;
    authorRole: 'teacher' | 'dean_office' | 'student_mentor';
    answerKy: string;
    answerRu: string;
    date: string;
    isVerified: boolean;
  }[];
}

export interface CampusFloorItem {
  floor: number;
  rooms: string[];
  descriptionKy: string;
  descriptionRu: string;
}

export interface CampusLocation {
  id: string;
  nameKy: string;
  nameRu: string;
  category: 'building' | 'office' | 'library' | 'food' | 'dorm' | 'health' | 'sport' | 'hub';
  categoryLabelKy: string;
  categoryLabelRu: string;
  code: string; // e.g. "Б-101", "IT-302"
  xPercent: number; // 0 to 100 for SVG/map coordinates
  yPercent: number; // 0 to 100
  workingHours: string;
  descriptionKy: string;
  descriptionRu: string;
  featuresKy: string[];
  featuresRu: string[];
  floors?: CampusFloorItem[];
  relatedOfficeHoursTeachers?: string[];
  hasTrustBox?: boolean;
  trustBoxLocation?: string;
  accessibleForDisabled: boolean;
  phone?: string;
}

export type ResourceCategory = 'methodology' | 'video' | 'pdf' | 'ort-pisa-steam' | 'all';
export type ResourceFormat = 'pdf' | 'video' | 'interactive' | 'doc';

export interface LearningResource {
  id: string;
  titleKy: string;
  titleRu: string;
  titleEn?: string;
  category: 'methodology' | 'video' | 'pdf' | 'ort-pisa-steam';
  format: ResourceFormat;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  authorKy: string;
  authorRu: string;
  authorEn?: string;
  authorRoleKy?: string;
  authorRoleRu?: string;
  authorRoleEn?: string;
  durationOrPagesKy: string; // e.g. "48 бет (PDF)" or "35 мүнөт (Видео)"
  durationOrPagesRu: string;
  durationOrPagesEn?: string;
  fileSize?: string;
  descriptionKy: string;
  descriptionRu: string;
  descriptionEn?: string;
  tags: string[];
  viewsCount: number;
  downloadsCount: number;
  rating: number; // 4.8, 5.0 etc.
  reviewsCount: number;
  previewUrl?: string;
  contentSnippetKy?: string;
  contentSnippetRu?: string;
  contentSnippetEn?: string;
  downloadUrl?: string;
  isPopular?: boolean;
  isNew?: boolean;
}
