import {
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Support = () => {
  console.log("Support");
  return (
    <Box
      sx={{
        p: "2%",
        height: "93vh",
        overflowY: "auto",
      }}
    >
      <Paper elevation={2} sx={{ p: "3%" }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Terms and Conditions
        </Typography>

        <Typography
          textAlign={"justify"}
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          Last Updated: October 12, 2025
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography textAlign={"justify"} variant="body1">
          Welcome to PlayTube! These Terms and Conditions ("Terms") govern your
          access to and use of PlayTube's services, including our website,
          mobile applications, and any related services (collectively, the
          "Service"). By accessing or using PlayTube, you agree to be bound by
          these Terms.
        </Typography>

        {/* Section 1 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            1. Acceptance of Terms
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            By creating an account, accessing, or using PlayTube, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms and our Privacy Policy. If you do not agree to these
            Terms, please do not use our Service.
          </Typography>
        </Box>

        {/* Section 2 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            2. Eligibility
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            You must be at least 13 years old to use PlayTube. If you are under
            18, you must have permission from a parent or legal guardian. By
            using our Service, you represent and warrant that you meet these
            eligibility requirements.
          </Typography>
        </Box>

        {/* Section 3 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            3. Account Registration and Security
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="3.1 Account Creation"
                secondary="You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3.2 Account Responsibility"
                secondary="You are solely responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3.3 One Account Per User"
                secondary="You may only create and maintain one account. Multiple accounts may be subject to suspension or termination."
              />
            </ListItem>
          </List>
        </Box>

        {/* Section 4 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            4. Content and Conduct
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            4.1 User Content
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            PlayTube allows you to upload videos, post tweets, comments, and
            other content ("User Content"). You retain ownership of your User
            Content, but by posting it on PlayTube, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify,
            distribute, and display your content in connection with operating
            and promoting the Service.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            4.2 Prohibited Content
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            You agree not to upload, post, or transmit any content that:
          </Typography>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Violates any applicable laws or regulations" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Infringes on intellectual property rights of others" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Contains hate speech, harassment, or promotes violence" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Contains sexually explicit or pornographic material" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Promotes illegal activities or dangerous behavior" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Contains spam, malware, or phishing attempts" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Impersonates any person or entity" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Exploits or harms minors in any way" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            4.3 Content Moderation
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            PlayTube reserves the right to review, remove, or modify any User
            Content at our discretion, with or without notice. We may also
            suspend or terminate accounts that violate these Terms.
          </Typography>
        </Box>

        {/* Section 5 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            5. Intellectual Property Rights
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            The PlayTube Service, including its design, features, text,
            graphics, logos, and software, is owned by PlayTube and is protected
            by copyright, trademark, and other intellectual property laws. You
            may not copy, modify, distribute, or create derivative works without
            our express written permission.
          </Typography>
        </Box>

        {/* Section 6 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            6. Copyright Infringement
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            PlayTube respects the intellectual property rights of others. If you
            believe your copyrighted work has been infringed, please submit a
            notice with the following information:
          </Typography>
          <List sx={{ pl: 2 }}>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Identification of the copyrighted work" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Location of the infringing material on PlayTube" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Your contact information" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="A statement of good faith belief and accuracy" />
            </ListItem>
            <ListItem sx={{ display: "list-item", listStyleType: "disc" }}>
              <ListItemText primary="Your physical or electronic signature" />
            </ListItem>
          </List>
        </Box>

        {/* Section 7 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            7. Interactions and Features
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            7.1 Likes, Comments, and Shares
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            PlayTube provides features for users to interact with content
            through likes, comments, and shares. By using these features, you
            agree to interact respectfully and in accordance with these Terms.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            7.2 Community Guidelines
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            Maintain a respectful and constructive environment. Harassment,
            bullying, or abusive behavior will not be tolerated and may result
            in account suspension or termination.
          </Typography>
        </Box>

        {/* Section 8 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            8. Privacy and Data Collection
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            Your use of PlayTube is subject to our Privacy Policy, which
            describes how we collect, use, and protect your personal
            information. By using our Service, you consent to our data practices
            as described in the Privacy Policy.
          </Typography>
        </Box>

        {/* Section 9 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            9. Termination
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            We reserve the right to suspend or terminate your account at any
            time, for any reason, including violation of these Terms. You may
            also terminate your account at any time by contacting us. Upon
            termination, your right to use the Service will immediately cease.
          </Typography>
        </Box>

        {/* Section 10 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            10. Disclaimers and Limitation of Liability
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            10.1 Service Provided "As Is"
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            PlayTube is provided on an "as is" and "as available" basis without
            warranties of any kind, either express or implied. We do not
            guarantee that the Service will be uninterrupted, secure, or
            error-free.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            10.2 Limitation of Liability
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            To the fullest extent permitted by law, PlayTube shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising out of or related to your use of the Service.
          </Typography>
        </Box>

        {/* Section 11 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            11. Indemnification
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            You agree to indemnify and hold harmless PlayTube, its affiliates,
            and their respective officers, directors, employees, and agents from
            any claims, losses, damages, liabilities, and expenses arising out
            of your use of the Service, your User Content, or your violation of
            these Terms.
          </Typography>
        </Box>

        {/* Section 12 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            12. Changes to Terms
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            We may modify these Terms at any time. We will notify you of
            material changes by posting the updated Terms on our website or
            through the Service. Your continued use of PlayTube after such
            changes constitutes your acceptance of the new Terms.
          </Typography>
        </Box>

        {/* Section 13 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            13. Governing Law and Dispute Resolution
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which PlayTube operates, without
            regard to its conflict of law provisions. Any disputes arising out
            of or related to these Terms shall be resolved through binding
            arbitration.
          </Typography>
        </Box>
        {/* Section 13 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            14. Message from the Developer
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            I, Shubham Pandey, the developer of PlayTube, want to express my
            sincere gratitude to you for choosing PlayTube as your video-sharing
            platform. Your support and trust mean the world to me. I am
            committed to continuously improving PlayTube and providing you with
            the best possible experience. If you have any feedback or
            suggestions, please do not hesitate to reach out. Thank you for
            being a part of the PlayTube community!
          </Typography>
          <Typography fontWeight={"bold"} color="warning.main" variant="body1">
            Everything here is in this clause is AI generated.
          </Typography>
        </Box>

        {/* Section 14 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            14. Contact Us
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            If you have any questions about these Terms and Conditions, please
            contact us at:
          </Typography>
          <Typography textAlign={"justify"} variant="body1" paragraph>
            <strong>Email:</strong> legal@playtube.com
            <br />
            <strong>Address:</strong> PlayTube Inc., XYZ Media Street, Varanasi,
            CA 969696, Germany
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          textAlign={"justify"}
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          By using PlayTube, you acknowledge that you have read and understood
          these Terms and Conditions and agree to be bound by them.
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 2 }}
        >
          © 2025 PlayTube Inc. All rights reserved.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Support;
