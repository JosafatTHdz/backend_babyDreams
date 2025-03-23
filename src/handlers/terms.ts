import { Request, Response } from 'express'
import Terms from '../models/Terms'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

export const getTerms = async (req: Request, res: Response) => {
    try {
        const terms = await Terms.find()
            .select("title description createdAt")
            .lean();
        res.status(200).json(terms)
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los términos",
            error: error.message,
        })
    }
}

export const getTermById = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "ID no válido" })
        return
    }
    try {
        const term = await Terms.findById(id)
        if (!term) {
            res.status(404).json({ success: false, message: "Término no encontrado" })
            return
        }
        res.status(200).json({ success: true, data: term });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el término",
            error: error.message,
        })
    }
}

export const addTerm = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() })
        return
    }

    try {
        const { title, description } = req.body
        const newTerm = await Terms.create({ title, description })
        res.status(201).json({ success: true, data: newTerm })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el término",
            error: error.message,
        })
    }
}

export const updateTerm = async (req: Request, res: Response) => {
    const { id } = req.params;
    const errors = validationResult(req)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "ID no válido" })
        return
    }
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() })
        return
    }
    try {
        const { title, description } = req.body;
        const updatedTerm = await Terms.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        ).lean();
        if (!updatedTerm) {
            res.status(404).json({ success: false, message: "Término no encontrado" })
            return
        }
        res.status(200).json({ success: true, data: updatedTerm })
    } catch (error) {
        res.status(500).json({success: false, message: "Error al actualizar el término", error: error.message})
    }
}

export const deleteTerm = async (req: Request, res: Response) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "ID no válido" })
        return
    }
    try {
        const deletedTerm = await Terms.findByIdAndDelete(id);
        if (!deletedTerm) {
            res.status(404).json({ success: false, message: "Término no encontrado" })
            return
        }
        res.status(200).json({ success: true, message: "Término eliminado correctamente" })
    } catch (error) {
        res.status(500).json({success: false, message: "Error al eliminar el término", error: error.message})
    }
}