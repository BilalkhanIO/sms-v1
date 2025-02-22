//src/pages/classes/CreateClass.jsx
import React from "react";
import ClassForm from "../../components/ClassForm"; // Create this component
import PageHeader from "../../components/common/PageHeader";
const CreateClass = () => {
  return (
    <>
      <PageHeader title="Create Class" />
      <ClassForm />
    </>
  );
};

export default CreateClass;
