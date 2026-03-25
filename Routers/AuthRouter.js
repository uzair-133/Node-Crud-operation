const ensureAuth = require('../Middleware/Auth');
const {signup,login,Read,update,Delete} = require('../Controllers/AuthController')
const router  = require('express').Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/read',ensureAuth,Read);
router.put('/update/:id',ensureAuth,update);
router.delete('/delete/:id',ensureAuth,Delete);

module.exports = router;
