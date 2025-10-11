// import { Box } from "@mui/material";
import useFetchFeed from "../hooks/data-fetching/useFetchFeed";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import FeedItem from "../components/dashboard/FeedItem";
import Masonry from "@mui/lab/Masonry";

const Dashboard = () => {
  const { data, isLoading, isError } = useFetchFeed();

  if (isLoading) return <CircularProgressCenter size={80} />;
  if (isError) return <div> SITE IS FACING SOME INTERNAL ISSUES</div>;
  if (!data) return <CircularProgressCenter size={80} />;

  return (
    <Masonry
      columns={{ xs: 1, sm: 2, md: 3, xl: 4 }}
      spacing={2}
      sx={{ margin: "auto", padding: 1 }}
    >
      {data.map((item) => (
        <FeedItem key={item._id} item={item} />
      ))}
    </Masonry>
  );
};

export default Dashboard;

// const sxValue = {
//   display: "flex",
//   flexDirection: "row",
//   flexWrap: "wrap",
//   alignItems: "center",
//   gap: 2,
//   padding: 3,
//   minHeight: "100vh",
// };
