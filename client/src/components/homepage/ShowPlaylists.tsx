import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import useAuth from "../../hooks/useAuth";
import useFetchUserPlaylist from "../../hooks/data-fetching/useFetchUserPlaylist";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import ContentNotAvailable from "../others/ContentNotAvailable";

const ShowPlaylists = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserPlaylist(
    user?.user?._id || ""
  );
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data) return <ContentNotAvailable text="No Subscribers" />;
  if (isError) return <div>...Encountered Error</div>;
  return (
    <Stack spacing={1}>
      {data?.playlists?.map((playlist) => (
        <Card
          key={playlist._id}
          variant="outlined"
          sx={{ borderRadius: "10px" }}
        >
          <CardContent sx={{ p: 2 }}>
            {/* Playlist Info */}
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {playlist.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {playlist.description}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              mb={2}
            >
              Created{" "}
              {convertISOIntoLocalTime(playlist.createdAt).toLocaleString()}
            </Typography>

            {/* Videos List */}
            <Stack direction="row" flexWrap="wrap" spacing={2}>
              {playlist?.videos?.map((video) => (
                <Card
                  key={video._id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    p: 1,
                    width: 250,
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    variant="square"
                    src={video.thumbnail}
                    alt={video.title}
                    sx={{ width: 80, height: 50, mr: 1 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" noWrap>
                      {video.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      display="block"
                    >
                      {video.duration.toFixed(2)} min | {video.views} views
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ShowPlaylists;
