import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import type { PlaylistVideo } from "../../hooks/CRUD-hooks/useGetSinglePlaylist";
import DeleteVideoFromPlaylistModal from "./DeleteVideoFromPlaylistModal";
import PlaylistVideoItem from "./PlaylistVideoItem";

const ShowPlaylistVideoList: FC<PropTypes> = ({
  videos,
  playlistId,
  isOwner,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<PlaylistVideo | null>(
    null
  );

  if (!videos || videos.length === 0) {
    return <Typography color="textSecondary">No Videos to show</Typography>;
  }

  const handleOpenDelete = (video: PlaylistVideo) => {
    setSelectedVideo(video);
  };

  const handleCloseDelete = () => {
    setSelectedVideo(null);
  };

  const renderVideoItem = videos.map((video, index) => (
    <PlaylistVideoItem
      key={video._id || index}
      index={index + 1}
      video={video}
      isOwner={isOwner}
      onDelete={() => handleOpenDelete(video)}
    />
  ));

  return (
    <Box sx={videoListContainerSx}>
      <Stack spacing={1}>{renderVideoItem}</Stack>
      {selectedVideo && (
        <Modal open={!!selectedVideo} onClose={handleCloseDelete}>
          <DeleteVideoFromPlaylistModal
            handleClose={handleCloseDelete}
            playlistId={playlistId}
            videoId={selectedVideo._id}
            videoTitle={selectedVideo.title}
          />
        </Modal>
      )}
    </Box>
  );
};

export default ShowPlaylistVideoList;

const videoListContainerSx = {
  flex: 1,
  minWidth: 0,
};

interface PropTypes {
  videos: PlaylistVideo[];
  playlistId: string;
  isOwner: boolean;
}
