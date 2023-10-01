import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Root from "@/pages/Root";
import { BrowserRouter, Route, Routes as _Routes } from "react-router-dom";
import Layout from "../abstract/Layout";
import { ERoutes } from "./Routes.enum";
import Products from "@/pages/products/Products";
import Product from "@/pages/products/Product";
import Orders from "@/pages/orders/Orders";
import Order from "@/pages/orders/Order";

const Routes = () => {
  return (
    <BrowserRouter>
      <_Routes>
        <Route path="/" element={<Layout />}>
          <Route path={ERoutes.root} element={<Root />} />

          <Route path={ERoutes.products} element={<Products />} />
          <Route
            path={`${ERoutes.products}/${ERoutes.product}`}
            element={<Product />}
          />

          <Route path={ERoutes.orders} element={<Orders />} />
          <Route
            path={`${ERoutes.orders}/${ERoutes.order}`}
            element={<Order />}
          />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={ERoutes.login} element={<Login />} />
      </_Routes>
    </BrowserRouter>
  );
};

export default Routes;
