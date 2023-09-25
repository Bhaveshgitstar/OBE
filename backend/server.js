const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());

/*const { RecaptchaV2 } = require('express-recaptcha');

const recaptcha = new RecaptchaV2({
    siteKey: process.env.RECAPTCHA_SITE_KEY,         // Use environment variables for configuration
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
});*/
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/course_outcome', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

const moduleSchema = new mongoose.Schema(
    {
        ModuleNo: Number, // Use Number instead of Int32
        ModuleTitle: String,
        Topics: String,
        NoOfLectures: Number // Use Number instead of Int32
    },
    { versionKey: false }
);

const CourseOutcomeModule = mongoose.model('CourseOutcomeModule', moduleSchema, 'course_outcome');

app.use(express.static(path.join(__dirname, 'frontend')));

app.use(session({
    secret: 'your-secret-key', // Change this to a secret key
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
});

// Example user data (replace with your database logic)
const users = [
    {
        username: 'admin',
        password: '$2b$10$T18kGWmjOJgHrW9sGZd.lOi2FmMShtCf6TR9sFvKANMn14dKfR/zp', // Hashed password for 'adminpassword'
    },
];

app.post('/admin-login', recaptcha.middleware.verify, async (req, res) => {
    // Verify reCAPTCHA response
    /*if (!req.recaptcha.error) {*/
        // CAPTCHA verification passed, check admin credentials and redirect
        const { username, password } = req.body;

        // Find the user by username (replace with your database query)
        const user = users.find(u => u.username === username);

        if (user && await bcrypt.compare(password, user.password)) {
            // Admin verified, store session and redirect to admin dashboard or another page
            req.session.username = username;
            return res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
        } else {
            // Admin credentials incorrect, return an error message
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }
    } 
);

app.get('/api/modules', async (req, res) => {
    try {
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/api/modules', async (req, res) => {
    const newModule = new CourseOutcomeModule({
        ModuleNo: req.body.ModuleNo,
        ModuleTitle : req.body.ModuleTitle,
        Topics : req.body.Topics,
        NoOfLectures: req.body.NoOfLectures
    });

    newModule.save();
    return res.redirect('back');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
