import React from "react";
import { Card } from "@mui/material";
import Sample3 from "./Sample3";
import Sample4 from "./Sample4";
import useMode from "../../hooks/useMode";

const Sample6: React.FC<Sample6Props> = ({ reply }) => {
  const { mode } = useMode();
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "rgb(255,255,255)" : "rgb(0,0,0,0.2)",
  };
  return (
    <Card sx={styleMode2}>
      <Sample3 data={reply} />
      <Sample4 ID={reply._id} disabled={true} />
    </Card>
  );
};

export default Sample6;

type Sample6Props = {
  reply: {
    _id: string;
    content: string;
    owner: {
      _id: string;
      fullname: string;
      avatar: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  };
};
