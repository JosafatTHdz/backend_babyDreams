import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile } from './handlers'
import { createProduct, getCategories, getProduct, getProducts, getProductsByCategory, updateProduct, uploadImage } from './handlers/products'
import { createAbout, deleteAbout, getAbout, updateAbout } from './handlers/about'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
import { isAdmin } from './middleware/authRole'
const router = Router()

/** Autenticacion y registro **/
router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El usuario no puede estar vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacio'),
    body('email')
        .notEmpty()
        .withMessage('email invalido'),
    body('phone')
        .notEmpty()
        .withMessage('El telefono no puede estar vacio'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password es muy corto, minimo 8 caracteres'),
    handleInputErrors,
    createAccount
)

router.post('/auth/login',
    body('email')
        .notEmpty()
        .withMessage('email invalido'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio'),
    login
)

router.get('/user', authenticate, getUser)
router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('El usuario no puede estar vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacio'),
    body('email')
        .notEmpty()
        .withMessage('email invalido'),
    body('phone')
        .notEmpty()
        .withMessage('El telefono no puede estar vacio'),
    handleInputErrors,
    authenticate, 
    updateProfile
)

router.post('/product/register', 
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacio'),
    body('description')
        .notEmpty()
        .withMessage('La descripcion no puede estar vacia'),
    body('category')
        .notEmpty()
        .withMessage('La categoria no puede estar vacia'),
    authenticate, 
    isAdmin,
    createProduct
)
router.post('/product/image',
    body('image')
        .notEmpty()
        .withMessage('La imagen no puede estar vacia'),
    authenticate, 
    isAdmin,
    uploadImage
)
router.get('/product', getProducts)
router.get('/product/category', getCategories)
router.get('/product/category/:categoryId', getProductsByCategory)
router.get('/product/:productId', getProduct)
router.get('/product/update/:productId', 
    authenticate, 
    isAdmin, 
    updateProduct
)
router.post('/about/create', 
    authenticate,
    isAdmin,
    createAbout
)
router.get('/about', getAbout)
router.patch('/about/update', 
    body('quienesSomos')
        .notEmpty()
        .withMessage('Quienes somos no puede estar vacio'),
    body('mision')
        .notEmpty()
        .withMessage('La mision no puede estar vacia'),
    body('vision')
        .notEmpty()
        .withMessage('La vision no puede estar vacia'),
    authenticate, 
    isAdmin, 
    updateAbout
)
router.delete('/about/delete', deleteAbout)
// router.get('/product/search/:search', getProducts)
// router.get('/product/search/:search/category/:category', getProducts)
// router.get('/product/search/:search/category/:category/price/:price', getProducts)
// router.get('/product/search/:search/category/:category/price/:price/stock/:stock', getProducts)

export default router