const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sliderDataRoutes = require('./routes/SliderDataRoutes');
const multer = require('multer');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB not connected', err))

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/authRoutes'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Define Schema and Model
const SliderData = mongoose.model('SliderData', new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    SQUARE_ft: Number,
    Rooms: Number,
    BudgetMin: Number,
    BudgetMax: Number,
    driveLink: String  // Change imagePath to driveLink for the Google Drive link
}));

// SliderData Route
app.post('/api/sliderData', async (req, res) => {
    try {
        const { name, email, phone, SQUARE_ft, Rooms, BudgetMin, BudgetMax, driveLink } = req.body;
        const newData = new SliderData({ name, email, phone, SQUARE_ft, Rooms, BudgetMin, BudgetMax, driveLink });
        await newData.save();
        res.json(newData);
    } catch (error) {
        console.error('Error saving slider data:', error);
        res.status(500).json({ error: 'Error saving slider data' });
    }
});

const feedbackSchema = new mongoose.Schema({
    feedback: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/api/feedback', async (req, res) => {
    try {
        const { feedback } = req.body;
        const newFeedback = new Feedback({ feedback });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback saved successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const developerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Developer = mongoose.model('Developer', developerSchema);

app.post('/api/dregister', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDeveloper = new Developer({ name, email, password: hashedPassword });
        await newDeveloper.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error registering developer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/dlogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const developer = await Developer.findOne({ email });
        if (!developer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, developer.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/getUsers', (req, res) => {
    SliderData.find()
        .then(users => res.json(users))
        .catch(err => res.json(err))
});

app.use('/api', sliderDataRoutes);

const port = 8000;
app.listen(port, () => console.log(`server is listening on port ${port}`))
