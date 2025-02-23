import { CartAttributeType, CartAttributeValueType, CartItemType, SelectedAttributesType } from "../types/cartType";
import { AttributeType } from "../types/productType";

export const handleAddToCart = (
  product: any,
  selectedAttributes: SelectedAttributesType,
  cartItems: CartItemType[],
  addToCart: (item: CartItemType) => void
) => {
  if (!product || !addToCart) return;

  let attributesToUse = { ...selectedAttributes };

 
  product.attributes?.forEach((attr: AttributeType) => {
    if (!attributesToUse[attr.name] && attr.values?.length) {
      attributesToUse[attr.name] = { id: attr.id, value: attr.values[0].value };
    }
  });

  const uniqueKey = `${product.id}-${Object.keys(attributesToUse)
    .map((key) => `${key}-${attributesToUse[key].value}`)
    .join("_")}`;

  const existingItem = cartItems.find((item) => item.uniqueKey === uniqueKey);

  if (existingItem) {
    addToCart({ ...existingItem, qty: existingItem.qty + 1 });
  } else {
    const cartItem: CartItemType = {
      id: product.id,
      productImage: product.gallery?.[0] || "",
      qty: 1,
      price: product.price,
      name: product.name,
      uniqueKey,
      attributes: product.attributes?.map((attr: CartAttributeType) => ({
        id: attr.id,
        name: attr.name,
        type: attr.type,
        values: attr.values?.map((val: CartAttributeValueType) => ({
          value: val.value,
          display_value: val.display_value,
          selected: attributesToUse[attr.name]?.value === val.value,
        })) || [],
      })),
    };

    addToCart(cartItem);
  }
};
