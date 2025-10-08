import { useState } from "react";
import { Box } from "@mui/material";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import { useParams } from "react-router-dom";
import SubHomepage from "../components/homepage/SubHomepage";

const Homepage = () => {
  const { username } = useParams();
  const [open, setOpen] = useState<OpenStateType>({
    videos: true,
    playlists: false,
    tweets: false,
    subscribed: false,
  });
  const { data, isLoading, isError } = useFetchHomepageDetails(username || "");
  if (isLoading) return <div>...Loading Homepage</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!data) return <div>....No Homepage Info</div>;

  const handleOpen = (value: keyof OpenStateType) => {
    setOpen({
      videos: false,
      playlists: false,
      tweets: false,
      subscribed: false,
      [value]: true,
    });
  };
  return (
    <Box>
      <SubHomepage open={open} data={data} handleOpen={handleOpen} />
    </Box>
  );
};

export default Homepage;

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};
