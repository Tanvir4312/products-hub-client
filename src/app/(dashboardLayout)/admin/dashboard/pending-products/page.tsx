import ProductManagement from "@/components/modules/Dasboard/Admin_Dashboard/ProductManagement/ProductManagement";
import React, { Suspense } from "react";

export const metadata = {
  title: "Pending Approval | Admin Dashboard",
  description: "Review and manage products awaiting platform approval.",
};

const PendingProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading Registry...</div>}>
      <ProductManagement 
        defaultStatus="PENDING"
        pageTitle="Pending"
        pageSubtitle="Reviewing and managing products awaiting platform approval."
      />
    </Suspense>
  );
};

export default PendingProductsPage;