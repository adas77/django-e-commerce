import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Orders from "@/pages/orders/Orders";
import Product from "@/pages/products/Product";
import Products from "@/pages/products/Products";
import { BrowserRouter, Route, Routes as _Routes } from "react-router-dom";
import Layout from "../abstract/Layout";
import { ERoutes, ERoutesDetail } from "./Routes.enum";
import ProtectedRouteClient from "./ProtectedRouteClient";

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
          <Route path="/" element={<ProtectedRouteClient />}>
            <Route path={ERoutes.orders} element={<Orders />} />
          </Route>

          <Route path="*" element={<NotFound />} />
          <Route path={ERoutesDetail.login} element={<Login />} />
        </Route>
      </_Routes>
    </BrowserRouter>
  );
};

export default Routes;
