import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Todos os campos sao obrigatorios" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email ja existe" });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username ja existe" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Senha precisar ter mais que 6 caracteres" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    res.status(201).json({ message: "Usuario registrado com sucesso" });
  } catch (error) {
    console.error("Error in signup:", error.message)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Usuário ou senha inválidos" })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Usuário ou senha inválidos" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("jwt-linkedin", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    res.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error("Error em login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
}


export const logout = async (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.json({ message: "Usuario desconectado com sucesso" })
}

export const getCurrentUser = async (req, res)=> {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Error em getCurrentUser controller:", error);
    res.status(500).json({message: "Server error"});
  }
}