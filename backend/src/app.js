const express = require("express");

const cors = require("cors");

const AuthRouter = require("./routes/auth.routes");

const ChatRouter = require("./routes/chat.routes");

const cookieParser = require("cookie-parser");

const app = express();

// =========================================================
// CORS
// =========================================================

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],

    credentials: true,
  }),
);

// =========================================================
// BODY PARSER
// =========================================================

app.use(express.json({ limit: "10mb" }));

// =========================================================
// COOKIE PARSER
// =========================================================

app.use(cookieParser());

// =========================================================
// ROUTES
// =========================================================

app.use("/api/auth", AuthRouter);

app.use("/api/chat", ChatRouter);

module.exports = app;

/*
const express = require("express");
const AuthRouter = require("./routes/auth.routes");
const ChatRouter = require("./routes/chat.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRouter);

app.use("/api/chat", ChatRouter);

module.exports = app;
*/
