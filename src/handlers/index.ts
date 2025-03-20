import { Request, Response } from 'express'
import User from "../models/User"
import { checkPassword, hashPass } from '../utils/auth'
import { generateJWT } from '../utils/jwt'

export const createAccount = async (req: Request, res: Response) => {
    const slug = (await import("slug")).default
    const { email, password, role } = req.body

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
    const user = new User({
        ...req.body,
        role: role || "user"
    })
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
    const slug = (await import("slug")).default;
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


