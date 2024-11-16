import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { generateExamReports } from '../../redux/features/examSlice';
import { REPORT_TYPES } from '../../constants/exam';
import { 
  DocumentTextIcon, 
  ChartBarIcon, 
  TableIcon 
} from '@heroicons/react/outline';

const ExamReportGenerator = ({ examId }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES.RESULT_SHEET);
  const dispatch = useDispatch();

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const report = await dispatch(generateExamReports({
        examId,
        type: selectedReport
      })).unwrap();
      
      // Handle the generated report (e.g., download or display)
      downloadReport(report, selectedReport);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (report, type) => {
    const blob = new Blob([report.data], { type: report.mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_${type.toLowerCase()}_${new Date().getTime()}.${report.extension}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Generate Reports
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setSelectedReport(REPORT_TYPES.RESULT_SHEET)}
          className={`p-4 border rounded-lg text-left ${
            selectedReport === REPORT_TYPES.RESULT_SHEET
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <DocumentTextIcon className="h-6 w-6 text-indigo-500 mb-2" />
          <h4 className="font-medium text-gray-900">Result Sheet</h4>
          <p className="text-sm text-gray-500">
            Detailed results for all students
          </p>
        </button>

        <button
          onClick={() => setSelectedReport(REPORT_TYPES.GRADE_SHEET)}
          className={`p-4 border rounded-lg text-left ${
            selectedReport === REPORT_TYPES.GRADE_SHEET
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <TableIcon className="h-6 w-6 text-indigo-500 mb-2" />
          <h4 className="font-medium text-gray-900">Grade Sheet</h4>
          <p className="text-sm text-gray-500">
            Summary of grades and GPA
          </p>
        </button>

        <button
          onClick={() => setSelectedReport(REPORT_TYPES.PERFORMANCE_ANALYSIS)}
          className={`p-4 border rounded-lg text-left ${
            selectedReport === REPORT_TYPES.PERFORMANCE_ANALYSIS
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <ChartBarIcon className="h-6 w-6 text-indigo-500 mb-2" />
          <h4 className="font-medium text-gray-900">Performance Analysis</h4>
          <p className="text-sm text-gray-500">
            Statistical analysis and charts
          </p>
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>
    </div>
  );
};

export default ExamReportGenerator;
