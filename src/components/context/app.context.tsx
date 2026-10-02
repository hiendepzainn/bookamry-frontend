import { fetchAccount } from "@/services/auth.api";
import React, { createContext, useEffect, useState } from "react";
import AppLoading from "../others/app.loading";

interface IProps {
  children: React.ReactNode;
}

export const MyContext = createContext<IContext>({
  authenticated: false,
  setAuthenticated: () => {},
  user: {
    avatar: "",
    email: "",
    fullName: "",
    id: "",
    phone: "",
    role: "",
  },
  setUser: () => {},
  loadingApp: false,
  setLoadingApp: () => {},
  cart: [],
  setCart: () => {},
});

const AppContext = (props: IProps) => {
  const [user, setUser] = useState<IDataLoginUser>({
    avatar: "",
    email: "",
    fullName: "",
    id: "",
    phone: "",
    role: "",
  });
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loadingApp, setLoadingApp] = useState<boolean>(false);
  const [cart, setCart] = useState<IBookInCart[]>([]);

  const fetchDataUser = async () => {
    setLoadingApp(true);

    const cart = localStorage.getItem("cart");
    if (cart) setCart(JSON.parse(cart));

    const res = await fetchAccount();

    if (res.data) {
      setAuthenticated(true);
      setUser(res.data.user);
      setLoadingApp(false);
    }

    setLoadingApp(false);
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  return (
    <>
      {loadingApp === true ? (
        <AppLoading />
      ) : (
        <MyContext.Provider
          value={{
            user,
            setUser,
            authenticated,
            setAuthenticated,
            loadingApp,
            setLoadingApp,
            cart,
            setCart,
          }}
        >
          {props.children}
        </MyContext.Provider>
      )}
    </>
  );
};

export default AppContext;
