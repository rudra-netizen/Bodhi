const express = require("express");

const AuthController = require("../controllers/auth.controller");
const Middleware = require("../middleware/auth.middleware");

const router = express.Router();

// =========================================================
// NORMAL LOGIN
// =========================================================

router.post("/login", AuthController.loginUser);

// =========================================================
// GOOGLE SIGNUP
// =========================================================

router.get("/google", AuthController.googleAuth);

router.get("/google/callback", AuthController.googleCallback);

// =========================================================
// GOOGLE SIGNUP DATA
// =========================================================

router.get("/google/signup-data", AuthController.getGoogleSignupData);

// =========================================================
// COMPLETE GOOGLE PROFILE
// =========================================================

router.post("/google/complete-profile", AuthController.completeGoogleProfile);
router.post("/complete-profile", AuthController.completeGoogleProfile);

// =========================================================
// LOGOUT
// =========================================================

router.post("/logout", Middleware.AuthMiddlew, AuthController.logoutUser);

module.exports = router;

/*
const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

module.exports = router;
*/
