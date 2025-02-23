// src/pages/Users.jsx

import React from "react";
import UserList from "../components/user/UserList";
import PageHeader from "../components/common/PageHeader";

const Users = () => {
  return (
    <>
      <PageHeader title="User Management" />
      <UserList />
    </>
  );
};

export default Users;
