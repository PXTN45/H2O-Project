import express, { Request, Response } from "express";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import packgeRouter from "./routes/package.router";
import homeStayRouter from "./routes/homestay.router"
import userRouter from "./routes/user.router";
import jwt  from "jsonwebtoken";
const cookieParser = require("cookie-parser");


// Load environment variables from .env file
dotenv.config();

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "H2O API Project",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  externalDocs: {
    description: "Download Swagger.json",
    url: "/swagger.json",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      Location: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID of the location',
          },
          name: {
            type: 'string',
            description: 'Name of the location',
          },
          
        },
      },
      Image: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID of the image',
          },
          url: {
            type: 'string',
            description: 'URL of the image',
          },
         
        },
      },
    },
  },  
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: ["src/routes/package.router.ts", "src/routes/homestay.router.ts"], // Adjust this if the paths to the routes change
  connectTimeoutMS: 10000, // Set timeout for the connection
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Generate Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Create Express app
const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Middleware setup
app.use(cors({
  credentials: true,
  origin: CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // ต้องการระบุเมธอดที่อนุญาต
  allowedHeaders: ['Content-Type', 'Authorization'], // กำหนด header ที่อนุญาต
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || "";
mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.error("disconnected", error);
  });

// Swagger setup
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req: Request, res: Response) => {
  res.header("Content-Type", "application/swagger.json");
  res.send(swaggerSpec);
});

// Routes
app.use("/",homeStayRouter)
app.use("/", packgeRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1> Welcome to H2O Project</h1>");
});

app.post("/jwt", async (req: Request, res: Response) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
  res.send({ token });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running  on http://localhost:" + PORT);
});
