// src/pages/classes/UpdateClass.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useGetClassByIdQuery } from "../../api/classesApi";
import ClassForm from "../../components/ClassForm"; // Reuse the form
import LoadingSpinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";

const UpdateClass = () => {
  const { id } = useParams();
  const { data: classData, isLoading, error } = useGetClassByIdQuery(id);

  if (isLoading || !classData) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageHeader title="Update Class" />
      <ClassForm classData={classData} />
    </>
  );
};

export default UpdateClass;
