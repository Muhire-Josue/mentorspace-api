import db from '../model';

class mentorController {
  static async all(req, res) {
    const criterea = 'mentor';
    const { rows } = await db.query('SELECT * FROM users WHERE status=$1', [criterea]);
    const mentors = rows.map(function (item) {
      delete item.password;
      return item;
    });
    if (req.user.status === 'user' || req.user.status === 'admin') {
      res.status(200).json({
        status: 200,
        data: mentors,
      });
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }

  static async findMentorById(req, res) {
    try {
      const pId = parseInt(req.params.id);
      if (req.user.status === 'user') {
        if (Number.isInteger(pId)) {
          const { rows } = await db.query('SELECT * FROM users WHERE status=\'mentor\' AND id=$1', [pId]);
          if (rows.length > 0) {
            res.status(200).json({
              status: 200,
              id: rows[0].id,
              firstname: rows[0].firstname,
              lastname: rows[0].lastname,
              email: rows[0].email,
              address: rows[0].address,
              bio: rows[0].bio,
              expertise: rows[0].expertise,
              occupation: rows[0].occupation,
              userStatus: rows[0].status
            });
          } else {
            res.status(404).json({
              status: 404,
              error: 'Mentor not found',

            });
          }
        } else {
          res.status(400).json({
            status: 400,
            error: 'Please provide a valid ID',
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
    } catch (error) {
      console.log(error);

    }
  }
  static async acceptSession(req, res) {
    if (req.user.status === 'mentor') {
      const id = req.params.sessionId;
      const { rows } = await db.query('SELECT * FROM sessions WHERE "sessionId"=$1', [id]);
      if (rows[0]) {
        if (req.user.id === rows[0].mentorId) {
          if (rows[0].status === 'accept') {
            return res.status(409).json({
              status: 409,
              message: 'Session already accepted',
            });
          }
            const text = `UPDATE sessions SET status=$1 WHERE "sessionId"=${id} RETURNING *`;
            const values = ['accept'];
           const data =  await db.query(text, values);
           
            return res.status(200).json({
              status: 200,
              message: 'Session has been accepted',
              data: data.rows[0]
            });
          
        } else {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized operation',
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          message: 'Session not found',
        });
      }
    } else {
      return res.status(400).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }

  static async rejectSession(req, res) {
    try {
      if (req.user.status === 'mentor') {
        const id = req.params.sessionId;
        const { rows } = await db.query('SELECT * FROM sessions WHERE "sessionId"=$1', [id]);
        if (rows[0]) {
          if (req.user.id === rows[0].mentorId) {
            if (rows[0].status === 'reject') {
              return res.status(409).json({
                status: 409,
                message: 'Session already rejected',
              });
            }
            const text = `UPDATE sessions SET status=$1 WHERE "sessionId"=${id} RETURNING *`;
            const values = ['reject'];
            const data = await db.query(text, values);
            res.status(200).json({
              status: 200,
              message: 'Session rejected successfully!',
              data: data.rows[0]
            });
          } else {
            res.status(401).json({
              status: 401,
              error: 'Unauthorized operation',
            });
          }
        } else {
          res.status(404).json({
            error: 404,
            message: 'User not found',
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default mentorController;