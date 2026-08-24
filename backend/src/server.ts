import app from "./app.js";
import { config } from "./config/env.js";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 E-Commerce Big Data Analytics Platform — API Backend`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`📊 Mode: ${config.dataMode.toUpperCase()} MODE`);
  console.log(`=======================================================`);
});
