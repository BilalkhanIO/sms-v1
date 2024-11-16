import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createExam, updateExam, fetchExamById } from '../../redux/features/examSlice';
import { EXAM_TYPES } from '../../constants/exam';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ExamForm = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedExam, loading, error } = useSelector((state) => state.exam);
  const { classes } = useSelector((state) => state.class);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    classId: '',
    startDate: '',
    endDate: '',
    totalMarks: 0,
    passingMarks: 0,
    description: '',
    instructions: '',
    subjects: []
  });

  useEffect(() => {
    if (examId) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, examId]);

  useEffect(() => {
    if (selectedExam && examId) {
      setFormData({
        title: selectedExam.title,
        type: selectedExam.type,
        classId: selectedExam.classId,
        startDate: selectedExam.startDate.split('T')[0],
        endDate: selectedExam.endDate.split('T')[0],
        totalMarks: selectedExam.totalMarks,
        passingMarks: selectedExam.passingMarks,
        description: selectedExam.description || '',
        instructions: selectedExam.instructions || '',
        subjects: selectedExam.subjects || []
      });
    }
  }, [selectedExam, examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (examId) {
        await dispatch(updateExam({ id: examId, data: formData })).unwrap();
      } else {
        await dispatch(createExam(formData)).unwrap();
      }
      navigate('/exams');
    } catch (error) {
      console.error('Failed to save exam:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Exam Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Exam Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Type</option>
            {Object.values(EXAM_TYPES).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Marks
          </label>
          <input
            type="number"
            value={formData.totalMarks}
            onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Passing Marks
          </label>
          <input
            type="number"
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/exams')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {examId ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </form>
  );
};

export default ExamForm;
