import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetSubjectsQuery } from '../../api/subjectApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { BookOpen, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const SubjectList = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    grade: 'all'
  });

  const { data: subjects, isLoading, error } = useGetSubjectsQuery(filters);

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const grades = [
    { value: 'all', label: 'All Grades' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Subjects">
        {isAdmin && (
          <Link to="/dashboard/subjects/create">
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </Link>
        )}
      </PageHeader>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search subjects..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={filters.grade}
          onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
          className="border rounded-lg px-4 py-2"
        >
          {grades.map(grade => (
            <option key={grade.value} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects?.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.name}
                    </div>
                    {subject.description && (
                      <div className="text-sm text-gray-500">
                        {subject.description.length > 50
                          ? `${subject.description.substring(0, 50)}...`
                          : subject.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subject.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Grade {subject.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subject.credits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subject.teachers?.length > 0
                        ? subject.teachers.map(teacher => 
                            `${teacher.firstName} ${teacher.lastName}`
                          ).join(', ')
                        : 'No teachers assigned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/subjects/${subject.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </Link>
                    {isAdmin && (
                      <Link
                        to={`/dashboard/subjects/${subject.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!subjects || subjects.length === 0) && (
          <div className="p-6 text-center text-gray-500">
            No subjects found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectList; 