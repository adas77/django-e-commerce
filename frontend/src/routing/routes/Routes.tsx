import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Root from "@/pages/Root";
import { BrowserRouter, Route, Routes as _Routes } from "react-router-dom";
import Layout from "../abstract/Layout";
import { ERoutes, ERoutesDetail } from "./Routes.enum";
import Products from "@/pages/products/Products";
import Product from "@/pages/products/Product";
import Orders from "@/pages/orders/Orders";
import Order from "@/pages/orders/Order";

const Routes = () => {
  return (
    <BrowserRouter>
      <_Routes>
        <Route path="/" element={<Layout />}>
          <Route path={ERoutes.products} element={<Products />} />
          <Route
            path={`${ERoutes.products}/${ERoutesDetail.product}`}
            element={<Product />}
          />

          <Route path={ERoutes.orders} element={<Orders />} />
          {/* <Route
            path={`${ERoutes.orders}/${ERoutesDetail.order}`}
            element={<Order />}
          /> */}

          <Route path="*" element={<NotFound />} />
          <Route path={ERoutesDetail.login} element={<Login />} />
        </Route>
      </_Routes>
    </BrowserRouter>
  );
};

export default Routes;
