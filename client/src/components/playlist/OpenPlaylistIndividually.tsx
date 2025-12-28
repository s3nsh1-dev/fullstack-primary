import { useParams } from "react-router-dom";
import useGetSinglePlaylist from "../../hooks/CRUD-hooks/useGetSinglePlaylist";
import useAuth from "../../hooks/useAuth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import ShowPlaylistHeader from "./ShowPlaylistHeader";
import ShowPlaylistVideoList from "./ShowPlaylistVideoList";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useMediaQuery from "@mui/material/useMediaQuery";

const OpenPlaylistIndividually = () => {
  const { playlistId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up(1070));

  const contentWrapperSx = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    gap: { xs: 3, md: 4 },
    maxWidth: "1600px",
    mx: "auto",
  };

  const { data, isLoading, isError } = useGetSinglePlaylist(playlistId || "");
  const { user } = useAuth();

  if (isError)
    return <Typography color="error">...Encountered Error</Typography>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data) return <Typography color="textSecondary">No Playlists</Typography>;
  const isOwner = user?.user?._id === data?.owner?._id;

  return (
    <Box
      sx={{
        ...pageContainerSx,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={contentWrapperSx}>
        <ShowPlaylistHeader
          playlist={data}
          videos={data?.videos || []}
          isOwner={isOwner}
        />
        <ShowPlaylistVideoList videos={data?.videos || []} />
      </Box>
    </Box>
  );
};

export default OpenPlaylistIndividually;

const pageContainerSx = {
  minHeight: "calc(100vh - 64px)", // Adjust based on navbar height
  p: { xs: 2, md: 4 },
};
