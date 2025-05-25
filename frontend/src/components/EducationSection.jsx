import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const handleAddEducation = () => {
    if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu._id !== id));
  };

  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
  };

  return (
    <div className='bg-white shadow rounded-lg p-6 mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Escolaridade</h2>
      {educations.map((edu) => (
        <div key={edu._id} className='mb-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <School size={20} className='mr-2' style={{marginBottom: "25px"}} />
            <div className="flex flex-col justify-between h-16"> 
              <h3 className='font-semibold'>{edu.fieldOfStudy}</h3>
              <p className='text-gray-500 text-sm m-0'>
                {edu.startYear} - {edu.endYear || "Present"}
              </p>
              <p className='text-gray-600 m-0'>{edu.school}</p>
            </div>
          </div>
          {isEditing && (
            <button onClick={() => handleDeleteEducation(edu._id)} >
              <X size={20} color="red" />
            </button>
          )}
        </div>
      ))}
      {isEditing && (
        <div className='mt-4'>
          <input
            type='text'
            placeholder='Instituição de ensino'
            value={newEducation.school}
            onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
            className='w-full p-2 border rounded mb-2 '
          />
          <input
            type='text'
            placeholder='Curso'
            value={newEducation.fieldOfStudy}
            onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
            className='w-full p-2 border rounded mb-2'
          />
          <input
            type='number'
            placeholder='Inicio'
            value={newEducation.startYear}
            onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
            className='w-full p-2 border rounded mb-2'
          />
          <input
            type='number'
            placeholder='Fim'
            value={newEducation.endYear}
            onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
            className='w-full p-2 border rounded mb-2'
          />
          <button
            onClick={handleAddEducation}
            className='bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300'
          >
            Adicionar Escolaridade
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className='mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark
							 transition duration-300'
            >
              Salvar alterações
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className='mt-4 text-primary hover:text-primary-dark transition duration-300'
            >
              Editar
            </button>
          )}
        </>
      )}
    </div>
  );
};
export default EducationSection;