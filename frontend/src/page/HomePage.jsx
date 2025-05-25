import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";

const HomePage = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });


  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1 '>
        <Sidebar user={authUser} />
      </div>

      <div className='col-span-1 lg:col-span-2'>
        <PostCreation user={authUser} />

        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.length === 0 && (
          <div className='bg-gray-200 rounded-lg shadow p-8 text-center'>
            <div className='mb-6'>
              <Users size={64} className='mx-auto text-blue-500' color="#3b82f6"/>
            </div>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Nenhuma publicação ainda</h2>
            <p className='text-gray-600 mb-6'>Conecte-se com outras pessoas para começar a ver publicações no seu feed!</p>
          </div>
        )}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className='col-span-1 lg:col-span-1 hidden lg:block '>
          <div className='bg-gray-200 rounded-lg shadow p-4'>
            <h2 className='font-semibold mb-4'>Pessoas que talvez você conheça</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default HomePage;