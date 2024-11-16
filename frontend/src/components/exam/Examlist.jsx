import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExams, deleteExam } from '../../redux/features/examSlice';
import { EXAM_TYPES, EXAM_STATUS } from '../../constants/exam';
import { 
  PencilIcon, 
  TrashIcon, 
  ClipboardCheckIcon,
  CalendarIcon 
} from '@heroicons/react/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const ExamList = () => {
  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((state) => state.exam);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    dispatch(fetchExams(filters));
  }, [dispatch, filters]);

  const handleDelete = (exam) => {
    setSelectedExam(exam);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteExam(selectedExam.id)).unwrap();
      setShowDeleteDialog(false);
      setSelectedExam(null);
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [EXAM_STATUS.UPCOMING]: 'bg-blue-100 text-blue-800',
      [EXAM_STATUS.ONGOING]: 'bg-green-100 text-green-800',
      [EXAM_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
      [EXAM_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            {Object.values(EXAM_TYPES).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            {Object.values(EXAM_STATUS).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search exams..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <Link
          to="/exams/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Exam
        </Link>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {exam.className} | {exam.type}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  <p>Total Marks: {exam.totalMarks}</p>
                  <p>Date: {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Link
                  to={`/exams/${exam.id}/schedule`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <CalendarIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/exams/${exam.id}/results`}
                  className="text-green-600 hover:text-green-900"
                >
                  <ClipboardCheckIcon className="h-5 w-5" />
                </Link>
                <Link
                  to={`/exams/${exam.id}/edit`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDelete(exam)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Exam"
        message={`Are you sure you want to delete "${selectedExam?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ExamList;
