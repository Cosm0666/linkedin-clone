import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { axiosInstance } from '../../lib/axios';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err?.response?.data?.message || "Algo deu errado");
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ username, password });
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Usuario'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='form-control w-full my-3'
				required
			/>
			<input
				type='password'
				placeholder='Senha'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='form-control w-full my-3'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Entrar"}
			</button>
		</form>
	);
};

export default LoginForm