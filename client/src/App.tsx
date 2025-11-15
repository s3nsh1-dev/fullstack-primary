import { lazy, useEffect } from "react";
// Replace direct imports with lazy ones
const Test = lazy(() => import("./pages/Test"));
const Homepage = lazy(() => import("./pages/Homepage"));
const LikedContent = lazy(() => import("./pages/LikedContent"));
const MyVideos = lazy(() => import("./pages/MyVideos"));
const Settings = lazy(() => import("./pages/Settings"));
const Subscribers = lazy(() => import("./pages/Subscribers"));
const Support = lazy(() => import("./pages/Support"));
const Tweets = lazy(() => import("./pages/Tweets"));
const WatchHistory = lazy(() => import("./pages/WatchHistory"));
const OpenSingleTweetPage = lazy(() => import("./pages/OpenSingleTweetPage"));
const OpenSingleVideoPage = lazy(() => import("./pages/OpenSingleVideoPage"));
const ShowVideos = lazy(() => import("./components/homepage/ShowVideos"));
const ShowSubscribed = lazy(
  () => import("./components/homepage/ShowSubscribed")
);
const ShowTweets = lazy(() => import("./components/homepage/ShowTweets"));
const ShowPlaylists = lazy(() => import("./components/homepage/ShowPlaylists"));
const EditVideoOptions = lazy(
  () => import("./components/Videos/EditVideoOptions")
);
const SearchPage = lazy(() => import("./pages/SearchPage"));
//components and pages
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./pages/Navbar";
import AppLoadingProgress from "./pages/AppLoadingProgress";
import ErrorBoundary from "./components/ui-components/ErrorBoundary";

import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./utilities/muiThemeController";
import useAuth from "./hooks/useAuth";
import useMode from "./hooks/useMode";
import useGlobalSearch from "./hooks/useGlobalSearch";

function App() {
  const { mode } = useMode();
  const { loading } = useAuth();
  const searchRef = useGlobalSearch();
  useEffect(() => {
    const handleCTRL_k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchRef?.current) {
          searchRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleCTRL_k);
    return () => window.removeEventListener("keydown", handleCTRL_k);
  }, [searchRef]);

  if (loading) return <AppLoadingProgress />;
  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <ErrorBoundary>
        <Box sx={{ mt: (theme) => `${theme.mixins.toolbar.minHeight}px` }}>
          <Routes>
            {/* routes with Navbar */}
            <Route element={<Navbar />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/liked-content" element={<LikedContent />} />
              <Route path="/setting" element={<Settings />} />
              <Route path="/subscribers" element={<Subscribers />} />
              <Route path="/support" element={<Support />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/search" element={<SearchPage />} />
              {/* Nested tabs*/}
              <Route path="/my-videos">
                <Route index element={<MyVideos />} />
                <Route
                  path="edit"
                  element={<EditVideoOptions pageLimit={7} />}
                />
              </Route>
              <Route path="/tweets">
                <Route index element={<Tweets />} />
                <Route path=":tweetId" element={<OpenSingleTweetPage />} />
              </Route>
              <Route path="/:username" element={<Homepage />}>
                <Route index element={<ShowVideos pageLimit={5} />} />
                <Route path="videos" element={<ShowVideos pageLimit={5} />} />
                <Route path="playlists" element={<ShowPlaylists />} />
                <Route
                  path="subscribers"
                  element={<ShowSubscribed pageLimit={4} />}
                />
                <Route
                  path="tweets"
                  element={<ShowTweets interaction={false} pageLimit={3} />}
                />
              </Route>
              <Route path="/videos">
                <Route path=":videoId" element={<OpenSingleVideoPage />} />
              </Route>
            </Route>
            {/* routes without Navbar */}
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
