import { useState } from "react";
import type { UserData, StudentData, TeacherData } from "./types";
import RegistrationForm from "./RegistrationForm";

interface Props {
  records: UserData[];
  onDelete: (id: string) => void;
  onEdit: (data: UserData) => void;
}

interface ConfirmState { id: string; name: string; }

function ConfirmDialog({ target, onConfirm, onCancel }: {
  target: ConfirmState; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white border border-gray-200 p-8 w-full max-w-sm mx-4">
        <h3 className="text-base font-bold text-gray-800 mb-2">Delete Record?</h3>
        <p className="text-sm text-gray-500 mb-1">
          Are you sure you want to delete <span className="font-semibold text-gray-700">{target.name}</span>?
        </p>
        <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-semibold">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-5 py-2 bg-red-500 text-white text-sm font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ data, onSave, onClose }: {
  data: UserData; onSave: (d: UserData) => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <RegistrationForm
          editData={data}
          onSubmit={(updated) => { onSave(updated); onClose(); }}
          onCancelEdit={onClose}
        />
      </div>
    </div>
  );
}

export default function DataTable({ records, onDelete, onEdit }: Props) {
  const [tab, setTab] = useState<"student" | "teacher">("student");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [editTarget, setEditTarget] = useState<UserData | null>(null);

  const students = records.filter((r): r is StudentData => r.role === "student");
  const teachers = records.filter((r): r is TeacherData => r.role === "teacher");

  return (
    <div className="bg-white border border-gray-200">
      <div className="px-8 pt-8 pb-0">
        <h2 className="text-lg font-bold text-gray-800">Registered Records</h2>
        <p className="text-xs text-gray-400 mt-1">View, edit or remove registered users</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-6 px-8">
        <button onClick={() => setTab("student")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px ${
            tab === "student" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-400"
          }`}>
          Registered Students
          <span className={`ml-2 px-2 py-0.5 text-xs font-bold ${
            tab === "student" ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-400"
          }`}>
            {students.length}
          </span>
        </button>
        <button onClick={() => setTab("teacher")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 -mb-px ${
            tab === "teacher" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-400"
          }`}>
          Registered Teachers
          <span className={`ml-2 px-2 py-0.5 text-xs font-bold ${
            tab === "teacher" ? "bg-sky-100 text-sky-600" : "bg-gray-100 text-gray-400"
          }`}>
            {teachers.length}
          </span>
        </button>
      </div>

      <div className="p-8 pt-6">
        {tab === "student" ? (
          <StudentTable students={students}
            onEdit={setEditTarget}
            onDelete={(id, name) => setConfirm({ id, name })} />
        ) : (
          <TeacherTable teachers={teachers}
            onEdit={setEditTarget}
            onDelete={(id, name) => setConfirm({ id, name })} />
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          target={confirm}
          onConfirm={() => { onDelete(confirm.id); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {editTarget && (
        <EditModal
          data={editTarget}
          onSave={(updated) => { onEdit(updated); setEditTarget(null); }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}

function StudentTable({ students, onEdit, onDelete }: {
  students: StudentData[];
  onEdit: (d: UserData) => void;
  onDelete: (id: string, name: string) => void;
}) {
  if (!students.length) return <EmptyState message="No students registered yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wide">
            {["#", "Full Name", "Email", "Phone", "Gender", "Student ID", "Grade", "Major", "Enroll Year", "Guardian", "Actions"].map((h) => (
              <th key={h} className="px-3 py-3 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 text-gray-400">{i + 1}</td>
              <td className="px-3 py-3 font-semibold text-gray-800">{s.fullName}</td>
              <td className="px-3 py-3 text-gray-500">{s.email}</td>
              <td className="px-3 py-3 text-gray-500">{s.phone}</td>
              <td className="px-3 py-3 text-gray-500">{s.gender}</td>
              <td className="px-3 py-3 text-gray-500">{s.studentId}</td>
              <td className="px-3 py-3 text-gray-500">{s.grade}</td>
              <td className="px-3 py-3 text-gray-500">{s.major}</td>
              <td className="px-3 py-3 text-gray-500">{s.enrollmentYear}</td>
              <td className="px-3 py-3 text-gray-500">{s.guardianName}</td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(s)}
                    className="px-3 py-1 text-xs font-semibold text-sky-600 border border-sky-300 hover:bg-sky-50">
                    Edit
                  </button>
                  <button onClick={() => onDelete(s.id, s.fullName)}
                    className="px-3 py-1 text-xs font-semibold text-red-500 border border-red-300 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeacherTable({ teachers, onEdit, onDelete }: {
  teachers: TeacherData[];
  onEdit: (d: UserData) => void;
  onDelete: (id: string, name: string) => void;
}) {
  if (!teachers.length) return <EmptyState message="No teachers registered yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-wide">
            {["#", "Full Name", "Email", "Phone", "Gender", "Employee ID", "Department", "Subject", "Qualification", "Experience", "Joining Date", "Actions"].map((h) => (
              <th key={h} className="px-3 py-3 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teachers.map((t, i) => (
            <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 text-gray-400">{i + 1}</td>
              <td className="px-3 py-3 font-semibold text-gray-800">{t.fullName}</td>
              <td className="px-3 py-3 text-gray-500">{t.email}</td>
              <td className="px-3 py-3 text-gray-500">{t.phone}</td>
              <td className="px-3 py-3 text-gray-500">{t.gender}</td>
              <td className="px-3 py-3 text-gray-500">{t.employeeId}</td>
              <td className="px-3 py-3 text-gray-500">{t.department}</td>
              <td className="px-3 py-3 text-gray-500">{t.subject}</td>
              <td className="px-3 py-3 text-gray-500">{t.qualification}</td>
              <td className="px-3 py-3 text-gray-500">{t.experience} yrs</td>
              <td className="px-3 py-3 text-gray-500">{t.joiningDate}</td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(t)}
                    className="px-3 py-1 text-xs font-semibold text-sky-600 border border-sky-300 hover:bg-sky-50">
                    Edit
                  </button>
                  <button onClick={() => onDelete(t.id, t.fullName)}
                    className="px-3 py-1 text-xs font-semibold text-red-500 border border-red-300 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
