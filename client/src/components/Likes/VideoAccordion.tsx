import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useState } from "react";

interface LikedItem {
  _id: string;
  video?: Video;
  likedBy: string;
  updatedAt: string;
}
interface Video {
  _id: string;
  owner: User;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  updatedAt: string;
}
interface User {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
}

export default function VideoAccordion({ item }: { item: LikedItem }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        mb: 1,
        "&:before": { display: "none" }, // remove default divider line
      }}
    >
      {/* Accordion Header */}
      <AccordionSummary
        expandIcon={<ArrowDropDownIcon />}
        aria-controls={`panel-${item._id}-content`}
        id={`panel-${item._id}-header`}
        sx={{
          minHeight: "unset !important",
          px: 1,
          py: 0.5,
          "&.Mui-expanded": { minHeight: "unset !important" },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            alignItems: "center",
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: 0,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <OndemandVideoIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight={600}
            noWrap
          >
            {item.video?.title}
          </Typography>
        </Box>
      </AccordionSummary>

      {/* Accordion Content */}
      <AccordionDetails sx={{ px: 1.5, py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {/* Thumbnail / Video Player */}
          <Box
            sx={{
              width: 140,
              height: 80,
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              bgcolor: "black",
            }}
          >
            {!playing ? (
              <>
                <img
                  src={item.video?.thumbnail}
                  alt={item.video?.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  onClick={() => setPlaying(true)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                  }}
                >
                  <PlayCircleOutlineIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <video
                src={item.video?.videoFile}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </Box>

          {/* Video Info */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {item.video?.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.video?.description}
            </Typography>

            {/* Owner Info */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Avatar
                src={item.video?.owner.avatar}
                alt={item.video?.owner.fullname}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.video?.owner.fullname}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
