import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();

  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
  });

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Solicitação de conexão enviada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro");
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Solicitação de conexão aceita");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Solicitação de conexão rejeitada");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Algo deu errado");
    },
  });

  const renderButton = () => {
    if (isLoading) {
      return (
        <button className='px-9 py-2 rounded-full text-sm bg-gray-200 text-gray-500' style={{ borderRadius: "20px" }} disabled>
          Carregando...
        </button>
      );
    }

    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <>
            <style>
              {`
                @media (max-width: 1450px) {
                  .hide-pendente-1450 {
                    display: none !important;
                  }
                }
             `}
            </style>
            <button
              className='px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full text-xs sm:text-sm md:text-base flex items-center bg-yellow-500 text-white max-w-full truncate'
              style={{ borderRadius: "20px" }}
              disabled
            >
              <Clock size={16} className='mr-1 flex-shrink-0' />
              <span className="hide-pendente-1450 truncate">Pendente</span>
            </button>
          </>
        );
      case "received":
        return (
          <div className='flex gap-2 justify-center'>
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`} style={{ borderRadius: "20px" }}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`} style={{ borderRadius: "20px" }}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className='px-9 py-2 rounded-full text-sm bg-green-500 text-white flex items-center' style={{ borderRadius: "20px" }}
            disabled
          >
            <UserCheck size={16} className='mr-1' />
            Conectado
          </button>
        );
      default:
        return (
          <button
            className='px-9 py-2 rounded-full text-sm border border-primary hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center' style={{ borderRadius: "20px" }}
            onClick={handleConnect}
          >
            <UserPlus size={16} className='mr-1' />
            Conectar
          </button>
        );
    }
  };

  const handleConnect = () => {
    if (connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user._id);
    }
  };

  return (
    <div className='flex items-center justify-between mb-4 min-w-0 w-full'>
      <Link
        to={`/profile/${user.username}`}
        className='flex items-center flex-grow min-w-0 overflow-hidden'
        style={{ textDecoration: "none" }}
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className='w-12 h-12 rounded-full mr-3 flex-shrink-0'
        />
        <div className="min-w-0">
          <h3 className='font-semibold text-sm truncate'>{user.name}</h3>
          <p className='text-xs text-info truncate'>{user.headline}</p>
        </div>
      </Link>
      <div className="flex-shrink-0 ml-2">{renderButton()}</div>
    </div>
  );
};
export default RecommendedUser;




