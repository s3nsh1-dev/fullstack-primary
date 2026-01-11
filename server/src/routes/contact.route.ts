import { Router } from "express";
import { body } from "express-validator";
import { submitContactForm } from "../controllers/contact.controller";

const contactRouter = Router();

const contactFormValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .escape(), // Prevents XSS attacks

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail() // Converts to lowercase, removes dots, etc.
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),

  body("message")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters")
    .escape(), // Prevents XSS attacks
];

contactRouter.post("/", contactFormValidation, submitContactForm);

export { contactRouter };
