import User from '../model/user';
import sucess from '../helper/endPointResponse/sucess';
import failure from '../helper/endPointResponse/failure';

class adminController {
  static userToMentor(req, res) {
    if (req.user.status === 'admin') {
      const userIndex = User.findIndex(u => u.id === parseInt(req.params.userId));
      if (User[userIndex].status === 'user') {
        User[userIndex].status = 'mentor';
        const data = sucess('User account changed to mentor', 200, User[userIndex]);
        res.status(data.status).json({
          status: data.status,
          message: data.data,
          data: User[userIndex],
        });
      } else {
        const data = failure('User is already a mentor', 400);
        res.status(data.status).json({
          status: data.status,
          error: data.message,
        });
      }
    } else {
      const data = failure('Unauthorized access', 401);
      res.status(data.status).json({
        status: data.status,
        error: data.message,
      });
    }
  }
}

export default adminController;
