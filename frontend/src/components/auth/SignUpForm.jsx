import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const SignUpForm = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const queryClient = useQueryClient();

	const { mutate: signUpMutation, isLoading } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/auth/signup", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Conta criada com sucesso");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Algo deu errado");
		},
	});

	const handleSignUp = (e) => {
		e.preventDefault();
		signUpMutation({ name, username, email, password });
	};

	return (
		<form onSubmit={handleSignUp} className='flex flex-col gap-4'>
			<input
				type='text'
				placeholder='Nome'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='form-control w-full'
				required
			/>
			<input
				type='text'
				placeholder='Usuario'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='form-control w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='form-control w-full'
				required
			/>
			<input
				type='password'
				placeholder='Senha'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='form-control w-full'
				required
			/>

			<button type='submit' disabled={isLoading} className='btn btn-primary w-full text-white'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Aceitar e entrar"}
			</button>
		</form>
	);
};
export default SignUpForm;