import { Spin } from "antd";

const AppLoading = () => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-50px",
          marginLeft: "-50px",
          width: "100px",
          height: "100px",
        }}
      >
        <Spin fullscreen={true} size="large" />
      </div>
    </>
  );
};

export default AppLoading;
