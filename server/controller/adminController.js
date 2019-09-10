import db from '../model/index';

class adminController {
    static async userToMentor(req, res) {
        if (req.user.status === 'admin') {
            const id = parseInt(req.params.userId);
            const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 404,
                    message: 'User not found',
                });
            }
            if (rows[0].status === 'user') {

                const text = `UPDATE users SET status=$1 WHERE id=${id} RETURNING *`;
                const values = ['mentor'];
                await db.query(text, values);
                return res.status(200).json({
                    status: 200,
                    message: 'User account changed to mentor',
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    error: 'User is already a mentor',
                });
            }
        } else {
            return res.status(401).json({
                status: 401,
                error: 'Unauthorized access',
            });
        }
    }
}

export default adminController;
