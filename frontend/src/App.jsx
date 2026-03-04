import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // ✅ Lucide icon
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";


function App() {
    const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
// let show=true;
  useEffect(() => {
    checkAuth();
  }, []);

  console.log({ authUser });

  // ✅ Loader Direct Here
  if (isCheckingAuth&&!authUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <Loader2 className="animate-spin text-primary" size={50} />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
<Route 
  path="/" 
  element={authUser ? <HomePage /> : <Navigate to="/login" />} 
/>        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/" />} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/" />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={authUser ?<ProfilePage />:<Navigate to="/login" />} />
      </Routes>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </div>
  );
}

export default App;