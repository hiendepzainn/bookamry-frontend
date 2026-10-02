import { Outlet } from "react-router-dom";
import AppFooter from "@/components/layout/app.footer";
import AppHeader from "@/components/layout/app.header";
import { useState } from "react";

const LayoutClient = () => {
  const [keyword, setKeyword] = useState<string>("");
  return (
    <>
      <AppHeader keyword={keyword} setKeyword={setKeyword} />
      <Outlet context={{ keyword }} />
      <AppFooter />
    </>
  );
};

export default LayoutClient;
