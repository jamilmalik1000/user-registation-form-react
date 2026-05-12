import RegistrationForm from "./RegistrationForm";
import DataTable from "./DataTable";
import { useRegistrations } from "./useRegistrations";

export default function App() {
  const { records, addRecord, deleteRecord } = useRegistrations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
           User Registration Portal
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Register students and teachers with ease</p>
        </div>

        <RegistrationForm onSubmit={addRecord} />
        <DataTable records={records} onDelete={deleteRecord} />
      </div>
    </div>
  );
}
