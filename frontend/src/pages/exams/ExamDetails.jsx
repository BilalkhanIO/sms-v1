import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetExamByIdQuery, useDeleteExamMutation } from '../../api/examApi';
import { useSelector } from 'react-redux';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { Edit, Trash2, ClipboardList } from 'lucide-react';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canManage = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'].includes(user?.role);

  const { data: exam, isLoading, isError } = useGetExamByIdQuery(id);
  const [deleteExam, { isLoading: isDeleting }] = useDeleteExamMutation();

  const handleDelete = async () => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      await deleteExam(id).unwrap();
      navigate('/dashboard/exams');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError || !exam) return <div className="text-red-500 p-4">Exam not found.</div>;

  return (
    <div>
      <PageHeader
        title={exam.title}
        backUrl="/dashboard/exams"
        action={
          canManage && (
            <div className="flex gap-2">
              <Link
                to={`/dashboard/exams/${id}/edit`}
                className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                <Edit className="h-4 w-4" /> Edit
              </Link>
              <Link
                to={`/dashboard/exams/${id}/results`}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <ClipboardList className="h-4 w-4" /> Enter Results
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Exam Information</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Type</dt>
              <dd className="font-medium">{exam.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Date</dt>
              <dd className="font-medium">{new Date(exam.date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Total Marks</dt>
              <dd className="font-medium">{exam.totalMarks}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Passing Marks</dt>
              <dd className="font-medium">{exam.passingMarks}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="font-medium">{exam.status}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Class & Subject</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Class</dt>
              <dd className="font-medium">{exam.class?.name} {exam.class?.section}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Subject</dt>
              <dd className="font-medium">{exam.subject?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Created By</dt>
              <dd className="font-medium">{exam.createdBy?.firstName} {exam.createdBy?.lastName}</dd>
            </div>
          </dl>
        </div>
      </div>

      {exam.results?.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Results Summary</h3>
          <p className="text-gray-500">{exam.results.length} result(s) recorded.</p>
          <Link to={`/dashboard/exams/${id}/results`} className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            View / Edit Results →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExamDetails;
