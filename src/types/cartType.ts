import {  PriceType } from "./productType";

export interface CartType {
  totalItemCount: number;
  items: CartItemType[];
  totalPrice: number;
}

export interface CartItemType {
    id: string;
    productImage: string;
    qty: number;
    price: PriceType;
    name: string;
    uniqueKey: string;
    attributes?: CartAttributeType[] ; 
  }
  

  export interface CartAttributeType {
    id: number;
    name: string;
    type: string;
    values: CartAttributeValueType[]; 
  }
  

  export interface CartAttributeValueType {
    display_value: string;
    value: string;
    selected: boolean; 
  }
  


export interface SelectedAttributesType {
    [key: string]: { id: number; value: string };
  }
  