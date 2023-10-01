const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizedRoles } = require('../middlewares/auth');

const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/product/new').post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);
router.route('/product/:id').put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);


module.exports = router;