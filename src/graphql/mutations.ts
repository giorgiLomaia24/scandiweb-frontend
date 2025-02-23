import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!) {
    createOrder(items: $items) {
      order_id
      message
    }
  }
`;
