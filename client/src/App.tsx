import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";
import useAuth from "./hooks/useAuth";
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
import useRefreshUser from "./hooks/data-fetching/useRefreshUser";

function App() {
  const { mode } = useMode();
  const { login } = useAuth();
  const { data, isSuccess } = useRefreshUser();
  React.useEffect(() => {
    if (isSuccess && data) {
      login(data);
    }
  }, [isSuccess, data, login]);

  return (
    <Box sx={{ marginTop: "57px" }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* routes with Navbar */}
            <Route element={<Navbar navTitle="" />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/liked-content" element={<LikedContent />} />
              <Route path="/my-videos" element={<MyVideos />} />
              <Route path="/setting" element={<Settings />} />
              <Route path="/subscribers" element={<Subscribers />} />
              <Route path="/support" element={<Support />} />
              <Route path="/tweets" element={<Tweets />} />
              <Route path="/history" element={<WatchHistory />} />
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
