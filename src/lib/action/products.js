'use server'


import { getTokenServer } from "../getTokenServer";


const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

export const addProduct = async(product)=>{
   const token = await getTokenServer()

    const res = await fetch(`${baseURL}/seller/products`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(product),
    });
    const data = await res.json()
    return data;
};

