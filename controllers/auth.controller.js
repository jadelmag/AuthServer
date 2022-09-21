const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../utils/jwt");
const User = require("../models/User");

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "User not found",
      });
    }

    const validPassword = bcrypt.compareSync(password, dbUser.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password not valid",
      });
    }

    const token = await generateJWT(dbUser.id, dbUser.name);

    return res.status(200).json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const createUser = async (req, res = response) => {
  const { email, name, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists with that email",
      });
    }

    const dbUser = new User(req.body);

    const salt = bcrypt.genSaltSync(10);
    dbUser.password = bcrypt.hashSync(password, salt);
    const token = await generateJWT(dbUser.id, name);
    await dbUser.save();

    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Please contact with administrator",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid } = req;

  const dbUser = await User.findById(uid);
  const token = await generateJWT(uid, dbUser.name);

  return res.json({
    ok: true,
    uid: uid,
    name: dbUser.name,
    email: dbUser.email,
    token: token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
