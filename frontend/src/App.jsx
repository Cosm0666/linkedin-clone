import Layout from "./components/layout/Layout";
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from "./page/HomePage";
import SignupPage from "./page/auth/SignupPage";
import LoginPage from "./page/auth/LoginPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import { Loader } from "lucide-react";
import NotificationsPage from "./page/NotificationsPage.jsx";
import NetworkPage from "./page/NetworkPage.jsx";
import PostPage from "./page/PostPage.jsx";
import ProfilePage from "./page/ProfilePage.jsx";


function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.message && error.response.status === 401) {
          return null
        }
        toast.error(error.response.data.message || "Algo deu errado");
      }
    }
  });

  if(isLoading){ 
    return <div className="flex items-center justify-center min-h-screen w-full">
      <Loader className="animate-spin" />
    </div>
}
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={"/"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
          <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
          <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
        </Routes>
      <Toaster />
      </Layout>
    </>
  );
}
export default App
