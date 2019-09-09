import db from '../model';


class mentorController {

  static async all(req, res) {
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
  }  
}

export default mentorController;
