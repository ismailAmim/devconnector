const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
/* const config = require('config');
const {
    check,
    validationResult
} = require('express-validator'); */



const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');


const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation 
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).
        then(user => {
            if (user) {
                errors.email = 'Email already exists';
                res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size,
                    r: 'pg', // rating,
                    d: 'mm' //Default
                });
                const newUser = new User({
                    fname: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));

                    });
                });
            }
        });
});


// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post(
    '/login',
    (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);
        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;

        //Find user by email
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    errors.email = 'User not found';
                    return res.status(404).json(errors);
                }
                // Check password
                bycrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            //User Matched
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            };
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer' + token
                                    });
                                }
                            );
                        } else {
                            errors.password = 'Password incorrect';
                            return res.status(400).json(errors);
                        }
                    });
            });
    });

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            fname: req.user.name,
            email: req.user.email
        });
    }
);




// @route       GET api/users
// @desc        Test route
// @access      Public
/* router.get('/', (req, res) => 
        res.send('User route')); */
/* 
router.post('/',
    [
        check('fname', 'Name is required').not().isEmpty(),
        check('email', 'please include a valid email').isEmail(),
        check('password', 'please enter a password with 6 or more characters').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            fname,
            email,
            password
        } = req.body;

        // See if user exists
        try {
            let user = await User.findOne({
                email
            });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: "User already exists"
                    }]
                });
            }
            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = new User({
                fname,
                email,
                avatar,
                password
            });
            // Encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            // Return jsonwebtoken

            const payload = {
                user: {
                    // in mongoose we don't need _id
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                expireIn: 360000
            },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                })
            console.log(req.body);
            res.send('User registered');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    }) */



module.exports = router;