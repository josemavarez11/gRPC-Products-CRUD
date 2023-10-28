import { client } from "../client.js";

export class CrudController{

    static async createProduct(req, res){ //C
        const { productDescription } = req.params;
        await client.create({description: productDescription}, (error, response) => {
            if(error){
                console.error("Error al agregar el producto ", error.message)
                res.status(500).send("Error al agregar el producto")
            } else{
                res.status(201).send("Producto agregado correctamente")
            }
        })
    }
    
    static async readProducts(req, res){ //R
        await client.read({}, (error, response) => {
            if(error){
                console.error("Error al obtener los productos ", error.message)
                res.status(500).send("Error al obtener los productos")
            } else{
                res.status(200).send(response.product)
            }
        });
    }

    static async updateProduct(req, res){
        const { productId, productDescription } = req.params;
        await client.update({id: productId, description: productDescription}, (error, response) => {
            if(error){
                console.error("Error al actualizar el producto ", error.message)
                res.status(500).send("Error al obtener los productos")
            } else{
                res.status(200).send("Producto actualizado correctamente")
            }
        })
    }

    static async deleteProduct(req, res){ //D
        const { productId } = req.params;
        await client.delete({id: productId}, (error, response) => {
            if(error){
                console.error("Error al borrar el producto", error.message)
                res.status(500).send("Error al obtener los productos")
            } else{
                res.status(200).send("Producto borrado correctamente")
            }
        })
    }
}