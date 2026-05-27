import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetExamsQuery, useDeleteExamMutation } from '../../api/examApi';
import { useSelector } from 'react-redux';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { PlusCircle, Eye, Edit, Trash2, ClipboardList } from 'lucide-react';

const ExamList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user?.role);

  const { data: exams, isLoading, isError } = useGetExamsQuery();
  const [deleteExam, { isLoading: isDeleting }] = useDeleteExamMutation();
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteExam(id).unwrap();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setConfirmId(null);
    }
  };

  const statusColors = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-red-500 p-4">Failed to load exams.</div>;

  return (
    <div>
      <PageHeader
        title="Exams"
        action={
          canManage && (
            <button
              onClick={() => navigate('/dashboard/exams/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              Create Exam
            </button>
          )
        }
      />

      {!exams?.length ? (
        <div className="text-center py-16 text-gray-500">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No exams found.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{exam.title}</td>
                  <td className="px-6 py-4 text-gray-500">{exam.type}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(exam.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-500">{exam.totalMarks}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[exam.status] || 'bg-gray-100 text-gray-700'}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/dashboard/exams/${exam._id}`} className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4 inline" />
                    </Link>
                    {canManage && (
                      <>
                        <Link to={`/dashboard/exams/${exam._id}/edit`} className="text-yellow-600 hover:text-yellow-800 ml-2">
                          <Edit className="h-4 w-4 inline" />
                        </Link>
                        {confirmId === exam._id ? (
                          <span className="ml-2">
                            <button onClick={() => handleDelete(exam._id)} disabled={isDeleting} className="text-red-600 text-xs mr-1">Confirm</button>
                            <button onClick={() => setConfirmId(null)} className="text-gray-500 text-xs">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmId(exam._id)} className="text-red-500 hover:text-red-700 ml-2">
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamList;
