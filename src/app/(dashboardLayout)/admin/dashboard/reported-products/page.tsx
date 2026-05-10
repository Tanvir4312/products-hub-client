import ProductManagement from "@/components/modules/Dasboard/Admin_Dashboard/ProductManagement/ProductManagement";
import React, { Suspense } from "react";

export const metadata = {
  title: "Incident Governance | Admin Dashboard",
  description: "Review and manage reported products and policy violations.",
};

const ReportedProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading Registry...</div>}>
      <ProductManagement 
        defaultReported="true"
        pageTitle="Reported"
        pageSubtitle="Governing reported content and investigating policy violations."
      />
    </Suspense>
  );
};

export default ReportedProductsPage;