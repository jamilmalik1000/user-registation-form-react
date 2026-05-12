import { useState } from "react";
import type { UserData, StudentData, TeacherData } from "./types";

interface Props {
  records: UserData[];
  onDelete: (id: string) => void;
}

interface ConfirmState {
  id: string;
  name: string;
  role: "student" | "teacher";
}

function ConfirmDialog({ target, onConfirm, onCancel }: {
  target: ConfirmState;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 animate-fade-in">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">
            🗑️
          </div>
          <h3 className="text-lg font-bold text-gray-800">Delete Record?</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-700">{target.name}</span>?
            <br />
            <span className="text-xs text-red-400">This action cannot be undone.</span>
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all shadow-md">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DataTable({ records, onDelete }: Props) {
  const [tab, setTab] = useState<"student" | "teacher">("student");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const handleDeleteClick = (id: string, name: string, role: "student" | "teacher") =>
    setConfirm({ id, name, role });

  const handleConfirm = () => {
    if (confirm) onDelete(confirm.id);
    setConfirm(null);
  };

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
        <StudentTable students={students} onDelete={(id, name) => handleDeleteClick(id, name, "student")} />
      ) : (
        <TeacherTable teachers={teachers} onDelete={(id, name) => handleDeleteClick(id, name, "teacher")} />
      )}

      {confirm && (
        <ConfirmDialog
          target={confirm}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

function StudentTable({ students, onDelete }: { students: StudentData[]; onDelete: (id: string, name: string) => void }) {
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
                <button onClick={() => onDelete(s.id, s.fullName)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeacherTable({ teachers, onDelete }: { teachers: TeacherData[]; onDelete: (id: string, name: string) => void }) {
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
                <button onClick={() => onDelete(t.id, t.fullName)}
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
