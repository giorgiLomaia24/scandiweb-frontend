import { Component } from "react";
import { connect } from "react-redux";
import { fetchProductsByCategory } from "../../redux/slices/productSlice";
import { RootState } from "../../redux/store";
import { HomePropsType } from "../../types/propType";
import { CategoryType, ProductType } from "../../types/productType";
import { SelectedAttributesType } from "../../types/cartType";
import { capitalizeFirstLetter } from "../../utils/helperFunctions";
import Card from "../../components/card/Card";
import HomePagePlaceHolder from "../../placeholders/home/HomePagePlaceHolder";
import ErrorPage from "../../errors/ErrorPage";
import { withRouter } from "../../utils/withRouter"; 
import "./home.css";

class Home extends Component<HomePropsType, { filteredProducts: ProductType[] }> {
  constructor(props: HomePropsType) {
    super(props);
    this.state = {
      filteredProducts: [],
    };
  }

  componentDidMount() {
    const { fetchProductsByCategory, products } = this.props;

    if (products.length === 0) {
      fetchProductsByCategory("all");
    }

    this.updateFilteredProducts(); 
  }

  componentDidUpdate(prevProps: HomePropsType) {
    
    if (
      prevProps.selectedCategory !== this.props.selectedCategory ||
      prevProps.products !== this.props.products ||
      prevProps.match.params.categoryName !== this.props.match.params.categoryName
    ) {
      this.updateFilteredProducts();
    }
  }

  generateDefaultAttributes = (product: ProductType): SelectedAttributesType => {
    return product.attributes?.reduce((acc, attr) => {
      if (attr.values?.length) {
        acc[attr.name] = { id: attr.id, value: attr.values[0].value };
      }
      return acc;
    }, {} as SelectedAttributesType) || {};
  };

  getCategoryIdFromParamsOrRedux = (): number => {
    const { categories, selectedCategory, match } = this.props;
    const categoryIdFromParams = match.params.categoryName; 

    const categoryName = categoryIdFromParams || selectedCategory;

    if (!categoryName || categoryName === "all") return 0; 

    const foundCategory = categories.find(
      (cat: CategoryType) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    return foundCategory ? Number(foundCategory.id) : 0; 
  };

  updateFilteredProducts = () => {
    const { products } = this.props;
    const categoryId = this.getCategoryIdFromParamsOrRedux(); 

    if (categoryId === 0) {
      this.setState({ filteredProducts: products });
      return;
    }

    const filtered = products.filter((product) => Number(product.category_id) === categoryId);
    this.setState({ filteredProducts: filtered });

  };

  render() {
    const { loading, error, setSelectedCategoryName } = this.props;
    const { filteredProducts } = this.state;

    if (loading) return <HomePagePlaceHolder />;
    if (error) return <ErrorPage />;


    return (
      <>
        <div className="category-title">
          <h1>{capitalizeFirstLetter(setSelectedCategoryName)}</h1>
        </div>

        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: ProductType) => (
              <Card
                key={product.id}
                id={product.id}
                imageUrl={product.gallery?.[0] || "https://via.placeholder.com/150"}
                price={{
                  amount: product.price?.amount ?? 0,
                  currency_label: product.price?.currency_label ?? "USD",
                  currency_symbol: product.price?.currency_symbol ?? "$",
                }}
                name={product.name}
                in_stock={product.in_stock}
                attributes={product.attributes ?? []}
                selectedAttributes={this.generateDefaultAttributes(product)}
              />
            ))
          ) : (
            <p>No products available for this category.</p>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.product.products,
  categories: state.product.categories,
  loading: state.product.loading,
  error: state.product.error,
  selectedCategory: state.product.selectedCategory,
  setSelectedCategoryName: state.product.selectedCategoryName,
});


export default connect(mapStateToProps, { fetchProductsByCategory })(withRouter(Home));