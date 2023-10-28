import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
const PROTO_PATH = './product.proto';

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = loadSync(PROTO_PATH, options);
const ProductService = loadPackageDefinition(packageDefinition).ProductService;

export const client = new ProductService(
    "localhost:50051",
    credentials.createInsecure()
);