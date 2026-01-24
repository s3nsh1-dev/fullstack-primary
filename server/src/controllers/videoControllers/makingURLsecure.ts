import { Video } from "../../models/video.model";
import { asyncHandler } from "../../utils/asyncHandler";

const makingURLsecure = asyncHandler(async (req, res) => {
  await Video.updateMany(
    {
      $or: [
        { videoFile: { $regex: /^http/ } },
        { thumbnail: { $regex: /^http/ } },
      ],
    },
    [
      {
        $set: {
          videoFile: {
            $replaceOne: {
              input: "$videoFile",
              find: "http://",
              replacement: "https://",
            },
          },
          thumbnail: {
            $replaceOne: {
              input: "$thumbnail",
              find: "http://",
              replacement: "https://",
            },
          },
        },
      },
    ]
  );
});
export default makingURLsecure;
