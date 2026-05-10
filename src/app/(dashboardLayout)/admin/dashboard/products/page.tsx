import ProductManagement from "@/components/modules/Dasboard/Admin_Dashboard/ProductManagement/ProductManagement";
import React, { Suspense } from "react";

export const metadata = {
  title: "Inventory Control | Admin Dashboard",
  description: "Manage platform products, approval cycles, and featured items.",
};

const AdminProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading Registry...</div>}>
      <ProductManagement />
    </Suspense>
  );
};

export default AdminProductsPage;