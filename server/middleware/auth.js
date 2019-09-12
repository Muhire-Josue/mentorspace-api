import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader === 'undefined'){
        return res.status(401).json({
            status_code: 401,
            message: 'Token not provided',
        });
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return jwt.verify(req.token, process.env.API_SERCRET_KEY, (error, data) => {
        if (error) {
            return res.status(401).json({
                status_code: 401,
                error: error.message
            });
        } else {
            req.user = data;
            next();
        }
    });
}

export default auth;