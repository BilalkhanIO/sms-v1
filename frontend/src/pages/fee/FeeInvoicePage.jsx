import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateInvoice } from '../../redux/features/feeSlice';
import FeeInvoiceGenerator from '../../components/fee/FeeInvoiceGenerator';
import { DownloadIcon, PrinterIcon } from '@heroicons/react/outline';

const FeeInvoicePage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const dispatch = useDispatch();
  const { structures, loading } = useSelector((state) => state.fee);
  const { students } = useSelector((state) => state.student);

  const handleGenerateInvoice = async () => {
    if (!selectedStudent || !selectedStructure) return;
    
    try {
      const invoice = await dispatch(generateInvoice({
        studentId: selectedStudent,
        structureId: selectedStructure,
      })).unwrap();
      
      // Handle successful invoice generation
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Fee Invoice</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {/* Handle print */}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PrinterIcon className="h-5 w-5 mr-2 text-gray-500" />
            Print
          </button>
          <button
            onClick={() => {/* Handle download */}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DownloadIcon className="h-5 w-5 mr-2 text-gray-500" />
            Download
          </button>
        </div>
      </div>

      {/* Selection Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fee Structure
            </label>
            <select
              value={selectedStructure}
              onChange={(e) => setSelectedStructure(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select Fee Structure</option>
              {structures.map((structure) => (
                <option key={structure.id} value={structure.id}>
                  {structure.name} - {structure.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerateInvoice}
            disabled={!selectedStudent || !selectedStructure || loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
          >
            {loading ? 'Generating...' : 'Generate Invoice'}
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="bg-white shadow rounded-lg">
        <FeeInvoiceGenerator
          studentId={selectedStudent}
          structureId={selectedStructure}
        />
      </div>
    </div>
  );
};

export default FeeInvoicePage; 