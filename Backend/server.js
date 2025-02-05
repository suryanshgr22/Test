const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Note = require('./models/Note');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Test1')
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Error", err);
  });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

app.get('/', (req, res) => {
  res.send('Hello');
});

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.get('/api/notes', authenticate, async (req, res) => {
  const notes = await Note.find({ createdBy: req.user.id }).sort({ createdAt: 1 });
  res.json(notes);
});

app.post('/api/notes', authenticate, async (req, res) => {
  try {
    const { title, text } = req.body;
    const note = await Note.create({ createdBy: req.user.id, title, text });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Error creating note" });
  }
});

app.put('/api/notes/:id', authenticate, async (req, res) => {
  try {
    const { title, text } = req.body;
    const note = await Note.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, { title, text }, { new: true });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Error updating note" });
  }
});

app.delete('/api/notes/:id', authenticate, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.send("Note deleted");
  } catch (error) {
    res.status(500).json({ error: "Error deleting note" });
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
