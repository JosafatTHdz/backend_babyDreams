import { Request, Response } from "express"
import FAQ from "../models/FAQ"

export const getFAQ = async (req: Request, res: Response) => {
    try {
        const faqs = await FAQ.find()
        res.json(faqs)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener preguntas frecuentes" })
    }
}

export const addFAQ = async (req: Request, res: Response) => {
    try {
        const { question, answer } = req.body
        if (!question || !answer) {
            res.status(400).json({ message: "Se requieren 'question' y 'answer'" })
            return
        }
        const newFaq = new FAQ({ question, answer })
        await newFaq.save()
        res.status(201).json(newFaq)
    } catch (error) {
        res.status(500).json({ message: "Error al agregar la pregunta frecuente" })
    }
}

export const updateFAQ = async (req: Request, res: Response) => {
    try {
        const { answer } = req.body
        if (!answer) {
            res.status(400).json({ message: "Se requiere 'answer' para actualizar" })
            return
        }
        const updatedFaq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { answer },
            { new: true }
        )
        if (!updatedFaq) {
            res.status(404).json({ message: "FAQ no encontrada" })
            return 
        }
        res.json(updatedFaq)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteFAQ = async (req: Request, res: Response) => {
    try {
        const deletedFaq = await FAQ.findByIdAndDelete(req.params.id)
        if (!deletedFaq) {
            res.status(404).json({ message: "FAQ no encontrada" })
            return
        }
        res.json({ message: "FAQ eliminada correctamente" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}