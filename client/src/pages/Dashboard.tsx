import Test from "../pages/Test";
import useFetchFeed from "../hooks/data-fetching/useFetchFeed";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";

const Dashboard = () => {
  const { data, isLoading, isError } = useFetchFeed();

  if (isLoading) return <CircularProgressCenter size={80} />;
  if (isError) return <div> SITE IS FACING SOME INTERNAL ISSUES</div>;
  if (!data) return <CircularProgressCenter size={80} />;

  return (
    <div
      style={{
        gap: 10,
        display: "flex",
        flexDirection: "column",
        overflowWrap: "anywhere",
      }}
    >
      {JSON.stringify(data)}
      <Test />
    </div>
  );
};

export default Dashboard;
