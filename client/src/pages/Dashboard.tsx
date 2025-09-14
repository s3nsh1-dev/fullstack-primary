import useLogin from "../hooks/data-fetching/useLogin";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import useLogout from "../hooks/data-fetching/useLogout";
import { sampleuserCredentials as userCredentials } from "../constants/constants";

const Dashboard = () => {
  const loginMutate = useLogin();
  const logoutMutate = useLogout();

  const handleLogin = () => {
    loginMutate.mutate(userCredentials);
  };
  const handleLogout = () => {
    logoutMutate.mutate(
      loginMutate.data?.accessToken || "INVALID ACCESS TOKEN"
    );
  };

  console.log("Login", loginMutate?.data?.loggedIn);
  console.log("Logout", logoutMutate?.data?.loggedIn);

  return (
    <div
      style={{
        backgroundColor: "green",
        padding: "10px",
        gap: 10,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ContainedButton onClick={handleLogin} disabled={loginMutate.isPending}>
        {loginMutate.isPending ? "Logging in...." : "Login"}
      </ContainedButton>
      <ContainedButton onClick={handleLogout}>
        {logoutMutate.isPending ? "Logging out...." : "Logout"}
      </ContainedButton>
      {loginMutate.isPending && <div>....Loading User</div>}
      {loginMutate.isError && (
        <div>Encountered error: Please try after some time</div>
      )}
      {loginMutate.isSuccess && <p>{JSON.stringify(loginMutate.data)}</p>}
    </div>
  );
};

export default Dashboard;
