import { Component, createRef } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchProductDetails, setPlaceOrder, setSelectedProduct } from "../../redux/slices/productSlice";
import { addToCart, openCart } from "../../redux/slices/cartSlice";
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
import { withRouter } from "../../utils/withRouter";
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


    if (!id) {
      return;
    }

    if (products.length === 0) {
      fetchProductDetails(id);
    } else {
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProduct(product);
      } else {
        fetchProductDetails(id);
      }
    }

    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps: ProductDetailsPropsType) {
    const { product } = this.props;

    if (prevProps.product !== product && product) {
      this.setState({ productState: product });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }



  handleResize = () => {
    this.setState({ isHorizontal: window.innerWidth <= 1116 });
  };

  handleNext = () => {
    const { product } = this.props;
    if (!product?.gallery || product.gallery.length === 0) return; 
  
    this.sliderRef.current?.scrollToNext();
  
    this.setState(
      (prevState) => ({
        activeImageIndex: (prevState.activeImageIndex + 1) % product.gallery.length, 
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

    const { product, addToCart, cartItems, setPlaceOrder, openCart } = this.props;
    console.log(product);
    if (product?.in_stock) {
      handleAddToCart(product, this.state.selectedAttributes, cartItems, addToCart);
    }
    setPlaceOrder(false);
    openCart();
    document.body.classList.add('no-scroll');
    
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
                isPDP={true}
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
              backgroundColor={
                product?.in_stock &&
                  product?.attributes?.every((attr) => selectedAttributes[attr.name])
                  ? "#5ECE7B"
                  : "gray"
              }
              cursor={
                product?.in_stock &&
                  product?.attributes?.every((attr) => selectedAttributes[attr.name])
                  ? "pointer"
                  : "not-allowed"
              }
              margin={isHorizontal ? "15px auto" : ""}
              dataTestId="add-to-cart"
              disabled={
                product?.in_stock === false ||
                !product?.attributes?.every((attr) => selectedAttributes[attr.name])
              }
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
  id: ownProps.match.params.id,
  product: state.product.selectedProduct,
  products: state.product.products,
  loading: state.product.loading,
  error: state.product.error,
  cartItems: state.cart.items,
});

export default withRouter(connect(mapStateToProps, { fetchProductDetails, addToCart, setPlaceOrder, setSelectedProduct, openCart })(ProductDetails));
