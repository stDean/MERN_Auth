require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload")

const connectDB = require('./connect/db');

// middleware
const RouteNotFound = require('./middleware/notFound.middleware');
const ErrorHandling = require('./middleware/errorHandling.middleware');
const AuthMiddleware = require('./middleware/auth.middleware');
const UploadMiddleware = require('./middleware/upload.middleware');

// routers
const AuthRouter = require('./router/auth.router');
const UserRouter = require('./router/user.router');
const UploadRouter = require('./router/upload.router');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
}));

// routes
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/user', AuthMiddleware, UserRouter);
app.use('/api/v1/user_avatar', UploadMiddleware, AuthMiddleware, UploadRouter);

app.use(RouteNotFound);
app.use(ErrorHandling);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
}

start();