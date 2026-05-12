import { useState, useEffect } from "react";
import type { UserRole, StudentData, TeacherData, UserData } from "./types";

interface Props {
  onSubmit: (data: UserData) => void;
  editData?: UserData | null;
  onCancelEdit?: () => void;
}

const inputCls = "w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-400";

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder} className={inputCls} />
    </div>
  );
}

const commonFields = (
  vals: Record<string, string>,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
) => (
  <>
    <Field label="Full Name" name="fullName" placeholder="e.g. John Doe" value={vals.fullName} onChange={onChange} required />
    <Field label="Email" name="email" type="email" placeholder="e.g. john@example.com" value={vals.email} onChange={onChange} required />
    <Field label="Phone" name="phone" type="tel" placeholder="e.g. +1 234 567 8900" value={vals.phone} onChange={onChange} required />
    <Field label="Date of Birth" name="dob" type="date" value={vals.dob} onChange={onChange} required />
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Gender</label>
      <select name="gender" title="Select Gender" value={vals.gender} onChange={onChange} required className={inputCls}>
        <option value="">— Select Gender —</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</label>
      <textarea name="address" value={vals.address} onChange={onChange} rows={2} required
        placeholder="e.g. 123 Main Street, City, Country" className={inputCls} />
    </div>
  </>
);

const studentDefaults = {
  fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
  studentId: "", grade: "", major: "", enrollmentYear: "", guardianName: "", guardianPhone: "",
};

const teacherDefaults = {
  fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
  employeeId: "", department: "", subject: "", qualification: "", experience: "", joiningDate: "",
};

export default function RegistrationForm({ onSubmit, editData, onCancelEdit }: Props) {
  const isEditing = !!editData;
  const [role, setRole] = useState<UserRole>("student");
  const [sVals, setSVals] = useState({ ...studentDefaults });
  const [tVals, setTVals] = useState({ ...teacherDefaults });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!editData) return;
    setRole(editData.role);
    if (editData.role === "student") setSVals({ ...studentDefaults, ...editData });
    else setTVals({ ...teacherDefaults, ...editData });
  }, [editData]);

  const handleS = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setSVals((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleT = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setTVals((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = isEditing ? editData!.id : crypto.randomUUID();
    if (role === "student") {
      onSubmit({ ...sVals, id, role: "student" } as StudentData);
      if (!isEditing) setSVals({ ...studentDefaults });
    } else {
      onSubmit({ ...tVals, id, role: "teacher" } as TeacherData);
      if (!isEditing) setTVals({ ...teacherDefaults });
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleCancel = () => {
    setSVals({ ...studentDefaults });
    setTVals({ ...teacherDefaults });
    onCancelEdit?.();
  };

  return (
    <div className="bg-white border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {isEditing ? `Edit ${role === "student" ? "Student" : "Teacher"} Record` : "Registration Form"}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {isEditing ? "Update the details below and save" : "Fill in the details to register a new user"}
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex gap-2 mb-6">
        {(["student", "teacher"] as UserRole[]).map((r) => (
          <button key={r} type="button"
            onClick={() => !isEditing && setRole(r)}
            disabled={isEditing}
            className={`px-6 py-2 text-sm font-semibold border ${
              role === r
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-white text-gray-500 border-gray-300"
            } ${isEditing ? "cursor-not-allowed opacity-50" : ""}`}>
            {r === "student" ? "Student" : "Teacher"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role === "student" ? (
            <>
              {commonFields(sVals, handleS)}
              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-3">Academic Info</p>
              </div>
              <Field label="Student ID" name="studentId" placeholder="e.g. STU-2024-001" value={sVals.studentId} onChange={handleS} required />
              <Field label="Grade / Class" name="grade" placeholder="e.g. Grade 10 / Class A" value={sVals.grade} onChange={handleS} required />
              <Field label="Major / Stream" name="major" placeholder="e.g. Computer Science" value={sVals.major} onChange={handleS} required />
              <Field label="Enrollment Year" name="enrollmentYear" type="number" placeholder="e.g. 2024" value={sVals.enrollmentYear} onChange={handleS} required />
              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-3">Guardian Info</p>
              </div>
              <Field label="Guardian Name" name="guardianName" placeholder="e.g. Jane Doe" value={sVals.guardianName} onChange={handleS} required />
              <Field label="Guardian Phone" name="guardianPhone" type="tel" placeholder="e.g. +1 234 567 8900" value={sVals.guardianPhone} onChange={handleS} required />
            </>
          ) : (
            <>
              {commonFields(tVals, handleT)}
              <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-3">Professional Info</p>
              </div>
              <Field label="Employee ID" name="employeeId" placeholder="e.g. EMP-2024-001" value={tVals.employeeId} onChange={handleT} required />
              <Field label="Department" name="department" placeholder="e.g. Mathematics" value={tVals.department} onChange={handleT} required />
              <Field label="Subject Taught" name="subject" placeholder="e.g. Algebra & Calculus" value={tVals.subject} onChange={handleT} required />
              <Field label="Qualification" name="qualification" placeholder="e.g. M.Sc. Mathematics" value={tVals.qualification} onChange={handleT} required />
              <Field label="Experience (years)" name="experience" type="number" placeholder="e.g. 5" value={tVals.experience} onChange={handleT} required />
              <Field label="Joining Date" name="joiningDate" type="date" value={tVals.joiningDate} onChange={handleT} required />
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {isEditing && (
            <button type="button" onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-600 text-sm font-semibold">
              Cancel
            </button>
          )}
          <button type="submit"
            className="px-6 py-2 bg-sky-500 text-white text-sm font-semibold">
            {isEditing ? "Save Changes" : `Register ${role === "student" ? "Student" : "Teacher"}`}
          </button>
        </div>

        {submitted && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            {isEditing ? "Record updated successfully." : "Registered successfully."}
          </p>
        )}
      </form>
    </div>
  );
}
