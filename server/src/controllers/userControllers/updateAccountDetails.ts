import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, content } = req.body as Record<"name" | "content", string>;

  if (!name || !content) {
    throw new ApiError(400, "RE-ENTER VALUES AND CONTENT");
  }

  // Use a direct lookup instead of Array.includes
  const rule = VALIDATION_RULES[name as NameType];

  // If 'name' is not in the VALIDATION_RULES object, it's an INCORRECT PROPERTY NAME
  if (!rule) {
    throw new ApiError(400, "INCORRECT PROPERTY NAME");
  }

  // AUTHENTICATION CHECK - Should ideally be done via a prior middleware (e.g., verifyJWT)
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "USER NOT AUTHENTICATED");
  }

  const userId = req.user._id;

  // --- APPLY CLEANING & VALIDATION ---
  const cleanContent = rule.cleaner(content);

  if (!rule.regex.test(cleanContent)) {
    throw new ApiError(400, `${name} IS INCORRECTLY TYPED`);
  }
  // ------------------------------------

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { [name]: cleanContent } }, // Safe update
    { new: true }
  ).select("username fullname email avatar coverImage");

  if (!user) {
    throw new ApiError(404, "USER NOT FOUND");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "ACCOUNT DETAILS UPDATED SUCCESSFULLY")
    );
});
// The cleanEmail and cleanFullname functions would remain outside as utilities.
type NameType = "email" | "fullname";
const validNames: NameType[] = ["email", "fullname"];
const cleanEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const cleanFullname = (fullname: string) => {
  return fullname
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const VALIDATION_RULES: Record<
  NameType,
  {
    regex: RegExp;
    cleaner: (content: string) => string;
  }
> = {
  // 1. Regex is for a standard email format
  email: {
    // Regex is less permissive, matching standard email structure
    regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    cleaner: cleanEmail,
  },
  // 2. Regex for fullname allows letters and spaces (after cleaning)
  fullname: {
    // Since cleanFullname removes multi-spaces/trimming, this regex just ensures only letters remain.
    regex: /^[A-Za-z\s]+$/,
    cleaner: cleanFullname,
  },
};
