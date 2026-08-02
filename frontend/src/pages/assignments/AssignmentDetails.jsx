import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Upload, Star } from 'lucide-react';
import {
  useGetAssignmentByIdQuery,
  useSubmitAssignmentMutation,
  useGradeSubmissionMutation,
} from '../../api/assignmentApi';
import useAuth from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useUIStore } from '../../store/zustand/useUIStore';

const AssignmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role;
  const addToast = useUIStore((s) => s.addToast);

  const { data, isLoading, isError, error } = useGetAssignmentByIdQuery(id);
  const assignment = data?.data || data || null;

  // Submit modal state
  const [submitOpen, setSubmitOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();

  // Grade modal state
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradeTarget, setGradeTarget] = useState(null); // { studentId, studentName }
  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });
  const [gradeSubmission, { isLoading: isGrading }] = useGradeSubmissionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitAssignment({ id, fileUrl }).unwrap();
      addToast({ type: 'success', title: 'Assignment submitted successfully' });
      setSubmitOpen(false);
      setFileUrl('');
    } catch (err) {
      addToast({ type: 'error', title: 'Submission failed', message: err?.data?.message });
    }
  };

  const openGradeModal = (submission) => {
    setGradeTarget(submission);
    setGradeForm({ grade: submission.grade ?? '', feedback: submission.feedback ?? '' });
    setGradeOpen(true);
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await gradeSubmission({
        assignmentId: id,
        studentId: gradeTarget.student?._id || gradeTarget.studentId,
        grade: Number(gradeForm.grade),
        feedback: gradeForm.feedback,
      }).unwrap();
      addToast({ type: 'success', title: 'Grade saved' });
      setGradeOpen(false);
      setGradeTarget(null);
    } catch (err) {
      addToast({ type: 'error', title: 'Grading failed', message: err?.data?.message });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        {error?.data?.message || 'Failed to load assignment.'}
      </div>
    );
  }

  const submissions = assignment.submissions || [];
  const mySubmission = role === 'STUDENT'
    ? submissions.find(
        (s) => s.student?.user?._id?.toString() === user?._id?.toString()
      ) || assignment.mySubmission
    : null;

  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  return (
    <div>
      <PageHeader
        title={assignment.title}
        backUrl="/dashboard/assignments"
      />

      {/* Assignment Details Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {assignment.subject?.name || assignment.subjectName || 'No subject'}
            </span>
            {assignment.class?.name && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{assignment.class.name}</span>
              </>
            )}
          </div>
          <StatusBadge status={assignment.status} />
        </div>

        {assignment.description && (
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{assignment.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Due Date</p>
            <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleString()
                : '—'}
            </p>
          </div>
          {assignment.pointsPossible != null && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Points Possible</p>
              <p className="text-sm font-medium text-gray-800">{assignment.pointsPossible}</p>
            </div>
          )}
          {role === 'TEACHER' && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Submissions</p>
              <p className="text-sm font-medium text-gray-800">
                {submissions.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT: Submission Section */}
      {role === 'STUDENT' && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">My Submission</h2>

          {mySubmission ? (
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Submitted</p>
                {mySubmission.submittedAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(mySubmission.submittedAt).toLocaleString()}
                  </p>
                )}
                {mySubmission.fileUrl && (
                  <a
                    href={mySubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View submitted file
                  </a>
                )}
                {mySubmission.grade != null && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-800 rounded-full px-3 py-1 text-xs font-medium">
                    <Star className="h-3.5 w-3.5" />
                    Grade: {mySubmission.grade}
                    {assignment.pointsPossible ? ` / ${assignment.pointsPossible}` : ''}
                  </div>
                )}
                {mySubmission.feedback && (
                  <p className="text-xs text-gray-600 mt-2 italic">"{mySubmission.feedback}"</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Not yet submitted</p>
                {isOverdue && (
                  <p className="text-xs text-red-500 mt-0.5">This assignment is overdue.</p>
                )}
                <Button
                  className="mt-3"
                  size="small"
                  onClick={() => setSubmitOpen(true)}
                  disabled={assignment.status === 'CLOSED'}
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Submit Assignment
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEACHER: Submissions Table */}
      {role === 'TEACHER' && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Submissions ({submissions.length})
            </h2>
          </div>

          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText className="h-10 w-10 opacity-30 mb-2" />
              <p className="text-sm">No submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feedback
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((sub, idx) => {
                    const student = sub.student || {};
                    const studentName =
                      student.user
                        ? `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim()
                        : sub.studentName || `Student ${idx + 1}`;
                    return (
                      <tr key={sub._id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.submittedAt
                            ? new Date(sub.submittedAt).toLocaleString()
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.fileUrl ? (
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.grade != null
                            ? `${sub.grade}${assignment.pointsPossible ? ` / ${assignment.pointsPossible}` : ''}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {sub.feedback || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Button
                            size="small"
                            variant="secondary"
                            onClick={() => openGradeModal(sub)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Grade
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submit Assignment Modal */}
      <Modal
        isOpen={submitOpen}
        onClose={() => { setSubmitOpen(false); setFileUrl(''); }}
        title="Submit Assignment"
        size="default"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setSubmitOpen(false); setFileUrl(''); }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="submit-assignment-form"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </>
        }
      >
        <form id="submit-assignment-form" onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">
            Paste a link to your submitted file (Google Drive, Dropbox, etc.).
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File URL *</label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="https://drive.google.com/..."
            />
          </div>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        isOpen={gradeOpen}
        onClose={() => { setGradeOpen(false); setGradeTarget(null); }}
        title="Grade Submission"
        size="default"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => { setGradeOpen(false); setGradeTarget(null); }}
              disabled={isGrading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="grade-submission-form"
              isLoading={isGrading}
            >
              Save Grade
            </Button>
          </>
        }
      >
        <form id="grade-submission-form" onSubmit={handleGrade} className="space-y-4">
          {gradeTarget && (
            <p className="text-sm text-gray-600">
              Grading submission for{' '}
              <strong>
                {gradeTarget.student?.user
                  ? `${gradeTarget.student.user.firstName || ''} ${gradeTarget.student.user.lastName || ''}`.trim()
                  : gradeTarget.studentName || 'student'}
              </strong>
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade{assignment?.pointsPossible ? ` (out of ${assignment.pointsPossible})` : ''} *
            </label>
            <input
              type="number"
              required
              min="0"
              max={assignment?.pointsPossible ?? undefined}
              value={gradeForm.grade}
              onChange={(e) => setGradeForm((f) => ({ ...f, grade: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter grade"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
            <textarea
              rows={3}
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm((f) => ({ ...f, feedback: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Optional feedback for the student"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentDetails;
