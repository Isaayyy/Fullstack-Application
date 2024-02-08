const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
//const{mongoose} = require('mongoose')
const mongoose = require('mongoose'); 
const multer = require('multer');

// Create Express app
const app = express();

// Set up CORS
app.use(cors({
        origin: ["https://nlsw-frontend.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        //origin: 'http://localhost:5173',
        credentials: true
    }));

// Parse JSON bodies
app.use(express.json());

// // Create memory storage for multer
// const storage = multer.memoryStorage();

// // Initialize multer with memory storage
// const upload = multer({ storage: storage });


// Connecting Mongoose :3
// mongoose.connect(process.env.MONGO_URL)
mongoose.connect('mongodb+srv://nlswadmin01:NLSWdb1977@cluster0.o3qtadl.mongodb.net/test?retryWrites=true&w=majority')
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Database not Connected :(' , err))

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));


app.use('/auth', require('./routes/authRoutes'))
app.use('/eventvolunteer', require('./routes/eventVolunteer'))
app.use('/prayerrequests', require('./routes/prayerRoutes'));
app.use('/event', require('./routes/eventRoutes'));
app.use('/volunteer', require('./routes/volunteerRoutes'));
app.use('/connectgroup', require('./routes/connectgroupRoutes'));
app.use('/pastorial', require('./routes/pastorialRoutes'));
