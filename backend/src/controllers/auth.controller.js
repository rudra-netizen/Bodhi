const userModel = require("../models/user.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

// =========================================================
// JWT HELPER
// =========================================================

function generateToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
}

// =========================================================
// COOKIE OPTIONS
// =========================================================

function getCookieOptions() {
  return {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// =========================================================
// NORMAL LOGIN
// =========================================================

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    const isPass = await bcrypt.compare(password, user.password);

    if (!isPass) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      message: "User logged In Successfully",

      user: {
        email: user.email,

        fullName: user.fullName,

        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

// =========================================================
// GOOGLE SIGNUP - STEP 1
// =========================================================
//
// User clicks:
//
// "Sign in with Google"
//
// =========================================================

function googleAuth(req, res) {
  try {
    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",

      scope: ["openid", "email", "profile"],

      prompt: "select_account",

      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    });

    return res.redirect(authUrl);
  } catch (error) {
    console.error("Google Auth Error:", error);

    return res.status(500).json({
      message: "Unable to start Google authentication",
    });
  }
}

// =========================================================
// GOOGLE CALLBACK
// =========================================================
//
// Google → backend
//
// Google se email + googleId receive honge.
//
// =========================================================

async function googleCallback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Google authorization code missing");
    }

    // =====================================================
    // EXCHANGE CODE FOR TOKENS
    // =====================================================

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).send("Google authentication failed");
    }

    // =====================================================
    // VERIFY GOOGLE ID TOKEN
    // =====================================================

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;

    const email = payload.email;

    if (!googleId || !email) {
      return res.status(401).send("Unable to get Google account information");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // =====================================================
    // CHECK IF GOOGLE ACCOUNT ALREADY EXISTS
    // =====================================================

    const googleUser = await userModel.findOne({
      googleId,
    });

    if (googleUser) {
      // ---------------------------------------------------
      // IMPORTANT
      //
      // Signup page par sirf new account banana hai.
      //
      // Existing Google account ko login nahi karenge.
      // ---------------------------------------------------

      return res.redirect(
        `${process.env.FRONTEND_URL}/register?error=account_exists`,
      );
    }

    // =====================================================
    // CHECK EMAIL
    // =====================================================

    const existingEmailUser = await userModel.findOne({
      email: normalizedEmail,
    });

    if (existingEmailUser) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/register?error=email_exists`,
      );
    }

    // =====================================================
    // TEMPORARY GOOGLE SIGNUP TOKEN
    // =====================================================
    //
    // Is token mein trusted Google information hogi.
    //
    // Frontend email ko modify nahi kar sakta.
    //
    // =====================================================

    const signupToken = jwt.sign(
      {
        googleId,

        email: normalizedEmail,
      },

      process.env.JWT_SECRET_KEY,

      {
        expiresIn: "10m",
      },
    );

    // =====================================================
    // SAVE TEMPORARY COOKIE
    // =====================================================

    res.cookie("google_signup_token", signupToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      maxAge: 10 * 60 * 1000,
    });

    // =====================================================
    // REDIRECT TO FRONTEND
    // =====================================================

    return res.redirect(`${process.env.FRONTEND_URL}/complete-profile`);
  } catch (error) {
    console.error("Google Callback Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/register?error=google_auth_failed`,
    );
  }
}

// =========================================================
// GET GOOGLE SIGNUP DATA
// =========================================================
//
// Frontend complete-profile page load hone par
// ye endpoint call karega.
//
// Email backend temporary cookie se nikalega.
//
// =========================================================

async function getGoogleSignupData(req, res) {
  try {
    const { google_signup_token } = req.cookies;

    if (!google_signup_token) {
      return res.status(401).json({
        message: "Google signup session expired",
      });
    }

    const decoded = jwt.verify(google_signup_token, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      email: decoded.email,
    });
  } catch (error) {
    console.error("Get Google Signup Data Error:", error);

    return res.status(401).json({
      message: "Google signup session expired",
    });
  }
}

// =========================================================
// COMPLETE GOOGLE PROFILE
// =========================================================
//
// Frontend sirf:
//
// firstName
// lastName
// password
//
// bhejega.
//
// EMAIL FRONTEND SE NAHI LENGE.
//
// Email temporary Google token se niklegi.
//
// =========================================================

async function completeGoogleProfile(req, res) {
  try {
    const { firstName, lastName, password } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!firstName?.trim() || !lastName?.trim() || !password) {
      return res.status(400).json({
        message: "First name, last name and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // =====================================================
    // GET TEMPORARY GOOGLE TOKEN
    // =====================================================

    const { google_signup_token } = req.cookies;

    if (!google_signup_token) {
      return res.status(401).json({
        message: "Google signup session expired",
      });
    }

    // =====================================================
    // VERIFY TOKEN
    // =====================================================

    const decoded = jwt.verify(google_signup_token, process.env.JWT_SECRET_KEY);

    const { googleId, email } = decoded;

    if (!googleId || !email) {
      return res.status(401).json({
        message: "Invalid Google signup session",
      });
    }

    // =====================================================
    // CHECK AGAIN
    // =====================================================

    const existingUser = await userModel.findOne({
      $or: [
        {
          email,
        },
        {
          googleId,
        },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Account already exists",
      });
    }

    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashPass = await bcrypt.hash(password, 10);

    // =====================================================
    // CREATE USER
    // =====================================================

    const user = await userModel.create({
      email,

      fullName: {
        firstName: firstName.trim(),

        lastName: lastName.trim(),
      },

      password: hashPass,

      googleId,

      authProvider: "google",
    });

    // =====================================================
    // GENERATE NORMAL JWT
    // =====================================================

    const token = generateToken(user._id);

    // =====================================================
    // REMOVE TEMPORARY COOKIE
    // =====================================================

    res.clearCookie("google_signup_token", {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // =====================================================
    // SET NORMAL JWT COOKIE
    // =====================================================

    res.cookie("token", token, getCookieOptions());

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      message: "Account created successfully",

      user: {
        _id: user._id,

        email: user.email,

        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Complete Google Profile Error:", error);

    return res.status(401).json({
      message: "Google signup session expired",
    });
  }
}

// =========================================================
// LOGOUT
// =========================================================

function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      message: "Error logging out",
    });
  }
}

module.exports = {
  loginUser,

  googleAuth,

  googleCallback,

  getGoogleSignupData,

  completeGoogleProfile,

  logoutUser,
};

/*
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function registerUser(req, res) {
  const {
    email,
    fullName: { firstName, lastName },
    password,
  } = req.body;

  const isUser = await userModel.findOne({ email });

  if (isUser) return res.status(401).json({ message: "User Already exists" });

  const hashPass = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email,
    fullName: {
      firstName: firstName,
      lastName: lastName,
    },
    password: hashPass,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
  res.cookie("token", token);

  res.status(201).json({
    message: "User registered Successfully",
    user: {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) return res.status(401).json({ message: "Unauthorized Access" });

  const isPass = await bcrypt.compare(password, user.password);

  if (!isPass) return res.status(401).json({ message: "Unauthorized Access" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
  res.cookie("token", token);

  res.status(201).json({
    message: "User logged In Successfully",
    user: {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    },
  });
}

module.exports = { registerUser, loginUser };
*/
