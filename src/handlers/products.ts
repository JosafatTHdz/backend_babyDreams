import { Request, Response } from 'express'
import Product from '../models/Product'
import Category from '../models/Category'
import slug from 'slug'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import { v4 as uuid } from 'uuid'

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
    res.status(201).json(product)
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false });

    try {
        form.parse(req, async (error, fields, files) => {
            if (error) {
                console.error("❌ Error en formidable:", error);
                return res.status(500).json({ error: "Error al procesar la imagen" });
            }

            console.log("🛠️ Campos recibidos en formidable:", fields);

            if (!files.file || !files.file[0]) {
                return res.status(400).json({ error: "No se subió ninguna imagen" });
            }

            const productId = fields.productId?.[0]; // 🔹 Corregido para asegurar que extrae el ID correctamente
            if (!productId) {
                console.error("❌ productId no recibido:", fields);
                return res.status(400).json({ error: "El ID del producto es obligatorio" });
            }

            console.log("🔹 Producto a actualizar con imagen:", productId);

            // Subir la imagen a Cloudinary
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async (err, result) => {
                if (err) {
                    console.error("❌ Error al subir imagen a Cloudinary:", err);
                    return res.status(500).json({ error: "Error al subir la imagen" });
                }

                try {
                    // 🔹 Actualizar el producto con la URL de la imagen
                    const updatedProduct = await Product.findByIdAndUpdate(
                        productId,
                        { image: result.secure_url },
                        { new: true }
                    );

                    if (!updatedProduct) {
                        console.error("❌ Producto no encontrado para actualizar.");
                        return res.status(404).json({ error: "Producto no encontrado" });
                    }

                    console.log("✅ Imagen subida y producto actualizado:", updatedProduct);
                    res.status(200).json({ message: "Imagen subida y producto actualizado", product: updatedProduct });
                } catch (e) {
                    console.error("❌ Error al actualizar producto en DB:", e);
                    res.status(500).json({ error: "Error al actualizar el producto" });
                }
            });
        });
    } catch (e) {
        console.error("❌ Error general en uploadImage:", e);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.find()
    res.json(products)
}

export const getProduct = async (req: Request, res: Response) => {
    const { productId } = req.params
    const product = await Product.findById(productId)
    if (!product) {
        res.status(404).send('Producto no encontrado')
        return
    }
    res.json(product)
}

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params

        const products = await Product.find({ category: categoryId }).populate("category", "name")

        if (!products.length) {
            res.status(404).json({ message: "No hay productos en esta categoría" })
            return
        }

        res.json(products)
    } catch (error) {
        console.error("❌ Error al obtener productos por categoría:", error);
        res.status(500).json({ error: "Hubo un error al obtener los productos" })
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const { search, category, price, stock } = req.body
    const products = await Product.find({
        name: { $regex: search, $options: 'i' },
        category: category,
        price: price,
        stock: stock
    })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.body
    const product = await Product.findById(id)
    if (!product) {
        res.status(404).send('Producto no encontrado')
        return
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.body
    const product = await Product.findById(productId)
    if (!product) {
        res.status(404).send('Producto no encontrado')
        return
    }
    const { name, description, category, price, stock } = req.body
    product.name = name
    product.description = description
    product.category = category
    product.price = price
    product.stock = stock
    await product.save()
}

export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.find()
    res.json(categories)
}