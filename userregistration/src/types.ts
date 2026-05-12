export type UserRole = "student" | "teacher";

export interface StudentData {
  id: string;
  role: "student";
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  studentId: string;
  grade: string;
  major: string;
  enrollmentYear: string;
  guardianName: string;
  guardianPhone: string;
}

export interface TeacherData {
  id: string;
  role: "teacher";
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  employeeId: string;
  department: string;
  subject: string;
  qualification: string;
  experience: string;
  joiningDate: string;
}

export type UserData = StudentData | TeacherData;
