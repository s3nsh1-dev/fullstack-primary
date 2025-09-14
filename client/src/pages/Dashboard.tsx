import useLogin from "../hooks/data-fetching/useLogin";

const userCredentials = {
  username: "sampleuser0123",
  password: "sampleuser0123",
};

const Dashboard = () => {
  const { data, isLoading, isError } = useLogin(userCredentials);
  if (!data) return null;
  if (isLoading) return <div>....Loading</div>;
  if (isError)
    return (
      <div>We have encounter some error. Please retry after some time</div>
    );
  console.log("Dashboard Data", data);
  return <div style={{ backgroundColor: "green" }}>This is my Dashboard</div>;
};

export default Dashboard;
