const express = require('express');
const router = express.Router();
const passport = require('passport');
// const auth = require('../../middleware/auth');

// const request = require('request');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


const Profile = require('../../models/Profile');
const User = require('../../models/User');
//const Post = require('../../ models / Post');


// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));


// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {};
        Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = 'There is no for this user';
                    res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    })

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get(
    '/all',
    (req, res) => {
        const errors = {};
        Profile.find()
            .populate('user', ['name', 'avatar'])
            .then(profiles => {
                if (!profiles) {
                    errors.noprofile = 'There are no profiles';
                    return res.status(404).json(errors);
                }
                res.json(profiles);
            })
            .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
    });

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get(
    '/handle/:handle',
    (req, res) => {
        const errors = {};
        Profile.findOne({ handle: req.params.handle })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = 'There is no profile for this user';
                    res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    });


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get(
    '/user/:user_id',
    (req, res) => {
        const errors = {};

        Profile.findOne({ user: req.params.user_id })
            .then(profile => {
                if (!profile) {
                    errors.noprofile = " There is no profile for this user";
                    res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
    });
// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body)
        if (!isValid)
            return res.status(400).json(errors);
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        if (typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',');

        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    //Update
                    Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    ).then(profile => res.json(profile));
                } else {
                    // Create new 
                    Profile.findOne({ handle: profileFields.handle })
                        .then(profile => {
                            if (profile) {
                                errors.handle = 'That handle already exists';
                                res.status(400).json(errors);
                            }
                            // Save profile
                            new Profile(profileFields).save().then(profile => res.json(profile));
                        });
                }
            });
    });

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExperienceInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    decription: req.body.decription
                }
                // Add to exp array
                profile.experience.unshift(newExp);
                // save
                profile.save().then(profile => res.json(profile));
            });
    });

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private

router.post(
    '/education',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEducationInput(errors);
        if (!isValid)
            return res.status(400).json(errors);

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const newEdu = {
                    school: req.body.school,
                    dergree: req.body.dergree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                }
                //Add to edu array
                profile.education.unshift(newEdu);

                profile.save().then(profile => res.json(profile));
            });
    });
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    '/experience/:exp_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                // Get remove index 
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);
                // splice out array 
                profile.experience.splice(removeIndex, 1);
                // save 
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    });
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id);
                // splice array
                profile.education.splice(removeIndex, 1);
                // save
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    });

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findByIdAndRemove({ user: req.user.id })
            .then(() => {
                User.findByIdAndRemove({ _id: req.user.id })
                    .then(() => res.json({ success: true })
                    );
            })
    }
);


/* const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');

// @route       GET api/Profile/me
// @desc        GET current users profile
// @access      private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'there is no profile for this user'
            });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route       POST api/Profile/me
// @desc        create or update  users profile
// @access      private
router.post('/', [auth, [
    check('status', 'status is required')
        .not()
        .isEmpty(),
    check('skills', 'skills is required')
        .not()
        .isEmpty()
]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram
        } = req.body;

        // Build profile object

        const profileFields = {};
        profileFields.user = req.user.id;
        if (website) profileFields.website = website;
        if (company) profileFields.company = company;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;

        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        //Build social Object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = Profile.findOne({
                user: req.user.id
            });
            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                });

                return res.json(profile);
            }
            // Create  if doesn't exists
            profile = new Profile(profileFields);
            await Profile.save();
            res.json(profile);

        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


        //res.send('Hello');
    });

// @route       GET api/Profile/
// @desc        get all profiles
// @access      public
router.get('/', async (req, res) => {

    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

// @route       GET api/Profile/user/:user_id
// @desc        get profile by  id
// @access      public
router.get('/user/:user_id', async (req, res) => {

    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile)
            return res.status(400).json({
                msg: 'Profile not found'
            });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId')
            return res.status(400).json({
                msg: 'Profile not found'
            });

        res.status(500).send('Server Error');
    }
});

// @route       DELETE api/Profile
// @desc        DELETE profile , user & posts
// @access      public
router.delete('/', async (req, res) => {

    try {

        // Todo Remove user posts
        await Post.DeleteMany({
            user: req.user.id
        });
        // remove profile 
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        // remove user 
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json("User deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route       PUT api/Profile/experience
// @desc        add profile experience
// @access      public

router.put('/experience', [auth, [
    check('title', 'Title is required ')
        .not()
        .isEmpty(),
    check('company', 'company is required ')
        .not()
        .isEmpty(),
    check('from', 'from is required ')
        .not()
        .isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route       DELETE api/Profile/experience/:exp_id
// @desc        DELETE experience
// @access      public
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        //GET remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route       PUT api/Profile/education
// @desc        add profile education
// @access      public

router.put('/education', [auth, [
    check('school', 'is required ')
        .not()
        .isEmpty(),
    check('degree', 'degree is required ')
        .not()
        .isEmpty(),
    check('fieldofstudy', 'field of study is required ')
        .not()
        .isEmpty(),
    check('from', 'from is required ')
        .not()
        .isEmpty(),
    check('Title', 'Title is required ')
        .not()
        .isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        Title,
        from,
        to,
        current,
        description
    } = req.body;
    const newEd = {
        school,
        degree,
        fieldofstudy,
        Title,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.education.unshift(newEd);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route       DELETE api/Profile/experience/:ed_id
// @desc        DELETE education
// @access      public
router.delete('/education/:ed_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        //GET remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.ed_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route       GET api/Profile/github/:username
// @desc        get user repos from github
// @access      public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            url: `https://api.github.com/users/${
                req.params.username
                }/repos?per_page=5&sort=created:asc&client_id=${
                config.get('githubClientId')
                }&client_secret =${config.get('githubSeret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (error, reponse, body) => {
            if (error) console.error(error);

            if (Response.statusCode !== 200) {
                return res.status(404).json({
                    msg: "No github profile found"
                });
            }
            res.json(JSON.parse(body));
        });

    } catch (err) {
        res.status(500).send('Error server');
    }
})
 */
module.exports = router;