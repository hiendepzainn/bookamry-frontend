import { createRoot } from "react-dom/client";
import "styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/pages/guest/login/login";
import RegisterPage from "@/pages/guest/register/register";
import LayoutClient from "@/layout/layoutClient";
import Homepage from "@/pages/guest/homepage/homepage";
import ErrorPage from "@/components/others/error";
import { App } from "antd";
import AppContext from "./components/context/app.context";
import AuthenticationRoute from "./components/auth/authentication";
import AuthorizationRoute from "./components/auth/authorization";
import LayoutAdmin from "./layout/layoutAdmin";
import BooksPageAdmin from "./pages/admin/bookManaging/books";
import UsersPageAdmin from "./pages/admin/userManaging/users";
import Dashboard from "./pages/admin/dashboard";
import BookDetails from "@/pages/guest/bookDetails/book";
import Cart from "@/pages/user/cart/cart.tsx";
import OrdersHistory from "./pages/user/orders/ordersHistory";
import OrdersPageAdmin from "./pages/admin/orderManaging/orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutClient />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Homepage /> },

      {
        path: "book/:id",
        element: <BookDetails />,
      },

      {
        path: "cart",
        element: (
          <AuthenticationRoute>
            <Cart />
          </AuthenticationRoute>
        ),
      },

      {
        path: "orderHistory",
        element: (
          <AuthenticationRoute>
            <OrdersHistory />
          </AuthenticationRoute>
        ),
      },
    ],
  },

  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <AuthenticationRoute>
            <AuthorizationRoute>
              <Dashboard />
            </AuthorizationRoute>
          </AuthenticationRoute>
        ),
      },

      {
        path: "books",
        element: (
          <AuthenticationRoute>
            <AuthorizationRoute>
              <BooksPageAdmin />
            </AuthorizationRoute>
          </AuthenticationRoute>
        ),
      },

      {
        path: "users",
        element: (
          <AuthenticationRoute>
            <AuthorizationRoute>
              <UsersPageAdmin />
            </AuthorizationRoute>
          </AuthenticationRoute>
        ),
      },

      {
        path: "orders",
        element: (
          <AuthenticationRoute>
            <AuthorizationRoute>
              <OrdersPageAdmin />
            </AuthorizationRoute>
          </AuthenticationRoute>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <App>
    <AppContext>
      <RouterProvider router={router} />
    </AppContext>
  </App>,
);
