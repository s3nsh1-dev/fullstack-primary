import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Accordion */}
      <Accordion
        disableGutters
        elevation={2}
        sx={{
          border: "1px solid",
          //   borderColor: "divider",
          backgroundColor: "transparent",
          borderRadius: 2,
          "&:before": { display: "none" },
          "&.MuiAccordion-root": {
            margin: 0, // specifically target the accordion
            marginTop: "5px",
          },
        }}
      >
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <OndemandVideoIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography
              variant="body1"
              color="textPrimary"
              fontWeight={600}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1, // limit to 2 lines
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
            >
              {item.video?.title}
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 1.5, py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            {/* Thumbnail */}
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
                onClick={() => setOpen(true)}
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
            </Box>

            {/* Video Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body1"
                color="textPrimary"
                fontWeight={600}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1, // limit to 2 lines
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {item.video?.title}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // limit to 2 lines
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {item.video?.description}
              </Typography>

              {/* Owner Info */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="caption" color="textPrimary">
                  {convertISOIntoLocalTime(item.video?.updatedAt || "")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Modal Video Player */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "black",
            boxShadow: 24,
            borderRadius: 2,
            outline: "none",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Video */}
          <video
            src={item.video?.videoFile}
            controls
            autoPlay
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              display: "block",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
