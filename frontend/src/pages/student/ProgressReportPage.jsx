import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentPerformance } from '../../redux/features/performanceSlice';
import { generatePDF, generateExcel } from '../../utils/reportGenerators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProgressReportPage = () => {
  const { studentId } = useParams();
  const [reportType, setReportType] = useState('detailed'); // detailed, summary, transcript
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [isGenerating, setIsGenerating] = useState(false);

  const dispatch = useDispatch();
  const { performance, loading, error } = useSelector((state) => state.performance);
  const student = useSelector((state) => 
    state.student.students.find(s => s.id === studentId)
  );

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentPerformance(studentId));
    }
  }, [dispatch, studentId]);

  const handleGenerateReport = async (format) => {
    try {
      setIsGenerating(true);
      const reportData = {
        student: {
          name: `${student.firstName} ${student.lastName}`,
          rollNumber: student.rollNumber,
          class: student.class,
          section: student.section,
        },
        performance: {
          ...performance,
          term: selectedTerm,
        },
        reportType,
        schoolInfo: {
          name: 'School Name',
          address: 'School Address',
          logo: 'school-logo-url',
        },
      };

      if (format === 'pdf') {
        await generatePDF(reportData, reportType);
      } else if (format === 'excel') {
        await generateExcel(reportData, reportType);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!performance) return <ErrorMessage message="No performance data available" />;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Progress Report Generation
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Generate comprehensive student progress reports
            </p>
          </div>

          {/* Report Configuration */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="detailed">Detailed Report</option>
                  <option value="summary">Summary Report</option>
                  <option value="transcript">Academic Transcript</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Term
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="current">Current Term</option>
                  <option value="previous">Previous Term</option>
                  <option value="all">All Terms</option>
                </select>
              </div>
            </div>

            {/* Report Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Report Preview</h4>
              <div className="mt-2 border-4 border-dashed border-gray-200 rounded-lg h-96 overflow-auto">
                {/* Add report preview content */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerateReport('pdf')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerateReport('excel')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isGenerating ? 'Generating...' : 'Generate Excel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportPage; 