// src/pages/classes/UpdateClass.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassById } from "../../store/classSlice"; // Import the thunk
import ClassForm from "../../components/ClassForm"; // Reuse the form
import LoadingSpinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";

const UpdateClass = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    item: classData,
    status,
    error,
  } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchClassById(id)); // Dispatch the thunk to fetch the class
  }, [dispatch, id]);

  if (status === "loading" || !classData) {
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
