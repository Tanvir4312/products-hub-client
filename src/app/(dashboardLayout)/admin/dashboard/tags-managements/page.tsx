import TagsManagement from "@/components/modules/Dasboard/Admin_Dashboard/TagsManagement/TagsManagement";
import React from "react";

export const metadata = {
  title: "Taxonomy Governance | Admin Dashboard",
  description: "Manage platform classification system and innovation discovery.",
};

const TagsManagementPage = () => {
  return (
    <div>
      <TagsManagement />
    </div>
  );
};

export default TagsManagementPage;