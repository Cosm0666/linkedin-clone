import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { axiosInstance } from '../../lib/axios';
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";


const Navbar = () => {
	const queryClient = useQueryClient();
	const authUser = queryClient.getQueryData(["authUser"]);

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});
	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: async () => axiosInstance.get("/connections/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).lenght;
	const unreadConnectionRequestsCount = connectionRequests?.data?.length;

	return (
		<nav className='bg-white shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-neutral flex flex-col items-center mx-2 no-underline'>
									<Home size={20} />
									<span className='text-xs hidden md:block'>Inicio</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative '>
									<Users size={20} />
									<span className='text-xs hidden md:block'>Minha rede</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative '>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notificaçoes</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center mx-2'
								>
									<User size={20} />
									<span className='text-xs hidden md:block'>Eu</span>
								</Link>
								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 mx-2'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Sair</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Entrar
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Cadastrar
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);

};

export default Navbar;