import RegistrationForm from "./RegistrationForm";
import DataTable from "./DataTable";
import { useRegistrations } from "./useRegistrations";

export default function App() {
  const { records, addRecord, updateRecord, deleteRecord } = useRegistrations();

  const studentCount = records.filter((r) => r.role === "student").length;
  const teacherCount = records.filter((r) => r.role === "teacher").length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Registration Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Register and manage students & teachers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Students</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">{studentCount}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Teachers</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">{teacherCount}</p>
          </div>
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Users</p>
            <p className="text-2xl font-bold text-gray-700 mt-1">{records.length}</p>
          </div>
        </div>

        <RegistrationForm onSubmit={addRecord} />
        <DataTable records={records} onDelete={deleteRecord} onEdit={updateRecord} />
      </div>
    </div>
  );
}
