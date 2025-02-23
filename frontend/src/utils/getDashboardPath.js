export const getDashboardPath = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
      case "SCHOOL_ADMIN":
        return "/dashboard/admin-dashboard";
      case "TEACHER":
        return "/dashboard/teacher-dashboard";
      case "STUDENT":
        return "/dashboard/student-dashboard";
      case "PARENT":
        return "/dashboard/parent-dashboard";
      default:
        return "/dashboard";
    }
  };