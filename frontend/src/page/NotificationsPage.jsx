import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
	const queryClient = useQueryClient();
	const authUser = queryClient.getQueryData(["authUser"]);

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: () => axiosInstance.get("/notifications"),
	});

	const { mutate: markAsReadMutation } = useMutation({
		mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
		},
	});

	const { mutate: deleteNotificationMutation } = useMutation({
		mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(["notifications"]);
			toast.success("Notificação excluida");
		},
	});

	const renderNotificationIcon = (type) => {
		switch (type) {
			case "like":
				return <ThumbsUp color="#0000ff" />;
			case "comment":
				return <MessageSquare color="00ff00"/>;
			case "connectionAccepted":
				return <UserPlus color="#00ff00" />;
			default:
				return null;
		}
	};

	const renderNotificationContent = (notification) => {
		switch (notification.type) {
			case "like":
				return (
					<span>
						<strong>{notification.relatedUser.name}</strong> curtiu seu post
					</span>
				);
			case "comment":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold flex no-underline'>
							{notification.relatedUser.name}
						</Link>{" "}
						comentou no seu post
					</span>
				);
			case "connectionAccepted":
				return (
					<span>
						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold flex no-underline'>
							{notification.relatedUser.name}
						</Link>{" "}
						aceitou sua solicitação
					</span>
				);
			default:
				return null;
		}
	};

	const renderRelatedPost = (relatedPost) => {
		if (!relatedPost) return null;

		return (
			<Link
				to={`/post/${relatedPost._id}`}
				className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors no-underline' style={{ textDecoration: "none" }}
			>
				{relatedPost.image && (
					<img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
				)}
				<div className='flex-1 flex items-center min-h-[40px] h-10'>
					<p className='text-sm text-gray-600 truncate w-full' style={{marginTop: "14px"}}>{relatedPost.content}</p>
				</div>
				<ExternalLink size={14} className='text-gray-400 flex-shrink-0' />
			</Link>
		);
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
			<div className='col-span-1 lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>
			<div className='col-span-1 lg:col-span-3'>
				<div className='bg-white rounded-lg shadow p-6'>
					<h1 className='text-2xl font-bold mb-6'>Notificações</h1>

					{isLoading ? (
						<p>Carregando notificações...</p>
					) : notifications && notifications.data.length > 0 ? (
						<ul>
							{notifications.data.map((notification) => (
								<li
									key={notification._id}
									className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${!notification.read ? "border-blue-500" : "border-gray-200"
										}`}
								>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-4'>
											<Link to={`/profile/${notification.relatedUser.username}`}>
												<img
													src={notification.relatedUser.profilePicture || "/avatar.png"}
													alt={notification.relatedUser.name}
													className='w-12 h-12 rounded-full object-cover'
												/>
											</Link>

											<div>
												<div className='flex items-center gap-2'>
													<div className='p-1 bg-gray-100 rounded-full'>
														{renderNotificationIcon(notification.type)}
													</div>
													<p className='text-sm'>{renderNotificationContent(notification)}</p>
												</div>
												<p className='text-xs text-gray-500 mt-1'>
													{formatDistanceToNow(new Date(notification.createdAt), {
														addSuffix: true,
													})}
												</p>
												{renderRelatedPost(notification.relatedPost)}
											</div>
										</div>

										<div className='flex gap-2'>
											{!notification.read && (
												<button
													onClick={() => markAsReadMutation(notification._id)}
													className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
													aria-label='Marca como lido'
												>
													<Eye size={16} />
												</button>
											)}

											<button
												onClick={() => deleteNotificationMutation(notification._id)}
												className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
												aria-label='Excluir notificação'
											>
												<Trash2 size={16} color="red" />
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p>Sem notificações no momento.</p>
					)}
				</div>
			</div>
		</div>
	);
};
export default NotificationsPage;
