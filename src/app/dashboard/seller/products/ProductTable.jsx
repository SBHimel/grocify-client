import { Pagination, Table } from "@heroui/react";
import Link from "next/link";

export default function ProductTable({ productsData }) {
  const products = productsData.data;
  const page = productsData.page;
  const pages = []
  const totalPages = productsData.totalPage;
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  // console.log(pages);

  return (
    <Table className="mt-10">
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>#</Table.Column>
            <Table.Column>Title</Table.Column>
            <Table.Column>Price</Table.Column>
            <Table.Column>Quantity</Table.Column>
          </Table.Header>
          <Table.Body>
            {products.map((product, index) => <Table.Row key={product._id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{product.title}</Table.Cell>
              <Table.Cell>{product.price}</Table.Cell>
              <Table.Cell>{product.quantity}</Table.Cell>
            </Table.Row>)}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      <Table.Footer>
        <Pagination size="sm">

          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}

              >
                <Link className="flex gap-2" href={`/dashboard/seller/products?page=${page-1}`}>
                <Pagination.PreviousIcon />
                Prev
                </Link>
              </Pagination.Previous>
            </Pagination.Item>
            {pages.map((p) => (
              <Pagination.Item key={p}>
                <Link href={`/dashboard/seller/products?page=${p}`}>
                  <Pagination.Link className={`${p===page && 'bg-blue-500 text-white'}`} isActive={p === page} >
                    {p}
                  </Pagination.Link>
                </Link>
              </Pagination.Item>
            ))}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page === totalPages}

              >
                <Link className="flex gap-2" href={`/dashboard/seller/products?page=${page+1}`}>
                Next
                <Pagination.NextIcon />
                </Link>
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </Table.Footer>
    </Table>
  );
}