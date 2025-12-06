import Box from "@mui/material/Box";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import { useParams, Outlet } from "react-router-dom";
import SubHomepage from "../components/homepage/SubHomepage";
import HomeUserDetails from "../components/homepage/HomeUserDetails";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";
import { Page404 } from "../components/others/Page404";

const Homepage = () => {
  const { user, loading } = useAuth();
  const { username } = useParams();
  const sessionUser = user?.user?._id || "";
  const { data, isLoading, isError, error } = useFetchHomepageDetails({
    username: username || "",
    userId: user?.user?._id || "",
  });

  if (!user && !loading && sessionUser === "" && username === "undefined")
    return <NotLoggedIn />;
  if (isLoading) return <LoadingAnimation />;
  if (isError) {
    const errorMessage = error?.message || "Encountered Error";
    return <Page404 errorMessage={errorMessage} />;
  }
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
