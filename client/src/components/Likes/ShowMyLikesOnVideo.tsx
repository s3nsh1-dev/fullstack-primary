import React from "react";
import { Box, Typography, CardContent, Card } from "@mui/material";
import type { LikedItem } from "../../hooks/data-fetching/useFetchLikedContent";
// import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ContentProfileHeader from "../Tweets/ContentProfileHeader";
import ShowLikeOwner from "./ShowLikeOwner";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VideoAccordion from "./VideoAccordion";

const ShowMyLikesOnVideo: React.FC<ShowMyLikesOnVideoProps> = ({
  item,
  link,
}) => {
  return (
    <Card sx={style1} elevation={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ContentProfileHeader
          style2={{}}
          imgSrc={item.video?.owner.avatar || "content-avatar"}
          fullname={item.video?.owner.fullname || "content-fullname"}
          username={item.video?.owner.username || "content-username"}
          createdAt={item.video?.updatedAt || "tweet-timestamp"}
        />
        <ShowLikeOwner timestamp={item.updatedAt} />
      </Box>
      {link && <Typography>link</Typography>}
      <CardContent sx={style5}>
        {/* <Accordion
          sx={{
            backgroundColor: "transparent",
          }}
          elevation={3}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{
              minHeight: "unset !important", // collapse height
              "&.Mui-expanded": {
                minHeight: "unset !important", // expanded height
              },
              "& .MuiAccordionSummary-content": {
                margin: 0,
                minHeight: "unset !important",
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0,
                minHeight: "unset !important",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <OndemandVideoIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography
                variant="body1"
                color="textPrimary"
                fontWeight={600}
                sx={style6}
              >
                {item.video?.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion> */}
        <VideoAccordion item={item} />
      </CardContent>
    </Card>
  );
};

export default ShowMyLikesOnVideo;

type ShowMyLikesOnVideoProps = {
  item: LikedItem;
  link: string | undefined;
};

const style1 = { padding: "10px", backgroundColor: "#ff3f3fb7" };

const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
  // display: "flex",
  // alignItems: "center",
};
// const style6 = { mt: "5px", overflow: "hidden", textOverflow: "ellipsis" };
