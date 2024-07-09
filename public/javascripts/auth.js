const jwt = require('jsonwebtoken');
const conf = require('../../jwt_secret/config');
const User = require('../../models/user');

const maxAge = 8 * 60 * 60;

/* Require log in before entering a page */
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    /* Check if yum yum cookie exists and is verified */
    if (token) {
        jwt.verify(token, conf.secret, (err, decodedToken) => {
            if (err) res.redirect('/auth/login');
            next();
        });
    } else {
        res.redirect('/auth/login');
    }
}

/* Require admin access */
const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if yum yum cookie exists and is verified
    if (token) {
        jwt.verify(token, conf.secret, (err, decodedToken) => {
            if (err) res.redirect('/auth/login');
            // Check if the user is an admin
            if (decodedToken.admin === true) {
                next();
            } else {
                res.redirect('/user/dashboard'); //change
            }
        });
    } else {
        res.redirect('/auth/login');
    }
}

const doubleLoginPrevention = (req, res, next) => {
    const token = req.cookies.jwt;

    /* Check if yum yum cookie exists and is verified */
    if (token) {
        jwt.verify(token, conf.secret, (err, decodedToken) => {
            if (err) next();
            res.redirect('/user/dashboard');
        });
    } else {
        next();
    }
}

/* Check for login yum yum cookies are in effect */
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    /* Check if yum yum cookie exists and is verified */
    if (token) {
        jwt.verify(token, conf.secret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;
            next();
        });
    } else {
        res.locals.user = null;
        next();
    }
}

/* Handle Errors */
const handleErrors = (err) => {
    let errs = { username: '', email: '', pass: '' };

    /* login error */
    if (err.message.includes('Email or Password incorrect.')) {
        return { msg: 'Email or Password incorrect.' };
    }

    /* duplicate user (email) error handeling */
    if (err.code === 11000) {
        errs.email = 'Email already in use.';
        return errs;
    }

    /* error validation */
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errs[properties.path] = properties.message;
        });
    }

    return errs;
}

/* Create yum yum cookies */
const createToken = (id, admin) => {
    return jwt.sign({ id, admin }, conf.secret, {
        expiresIn: maxAge
    })
}

module.exports = { requireAuth, doubleLoginPrevention, requireAdmin, checkUser, handleErrors, createToken, maxAge };