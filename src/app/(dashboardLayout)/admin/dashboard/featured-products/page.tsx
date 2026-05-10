import ProductManagement from "@/components/modules/Dasboard/Admin_Dashboard/ProductManagement/ProductManagement";
import React, { Suspense } from "react";

export const metadata = {
  title: "Featured Showcases | Admin Dashboard",
  description: "Manage platform-wide featured products and highlights.",
};

const FeaturedProductsPage = () => {
  return (
    <Suspense fallback={<div>Loading Registry...</div>}>
      <ProductManagement 
        defaultFeatured="true"
        pageTitle="Featured"
        pageSubtitle="Managing and curating platform-wide featured innovation showcases."
      />
    </Suspense>
  );
};

export default FeaturedProductsPage;