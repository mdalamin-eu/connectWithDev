const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect Database
connectDB();

// passport middleware

app.use(passport.initialize());

// passport config

require("./config/passport")(passport);
app.get("/", (req, res) => res.send("API Running"));

// Define routes

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));
