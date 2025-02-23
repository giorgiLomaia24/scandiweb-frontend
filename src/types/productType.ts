export interface ProductsType {
    products: ProductType[]
}

export interface ProductType {
    id: string;
    name: string;
    gallery: string[];
    in_stock: boolean;
    attributes?: AttributeType[];
    price: PriceType;
    description: string;
  }
  
 
  export interface AttributeType {
    id: number;
    name: string;
    type: string;
    values?: AttributeValueType[]; 
  }
  
  export interface AttributeValueType {
    display_value: string;
    value: string;
  }
 
  export interface PriceType {
    amount: number;
    currency_label: string;
    currency_symbol: string;
  }
  