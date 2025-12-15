import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 3001;

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// In-memory counter
let counter = 0;

// Home page
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Health check (JSON)
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Server status (returns HTML fragment)
app.get("/api/status", (req: Request, res: Response) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  res.send(`<div id="status-content">
    <div class="info-row">
      <span class="info-label">Status</span>
      <span class="info-value success">Online</span>
    </div>
    <div class="info-row">
      <span class="info-label">Uptime</span>
      <span class="info-value mono">${uptimeStr}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Memory</span>
      <span class="info-value mono">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</span>
    </div>
  </div>`);
});

// API: Echo message (returns HTML fragment)
app.post("/api/echo", (req: Request, res: Response) => {
  const message = req.body.message || "No message received";
  const timestamp = new Date().toLocaleTimeString();

  res.send(`<div id="echo-response" class="response-box">
    <span class="echo-message">"${message}"</span>
    <span class="echo-timestamp">Echoed at ${timestamp}</span>
  </div>`);
});

// API: Counter increment
app.post("/api/counter/increment", (req: Request, res: Response) => {
  counter++;
  res.send(`<div id="counter-display" class="counter-value">${counter}</div>`);
});

// API: Counter decrement
app.post("/api/counter/decrement", (req: Request, res: Response) => {
  counter--;
  res.send(`<div id="counter-display" class="counter-value">${counter}</div>`);
});

// API: Counter reset
app.post("/api/counter/reset", (req: Request, res: Response) => {
  counter = 0;
  res.send(`<div id="counter-display" class="counter-value">${counter}</div>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
