import { getProductById } from '@/lib/api/product';
import React from 'react';
import Link from 'next/link';

const ProductDetailsPage = async ({ params }) => {
    const { id } = await params;
    const product = await getProductById(id);

    // সেফটি গার্ড: কোনো কারণে যদি ডাটাবেজ থেকে ডাটা না আসে
    if (!product || product.message) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Product Not Found!</h2>
                <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-xl">
                    Back to Products
                </Link>
            </div>
        );
    }

    // ডাটা destructure করে নিচ্ছি
    const { title, description, price, quantity, image } = product;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* মেইন গ্রিড লেআউট */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
                    
                    {/* বাম পাশ: ইমেজ সেকশন */}
                    <div className="bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-6 min-h-[350px] sm:min-h-[400px]">
                        <img 
                            src={image || "https://via.placeholder.com/400"} 
                            alt={title} 
                            className="object-contain max-h-full max-w-full rounded-lg hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* ডান পাশ: প্রোডাক্ট ইনফরমেশন */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* ক্যাটাগরি বা ছোট ট্যাগ */}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-4">
                                Tech Essential
                            </span>
                            
                            {/* প্রোডাক্ট টাইটেল */}
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
                                {title}
                            </h1>
                            
                            {/* ডেসক্রিপশন */}
                            <p className="text-gray-600 text-base leading-relaxed mb-6 whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {/* প্রাইস, স্টক এবং অ্যাকশন সেকশন */}
                        <div className="border-t border-gray-100 pt-6 space-y-6">
                            <div className="flex items-center justify-between">
                                {/* প্রাইস */}
                                <div>
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                                        Price
                                    </span>
                                    <span className="text-3xl font-black text-gray-900">
                                        ${price}
                                    </span>
                                </div>

                                {/* স্টক স্ট্যাটাস */}
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-1">
                                        Availability
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold ${
                                        Number(quantity) > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                        {Number(quantity) > 0 ? `${quantity} Units In Stock` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* বাটন গ্রুপ */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <form action={'/api/payment'} method='POST'>
                                    <input type='hidden' name='price' value={price} ></input>

                                    <input type='hidden' name='title' value={title} ></input>
                                    
                                    <input
                                    type='hidden' name='productId' value={product._id} ></input>

                                    <button type='submit' className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 text-center">
                                    Buy Now
                                </button>
                                </form>
                                <Link 
                                    href="/products" 
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 text-center"
                                >
                                    Back to Gallery
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetailsPage;