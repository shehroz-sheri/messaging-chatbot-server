const express = require('express');
const { handleUserRegister, handleUserLogin, handleGetAllUsers, handleGetCurrentUser, handleUpdateUser, handleDeleteUser } = require('../controllers/user');

const router = express.Router()

router.post('/register', handleUserRegister)
router.post('/login', handleUserLogin)

router.get('/get-all-users', handleGetAllUsers)
router.get('/get-current-user', handleGetCurrentUser)

router.delete('/delete-user', handleDeleteUser)

router.patch('/update-user/:user_email', handleUpdateUser)


module.exports = router;