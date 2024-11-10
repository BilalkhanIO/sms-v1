import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById } from '../../redux/features/studentSlice';
import { generateTransferCertificate } from '../../utils/documentGenerators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const TransferCertificatePage = () => {
  const { studentId } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState({
    certificateNumber: '',
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    reasonForLeaving: '',
    remarks: '',
    conductAndCharacter: 'GOOD',
  });

  const dispatch = useDispatch();
  const { selectedStudent, loading, error } = useSelector((state) => state.student);
  const schoolInfo = useSelector((state) => state.settings.schoolInfo);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [dispatch, studentId]);

  const handleGenerateCertificate = async () => {
    try {
      setIsGenerating(true);
      await generateTransferCertificate(selectedStudent, schoolInfo, certificateData);
    } catch (error) {
      console.error('Error generating transfer certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!selectedStudent) return <ErrorMessage message="Student not found" />;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Transfer Certificate Generation
          </h1>
          <button
            onClick={handleGenerateCertificate}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isGenerating ? 'Generating...' : 'Generate Certificate'}
          </button>
        </div>

        {/* Certificate Form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              {/* Certificate Number */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Certificate Number
                </label>
                <input
                  type="text"
                  value={certificateData.certificateNumber}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      certificateNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Last Attendance Date */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Last Attendance Date
                </label>
                <input
                  type="date"
                  value={certificateData.lastAttendanceDate}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      lastAttendanceDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Reason for Leaving */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Leaving
                </label>
                <textarea
                  value={certificateData.reasonForLeaving}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      reasonForLeaving: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Conduct and Character */}
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Conduct and Character
                </label>
                <select
                  value={certificateData.conductAndCharacter}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      conductAndCharacter: e.target.value,
                    })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="EXCELLENT">Excellent</option>
                  <option value="VERY_GOOD">Very Good</option>
                  <option value="GOOD">Good</option>
                  <option value="SATISFACTORY">Satisfactory</option>
                </select>
              </div>

              {/* Additional Remarks */}
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Remarks
                </label>
                <textarea
                  value={certificateData.remarks}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      remarks: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Student Information Preview */}
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Student Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Preview of student details that will appear on the certificate.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Roll Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedStudent.rollNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Class</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedStudent.class}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Section</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedStudent.section}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(selectedStudent.admissionDate).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCertificatePage; 