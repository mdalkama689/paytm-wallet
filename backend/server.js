import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await connectDB();
  console.log("backend is running : ", PORT);
});
