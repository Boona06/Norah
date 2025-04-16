import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 10000;

// Body parser-ийг тохируулна
app.use(bodyParser.json());

// /webhook маршрутын тохиргоо
app.post("/webhook", (req, res) => {
  const userMessage = req.body.message;
  console.log("Message received:", userMessage);
  res.status(200).send("Webhook received successfully");
});

// Серверийг ажиллуулах
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
