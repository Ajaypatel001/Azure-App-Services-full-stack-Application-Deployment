import express from "express";
import mysql from "mysql2";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));

// ✅ DB Connection with timeout to prevent hanging
let dbConnected = false;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || "test",
  connectTimeout: 10000, // ✅ 10 second timeout instead of hanging forever
  ssl: {
    rejectUnauthorized: false, // ✅ Azure ke liye important
  },
});

// ✅ DB connection test
db.connect((err) => {
  if (err) {
    console.log("DB connection failed ❌", err.message);
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USERNAME:", process.env.DB_USERNAME);
    console.log("DB_NAME:", process.env.DB_NAME || "test");
    console.log("DB_PORT:", process.env.DB_PORT || 3306);
    dbConnected = false;
  } else {
    console.log("DB connected ✅");
    dbConnected = true;
  }
});

// ✅ Middleware to check DB before hitting DB routes
const checkDb = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({
      error: "Database not connected",
      message: "The server cannot reach the database. Please check DB configuration.",
    });
  }
  next();
};

// ✅ ROUTES
app.get("/", (req, res) => {
  res.json({
    message: "Backend working 🚀",
    dbStatus: dbConnected ? "Connected ✅" : "Disconnected ❌",
  });
});

app.get("/books", checkDb, (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log("GET /books error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res.json(data);
  });
});

app.post("/books", checkDb, (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?, ?, ?, ?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log("POST /books error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res.json(data);
  });
});

app.delete("/books/:id", checkDb, (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.log("DELETE /books error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res.json(data);
  });
});

app.put("/books/:id", checkDb, (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
    bookId
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log("PUT /books error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res.json(data);
  });
});

// ✅ FIXED SERVER PORT (don't use PORT=3306 in .env!)
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
