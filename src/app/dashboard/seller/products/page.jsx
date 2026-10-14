import AddProductModal from '@/components/dashboard/seller/AddProductModal';
import { getProduct } from '@/lib/api/product';
import React from 'react';
import ProductTable from './ProductTable';

const SellerProductPage = async({searchParams}) => {
    const params = await searchParams;
    console.log(params);
    const products = await getProduct(params.page)


    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Products</h1>
                <AddProductModal></AddProductModal>
            </div>
            <ProductTable productsData={products}></ProductTable>
        </div>
    );
};

export default SellerProductPage;