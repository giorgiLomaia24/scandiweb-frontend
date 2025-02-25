import { ReactNode } from "react";
import { CartItemType, SelectedAttributesType } from "./cartType";
import { AttributeType, CategoryType, PriceType, ProductType } from "./productType";

export interface ProductDetailsPropsType {
    product: ProductType;
    products: ProductType[];
    loading: boolean;
    error: string | null;
    fetchProductDetails: (productId: string) => void;
    addToCart: (item: CartItemType) => void;
    setPlaceOrder: (status: boolean) => void;
    setSelectedProduct: (product: ProductType) => void;
    cartItems: CartItemType[];
    id: string;
}
  
export interface HomePropsType {
    products: ProductType[];
    categories: CategoryType[]; 
    loading: boolean;
    error: string | null;
    selectedCategory: string;
    setSelectedCategoryName: string;
    fetchProductsByCategory: (category: string) => void;
    match: { params: { categoryName?: string } }; 

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
    disabled?: boolean; 
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


export interface NavbarProps {
    products: any[]
    categories: { id: string; name: string }[];
    selectedCategory: string;
    totalItemCount: number;
    orderPlaced: boolean;
    fetchCategories: () => void;
    setSelectedCategory: (category: string) => void;
    setSelectedCategoryName: (categoryName: string) => void;
    fetchProductsByCategory: (categoryId: string) => void;
    match: { params: { categoryName?: string } }; 
  }
  
export interface CartItemProps {
    handleIncreaseQty: (uniqueKey: string) => void;
    handleDecreaseQty: (uniqueKey: string) => void;

}
