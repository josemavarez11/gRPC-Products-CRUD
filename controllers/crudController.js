import { client } from "../client.js";

export class CrudController{

    static async createProduct(req, res){
        const { productDescription } = req.params;
        await fetch('http://localhost:2346/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: productDescription })
        })
        .then(response => response.json())
        .then(data => {
            return res.status(201).send(data)
        })
        .catch(error => {
            console.error("error creando producto:", error.message)
            return res.status(500).send("error creando producto")
        })
    }

    static async readProducts(req, res){
        await fetch('http://localhost:2346/products', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            return res.status(200).send(data)
        })
        .catch(error => {
            console.error("Error al obtener los productos ", error.message)
            return res.status(500).send("Error al obtener los productos")
        })
    }

    static async updateProduct(req, res){
        const { productId, productDescription } = req.params;
        await fetch(`http://localhost:2346/products/${productId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: productDescription })
        })
        .then(response => response.json())
        .then(data => {
            return res.status(200).send(data)
        })
        .catch(error => {
            console.error("Error actualizando producto", error.message)
            return res.status(500).send("Error actualizando producto")
        })
    }

    static async deleteProduct(req, res){
        const { productId } = req.params;
        await fetch(`http://localhost:2346/products/${productId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            return res.status(200).send(data)
        })
        .catch(error => {
            console.error("Error borrando producto", error.message)
            return res.status(500).send("Error borrando producto")
        })
    }
}