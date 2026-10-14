import { getTokenServer } from "../getTokenServer";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;


export const getProduct = async(page) =>{
    if(!page){
        page = 1;
    }
    const token = await getTokenServer()
    const res = await fetch(`${baseURL}/seller/products?page=${page}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
    })
    const data = await res.json();
    return data;
};


export const getAllProducts = async (search)=>{
    const res = await fetch(`${baseURL}/products?search=${search}`);
    const data = await res.json();

    return data;
};


export const getProductById = async (id) => {
    const res = await fetch(`${baseURL}/product/${id}`);
    const data = await res.json();
    return data;
};