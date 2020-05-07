const jwt = require('jsonwebtoken');

const withAuth = function(req, res, next) {
    console.log(3)
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.token = decoded.token;
                next();
            }
        });
    }
};

module.exports = withAuth;