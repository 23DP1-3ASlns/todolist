import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// 🔌 Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://liltacc7:jVGe6J2kSFDHtvlv@artissilins.hrfinbe.mongodb.net/taskDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 Connected to MongoDB Atlas'))
.catch(err => console.error('🔴 MongoDB Atlas connection error:', err));

// 📦 Task model
const Task = mongoose.model('Task', {
  title: String,
  description: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

// 📄 Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// 📥 Get all tasks
app.get('/tasks', async (req, res) => {
  res.json(await Task.find({}));
});

// 🆕 Create task
app.post('/tasks', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await task.save();
  res.send('Task created!');
});

// 🔁 Update task status
app.put('/tasks/:id', async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
    updatedAt: new Date()
  });
  res.send(`Task with ID ${req.params.id} updated!`);
});

// ❌ Delete task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send(`Task with ID ${req.params.id} deleted!`);
});

// 🚀 Start server
const port = 3000;
app.listen(port, () => {
  console.log(`⚡ App listening at http://localhost:${port}/tasks`);
});
