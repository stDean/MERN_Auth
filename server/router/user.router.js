const express = require('express');
const router = express.Router();

const AuthAdminMiddleware = require('../middleware/authAdmin.middleware');
const UserController = require('../controllers/user.controller');
const {
  getAllUser, getUser, updateUser, updateUserRole, deleteUser
} = UserController;

router.route('/').get(AuthAdminMiddleware, getAllUser);
router.route('/info').get(getUser)
router.route('/update').patch(updateUser);
router.route('/:id').patch(updateUserRole).delete(deleteUser);


module.exports = router;