import { loadPackageDefinition, Server, ServerCredentials} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
const PROTO_PATH = './product.proto';
import pg from "pg";
import dotenv from "dotenv"
dotenv.config({path: "./credentials.env"})

const pool = new pg.Pool({ 
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

const options = { 
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = loadSync(PROTO_PATH, options);
const productProto = loadPackageDefinition(packageDefinition);
const server = new Server();

var productsList = null;

try {
    const data = await pool.query("SELECT * FROM products ORDER BY id ASC");
    productsList = data.rows;
} catch (error) {
    console.log("error en el query de getProducts", error)
}

server.addService(productProto.ProductService.service, {
    create: async (call, callback) => {
        let productDescription = call.request.description;
        try {
            await pool.query('BEGIN');
            const data = await pool.query('INSERT INTO products (description) VALUES ($1)', [productDescription]);
            if (data.rowCount > 0) {
                await pool.query('COMMIT');
                callback(null, null);
            } else await pool.query('ROLLBACK');
        } catch (error) {
            console.log("error en el query del servicio insert", error)
        }
    },
    read: (_, callback) => {
        callback(null, { product: productsList });
    },
    update: async (call, callback) => {
        let productId = call.request.id;
        let productDescription = call.request.description;
        try {
            await pool.query('BEGIN');
            const data = await pool.query('UPDATE products SET description = $1 WHERE id = $2', [productDescription, productId]);
            if(data.rowCount > 0) await pool.query('COMMIT');
            else await pool.query('ROLLBACK');
        } catch (error) {
            console.log("Error en el query del servicio update", error)
        }
        callback(null, null);
    },
    delete: async (call, callback) => {
        let productId = call.request.id;
        try {
            await pool.query('BEGIN');
            const data = await pool.query('DELETE FROM products WHERE id = $1', [productId]);
            if(data.rowCount > 0) await pool.query('COMMIT');
            else await pool.query('ROLLBACK');
        } catch (error) {
            console.log("Error en el query del servicio delete", error)
        }
        callback(null, null);
    },
})

server.bindAsync(
    "127.0.0.1:50051",
    ServerCredentials.createInsecure(),
    (error, port) => {
        console.log("Server running at http://127.0.0.1:50051");
        server.start();
    }
);