import { useState } from "react";
import type { UserRole, StudentData, TeacherData, UserData } from "./types";

interface Props {
  onSubmit: (data: UserData) => void;
}

const commonFields = (
  vals: Record<string, string>,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
) => (
  <>
    <Field label="Full Name" name="fullName" placeholder="e.g. John Doe" value={vals.fullName} onChange={onChange} required />
    <Field label="Email" name="email" type="email" placeholder="e.g. john@example.com" value={vals.email} onChange={onChange} required />
    <Field label="Phone" name="phone" type="tel" placeholder="e.g. +1 234 567 8900" value={vals.phone} onChange={onChange} required />
    <Field label="Date of Birth" name="dob" type="date" placeholder="" value={vals.dob} onChange={onChange} required />
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
      <select name="gender" value={vals.gender} onChange={onChange} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700">
        <option value="">— Select Gender —</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <textarea name="address" value={vals.address} onChange={onChange} rows={2} required
        placeholder="e.g. 123 Main Street, City, Country"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
    </div>
  </>
);

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400" />
    </div>
  );
}

const studentDefaults = {
  fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
  studentId: "", grade: "", major: "", enrollmentYear: "", guardianName: "", guardianPhone: "",
};

const teacherDefaults = {
  fullName: "", email: "", phone: "", dob: "", gender: "", address: "",
  employeeId: "", department: "", subject: "", qualification: "", experience: "", joiningDate: "",
};

export default function RegistrationForm({ onSubmit }: Props) {
  const [role, setRole] = useState<UserRole>("student");
  const [sVals, setSVals] = useState({ ...studentDefaults });
  const [tVals, setTVals] = useState({ ...teacherDefaults });
  const [submitted, setSubmitted] = useState(false);

  const handleS = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setSVals((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleT = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setTVals((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (role === "student") {
      onSubmit({ ...sVals, id, role: "student" } as StudentData);
      setSVals({ ...studentDefaults });
    } else {
      onSubmit({ ...tVals, id, role: "teacher" } as TeacherData);
      setTVals({ ...teacherDefaults });
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registration Form</h2>

      {/* Role Toggle */}
      <div className="flex gap-3 mb-8">
        {(["student", "teacher"] as UserRole[]).map((r) => (
          <button key={r} type="button" onClick={() => setRole(r)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
              role === r
                ? r === "student"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-emerald-600 text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}>
            {r === "student" ? "🎓 Student" : "👨‍🏫 Teacher"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role === "student" ? (
            <>
              {commonFields(sVals, handleS)}
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Academic Info</p>
              </div>
              <Field label="Student ID" name="studentId" placeholder="e.g. STU-2024-001" value={sVals.studentId} onChange={handleS} required />
              <Field label="Grade / Class" name="grade" placeholder="e.g. Grade 10 / Class A" value={sVals.grade} onChange={handleS} required />
              <Field label="Major / Stream" name="major" placeholder="e.g. Computer Science" value={sVals.major} onChange={handleS} required />
              <Field label="Enrollment Year" name="enrollmentYear" type="number" placeholder="e.g. 2024" value={sVals.enrollmentYear} onChange={handleS} required />
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Guardian Info</p>
              </div>
              <Field label="Guardian Name" name="guardianName" placeholder="e.g. Jane Doe" value={sVals.guardianName} onChange={handleS} required />
              <Field label="Guardian Phone" name="guardianPhone" type="tel" placeholder="e.g. +1 234 567 8900" value={sVals.guardianPhone} onChange={handleS} required />
            </>
          ) : (
            <>
              {commonFields(tVals, handleT)}
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <p className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wide">Professional Info</p>
              </div>
              <Field label="Employee ID" name="employeeId" placeholder="e.g. EMP-2024-001" value={tVals.employeeId} onChange={handleT} required />
              <Field label="Department" name="department" placeholder="e.g. Mathematics" value={tVals.department} onChange={handleT} required />
              <Field label="Subject Taught" name="subject" placeholder="e.g. Algebra & Calculus" value={tVals.subject} onChange={handleT} required />
              <Field label="Qualification" name="qualification" placeholder="e.g. M.Sc. Mathematics" value={tVals.qualification} onChange={handleT} required />
              <Field label="Experience (years)" name="experience" type="number" placeholder="e.g. 5" value={tVals.experience} onChange={handleT} required />
              <Field label="Joining Date" name="joiningDate" type="date" placeholder="" value={tVals.joiningDate} onChange={handleT} required />
            </>
          )}
        </div>

        <button type="submit"
          className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all ${
            role === "student" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"
          }`}>
          Register {role === "student" ? "Student" : "Teacher"}
        </button>

        {submitted && (
          <p className="mt-3 text-center text-green-600 font-medium animate-pulse">
            ✅ Registered successfully!
          </p>
        )}
      </form>
    </div>
  );
}
