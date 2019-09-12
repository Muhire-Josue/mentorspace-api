import db from '../model/index';

class adminController {
    static async userToMentor(req, res) {
        if (req.user.status === 'admin') {
            const id = parseInt(req.params.userId);
            if (!Number.isInteger(id)) {
               return res.status(400).json({
                    status_code: 400,
                    error: 'Please provide a valid ID',
                });
            }
            const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
            if (!rows[0]) {
                return res.status(404).json({
                    status_code: 404,
                    error: 'User not found',
                });
            }
            if (rows[0].status === 'user') {

                const text = `UPDATE users SET status=$1 WHERE id=${id} RETURNING *`;
                const values = ['mentor'];
                await db.query(text, values);
                return res.status(200).json({
                    status_code: 200,
                    message: 'User account changed to mentor Sucessfully',
                });
            } else {
                return res.status(409).json({
                    status_code: 409,
                    error: 'User is already a mentor',
                });
            }
        } else {
            return res.status(401).json({
                status_code: 401,
                error: 'Unauthorized access',
            });
        }
    }
}

export default adminController;
