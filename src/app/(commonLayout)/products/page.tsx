import { getAllProducts } from "@/services/productService"
import { getUserInfo } from "@/services/authService"
import ProductsClient from "@/components/modules/Products/ProductsClient"
import { IProductResponse } from "@/types/product.types"

// Revalidate every 60 seconds for caching
export const revalidate = 60

const ProductsPage = async () => {
  // Fetch initial data server-side (parallel fetch)
  const [productsRes, user] = await Promise.all([
    getAllProducts({
      status: 'APPROVED',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }),
    getUserInfo()
  ])

  const initialData: IProductResponse["data"] = productsRes.data

  return <ProductsClient initialData={initialData} initialUser={user} />
}

export default ProductsPage
