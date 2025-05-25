import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";

const Post = ({ post: initialPost }) => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const { data: post } = useQuery({
    queryKey: ["post", initialPost._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/${initialPost._id}`);
      return res.data;
    },
    initialData: initialPost,
  });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post apagado com sucesso");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      toast.success("Comentário adicionado com sucesso");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Erro ao comentar");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Tem certeza que quer excluir o post?")) return;
    deletePost();
  };

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      
    }
  };


  return (
    <div className='bg-gray-200 rounded-lg shadow mb-4'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || "/avatar.png"}
                alt={post.author.name}
                className='size-10 rounded-full mr-3'
              />
            </Link>

            <div className="!space-y-0.5">
              <Link style={{ textDecoration: "none" }} to={`/profile/${post?.author?.username}`} className="text-black">
                <h3 className='font-semibold'>{post.author.name}</h3>
              </Link>
              <p className='text-xs text-info text-black'>{post.author.headline}</p>
              <p className='text-xs text-info text-black'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
            </div>
          </div>
          {isOwner && (
            <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
              {isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} color="#ef4444" />}
            </button>
          )}
        </div>
        <p className='mb-4'>{post.content}</p>
        {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

        <div className='flex justify-between text-info'>
          <PostAction
            icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${post.comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text='Share' />
        </div>
      </div>

      {showComments && (
        <div className='px-4 pb-4'>
          <div className='mb-4 max-h-60 overflow-y-auto'>
            {post.comments.map((comment) => (
              <div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                />
                <div className='flex-grow'>
                  <div className='flex items-center mb-1'>
                    <span className='font-semibold mr-2'>{comment.user.name}</span>
                    <span className='text-xs text-info'>
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className='flex items-center'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Adicionar um comentario...'
              className='flex-grow p-2 rounded-full bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-12'
            />
            <button
              type='submit'
              className='text-white px-6 hover:rounded-full transition duration-300 h-12 hover:bg-blue-700' style={{borderRadius: "100%"}}
              disabled={isAddingComment}
            >

              {isAddingComment ? <Loader size={20} className='animate-spin' /> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Post;