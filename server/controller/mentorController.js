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
         if(Number.isInteger(pId)){
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
}

export default mentorController;
