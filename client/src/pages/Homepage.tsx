import { useEffect } from "react";
import Box from "@mui/material/Box";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import { useParams, Outlet } from "react-router-dom";
import SubHomepage from "../components/homepage/SubHomepage";
import HomeUserDetails from "../components/homepage/HomeUserDetails";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";

const Homepage = () => {
  const { user, loading } = useAuth();
  const { username } = useParams();
  const sessionUser = user?.user?._id || "";
  console.log("session user filled", user);
  const { data, isLoading, isError } = useFetchHomepageDetails({
    username: username || "",
    userId: user?.user?._id || "",
  });

  useEffect(() => {
    console.log("homepage changed something");
  }, [user, loading, data, isLoading, isError]);

  console.log(user, loading, data, isLoading, isError);
  if (!user && !loading && sessionUser === "" && username === "undefined")
    return <NotLoggedIn />;
  if (isLoading) return <LoadingAnimation />;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <div>....No Homepage Info</div>;

  return (
    <>
      <Box>
        <HomeUserDetails data={data} />
        <SubHomepage username={username || ""} />
        <Box m={1}>
          <Outlet context={{ userId: data?.user?._id }} />
        </Box>
      </Box>
    </>
  );
};

export default Homepage;
