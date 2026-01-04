import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSchoolsQuery, useDeleteSchoolMutation } from '../../api/schoolApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageHeader from '../../components/common/PageHeader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Navigate } from 'react-router-dom';
import SchoolDataGrid from '../../components/schools/SchoolDataGrid';

const SchoolList = () => {
  const user = useSelector(selectCurrentUser);

  if (user && user.role === 'SCHOOL_ADMIN') {
    return <Navigate to={`/dashboard/schools/${user.school}`} />;
  }

  const { data: schools, isLoading, isError, error } = useGetSchoolsQuery();
  const [deleteSchool, { isLoading: isDeleting }] = useDeleteSchoolMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this school? This will also delete the associated admin user.')) {
      try {
        await deleteSchool(id).unwrap();
      } catch (err) {
        console.error('Failed to delete school:', err);
        alert(`Failed to delete school: ${err.data?.message || err.error}`);
      }
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return (
      <ErrorMessage>
        Error: {error.data?.message || error.error || 'Failed to load schools'}
      </ErrorMessage>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Schools">
        <Link to="/dashboard/schools/create">
          <Button>Add School</Button>
        </Link>
      </PageHeader>

      <SchoolDataGrid schools={schools?.data || []} handleDelete={handleDelete} />
    </div>
  );
};

export default SchoolList;