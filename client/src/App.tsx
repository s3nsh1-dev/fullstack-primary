import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";
// import Navbar from "./pages/Navbar";
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
import OpenSingleVideoPage from "./pages/OpenSingleVideoPage";
import ShowVideos from "./components/homepage/ShowVideos";
import ShowSubscribed from "./components/homepage/ShowSubscribed";
import ShowTweets from "./components/homepage/ShowTweets";
import ShowPlaylists from "./components/homepage/ShowPlaylists";
import EditVideoOptions from "./components/Videos/EditVideoOptions";
import NotFound from "./pages/NotFound";
import LayoutWithNavbar from "./components/navbar/LayoutWithNavbar";

function App() {
  const { mode } = useMode();
  const { loading } = useAuth();
  if (loading) return <AppLoadingProgress />;

  return (
    <Box sx={{ mt: (theme) => `${theme.mixins.toolbar.minHeight}px` }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <Routes>
          {/* routes with Navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/liked-content" element={<LikedContent />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/subscribers" element={<Subscribers />} />
            <Route path="/support" element={<Support />} />
            <Route path="/history" element={<WatchHistory />} />
            {/* Nested tabs*/}
            <Route path="/my-videos">
              <Route index element={<MyVideos />} />
              <Route path="edit" element={<EditVideoOptions />} />
            </Route>
            <Route path="/tweets">
              <Route index element={<Tweets />} />
              <Route path=":tweetId" element={<OpenSingleTweetPage />} />
            </Route>
            <Route path="/:username" element={<Homepage />}>
              <Route index element={<ShowVideos />} />
              <Route path="videos" element={<ShowVideos />} />
              <Route path="playlists" element={<ShowPlaylists />} />
              <Route path="subscribers" element={<ShowSubscribed />} />
              <Route
                path="tweets"
                element={<ShowTweets interaction={false} />}
              />
            </Route>
            <Route path="/videos">
              <Route path=":videoId" element={<OpenSingleVideoPage />} />
            </Route>
          </Route>
          {/* routes without Navbar */}
          <Route path="/test" element={<Test />} />
        </Routes>
      </ThemeProvider>
    </Box>
  );
}

export default App;
