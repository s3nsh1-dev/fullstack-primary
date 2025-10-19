import { Box } from "@mui/material";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import { useParams, Outlet } from "react-router-dom";
import SubHomepage from "../components/homepage/SubHomepage";
import HomeUserDetails from "../components/homepage/HomeUserDetails";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";

const Homepage = () => {
  const { username } = useParams();

  const { data, isLoading, isError } = useFetchHomepageDetails(username || "");
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <div>....No Homepage Info</div>;

  return (
    <Box>
      <HomeUserDetails data={data} />
      <SubHomepage username={username || ""} />
      <Box m={1}>
        <Outlet context={{ userId: data.user?._id }} />
      </Box>
    </Box>
  );
};

export default Homepage;
