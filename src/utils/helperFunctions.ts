export const getSizeAbbreviation = (size: string): string => {
    const sizeMapping: { [key: string]: string } = {
        small: "S",
        medium: "M",
        large: "L",
        "extra large": "XL",
        "double extra large": "XXL",
        "triple extra large": "XXXL",
    };

    const normalizedSize = size.trim().toLowerCase();

    return sizeMapping[normalizedSize] || size;
};

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
