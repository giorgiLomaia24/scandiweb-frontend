import { ReactNode } from "react";
import { CartItemType, SelectedAttributesType } from "./cartType";
import { AttributeType, PriceType, ProductType } from "./productType";

export interface ProductDetailsPropsType {
    product: ProductType;
    loading: boolean;
    error: string | null;
    fetchProductDetails: (productId: string) => void;
    addToCart: (item: CartItemType) => void;
    setPlaceOrder: (status: boolean) => void;
    cartItems: CartItemType[];
    id: string;
}
  
export interface HomePropsType {
    products: ProductType[];
    loading: boolean;
    error: string | null;
    selectedCategory: string;
    setSelectedCategoryName: string;
    fetchProductsByCategory: (category: string) => void;
}

export interface AttributePropsType {
    attributes: AttributeType[];
    selectedAttributes?: SelectedAttributesType; 
    isSmall: boolean;
    onSelect?: (attributeId: number, name: string, value: string) => void; 
}

export interface ButtonPropsType {
    label?: string; 
    icon?: ReactNode;
    onClick: () => void; 
    width?: string;
    height?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: number;
    lineHeight?: string;
    backgroundColor?: string;
    textColor?: string;
    border?: string;
    borderRadius?: string;
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
    top?: string;
    left?: string;
    boxShadow?: string;
    visibility?: "visible" | "hidden";
    transition?: string;
    hoverEffect?: boolean; 
    iconPosition?: "left" | "right" | "center"; 
    circular?: boolean; 
    marginTop?: string;
    cursor?: string;
    margin?: string;
    dataTestId?: string;
}


export interface CardPropsType {
    id: string;
    imageUrl: string;
    name: string;
    in_stock: boolean;
    price: PriceType;
    attributes?: AttributeType[]; 
    selectedAttributes?: SelectedAttributesType; 
}

export interface CartProps {
    cartItems: CartItemType[];
    totalItemCount: number;
    totalPrice: number;
    removeFromCart: (uniqueKey: string) => void;
    increaseQty: (uniqueKey: string) => void;
    decreaseQty: (uniqueKey: string) => void;
    placeOrder: (cartItems: CartItemType[]) => void;
    clearCart: () => void;
}
  
export interface CartItemProps {
    handleIncreaseQty: (uniqueKey: string) => void;
    handleDecreaseQty: (uniqueKey: string) => void;

}
