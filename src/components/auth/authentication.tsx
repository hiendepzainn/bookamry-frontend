import { useContext } from "react";
import { MyContext } from "../context/app.context";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const AuthenticationRoute = (props: IProps) => {
  const { authenticated } = useContext(MyContext);

  if (!authenticated) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, you must Login before access this Page."
        extra={
          <>
            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>

            <Link to="/login">
              <Button type="primary">Login</Button>
            </Link>
          </>
        }
      />
    );
  }

  return <>{props.children}</>;
};

export default AuthenticationRoute;
