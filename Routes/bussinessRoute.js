const { FetchBusiness, FetchBusinessByName } = require('../Controllers/bussinessController')

const router = require('express').Router()

//routes
router.get('/business', FetchBusiness)
router.get('/business/:name', FetchBusinessByName);


module.exports = router