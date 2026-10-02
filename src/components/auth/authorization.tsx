import { useContext } from "react";
import { MyContext } from "../context/app.context";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const AuthorizationRoute = (props: IProps) => {
  const { user } = useContext(MyContext);

  if (user.role !== "ADMIN") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>
        }
      />
    );
  }

  return <>{props.children}</>;
};

export default AuthorizationRoute;
