import db from '../model';


class mentorController {

  static async all(req, res) {
    
    try {
      const criterea = 'mentor';
      const { rows } = await db.query('SELECT * FROM users WHERE status=$1', [criterea]);
      const mentors = rows;
      if (req.user.status === 'user' || req.user.status === 'admin') {
        const allMentors = mentors.map(function(item) { 
          delete item.password; 
          return item; 
      });
        res.status(200).json({
          status: 200,
          data: allMentors,
        });
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

  static async findMentorById(req, res) {
    try {
      const pId = parseInt(req.params.id);
      if (req.user.status === 'user' && Number.isInteger(pId)) {
        const { rows } = await db.query('SELECT * FROM users WHERE status=\'mentor\' AND id=$1', [pId]);
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
      
    } catch (error) {
      console.log(error);
      
    }
  }
}

export default mentorController;
