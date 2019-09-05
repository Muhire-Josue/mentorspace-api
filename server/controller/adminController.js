import User from '../model/user';

class adminController {
  // Change user to mentor
  static userToMentor(req, res) {
    if (req.user.status === 'admin') {
      const userIndex = User.findIndex(u => u.id === parseInt(req.params.userId));
      if (User[userIndex].status === 'user') {
        User[userIndex].status = 'mentor';
        res.status(200).json({
          status: 200,
          message: 'User account changed to mentor',
          data: User[userIndex],
        });
      } else {
        res.status(400).json({
          status: 400,
          error: 'User is already a mentor',
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
  }
}

export default adminController;
