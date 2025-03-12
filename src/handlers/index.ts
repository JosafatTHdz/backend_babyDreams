import { Request, Response } from 'express'
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../models/User"
import { checkPassword, hashPass } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import cloudinary from '../config/cloudinary'
import Product from '../models/Product'

export const createAccount = async (req: Request, res: Response) => {

    const { email, password } = req.body

    const userExist = await User.findOne({email})
    if (userExist) {
        const error = new Error('El correo ya esta registrado')
        res.status(409).send({error : error.message})
        return
    }

    const handle = slug(req.body.handle, '')
    const handleExist = await User.findOne({handle})
    if (handleExist) {
        const error = new Error('Nombre de usuario no disponible')
        res.status(409).send({error : error.message})
        return
    }

    const user = new User(req.body)
    user.password = await hashPass(password)
    user.handle = handle


    await user.save()
    res.status(201).send('Registro completado correctamente')
}

export const login = async (req: Request, res: Response) => {
    //Comprobar que un usuario existe
    const { email, password } = req.body
    const user = await User.findOne({email})
    if (!user) {
        const error = new Error('El usuario no existe')
        res.status(404).send({error : error.message})
        return
    }

    //Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto')
        res.status(401).send({error : error.message})
        return
    }

    const token = generateJWT({id: user._id})

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {

        const { name, email, phone } = req.body

        const userExist = await User.findOne({ email })
        if (userExist && userExist.handle !== req.user.handle) {
            const error = new Error('El correo ya esta registrado')
            res.status(409).send({ error: error.message })
            return
        }

        const handle = slug(req.body.handle, '')
        const handleExist = await User.findOne({ handle })
        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            res.status(409).send({ error: error.message })
            return
        }

        //Actualizar el perfil
        req.user.name = name
        req.user.email = email
        req.user.phone = phone
        req.user.handle = handle

        await req.user.save()
        res.send('Perfil actualizado correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
        return
    }
}

export const createProduct = async (req: Request, res: Response) => {

    const name = slug(req.body.name, '')
    const nameExist = await Product.findOne({name})
    if (nameExist && nameExist.category !== req.body.category) {
        const error = new Error('Producto ya registrado')
        res.status(409).send({error : error.message})
        return
    }
    const product = new Product(req.body)
 
    await product.save()
    res.status(201).send('Producto registrado correctamente')
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples: false})
    const { name } = req.body
    try {
        
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                     res.status(500).json({error: error.message})
                }
                const name = fields.name?.[0];
                if (!name) {
                    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
                }
                const product = await Product.findOne({ name });
                if (!product) {
                    return res.status(404).json({ error: "Producto no encontrado" });
                }
                if (result) {
                    const product = await Product.findOne({name})
                    product.image = result.secure_url
                    await product.save()
                    res.status(201).send('Producto registrado correctamente')
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({error: error.message})
        return
    }
}