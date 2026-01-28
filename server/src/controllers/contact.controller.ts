import { asyncHandler } from "../utils/asyncHandler";
import { validationResult } from "express-validator";
import { logService } from "../services/logger.service";
import ApiError from "../utils/ApiError";
import { ContactFormData, mailService } from "../services/mail.service";
import ApiResponse from "../utils/ApiResponse";

const submitContactForm = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logService.warn("Contact form validation failed", {
        errors: errors.array(),
        email: req.body.email,
        path: req.path,
      });
      throw new ApiError(400, "CONTACT FORM VALIDATION FAILED");
    }

    const formData: ContactFormData = {
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      message: req.body.message.trim(),
    };

    await mailService.sendContactFormEmail(formData);

    return res
      .status(200)
      .json(new ApiResponse(200, formData, "MAIL SENT SUCCESSFULLY"));
  } catch (error) {
    logService.error("Error submitting contact form", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      email: req.body.email,
    });
    throw new ApiError(500, "CAN NOT CONNECT TO MAIL SERVER");
  }
});

export { submitContactForm };
