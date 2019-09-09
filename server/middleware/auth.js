import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];


    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return jwt.verify(req.token, process.env.API_SERCRET_KEY, (error, data) => {
        if (error) {
            return res.status(401).json({
                status: 401,
                message: 'please login first or sign up',
                error
            });
        } else {
            req.user = data;
            next();
        }
    });
}

export default auth;