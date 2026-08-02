import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetExamByIdQuery, useGetClassResultsQuery, useGenerateReportCardMutation } from '../../api/examApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Search, Download, Award, TrendingUp, Users, Percent } from 'lucide-react';

const ResultReport = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: examRaw, isLoading: isLoadingExam, isError: examError } = useGetExamByIdQuery(id);
  const { data: resultsRaw, isLoading: isLoadingResults, isError: resultsError } = useGetClassResultsQuery(id);
  const [generateReportCard, { isLoading: isGenerating }] = useGenerateReportCardMutation();

  if (isLoadingExam || isLoadingResults) {
    return <Spinner size="large" />;
  }

  const exam = examRaw?.data || examRaw;

  if (examError || resultsError || !exam || !resultsRaw) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        Failed to load exam results.
      </div>
    );
  }

  const results = resultsRaw?.data || resultsRaw;
  const studentList = results?.students || [];
  const stats = results?.stats || {};

  const filteredResults = studentList.filter(student =>
    `${student.user?.firstName || ''} ${student.user?.lastName || ''} ${student.rollNumber || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleGenerateReportCard = async (studentId) => {
    try {
      await generateReportCard({ examId: id, studentId }).unwrap();
    } catch (error) {
      console.error('Failed to generate report card:', error);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Exam Results"
        backUrl={`/dashboard/exams/${id}`}
      />

      <div className="space-y-6">
        {/* Exam Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
          <div className="mt-2 text-sm text-gray-600">
            <p>Subject: {exam.subject?.name || '—'}</p>
            <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
            <p>Total Marks: {exam.totalMarks}</p>
            <p>Passing Marks: {exam.passingMarks}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold">{stats.totalStudents ?? '—'}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pass Percentage</p>
                <p className="text-2xl font-semibold">{stats.passPercentage != null ? `${stats.passPercentage}%` : '—'}</p>
              </div>
              <Percent className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold">{stats.averageScore ?? '—'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Highest Score</p>
                <p className="text-2xl font-semibold">{stats.highestScore ?? '—'}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults?.map((student) => {
                  const percentage = (student.marks / exam.totalMarks) * 100;
                  const grade = getGrade(percentage);
                  return (
                    <tr key={student._id || student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.user?.firstName || ''} {student.user?.lastName || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.marks}/{exam.totalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPerformanceColor(percentage)}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPerformanceColor(percentage)}`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          size="small"
                          onClick={() => handleGenerateReportCard(student._id || student.id)}
                          isLoading={isGenerating}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Report Card
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultReport; 