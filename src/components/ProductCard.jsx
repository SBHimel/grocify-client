import Link from 'next/link';
import React from 'react';

const ProductCard = ({ product }) => {
    // ডাটা থেকে প্রপার্টিগুলো destructure করে নিচ্ছি
    const { title, description, price, quantity, image } = product;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            {/* প্রোডাক্ট ইমেজ সেকশন */}
            <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {/* কোয়ান্টিটি ব্যাজ */}
                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                    Number(quantity) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {Number(quantity) > 0 ? `${quantity} Available` : 'Stock Out'}
                </span>
            </div>

            {/* প্রোডাক্ট ডিটেইলস সেকশন */}
            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-1 mb-2">
                    {title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {description}
                </p>
                
                {/* প্রাইস এবং অ্যাকশন বাটন */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div>
                        <span className="text-xs text-gray-400 block">Price</span>
                        <span className="text-xl font-extrabold text-primary-600">${price}</span>
                    </div>
                    <Link href={`/products/${product._id}`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm transition-colors duration-200">
                        Details
                    </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;