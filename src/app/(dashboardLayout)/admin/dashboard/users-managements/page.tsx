import RoleUserManagement from "@/components/modules/Dasboard/Admin_Dashboard/RoleUserManagement/RoleUserManagement";
import React from "react";

export const metadata = {
  title: "General Audience Registry | Admin Dashboard",
  description: "Manage general platform users, suspensions, and roles.",
};

const UsersManagementsPage = () => {
  return (
    <div>
      <RoleUserManagement />
    </div>
  );
};

export default UsersManagementsPage;