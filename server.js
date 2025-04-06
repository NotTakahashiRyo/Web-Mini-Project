const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Fix: Proper CORS configuration
const corsOptions = {
  origin: 'http://localhost:5000',  // Make sure this matches your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Allow preflight for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/electionDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected 🚀"))
.catch(err => console.error("MongoDB connection error:", err));

// Election Results Schema
const electionResultSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  totalVotes: { type: Number, required: true },
  parties: [
    {
      name: { type: String, required: true },
      votes: { type: Number, required: true },
      color: { type: String, required: true } // For chart colors
    }
  ]
});

const ElectionResult = mongoose.model('ElectionResult', electionResultSchema);

// Sample data creation function
async function createSampleData() {
  try {
    const exists = await ElectionResult.exists({ year: 2024 });
    if (!exists) {
      await ElectionResult.create([
        {
          year: 2024,
          totalVotes: 5000000,
          parties: [
            { name: "Party A", votes: 2000000, color: "#FF6384" },
            { name: "Party B", votes: 1500000, color: "#36A2EB" },
            { name: "Party C", votes: 1000000, color: "#FFCE56" },
            { name: "Party D", votes: 500000, color: "#4BC0C0" }
          ]
        },
        {
          year: 2020,
          totalVotes: 4500000,
          parties: [
            { name: "Party A", votes: 1800000, color: "#FF6384" },
            { name: "Party B", votes: 1200000, color: "#36A2EB" },
            { name: "Party C", votes: 900000, color: "#FFCE56" },
            { name: "Party D", votes: 600000, color: "#4BC0C0" }
          ]
        }
      ]);
      console.log("Sample election data created");
    }
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
}
createSampleData();

// API Routes for election results
app.get('/api/election-results', async (req, res) => {
  try {
    console.log("Fetching all election results");
    const results = await ElectionResult.find().sort({ year: -1 });
    console.log(`Found ${results.length} results`);
    res.json(results);
  } catch (err) {
    console.error("Error fetching election results:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/election-results/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    console.log(`Fetching election results for year: ${year}`);
    const result = await ElectionResult.findOne({ year });
    
    if (!result) {
      console.log(`No results found for year: ${year}`);
      return res.status(404).json({ error: "Result not found" });
    }
    
    console.log(`Found results for year: ${year}`);
    res.json(result);
  } catch (err) {
    console.error(`Error fetching election results for year ${req.params.year}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); // All user routes will be prefixed with /api/users

// Test Route
app.get("/api", (req, res) => {
  res.send("API is working!");
});

// Debug: List all routes
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`);
  } else if (layer.name === 'router') {
    // Handle router middleware
    layer.handle.stack.forEach((sublayer) => {
      if (sublayer.route) {
        console.log(`${sublayer.route.stack[0].method.toUpperCase()} /api/users${sublayer.route.path}`);
      }
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`View the election results at http://localhost:${PORT}/results.html`);
});