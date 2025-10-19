import "../../css/div/loadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div id="box">
        <div id="l1">L</div>
        <div id="l2">O</div>
        <div id="l3">A</div>
        <div id="l4">D</div>
        <div id="l5">I</div>
        <div id="l6">N</div>
        <div id="l7">G</div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
