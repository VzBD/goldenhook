import { gql } from '@apollo/client';

export const GET_HOME_FEED = gql`
  query HomeFeed($limit: Int = 8) {
    products(limit: $limit) { id name price image }
  }
`;

export const GET_CATALOG = gql`
  query Catalog(
    $page: Int = 1,
    $pageSize: Int = 12,
    $brand: String,
    $q: String,
    $category: String,
    $priceFrom: Int,
    $priceTo: Int,
    $inStock: Boolean,
    $sort: String
  ) {
    catalog(
      page: $page,
      pageSize: $pageSize,
      brand: $brand,
      q: $q,
      category: $category,
      priceFrom: $priceFrom,
      priceTo: $priceTo,
      inStock: $inStock,
      sort: $sort
    ) {
      items { id name price image brand category }
      total
      page
      pageSize
      brands
      categories
    }
  }
`;

export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      price
      oldPrice
      sku
      brand
      description
      specs { key value }
      images
      reviews { id author rating comment createdAt }
      related { id name price image }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query Categories {
    catalog(page: 1, pageSize: 1) {
      categories
    }
  }
`;
