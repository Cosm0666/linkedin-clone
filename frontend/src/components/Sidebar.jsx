import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className='bg-gray-200 rounded-lg shadow'>
			<div className='p-4 text-center'>
				<div
					className='h-16 rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				<Link className="text-black" style={{ textDecoration: "none" }} to={`/profile/${user.username}`}>
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-20 h-20 rounded-full mx-auto mt-[-40px]'
					/>
					<h2 className='no-underline text-xl font-semibold mt-2'>{user.name}</h2>
				</Link>
				<p className='text-info'>{user.headline}</p>
				<p className='text-info text-xs'>{user.connections.length} Conexões</p>
			</div>
			<div className='border-t p-4 border-gray-300'>
				<nav>
					<ul className='space-y-2'>
						<li>
							<Link
								to='/'
								className='text-black flex items-center py-2 px-4 rounded-md hover:bg-gray-300 hover:text-white transition-colors'
							>
								<Home className='mr-2 ' size={20} /> Inicio
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='text-black hover:bg-gray-300 flex items-center py-2 px-4 rounded-md hover:text-white transition-colors'
							>
								<UserPlus className='mr-2' size={20} /> Minha Rede
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='text-black hover:bg-gray-300 flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Bell className='mr-2' size={20} /> Notificaçoes
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className='text-black hover:bg-gray-300 border-t p-4 border-gray-300'>
				<Link to={`/profile/${user.username}`} className='text-sm font-semibold'>
					Visitar o seu perfil
				</Link>
			</div>
		</div>
	);
}