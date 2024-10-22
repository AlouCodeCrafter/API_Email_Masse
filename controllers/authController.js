const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/erros.util");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// generer un refresh token et l'enregistre en  base
const createRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await tokenModel.create({ userId, token: refreshToken, expiresAt });
  return refreshToken;
};

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await userModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = signUpErrors(error);
    res.status(400).send({ errors });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    const refreshToken = await createRefreshToken(user._id);

    // Envoi des tokens dans les cookies
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (error) {
    console.log("login err:", error);

    const errors = signInErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    // Suppression du token en base de données
    await tokenModel.findOneAndDelete({ token: refreshToken });

    // Nettoyage des cookies
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
