import ProductCard from "@/components/ProductCard";
import SearchProduct from "@/components/SearchProduct";
import { getAllProducts } from "@/lib/api/product";
import React from "react";


const ProductsPage = async ({searchParams}) => {
    const {search} = await searchParams;
  const products = await getAllProducts(search);

  // আপনার ব্যাকএন্ড যদি পেজিনেশন অবজেক্ট { data: [...] } পাঠায় তবে products.data নিবেন,
  // আর সরাসরি শুধু অ্যারে পাঠালে products নিবেন।
  const displayProducts = products?.data || products || [];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* হেডিং ও সেকশন টাইটেল */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Explore Our Products
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Find the best tech gadgets and office essentials tailored just for you.
        </p>
      </div>

      <div className="text-center mb-10">
        <SearchProduct></SearchProduct>
      </div>

    {search && <h2>Found {products.length} Products with the <search> term</search></h2>}

      {/* যদি কোনো প্রোডাক্ট না থাকে */}
      {displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">No products available at the moment.</p>
        </div>
      ) : (
        /* রেসপন্সিভ গ্রিড লেআউট (মোবাইলে ১টা, ট্যাবে ২টা, ল্যাপটপে ৩টা, বড় স্ক্রিনে ৪টা কার্ড) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;