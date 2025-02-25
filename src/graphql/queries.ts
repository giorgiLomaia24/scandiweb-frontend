import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query getProductsByCategory($categoryId: String!) {
    products(category_id: $categoryId) {
      id
      name
      gallery
      in_stock
      description
      price {
        amount
        currency_label
        currency_symbol
      }
       attributes {
        id
        name
        type
        values {
          display_value
          value
        }
      }  
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query getProductDetails($productId: String!) {
    product(id: $productId) {
      id
      name
      gallery
      description
      in_stock
      attributes {
        id
        name
        type
        values {
          display_value
          value
        }
      }
      price {
        amount
        currency_label
        currency_symbol
      }
    }
  }
`;