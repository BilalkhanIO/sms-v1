import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetExamByIdQuery, useSubmitResultsMutation } from '../../api/examApi';
import { useGetStudentsByClassQuery } from '../../api/studentApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Search, Save, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const ResultEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isTeacher, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});

  const { data: exam, isLoading: isLoadingExam } = useGetExamByIdQuery(id);
  const { data: students, isLoading: isLoadingStudents } = useGetStudentsByClassQuery(
    exam?.classId,
    { skip: !exam?.classId }
  );
  const [submitResults, { isLoading: isSubmitting }] = useSubmitResultsMutation();

  if (!isTeacher && !isAdmin) {
    navigate('/dashboard');
    return null;
  }

  if (isLoadingExam || isLoadingStudents) {
    return <Spinner size="large" />;
  }

  const filteredStudents = students?.filter(student =>
    `${student.firstName} ${student.lastName} ${student.rollNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleMarksChange = (studentId, value) => {
    const marks = parseInt(value) || 0;
    setResults(prev => {
      const existing = prev.find(r => r.studentId === studentId);
      if (existing) {
        return prev.map(r =>
          r.studentId === studentId ? { ...r, marks } : r
        );
      }
      return [...prev, { studentId, marks }];
    });

    // Validate marks
    if (marks > exam.totalMarks) {
      setErrors(prev => ({
        ...prev,
        [studentId]: `Marks cannot exceed total marks (${exam.totalMarks})`
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[studentId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await submitResults({
        examId: id,
        results: results.map(result => ({
          ...result,
          status: result.marks >= exam.passingMarks ? 'passed' : 'failed'
        }))
      }).unwrap();
      navigate(`/dashboard/exams/${id}`);
    } catch (error) {
      console.error('Failed to submit results:', error);
    }
  };

  const getResultStatus = (marks) => {
    if (!marks) return null;
    return marks >= exam.passingMarks ? 'passed' : 'failed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Enter Exam Results"
        backUrl={`/dashboard/exams/${id}`}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Exam Info */}
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>Total Marks: {exam.totalMarks}</p>
            <p>Passing Marks: {exam.passingMarks}</p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks Obtained
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents?.map((student) => {
                const result = results.find(r => r.studentId === student.id);
                const status = getResultStatus(result?.marks);
                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={exam.totalMarks}
                          value={result?.marks || ''}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className={`w-24 px-3 py-1 border rounded-md ${
                            errors[student.id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[student.id] && (
                          <div className="absolute top-0 -right-6">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors[student.id] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[student.id]}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {status && (
                        <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultEntry; 