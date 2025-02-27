import { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchCategories, setSelectedCategory, fetchProductsByCategory, setSelectedCategoryName } from "../../redux/slices/productSlice";
import { closeCart, openCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import Cart from "../cart/Cart";
import Notification from "../notification/Notification";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { withRouter } from "../../utils/withRouter";
import { NavbarProps } from "../../types/propType";
import "./navbar.css";


interface NavbarState {
  isDropdownOpen: boolean;
  isMobileMenu: boolean;
  openMobileNav: boolean
}


class Nav extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isMobileMenu: false,
      openMobileNav: false
    };
  }

  componentDidMount() {
    const { categories, fetchCategories, match, selectedCategory, setSelectedCategory, setSelectedCategoryName } = this.props;

    let categoryParam = match?.params?.categoryName || window.location.pathname.split("/")[1] || "all";


    if (categories.length === 0) {
      fetchCategories();
    }

    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
      setSelectedCategoryName(categoryParam);
    }

    window.addEventListener('resize', this.handleResize);
    this.handleResize()
  }

  componentDidUpdate(prevProps: NavbarProps) {


    if (prevProps.selectedCategory !== this.props.selectedCategory) {
      this.setState({ isDropdownOpen: false });
      document.body.classList.remove('no-scroll');
    }

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }


  handleResize = () => {
    if (window.innerWidth <= 871) {
      this.setState({ isMobileMenu: true });
    } else {
      this.setState({ isMobileMenu: false, openMobileNav: false });
    }
  };


  handleCategoryClick = (categoryId: string | number) => {
    const categoryIdToString = String(categoryId);
    this.props.setSelectedCategory(categoryIdToString);
  };

  // toggleDropdown = () => {
  //   if (this.props.totalItemCount !== 0) {
  //     this.setState((prevState) => {
  //       const isNowOpen = !prevState.isDropdownOpen;

  //       if (isNowOpen) {
  //         document.body.classList.add('no-scroll');
  //       } else {
  //         document.body.classList.remove('no-scroll');
  //       }

  //       return { isDropdownOpen: isNowOpen };
  //     });
  //   }
  // };

  toggleDropdown = () => {
    if (this.props.showCart) {
      this.props.closeCart()
    } else {
      this.props.openCart()
    }
  };
  

  handleMobileNavOpen = () => {
    if (window.innerWidth <= 871) {
      this.setState({ openMobileNav: true });
      document.body.classList.add('no-scroll')
    }
  }
  handleMobileNavClose = () => {
    this.setState({ openMobileNav: false })
    document.body.classList.remove('no-scroll')
  }


  closeOverlay = () => {
    this.setState(() => ({
      isDropdownOpen: false,
    }));
    document.body.classList.remove('no-scroll')
  }



  render() {

    const { match, selectedCategory, categories } = this.props;
    const categoryParam = match.params.categoryName;

    return (
      <>

        <Notification message="ORDER PLACED SUCCESSFULLY" visible={this.props.orderPlaced} />

        <div className="navbar">
          {this.state.isMobileMenu && (<div className="humburger-menu" onClick={this.handleMobileNavOpen}><CiMenuBurger style={{ color: '#5ECE7B', fontSize: '26px', marginLeft: '-20px', fontWeight: '600' }} />   </div>)}

          <ul className={`navigation ${this.state.openMobileNav ? 'active' : ''}`}>
            {this.state.isMobileMenu && (
              <div className="close-mobile" onClick={this.handleMobileNavClose}>
                <IoCloseSharp style={{ color: "#fff", fontSize: "26px", fontWeight: "600" }} />
              </div>
            )}
            {categories.map((category) => {
              const categoryNameLower = category.name.toLowerCase();
              const isActive =
                selectedCategory.toLowerCase() === categoryNameLower ||
                categoryParam?.toLowerCase() === categoryNameLower;

              return (
                <Link
                  to={category.name === "all" ? "/all" : `/${categoryNameLower}`}
                  key={category.id}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  data-testid={isActive ? "active-category-link" : "category-link"}
                  onClick={() => {
                    this.props.setSelectedCategory(category.name);
                    this.props.setSelectedCategoryName(category.name);
                    this.setState({ openMobileNav: false });
                  }}
                >
                  <li className={`nav-link ${isActive ? "active" : ""}`}>{category.name.toUpperCase()}</li>
                </Link>
              );
            })}
          </ul>


          <div className="logo">
            <svg width="33" height="31" viewBox="0 0 33 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_150_361)">
                <path d="M30.0222 23.6646C30.0494 23.983 29.8009 24.2566 29.4846 24.2566H3.46924C3.15373 24.2566 2.90553 23.9843 2.93156 23.6665L4.7959 0.912269C4.8191 0.629618 5.05287 0.412109 5.33372 0.412109H27.5426C27.8226 0.412109 28.0561 0.628527 28.0801 0.910361L30.0222 23.6646Z" fill="#1DCF65" />
                <path d="M32.0988 29.6014C32.1313 29.9985 31.8211 30.339 31.4268 30.339H1.59438C1.2009 30.339 0.890922 30.0002 0.922082 29.6037L3.06376 2.34718C3.09168 1.9927 3.38426 1.71973 3.73606 1.71973H29.1958C29.5468 1.71973 29.8391 1.99161 29.868 2.34499L32.0988 29.6014Z" fill="url(#paint0_linear_150_361)" />
                <path d="M15.9232 21.6953C12.0402 21.6953 8.88135 17.8631 8.88135 13.1528C8.88135 12.9075 9.07815 12.7085 9.32109 12.7085C9.56403 12.7085 9.76084 12.9073 9.76084 13.1528C9.76084 17.3732 12.5253 20.8067 15.9234 20.8067C19.3214 20.8067 22.0859 17.3732 22.0859 13.1528C22.0859 12.9075 22.2827 12.7085 22.5257 12.7085C22.7686 12.7085 22.9654 12.9073 22.9654 13.1528C22.9653 17.8631 19.8062 21.6953 15.9232 21.6953Z" fill="white" />
              </g>
            </svg>
          </div>
          <div className="cart-icon" >
            <button  onClick={this.toggleDropdown} data-testid="cart-btn" >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M19.5613 4.87359C19.1822 4.41031 18.5924 4.12873 17.9821 4.12873H5.15889L4.75914 2.63901C4.52718 1.77302 3.72769 1.16895 2.80069 1.16895H0.653099C0.295301 1.16895 0 1.45052 0 1.79347C0 2.13562 0.294459 2.418 0.653099 2.418H2.80069C3.11654 2.418 3.39045 2.61936 3.47434 2.92139L6.04306 12.7077C6.27502 13.5737 7.07451 14.1778 8.00152 14.1778H16.4028C17.3289 14.1778 18.1507 13.5737 18.3612 12.7077L19.9405 6.50575C20.0877 5.941 19.9619 5.33693 19.5613 4.87365L19.5613 4.87359ZM18.6566 6.22252L17.0773 12.4245C16.9934 12.7265 16.7195 12.9279 16.4036 12.9279H8.00154C7.68569 12.9279 7.41178 12.7265 7.32789 12.4245L5.49611 5.39756H17.983C18.1936 5.39756 18.4042 5.49824 18.5308 5.65948C18.6567 5.81994 18.7192 6.0213 18.6567 6.22266L18.6566 6.22252Z" fill="#43464E" />
                <path d="M8.44437 14.9814C7.2443 14.9814 6.25488 15.9276 6.25488 17.0751C6.25488 18.2226 7.24439 19.1688 8.44437 19.1688C9.64445 19.1696 10.6339 18.2234 10.6339 17.0757C10.6339 15.928 9.64436 14.9812 8.44437 14.9812V14.9814ZM8.44437 17.9011C7.9599 17.9011 7.58071 17.5385 7.58071 17.0752C7.58071 16.6119 7.9599 16.2493 8.44437 16.2493C8.92885 16.2493 9.30804 16.6119 9.30804 17.0752C9.30722 17.5188 8.90748 17.9011 8.44437 17.9011Z" fill="#43464E" />
                <path d="M15.6875 14.9814C14.4875 14.9814 13.498 15.9277 13.498 17.0752C13.498 18.2226 14.4876 19.1689 15.6875 19.1689C16.8875 19.1689 17.877 18.2226 17.877 17.0752C17.8565 15.9284 16.8875 14.9814 15.6875 14.9814ZM15.6875 17.9011C15.2031 17.9011 14.8239 17.5385 14.8239 17.0752C14.8239 16.612 15.2031 16.2493 15.6875 16.2493C16.172 16.2493 16.5512 16.612 16.5512 17.0752C16.5512 17.5188 16.1506 17.9011 15.6875 17.9011Z" fill="#43464E" />
              </svg>
              {this.props.totalItemCount > 0 && (<div className="cart-item_count">{this.props.totalItemCount}</div>)}
            </button>
          </div>
        </div>

        { this.props.showCart && (<Cart />)}
        {this.props.totalItemCount > 0 && this.props.showCart && (<div className="overlay" onClick={() => this.props.closeCart()} />)}


      </>
    );
  }
}


const mapStateToProps = (state: RootState) => ({
  products: state.product.products,
  categories: state.product.categories,
  selectedCategory: state.product.selectedCategory,
  totalItemCount: state.cart.totalItemCount,
  orderPlaced: state.product.orderPlaced,
  showCart: state.cart.showCart

});

export default connect(mapStateToProps, {
  fetchCategories,
  setSelectedCategory,
  fetchProductsByCategory,
  setSelectedCategoryName,
  closeCart,
  openCart
})(withRouter(Nav));
