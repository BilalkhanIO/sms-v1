import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetSubjectByIdQuery, useDeleteSubjectMutation } from '../../api/subjectApi';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import { BookOpen, Users, GraduationCap, Award, Trash, Edit } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Modal from '../../components/common/Modal';

const SubjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: subject, isLoading, error } = useGetSubjectByIdQuery(id);
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteSubject(id).unwrap();
      navigate('/dashboard/subjects');
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Subject Details"
        backUrl="/dashboard/subjects"
      >
        {isAdmin && (
          <div className="flex space-x-4">
            <Link to={`/dashboard/subjects/${id}/edit`}>
              <Button variant="secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{subject.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Subject Code</p>
                <p className="font-medium">{subject.code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-medium">Grade {subject.grade}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Credits</p>
                <p className="font-medium">{subject.credits}</p>
              </div>
            </div>
          </div>

          {subject.description && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          )}
        </div>

        {/* Assigned Teachers */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assigned Teachers</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {subject.teachers?.map((teacher) => (
              <div key={teacher.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </div>
                <Link
                  to={`/dashboard/teachers/${teacher.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Profile
                </Link>
              </div>
            ))}
            {(!subject.teachers || subject.teachers.length === 0) && (
              <div className="px-6 py-4 text-gray-500">
                No teachers assigned to this subject.
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Subject"
      >
        <div className="p-6">
          <p className="text-gray-600">
            Are you sure you want to delete this subject? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubjectDetails; 