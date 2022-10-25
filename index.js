const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

mongoose
  .connect(`mongodb://localhost:27017/crm`)
  .then(() => console.log("DB connection successful!"));

const userRouter = require("./routers/users.routes");
const contactRouter = require("./routers/contacts.routes");
const campaignRouter = require("./routers/campaigns.routes");

app.use("/api/users", userRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/campaigns", campaignRouter);

app.get("/", (_, res) => {
  res.json({ message: "ok" });
});

app.listen(3000, () => {
  console.log("App listening");
});
