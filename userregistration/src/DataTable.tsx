import { useState } from "react";
import type { UserData, StudentData, TeacherData } from "./types";

interface Props {
  records: UserData[];
  onDelete: (id: string) => void;
}

export default function DataTable({ records, onDelete }: Props) {
  const [tab, setTab] = useState<"student" | "teacher">("student");

  const students = records.filter((r): r is StudentData => r.role === "student");
  const teachers = records.filter((r): r is TeacherData => r.role === "teacher");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Records</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button onClick={() => setTab("student")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            tab === "student" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
           Registered Students
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${tab === "student" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>
            {students.length}
          </span>
        </button>
        <button onClick={() => setTab("teacher")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            tab === "teacher" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
           Registered Teachers
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${tab === "teacher" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
            {teachers.length}
          </span>
        </button>
      </div>

      {tab === "student" ? (
        <StudentTable students={students} onDelete={onDelete} />
      ) : (
        <TeacherTable teachers={teachers} onDelete={onDelete} />
      )}
    </div>
  );
}

function StudentTable({ students, onDelete }: { students: StudentData[]; onDelete: (id: string) => void }) {
  if (!students.length)
    return <EmptyState message="No students registered yet." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-indigo-50 text-indigo-700">
            {["#", "Full Name", "Email", "Phone", "Gender", "Student ID", "Grade", "Major", "Enroll Year", "Guardian", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{s.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{s.email}</td>
              <td className="px-4 py-3 text-gray-600">{s.phone}</td>
              <td className="px-4 py-3"><Badge text={s.gender} color="indigo" /></td>
              <td className="px-4 py-3 text-gray-600">{s.studentId}</td>
              <td className="px-4 py-3 text-gray-600">{s.grade}</td>
              <td className="px-4 py-3 text-gray-600">{s.major}</td>
              <td className="px-4 py-3 text-gray-600">{s.enrollmentYear}</td>
              <td className="px-4 py-3 text-gray-600">{s.guardianName}</td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(s.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeacherTable({ teachers, onDelete }: { teachers: TeacherData[]; onDelete: (id: string) => void }) {
  if (!teachers.length)
    return <EmptyState message="No teachers registered yet." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-emerald-50 text-emerald-700">
            {["#", "Full Name", "Email", "Phone", "Gender", "Employee ID", "Department", "Subject", "Qualification", "Experience", "Joining Date", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teachers.map((t, i) => (
            <tr key={t.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{t.fullName}</td>
              <td className="px-4 py-3 text-gray-600">{t.email}</td>
              <td className="px-4 py-3 text-gray-600">{t.phone}</td>
              <td className="px-4 py-3"><Badge text={t.gender} color="emerald" /></td>
              <td className="px-4 py-3 text-gray-600">{t.employeeId}</td>
              <td className="px-4 py-3 text-gray-600">{t.department}</td>
              <td className="px-4 py-3 text-gray-600">{t.subject}</td>
              <td className="px-4 py-3 text-gray-600">{t.qualification}</td>
              <td className="px-4 py-3 text-gray-600">{t.experience} yrs</td>
              <td className="px-4 py-3 text-gray-600">{t.joiningDate}</td>
              <td className="px-4 py-3">
                <button onClick={() => onDelete(t.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: "indigo" | "emerald" }) {
  const cls = color === "indigo"
    ? "bg-indigo-100 text-indigo-700"
    : "bg-emerald-100 text-emerald-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{text}</span>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-4xl mb-3"></p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
