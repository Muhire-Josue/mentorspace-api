import db from '../model';


class mentorController {
  /**
   * @param {object} req 
   * @param {object} res 
   * @return all Mentors
   */
  static async all(req, res) {
    const criterea = 'mentor';
    // const mentors = Mentor.filter(m => m.status === 'mentor');
    const { rows } = await db.query('SELECT * FROM users WHERE status=$1', [criterea]);
    const mentors = rows;
    if (req.user.status === 'user' || req.user.status === 'admin') {
      res.status(200).json({
        status: 200,
        mentors,
      });
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }

  // Get a mentor
  static async findMentorById(req, res) {
    const pId = parseInt(req.params.id);
    const { rows } = await db.query('SELECT * FROM users WHERE status=\'mentor\' AND id=$1', [pId]);
    if (req.user.status === 'user') {
      // const mentor = mentors.find(m => m.id === parseInt(req.params.id));
      if (rows.length > 0) {
        res.status(200).json({
          status: 200,
          data: rows,
        });
      } else {
        res.status(404).json({
          status: 404,
          error: 'Mentor not found',

        });
      }
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }


  // Accept session
  static async acceptSession(req, res) {
    if (req.user.status === 'mentor') {
      const id = req.params.sessionId;
      // const session = Session.find(s => s.sessionId === parseInt(id));
      const { rows } = await db.query('SELECT * FROM sessions WHERE "sessionId"=$1', [id]);
      if (rows[0]) {
        if (req.user.id === rows[0].mentorId) {
          const text = `UPDATE sessions SET status=$1 WHERE "sessionId"=${id} RETURNING *`;
          const values = ['accept'];
          await db.query(text, values);
          res.status(200).json({
            status: 200,
            message: 'Session has been accepted'
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
          message: 'Session not found',
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        error: 'Unauthorized access',
      });
    }
  }

  // Reject session
  static async rejectSession(req, res) {
    try {
      if (req.user.status === 'mentor') {
        const id = req.params.sessionId;
        // const session = Session.find(s => s.sessionId === parseInt(id));
        const { rows } = await db.query('SELECT * FROM sessions WHERE "sessionId"=$1', [id]);
        if (rows[0]) {
          if (req.user.id === rows[0].mentorId) {
            const text = `UPDATE sessions SET status=$1 WHERE "sessionId"=${id} RETURNING *`;
            const values = ['reject'];
            await db.query(text, values);
            res.status(200).json({
              status: 200,
              message: 'Session rejected successfully!'
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
