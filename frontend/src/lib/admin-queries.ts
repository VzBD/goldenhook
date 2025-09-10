import { gql } from '@apollo/client';

export const GET_ADMIN_PRODUCTS = gql`
  query AdminProducts($page: Int = 1, $pageSize: Int = 20, $q: String) {
    adminProducts(page: $page, pageSize: $pageSize, q: $q) {
      items { id name price image }
      total
      page
      pageSize
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) { id name price image }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) { id name price image }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;
