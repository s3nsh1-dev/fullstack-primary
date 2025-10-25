import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Box from "@mui/material/Box";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ShowSubscribed from "../components/homepage/ShowSubscribed";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";

const Subscribers = () => {
  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;

  return (
    <Box p={1}>
      <HomeTabTitles
        text="Subscribers"
        icon={
          <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <ShowSubscribed />
      </Box>
    </Box>
  );
};

export default Subscribers;
