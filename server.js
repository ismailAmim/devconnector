const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
//const auth = require('./routes/api/auth');

//const connectDB = require('./config/db');



const app = express();
// connect Database 
//connectDB();

// Init MiddleWare
// app.use(express.json({
//     extented: false
// }));

//app.get('/', (req, res) => res.send('API Running'));


//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config 
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);


// Define Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
//app.use('/api/auth', auth);
app.use('/api/posts', posts);

// Define Routes
/* app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`server started on port ${PORT}`));