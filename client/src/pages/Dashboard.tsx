import { Box } from "@mui/material";
import useFetchFeed from "../hooks/data-fetching/useFetchFeed";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import FeedItem from "../components/dashboard/FeedItem";

const Dashboard = () => {
  const { data, isLoading, isError } = useFetchFeed();

  if (isLoading) return <CircularProgressCenter size={80} />;
  if (isError) return <div> SITE IS FACING SOME INTERNAL ISSUES</div>;
  if (!data) return <CircularProgressCenter size={80} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 3,
        minHeight: "100vh",
      }}
    >
      {data.map((item) => (
        <FeedItem key={item._id} item={item} />
      ))}
    </Box>
  );
};

export default Dashboard;
