import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, createProduct, getUser, login, updateProfile, uploadImage } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
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
    createProduct
)
router.post('/product/image', authenticate, uploadImage)



export default router