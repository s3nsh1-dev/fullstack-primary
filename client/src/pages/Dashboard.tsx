import useLogin from "../hooks/data-fetching/useLogin";
import useAuth from "../hooks/useAuth";
// import RegisterForm from "../components/RegisterForm";
// import Logout from "./Logout";
// import Login from "./Login";
import Test from "../pages/Test";

const Dashboard = () => {
  const loginMutate = useLogin();
  const { user } = useAuth();

  return (
    <div
      style={{
        gap: 10,
        display: "flex",
        flexDirection: "column",
        overflowWrap: "anywhere",
      }}
    >
      {!user && <div>....Loading Dashboard</div>}
      {loginMutate.isPending && <div>....Loading User</div>}
      {loginMutate.isError && (
        <div>Encountered error: Please try after some time</div>
      )}
      {/* {user && <p>{JSON.stringify(user)}</p>} */}
      {/* <RegisterForm /> */}
      {/* <Login /> */}
      {/* <Logout /> */}
      {user && (
        <div>
          User is logged IN : <div>{JSON.stringify(user)}</div>
        </div>
      )}
      <Test />
    </div>
  );
};

export default Dashboard;
