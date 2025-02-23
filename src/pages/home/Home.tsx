import { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../components/card/Card';
import { fetchProductsByCategory } from '../../redux/slices/productSlice';
import { RootState } from '../../redux/store';
import { HomePropsType } from '../../types/propType';
import { ProductType } from '../../types/productType';
import { SelectedAttributesType } from '../../types/cartType';
import './home.css';
import { capitalizeFirstLetter } from '../../utils/helperFunctions';
import HomePagePlaceHolder from '../../placeholders/home/HomePagePlaceHolder';
import ErrorPage from '../../errors/ErrorPage';

class Home extends Component<HomePropsType> {
  componentDidMount() {
    const { fetchProductsByCategory, selectedCategory } = this.props;
    fetchProductsByCategory(selectedCategory || 'all');
  }

  componentDidUpdate(prevProps: HomePropsType) {
    const { fetchProductsByCategory, selectedCategory } = this.props;

    if (prevProps.selectedCategory !== selectedCategory) {
      fetchProductsByCategory(selectedCategory);
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

  render() {
    const { products, loading, error } = this.props;

    if (loading) return <HomePagePlaceHolder />;
    if (error) return <ErrorPage />;

    return (
      <>
        <div className="category-title">
          <h1>{capitalizeFirstLetter(this.props.setSelectedCategoryName)}</h1>
        </div>
        <div className="product-list">
          {products?.length > 0 ? (
            products.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                imageUrl={product.gallery?.[0] || 'https://via.placeholder.com/150'}
                price={{
                  amount: product.price?.amount ?? 0,
                  currency_label: product.price?.currency_label ?? 'USD',
                  currency_symbol: product.price?.currency_symbol ?? '$',
                }}
                name={product.name}
                in_stock={product.in_stock}
                attributes={product.attributes ?? []}
                selectedAttributes={this.generateDefaultAttributes(product)}
              />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </>
    );
  }
}

// Map Redux state to props
const mapStateToProps = (state: RootState) => ({
  products: state.product.products,
  loading: state.product.loading,
  error: state.product.error,
  selectedCategory: state.product.selectedCategory,
  setSelectedCategoryName: state.product.selectedCategoryName
});

// Connect Redux and export component
export default connect(mapStateToProps, { fetchProductsByCategory })(Home);
