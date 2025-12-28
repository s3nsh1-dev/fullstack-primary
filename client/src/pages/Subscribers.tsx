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
    <Box p={2}>
      <HomeTabTitles
        text="Subscribers"
        icon={<PeopleAltOutlinedIcon color="secondary" />}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <ShowSubscribed pageLimit={8} />
      </Box>
    </Box>
  );
};

export default Subscribers;
