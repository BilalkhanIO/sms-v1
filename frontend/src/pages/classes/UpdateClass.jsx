import React from "react";
import ClassForm from "../../components/ClassForm";
import PageHeader from "../../components/common/PageHeader";

const UpdateClass = () => {
  return (
    <>
      <PageHeader title="Update Class" backUrl="/dashboard/classes" />
      <ClassForm />
    </>
  );
};

export default UpdateClass;
