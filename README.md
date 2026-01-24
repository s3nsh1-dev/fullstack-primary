# PlayTube

A full-stack video sharing and social media platform inspired by YouTube and Twitter, built with modern web technologies. PlayTube provides users with the ability to upload, share, and interact with video content, along with social features like subscriptions, comments, likes, tweets, and playlists.
<img width="1920" height="924" alt="image" src="https://github.com/user-attachments/assets/28c5c971-6bab-41bb-bb78-5394df62a97f" />

## 🎯 Project Overview

Playtube is an entertainment and interactive service platform that combines video sharing capabilities with social media features. Users can create channels, upload videos, interact with content through comments and likes, follow other creators, create playlists, and share thoughts through tweets.

## ✨ Features

### Core Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication with access and refresh tokens
  - User registration and login
  - Password encryption using bcrypt
  - Account management (deactivate, reactivate, delete)
  - Username availability checking
  - Profile customization (avatar, cover image)

- **Video Management**
  - Video upload with thumbnail support
  - Video publishing/unpublishing
  - Video editing and deletion
  - Video view tracking and analytics
  - Video duration tracking
  - Paginated video listings

- **Social Features**
  - Channel subscriptions (subscribe/unsubscribe)
  - Subscriber count tracking
  - Comments on videos, tweets, and nested comments
  - Like system for videos, tweets, and comments
  - Tweet creation and management
  - User search functionality
  - Watch history tracking

- **Content Organization**
  - Playlist creation and management
  - Add/remove videos from playlists
  - Personal video library
  - Liked content collection
  - Feed generation for subscribed channels

- **User Interface**
  - Responsive design with Material-UI
  - Dark/Light mode support
  - Lazy loading for optimized performance
  - Error boundaries for graceful error handling
  - Loading states and animations
  - Pagination for large datasets

### Additional Features

- Contact/support form with email notifications
- Dashboard with user statistics
- Homepage with channel information
- Search functionality across users and content
- Health check endpoints for monitoring
- Request logging middleware
- Cloudinary integration for media storage

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **UI Library**: Material-UI (MUI) 7.3.2
- **Routing**: React Router DOM 7.8.2
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query 5.87.1
- **HTTP Client**: Axios 1.13.1
- **Language**: TypeScript 5.8.3
- **Styling**: Emotion (CSS-in-JS), Material-UI theming

### Backend (Server)

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.16.5
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary 2.7.0
- **Email Service**: Nodemailer 7.0.12
- **Logging**: Winston 3.19.0
- **Validation**: express-validator 7.3.1
- **Language**: TypeScript 5.8.3

### Development Tools

- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript
- **Hot Reload**: Nodemon (server), Vite HMR (client)

## 📁 Project Structure

```
fullstack-primary/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── homepage/  # Homepage-specific components
│   │   │   ├── Videos/    # Video-related components
│   │   │   ├── playlist/  # Playlist components
│   │   │   ├── Likes/     # Like-related components
│   │   │   ├── navbar/    # Navigation components
│   │   │   └── ui-components/ # Generic UI components
│   │   ├── pages/         # Page components (routes)
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── data-fetching/  # API data fetching hooks
│   │   │   ├── CRUD-hooks/     # CRUD operation hooks
│   │   │   └── searching/      # Search functionality hooks
│   │   ├── contexts/      # React Context providers
│   │   ├── constants/     # Constants and type definitions
│   │   ├── utilities/     # Utility functions
│   │   └── assets/        # Static assets (images, logos)
│   ├── public/            # Public static files
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── server/                # Express backend application
    ├── src/
    │   ├── controllers/   # Request handlers
    │   │   ├── userControllers/     # User-related controllers
    │   │   ├── videoControllers/    # Video-related controllers
    │   │   ├── tweetControllers/    # Tweet-related controllers
    │   │   ├── playlistController/  # Playlist controllers
    │   │   ├── subscriptionController/ # Subscription controllers
    │   │   └── likeController/      # Like-related controllers
    │   ├── routes/        # API route definitions
    │   ├── models/        # Mongoose data models
    │   ├── middleware/    # Express middleware
    │   │   ├── auth.middleware.ts      # JWT authentication
    │   │   ├── multer.middleware.ts    # File upload handling
    │   │   ├── requestLogger.middleware.ts # Request logging
    │   │   ├── error.middleware.ts     # Error handling & 404 handler
    │   │   └── imageRemoval.middleware.ts  # Image cleanup
    │   ├── services/      # Business logic services
    │   │   ├── logger.service.ts  # Winston logging service
    │   │   └── mail.service.ts   # Email service
    │   ├── utils/         # Utility functions
    │   │   ├── dotenvHelper.ts   # Environment variable management
    │   │   ├── cloudinary.ts     # Cloudinary integration
    │   │   ├── ApiError.ts       # Custom error class
    │   │   ├── ApiResponse.ts    # Standardized API responses
    │   │   └── asyncHandler.ts   # Async error handler wrapper
    │   ├── db/            # Database connection
    │   ├── constants/    # Application constants
    │   ├── app.ts        # Express app configuration
    │   └── index.ts      # Server entry point
    ├── public/           # Static files served by Express
    ├── package.json
    └── tsconfig.json
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB database (local or cloud instance)
- Cloudinary account (for media storage)
- Gmail account (for email service, optional)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd fullstack-primary
```

### Step 2: Install Dependencies

**Install server dependencies:**

```bash
cd server
npm install
```

**Install client dependencies:**

```bash
cd ../client
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the `server/` directory. For a complete list of required environment variables, their descriptions, and default values, refer to `server/src/utils/dotenvHelper.ts`.

**Required Environment Variables:**

- `MONGODB_COMPASS_CONNECTION_STRING` - MongoDB connection string
- `DB_NAME` - Database name
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated list)
- `ACCESS_TOKEN_SECRET` - JWT access token secret
- `REFRESH_TOKEN_SECRET` - JWT refresh token secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

**Important Notes:**

- For production, use strong, randomly generated secrets
- `CORS_ORIGIN` can be a comma-separated list of allowed origins (e.g., `http://localhost:5173,http://localhost:3000`)
- Use `*` in `CORS_ORIGIN` to allow all origins (development only, **not recommended for production**)
- Email configuration (Gmail SMTP) is optional but required for contact form functionality

### Step 4: Run the Application

**Start the server (from `server/` directory):**

```bash
npm run server
```

The server will start on `http://localhost:3001` (or your configured PORT)

**Start the client (from `client/` directory):**

```bash
npm run dev
```

The client will start on `http://localhost:5173` (Vite default port)

## 📡 API Endpoints

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication Endpoints

- `POST /users/register` - Register a new user (with avatar and coverImage upload)
- `POST /users/login` - User login
- `POST /users/logout` - User logout (requires authentication)
- `GET /users/refresh-token` - Refresh access token
- `GET /users/current-user` - Get current authenticated user (requires authentication)
- `POST /users/change-password` - Change user password (requires authentication)
- `PATCH /users/update-account` - Update account details (requires authentication)
- `PATCH /users/avatar` - Update user avatar (requires authentication)
- `PATCH /users/cover` - Update cover image (requires authentication)
- `GET /users/profile/:userId` - Get user profile by ID
- `GET /users/channel/:username` - Get channel profile by username
- `GET /users/check-username` - Check username availability (requires authentication)
- `PATCH /users/update/username` - Update username (requires authentication)
- `POST /users/delete-user` - Delete user account (requires authentication)
- `PATCH /users/deactivate-user` - Deactivate account (requires authentication)
- `PATCH /users/reactivate-user` - Reactivate account (requires authentication)

### Video Endpoints

- `GET /videos` - Get all videos (paginated)
- `GET /videos/w/restriction` - Get all videos without restrictions (requires authentication)
- `GET /videos/:videoId` - Get video by ID
- `POST /videos` - Upload a new video with thumbnail (requires authentication)
- `PATCH /videos/:videoId` - Update video details/thumbnail (requires authentication)
- `DELETE /videos/:videoId` - Delete a video (requires authentication)
- `PATCH /videos/toggle/publish/:videoId` - Toggle video publish status (requires authentication)

### Subscription Endpoints

- `POST /subscriptions/c/:channelId` - Toggle subscription to a channel (requires authentication)
- `GET /subscriptions/c/:channelId` - Get subscriber count for a channel
- `GET /subscriptions/u/:subscriberId` - Get subscribed channels for a user

### Comment Endpoints

- `POST /comments/v/:video_ID` - Add comment on a video (requires authentication)
- `POST /comments/t/:tweet_ID` - Add comment on a tweet (requires authentication)
- `POST /comments/c/:comment_ID` - Add nested comment on a comment (requires authentication)
- `GET /comments/v/:video_ID` - Get comments on a video
- `GET /comments/t/:tweet_ID` - Get comments on a tweet
- `GET /comments/c/:comment_ID` - Get nested comments
- `PATCH /comments/modify/:comment_ID` - Update a comment (requires authentication)
- `DELETE /comments/modify/:comment_ID` - Delete a comment (requires authentication)

### Like Endpoints (All require authentication)

- `POST /likes/toggle/v/:videoId` - Toggle like on a video
- `POST /likes/toggle/t/:tweetId` - Toggle like on a tweet
- `POST /likes/toggle/c/:commentId` - Toggle like on a comment
- `GET /likes/check-video/:videoId` - Check if video is liked
- `GET /likes/check-tweet/:tweetId` - Check if tweet is liked
- `GET /likes/check-comment/:commentId` - Check if comment is liked
- `GET /likes/videos` - Get all liked videos
- `GET /likes/tweets` - Get all liked tweets
- `GET /likes/comments` - Get all liked comments
- `GET /likes/content/:userId` - Get all liked content for a user

### Tweet Endpoints

- `POST /tweets` - Create a new tweet (requires authentication)
- `GET /tweets/user/:userId` - Get tweets by user
- `GET /tweets/:tweetId` - Get a single tweet
- `PATCH /tweets/:tweetId` - Update a tweet (requires authentication)
- `DELETE /tweets/:tweetId` - Delete a tweet (requires authentication)

### Playlist Endpoints

- `POST /playlists` - Create a new playlist (requires authentication)
- `GET /playlists/user/:userId` - Get user playlists
- `GET /playlists/:playlistId` - Get playlist by ID
- `PATCH /playlists/:playlistId` - Update playlist (requires authentication)
- `DELETE /playlists/:playlistId` - Delete playlist (requires authentication)
- `PATCH /playlists/add/:videoId/:playlistId` - Add video to playlist (requires authentication)
- `PATCH /playlists/remove/:videoId/:playlistId` - Remove video from playlist (requires authentication)

### View & Watch History Endpoints

- `POST /views/:videoId` - Increment video view count (authentication optional)
- `POST /users/history/:videoId` - Add video to watch history
- `GET /users/history` - Get user watch history (requires authentication)

### Feed & Homepage Endpoints

- `GET /feeds` - Get feed of subscribed channels
- `GET /homepage/:username` - Get homepage data for a user

### Search Endpoints

- `GET /search/q/:searchText` - Search users and content

### Dashboard Endpoints (All require authentication)

- `GET /dashboard/stats` - Get channel statistics
- `GET /dashboard/videos` - Get channel videos

### Contact Endpoints

- `POST /contact` - Send contact/support message

### Health Check (All require authentication)

- `GET /health` - Health check endpoint
- `GET /health/user` - Check authenticated user details

## 🏗️ Architecture

### Backend Architecture

- **MVC Pattern**: Controllers handle requests, Models define data structure, Routes define endpoints
- **Middleware Chain**: Authentication, file upload, logging, error handling
- **Service Layer**: Business logic separated into services (logger, mail)
- **Utility Layer**: Reusable functions for common operations
- **Error Handling**: Production-grade centralized error handling middleware
  - Handles custom ApiError instances
  - Handles Mongoose errors (ValidationError, CastError, DuplicateKeyError)
  - Handles JWT authentication errors
  - Handles express-validator validation errors
  - Handles generic errors with appropriate logging
  - Returns consistent error responses matching ApiResponse format
  - Includes stack traces only in development mode
  - Comprehensive error logging with Winston
- **Response Standardization**: Consistent API responses using ApiResponse class

### Frontend Architecture

- **Component-Based**: Modular React components with clear separation of concerns
- **Context API**: Global state management for auth, theme, and search
- **Custom Hooks**: Reusable logic for data fetching and CRUD operations
- **Lazy Loading**: Code splitting for optimized bundle size
- **React Query**: Server state management and caching
- **Material-UI**: Consistent design system and theming

### Database Schema

- **User Model**: Authentication, profile, preferences, watch history
- **Video Model**: Video metadata, owner reference, publish status
- **Comment Model**: Comments on videos, tweets, and nested comments
- **Like Model**: Likes on videos, tweets, and comments
- **Tweet Model**: User tweets and content
- **Playlist Model**: User-created playlists with video references
- **Subscription Model**: Channel subscription relationships
- **View Model**: Video view tracking

### Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt (10 rounds)
- HTTP-only cookies for token storage
- CORS configuration for cross-origin requests
- Input validation using express-validator
- Secure file upload handling with Multer
- Environment variable management
- Production-grade error handling (prevents information leakage)

### Error Handling

The application implements a comprehensive error handling system:

- **Error Middleware** (`error.middleware.ts`): Centralized error handling that processes all errors
  - **Custom Errors**: Handles `ApiError` instances with custom status codes and messages
  - **Mongoose Errors**: Automatically handles validation, cast, and duplicate key errors
  - **JWT Errors**: Handles token expiration and invalid token errors
  - **Validation Errors**: Processes express-validator errors with detailed field information
  - **Generic Errors**: Catches and handles unexpected errors with appropriate logging
  - **404 Handler**: Returns consistent 404 responses for undefined routes
  - **Logging**: All errors are logged with appropriate levels (warn for 4xx, error for 5xx)
  - **Security**: Stack traces are only included in development mode
  - **Consistent Responses**: All errors follow the same response format as successful responses

**Error Response Format:**

```json
{
  "success": false,
  "message": "ERROR MESSAGE",
  "errors": "Additional error details or validation errors",
  "data": null,
  "stack": "Stack trace (development only)"
}
```

## 🔧 Development

### Available Scripts

**Server:**

```bash
npm run server    # Start development server with hot reload
npm run build     # Build TypeScript to JavaScript
npm start         # Start production server
```

**Client:**

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions (camelCase for variables, PascalCase for components)

### Best Practices

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate input data
- Use TypeScript types and interfaces
- Follow RESTful API conventions
- Implement pagination for large datasets
- Use environment variables for configuration

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Verify connection string in `.env`
- Check database name is correct

**CORS Errors:**

- Verify `CORS_ORIGIN` includes your client URL
- Check that credentials are enabled in client requests
- Ensure server allows the origin

**Authentication Issues:**

- Verify JWT secrets are set correctly
- Check token expiry times
- Ensure cookies are being sent with requests

**File Upload Issues:**

- Verify Cloudinary credentials
- Check file size limits
- Ensure Multer is configured correctly

**Email Service Issues:**

- For Gmail, use app-specific passwords
- Verify SMTP settings
- Check firewall/network restrictions

## 📄 License

ISC License

## 👤 Author

s3nsh1-dev

## 🙏 Acknowledgments

- Material-UI for the component library
- Cloudinary for media storage
- MongoDB for the database solution
- Express.js and React communities

---

**Note**: This is a full-stack application requiring both client and server to be running simultaneously for full functionality. Ensure all environment variables are properly configured before starting the application. For environment variable details, see `server/src/utils/dotenvHelper.ts`.
