import { Request, Response } from 'express'
import About from '../models/About'

export const getAbout = async (req: Request, res: Response) => {
    try {
        const about = await About.findOne()
        if (!about) {
            res.status(404).json({ message: 'No se encontraron datos' })
            return
        }
        res.json(about)
        return
    } catch (e) {
        const error = new Error('Hubo un error al encontrar la información')
        res.status(500).json({ error: error.message })
        return
    }
}

export const updateAbout = async (req: Request, res: Response) => {
    const { _id, quienesSomos, mision, vision, antecedentes } = req.body
    try {
        const updatedAbout = await About.findByIdAndUpdate(
            _id,
            { quienesSomos, mision, vision, antecedentes },
            { new: true }
        )
        if (!updatedAbout) {
            res.status(404).json({ message: 'No se encontró la información para actualizar' })
            return;
        }
        res.status(200).json("Información actualizada correctamente")
        return
    } catch (e) {
        const error = new Error('Hubo un error al eliminar la información')
        res.status(500).json({ error: error.message })
        return
    }
}

export const createAbout = async (req: Request, res: Response) => {
    const { quienesSomos, mision, vision, antecedentes } = req.body
    try {
        const newAbout = new About({ quienesSomos, mision, vision, antecedentes })
        await newAbout.save()
        res.status(201).json(newAbout)
        return
    } catch (e) {
        const error = new Error('Hubo un error al eliminar la información')
        res.status(500).json({ error: error.message })
        return
    }
}

export const deleteAbout = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const about = await About.findByIdAndDelete(id)
        if (!about) {
            res.status(404).json({ message: 'No se encontró la información para eliminar' })
            return
        }
        res.status(200).json({ message: 'Información eliminada con éxito' })
        return
    } catch (e) {
        const error = new Error('Hubo un error al eliminar la información')
        res.status(500).json({ error: error.message })
        return
    }
}