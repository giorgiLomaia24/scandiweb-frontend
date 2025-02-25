import { Component, createRef } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchProductDetails, setPlaceOrder, setSelectedProduct } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import Slider from "../../components/slider/Slider";
import Attribute from "../../components/attribute/Attribute";
import ProductImage from "../../components/pproduct-image/ProductImage";
import Button from "../../components/button/Button";
import { handleAddToCart } from "../../utils/cartUtils";
import parse from "html-react-parser";
import { ProductDetailsPropsType } from "../../types/propType";
import { SelectedAttributesType } from "../../types/cartType";
import ProductDetailsPlaceHolder from "../../placeholders/product/ProductDetailsPlaceHolder";
import { ProductType } from "../../types/productType";
import { withRouter } from "../../utils/withRouter"; // ✅ Ensures route params are injected
import "./productDetails.css";

interface ProductDetailsState {
  isHorizontal: boolean;
  activeImageIndex: number;
  selectedAttributes: SelectedAttributesType;
  productState?: ProductType;
}

class ProductDetails extends Component<ProductDetailsPropsType, ProductDetailsState> {
  state: ProductDetailsState = {
    isHorizontal: window.innerWidth <= 768,
    activeImageIndex: 0,
    selectedAttributes: {},
  };

  sliderRef = createRef<{ scrollToNext: () => void; scrollToPrev: () => void }>();

  componentDidMount() {
    const { fetchProductDetails, setSelectedProduct, id, products } = this.props;

    console.log("componentDidMount - ID:", id);
    console.log("componentDidMount - Product from Redux before fetching:", this.props.product);

    if (!id) {
      console.error("No product ID found in URL params.");
      return;
    }

    if (products.length === 0) {
      console.log("Fetching product details from API...");
      fetchProductDetails(id);
    } else {
      console.log("Searching for product in Redux store...");
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProduct(product);
      } else {
        console.log("Product not found in store, fetching from API...");
        fetchProductDetails(id);
      }
    }

    this.setDefaultAttributes();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps: ProductDetailsPropsType) {
    const { product } = this.props;

    if (prevProps.product !== product && product) {
      console.log("Redux updated with product:", product);
      this.setState({ productState: product });
      this.setDefaultAttributes();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  setDefaultAttributes = () => {
    const { product } = this.props;
    if (!product?.attributes) return;

    const defaultAttributes = product.attributes.reduce((acc, attr) => {
      if (attr.values?.length) {
        acc[attr.name] = { id: attr.id, value: attr.values[0].value };
      }
      return acc;
    }, {} as SelectedAttributesType);

    this.setState({ selectedAttributes: defaultAttributes });
  };

  handleResize = () => {
    this.setState({ isHorizontal: window.innerWidth <= 1116 });
  };

  handleNext = () => {
    const { product } = this.props;
    this.sliderRef.current?.scrollToNext();

    this.setState(
      (prevState) => ({
        activeImageIndex: (prevState.activeImageIndex + 1) % (product?.gallery.length || 1),
      }),
      () => window.scrollTo({ top: 0, behavior: "smooth" })
    );
  };

  handlePrev = () => {
    const { product } = this.props;
    this.sliderRef.current?.scrollToPrev();

    this.setState(
      (prevState) => ({
        activeImageIndex:
          prevState.activeImageIndex === 0 ? (product?.gallery.length || 1) - 1 : prevState.activeImageIndex - 1,
      }),
      () => window.scrollTo({ top: 0, behavior: "smooth" })
    );
  };

  setActiveImage = (index: number) => {
    this.setState({ activeImageIndex: index });
  };

  handleSelectAttribute = (attributeId: number, attributeName: string, value: string) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: { id: attributeId, value },
      },
    }));
  };

  addToCart = () => {
    const { product, addToCart, cartItems, setPlaceOrder } = this.props;
    if (product?.in_stock) {
      handleAddToCart(product, this.state.selectedAttributes, cartItems, addToCart);
    }
    setPlaceOrder(false);
  };

  render() {
    const { product, loading, error } = this.props;
    const { isHorizontal, activeImageIndex, selectedAttributes } = this.state;

    if (loading) return <ProductDetailsPlaceHolder />;
    if (error) return <p style={{ margin: "300px auto" }}>{error}</p>;
    if (!product) return <p style={{ margin: "300px auto" }}>No product found.</p>;

    return (
      <div className="product--details-wrapper">
        <Slider
          ref={this.sliderRef}
          images={product.gallery}
          isHorizontal={isHorizontal}
          onImageClick={this.setActiveImage}
          activeImageIndex={activeImageIndex}
        />

        <div className="product--details">
          <ProductImage
            activeIndex={activeImageIndex}
            images={product.gallery}
            handleNext={this.handleNext}
            handlePrev={this.handlePrev}
          />

          <div className="content">
            <div className="product--name">{product.name}</div>

            {product.attributes && (
              <Attribute
                attributes={product.attributes}
                selectedAttributes={selectedAttributes}
                isSmall={false}
                onSelect={this.handleSelectAttribute}
              />
            )}

            <div className="price">
              <p>Price:</p>
              <span className="price--value">
                {product.price.currency_symbol} {product.price.amount}
              </span>
            </div>

            <Button
              onClick={this.addToCart}
              label="ADD TO CART"
              hoverEffect={false}
              backgroundColor={product.in_stock ? "#5ECE7B" : "gray"}
              cursor={product.in_stock ? "pointer" : "not-allowed"}
              margin={isHorizontal ? "15px auto" : ""}
              dataTestId="add-to-cart"
              disabled={product.in_stock === false ? true : false}
            />

            <div className="description" data-testid="product-description">
              {parse(product.description)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: any) => ({
  id: ownProps.match.params.id, // ✅ Ensures `id` is retrieved correctly
  product: state.product.selectedProduct,
  products: state.product.products,
  loading: state.product.loading,
  error: state.product.error,
  cartItems: state.cart.items,
});

// ✅ Wrapped with `withRouter` to pass `id` from URL
export default withRouter(connect(mapStateToProps, { fetchProductDetails, addToCart, setPlaceOrder, setSelectedProduct })(ProductDetails));
