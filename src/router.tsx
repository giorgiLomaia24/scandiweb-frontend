import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import ProductDetails from "./pages/product-details/ProductDetails";

export default function AppRouter() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:categoryName" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
    </Routes>

  );
}
