import React from "react";

const BtnContainer = ({ children }: { children: React.ReactNode }) => {
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return <div style={style}>{children}</div>;
};

export default BtnContainer;
