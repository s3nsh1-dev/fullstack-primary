// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";
import Navbar from "./pages/Navbar";
import Test from "./pages/Test";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import LikedContent from "./pages/LikedContent";
import MyVideos from "./pages/MyVideos";
import Settings from "./pages/Settings";
import Subscribers from "./pages/Subscribers";
import Support from "./pages/Support";
import Tweets from "./pages/Tweets";
import WatchHistory from "./pages/WatchHistory";
import useAuth from "./hooks/useAuth";
import AppLoadingProgress from "./pages/AppLoadingProgress";
import OpenSingleTweetPage from "./pages/OpenSingleTweetPage";
// import ChannelHomePage from "./pages/ChannelHomePage";
// import ChannelTweetsPage from "./pages/ChannelTweetsPage";
// import ChannelVideosPage from "./pages/ChannelVideosPage";
import OpenSingleVideoPage from "./pages/OpenSingleVideoPage";
import ShowVideos from "./components/homepage/ShowVideos";
import ShowSubscribed from "./components/homepage/ShowSubscribed";
import ShowTweets from "./components/homepage/ShowTweets";
import ShowPlaylists from "./components/homepage/ShowPlaylists";

function App() {
  const { mode } = useMode();
  const { loading } = useAuth();
  if (loading) return <AppLoadingProgress />;

  return (
    <Box sx={{ marginTop: "57px" }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* routes with Navbar */}
            <Route element={<Navbar navTitle="" />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/:username" element={<Homepage />}>
                {/* Nested tabs */}
                <Route path="videos" element={<ShowVideos />} />
                <Route path="playlists" element={<ShowPlaylists />} />
                <Route path="tweets" element={<ShowTweets />} />
                <Route path="subscribed" element={<ShowSubscribed />} />

                {/* Default tab (redirect to videos) */}
                <Route index element={<ShowVideos />} />
              </Route>
              <Route path="/liked-content" element={<LikedContent />} />
              <Route path="/my-videos" element={<MyVideos />} />
              <Route path="/setting" element={<Settings />} />
              <Route path="/subscribers" element={<Subscribers />} />
              <Route path="/support" element={<Support />} />
              <Route path="/tweets" element={<Tweets />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/tweets">
                <Route path=":tweetId" element={<OpenSingleTweetPage />} />
              </Route>
              <Route path="/channels">
                {/* <Route path=":channelId/home" element={<ChannelHomePage />} /> */}
                {/* These are useful when i implement tabs instead on states OR something else
                <Route
                  path=":channelId/tweets"
                  element={<ChannelTweetsPage />}
                />
                <Route
                  path=":channelId/videos"
                  element={<ChannelVideosPage />}
                /> */}
              </Route>
              <Route path="/videos">
                <Route path=":videoId" element={<OpenSingleVideoPage />} />
              </Route>
            </Route>
            {/* routes without Navbar */}
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;

// /tweets/:tweetId → single tweet page

// /videos/:videoId → single video page

// /channels/:channelId/home → channel homepage

// /channels/:channelId/tweets → channel tweets

// /channels/:channelId/videos → channel videos
