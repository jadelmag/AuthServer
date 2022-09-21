const { Router } = require("express");
const { check } = require("express-validator");
const {
  createUser,
  loginUser,
  renewToken,
} = require("../controllers/auth.controller");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.post(
  "/new",
  [
    check("name", "El campo email es obligatorio").not().isEmpty(),
    check("email", "El campo email es requerido").isEmail(),
    check("password", "El campo password es requerido").isLength({ min: 6 }),
    validateFields,
  ],
  createUser
);
router.get("/renew", validateJWT, renewToken);
router.post(
  "/login",
  [
    check("email", "El campo email es requerido").isEmail(),
    check("password", "El campo password es requerido").isLength({ min: 6 }),
    validateFields,
  ],
  loginUser
);

module.exports = router;
