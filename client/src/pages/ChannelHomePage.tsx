import { useParams } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import SubHomepage from "../components/homepage/SubHomepage";

const ChannelHomePage = () => {
  const { channelId } = useParams();

  const [open, setOpen] = useState<OpenStateType>({
    videos: true,
    playlists: false,
    tweets: false,
    subscribed: false,
  });
  const { data, isLoading, isError } = useFetchHomepageDetails(channelId || "");
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
      <HomeTabTitles
        text="Home"
        icon={<HomeOutlinedIcon sx={{ fontSize: 28, color: "primary.main" }} />}
      />
      <SubHomepage open={open} data={data} handleOpen={handleOpen} />
    </Box>
  );
};

export default ChannelHomePage;

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};
