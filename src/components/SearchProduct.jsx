'use client'
import { Button, Input } from "@heroui/react";
import { redirect } from "next/navigation";


const SearchProduct = () => {
    const onSubmit = (e)=>{
        e.preventDefault();
        // console.log(e.target.search.value);

        redirect(`/products?search=${e.target.search.value}`)
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <Input name="search" type="search" placeholder="SearchProduct"></Input>
                <Button type="submit" size="sm" className={'ml-2'}>Search</Button>
            </form>
        </div>
    );
};

export default SearchProduct;