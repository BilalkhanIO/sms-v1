import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitResults } from '../../redux/features/examSlice';
import { GRADE_SCALE } from '../../constants/exam';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ExamResults = ({ examId }) => {
  const dispatch = useDispatch();
  const { selectedExam, loading, error } = useSelector((state) => state.exam);
  const [results, setResults] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (selectedExam?.students) {
      setResults(
        selectedExam.students.map(student => ({
          studentId: student.id,
          studentName: student.name,
          subjects: selectedExam.subjects.map(subject => ({
            subjectId: subject.id,
            marks: 0,
            remarks: ''
          }))
        }))
      );
    }
  }, [selectedExam]);

  const calculateGrade = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    for (const [grade, range] of Object.entries(GRADE_SCALE)) {
      if (percentage >= range.min && percentage <= range.max) {
        return grade;
      }
    }
    return 'F';
  };

  const handleMarksChange = (studentIndex, subjectIndex, marks) => {
    const updatedResults = [...results];
    updatedResults[studentIndex].subjects[subjectIndex].marks = 
      Math.min(Math.max(0, parseInt(marks) || 0), selectedExam.subjects[subjectIndex].marks);
    setResults(updatedResults);
  };

  const handleRemarksChange = (studentIndex, subjectIndex, remarks) => {
    const updatedResults = [...results];
    updatedResults[studentIndex].subjects[subjectIndex].remarks = remarks;
    setResults(updatedResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitResults({ examId, resultsData: results })).unwrap();
      setShowSubmitModal(false);
    } catch (error) {
      console.error('Failed to submit results:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Results Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Exam Results</h3>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Results
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                {selectedExam?.subjects.map((subject) => (
                  <th
                    key={subject.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {subject.subjectName}
                    <br />
                    <span className="text-gray-400">
                      (Max: {subject.marks})
                    </span>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                  <br />
                  <span className="text-gray-400">
                    (Max: {selectedExam?.totalMarks})
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, studentIndex) => {
                const totalMarks = result.subjects.reduce(
                  (sum, subject) => sum + subject.marks,
                  0
                );
                const grade = calculateGrade(totalMarks, selectedExam?.totalMarks);

                return (
                  <tr key={result.studentId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.studentName}
                      </div>
                    </td>
                    {result.subjects.map((subject, subjectIndex) => (
                      <td key={subject.subjectId} className="px-6 py-4">
                        <input
                          type="number"
                          value={subject.marks}
                          onChange={(e) => handleMarksChange(
                            studentIndex,
                            subjectIndex,
                            e.target.value
                          )}
                          min="0"
                          max={selectedExam?.subjects[subjectIndex].marks}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={subject.remarks}
                          onChange={(e) => handleRemarksChange(
                            studentIndex,
                            subjectIndex,
                            e.target.value
                          )}
                          placeholder="Remarks"
                          className="mt-1 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {totalMarks}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        grade === 'F'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Submit Results
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to submit these results? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
