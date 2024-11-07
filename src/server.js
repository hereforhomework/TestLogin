import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import session from 'express-session';

dotenv.config({ path: '../.env' }); 

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true
}));

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,  
            httpOnly: true,
            maxAge: 3600000  
        }
    })
);

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME  
});

// Register Route
app.post('/signup', async (req, res) => {
    const { name, email, password, userType } = req.body;
    if (!['kol', 'brand'].includes(userType)) {
        return res.status(400).json({ error: 'Invalid user type' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (name, email, password, userType) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, userType],
        (err) => {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.status(201).json({ message: 'User registered' });
        }
    );
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, users) => {
        if (err || users.length === 0) return res.status(400).json({ error: 'User not found' });
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType
        };
        res.json({ message: 'Login successful', user: req.session.user });
    });
});

// Check Session Route
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'No active session' });
    }
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Failed to log out' });
        res.json({ message: 'Logged out successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
