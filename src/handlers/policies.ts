import { Request, Response } from 'express'
import Policies from '../models/Policies'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose';

export const getPolicies = async (req: Request, res: Response) => {
    try {
        const policies = await Policies.find().select("title description createdAt").lean();
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({message: "Error al obtener las políticas", error: error.message})
    }
}

export const addPolicy = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() })
        return
    }
    console.log(req.body)
    try {
        const { title, description } = req.body
        const newPolicy = new Policies({ title, description })
        console.log(newPolicy)
        await newPolicy.save()
        res.status(201).json({ data: newPolicy })
    } catch (error) {
        res.status(500).json({success: false, message: "Error al crear la política", error: error.message})
    }
}

export const getPolicyById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "ID no válido" })
        return
    }

    try {
        const policy = await Policies.findById(id);
        if (!policy) {
            res.status(404).json({ success: false, message: "Política no encontrada" })
            return
        }
        res.status(200).json({ success: true, data: policy })
    } catch (error) {
        res.status(500).json({success: false, message: "Error al obtener la política", error: error.message})
    }
}

export const updatePolicy = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      console.log(id, title, description)
      const updated = await Policies.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true } // 👈 Importante para obtener el nuevo doc y validar
      );
  
      if (!updated) {
        res.status(404).json({ success: false, message: "Política no encontrada" });
        return
      }
  
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar la política",
        error: error.message,
      });
    }
  };
  

export const deletePolicy = async (req: Request, res: Response) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "ID no válido" })
        return
    }
    try {
        const deletedPolicy = await Policies.findByIdAndDelete(id);
        if (!deletedPolicy) {
            res.status(404).json({ success: false, message: "Política no encontrada" })
            return
        }
        res.status(200).json({ success: true, message: "Política eliminada correctamente" })
    } catch (error) {
        res.status(500).json({success: false, message: "Error al eliminar la política", error: error.message})
    }
}