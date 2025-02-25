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
      console.log("Updating filtered products...");
      if (this.props.products.length > 0) { // Ensure Redux has products before updating
        this.updateFilteredProducts();
      }
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
    const categoryId = String(this.getCategoryIdFromParamsOrRedux()); // Convert to string
  
    console.log("Filtering for category:", categoryId);
    console.log("Redux products before filtering:", products);
  
    if (categoryId === "all") {
      console.log("Setting all products in state...");
      this.setState({ filteredProducts: [...products] }); // Ensure we copy products
      return;
    }
  
    const filtered = products.filter((product) => {
      console.log(`Checking product ${product.id} with category ${product.category_id}`);
      return String(product.category_id) === categoryId; // ✅ Convert both to strings
    });
  
    console.log("Filtered Products:", filtered);
    this.setState({ filteredProducts: filtered });
  };
  
  

  render() {
    const { loading, error, setSelectedCategoryName } = this.props;
    const { filteredProducts } = this.state;

    if (loading) return <HomePagePlaceHolder />;
    if (error) return <ErrorPage />;

    console.log(this.props.products, 'products from redux')
    console.log(this.state.filteredProducts, 'products from state that is filetered')
    console.log(this.props.selectedCategory);



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