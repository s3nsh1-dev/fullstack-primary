import useLogin from "../hooks/data-fetching/useLogin";
// import useAuth from "../hooks/useAuth";
import RegisterForm from "../components/RegisterForm";
import Login from "./Login";

const Dashboard = () => {
  const loginMutate = useLogin();
  // const { user } = useAuth();

  return (
    <div
      style={{
        // backgroundColor: "green",
        padding: "10px",
        gap: 10,
        display: "flex",
        flexDirection: "row",
        overflowWrap: "anywhere",
      }}
    >
      {loginMutate.isPending && <div>....Loading User</div>}
      {loginMutate.isError && (
        <div>Encountered error: Please try after some time</div>
      )}
      {/* {user && <p>{JSON.stringify(user)}</p>} */}
      <RegisterForm />
      <Login />
    </div>
  );
};

export default Dashboard;
