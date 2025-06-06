import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			setExperiences([...experiences, newExperience]);

			setNewExperience({
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
		}
	};

	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
	};

	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	return (
		<div className='bg-white shadow rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold mb-4'>Experience</h2>
			{experiences.map((exp) => (
				<div key={exp._id} className='mb-1 flex justify-between items-start'>
					<div className='flex items-start'>
						<Briefcase size={20} className='mr-2' style={{marginTop: "9px"}} />
						<div>
							<h3 className='font-semibold'>{exp.title}</h3>
							<p className='text-gray-600 m-0'>{exp.company}</p>
							<p className='text-gray-500 text-sm m-0'>
								{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
							</p>
							<p className='text-gray-700'>{exp.description}</p>
						</div>
					</div>
					{isEditing && (
						<button onClick={() => handleDeleteExperience(exp._id)}>
							<X size={20} color="red"/>
						</button>
					)}
				</div>
			))}

			{isEditing && (
				<div className='mt-4'>
					<input
						type='text'
						placeholder='Titulo'
						value={newExperience.title}
						onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<input
						type='text'
						placeholder='Empresa'
						value={newExperience.company}
						onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<input
						type='date'
						placeholder='Start Date'
						value={newExperience.startDate}
						onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<div className='flex items-center mb-2'>
						<input
							type='checkbox'
							id='currentlyWorking'
							checked={newExperience.currentlyWorking}
							onChange={handleCurrentlyWorkingChange}
							className='mr-2'
						/>
						<label htmlFor='currentlyWorking' className="px-1">Presente</label>
					</div>
					{!newExperience.currentlyWorking && (
						<input
							type='date'
							placeholder='End Date'
							value={newExperience.endDate}
							onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
							className='w-full p-2 border rounded mb-2'
						/>
					)}
					<textarea
						placeholder='Descrição'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleAddExperience}
						className='bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
					>
						Adicionar experiência
					</button>
				</div>
			)}

			{isOwnProfile && (
				<>
					{isEditing ? (
						<button
							onClick={handleSave}
							className='mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
						>
							Salvar alterações
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='mt-4 text-primary hover:text-primary-dark transition duration-300'
						>
							Editar experiências
						</button>
					)}
				</>
			)}
		</div>
	);
};
export default ExperienceSection;