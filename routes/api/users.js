const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');

const User = require('../../models/User');
// @route       GET api/users
// @desc        Test route
// @access      Public
/* router.get('/', (req, res) => 
        res.send('User route')); */

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

    })



module.exports = router;