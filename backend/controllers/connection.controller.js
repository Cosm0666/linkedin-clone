import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
	try {
		const { userId } = req.params;
		const senderId = req.user._id;

		if (senderId.toString() === userId) {
			return res.status(400).json({ message: "Você não pode enviar uma solicitação para si mesmo."});
		}

		if (req.user.connections.includes(userId)) {
			return res.status(400).json({ message: "Voce ja esta conectado" });
		}

		const existingRequest = await ConnectionRequest.findOne({
			sender: senderId,
			recipient: userId,
			status: "pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "O pedido de solicitaçao ja existe" });
		}

		const newRequest = new ConnectionRequest({
			sender: senderId,
			recipient: userId,
		});

		await newRequest.save();

		res.status(201).json({ message: "Pedido enviado com sucesso" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const acceptConnectionRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ConnectionRequest.findById(requestId)
			.populate("sender", "name email username")
			.populate("recipient", "name username");

		if (!request) {
			return res.status(404).json({ message: "Solicitaçao nao encontrada" });
		}

		// check if the req is for the current user
		if (request.recipient._id.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Sem autorizaçao para aceitar a solicitaçao" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "Esta solicitaçao ja foi processada" });
		}

		request.status = "accepted";
		await request.save();

		
		await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId } });
		await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } });

		const notification = new Notification({
			recipient: request.sender._id,
			type: "connectionAccepted",
			relatedUser: userId,
		});

		await notification.save();

		res.json({ message: "Solicitaçao aceita com sucesso" });

	} catch (error) {
		console.error("Error em acceptConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const rejectConnectionRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await ConnectionRequest.findById(requestId);

		if (request.recipient.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Sem autorizaçao para aceitar a solicitaçao" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "Esta solicitaçao ja foi processada" });
		}

		request.status = "rejected";
		await request.save();

		res.json({ message: "Solicitaçao rejeitada" });
	} catch (error) {
		console.error("Error em rejectConnectionRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getConnectionRequests = async (req, res) => {
	try {
		
		const userId = req.user._id;
	
		const requests = await ConnectionRequest.find({ recipient: userId, status: "pending" }).populate(
			"sender",
			"name username profilePicture headline connections"
		);

		res.json(requests);
	} catch (error) {
		console.error("Error em getConnectionRequests controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserConnections = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"connections",
			"name username profilePicture headline connections"
		);

		res.json(user.connections);
	} catch (error) {
		console.error("Error em getUserConnections controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const removeConnection = async (req, res) => {
	try {
		const myId = req.user._id;
		const { userId } = req.params;

		await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
		await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });

		res.json({ message: "Solicitaçao removida com sucesso" });
	} catch (error) {
		console.error("Error em removeConnection controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.user._id;

		const currentUser = req.user;
		if (currentUser.connections.includes(targetUserId)) {
			return res.json({ status: "connected" });
		}

		const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.json({ status: "pending" });
			} else {
				return res.json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		res.json({ status: "not_connected" });
	} catch (error) {
		console.error("Error em getConnectionStatus controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};