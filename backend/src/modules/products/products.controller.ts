import { FastifyReply, FastifyRequest } from "fastify";
import ProductsService from "./products.service.js";

export class ProductsController {
  private productsService: ProductsService;

  constructor(productsService: ProductsService) {
    this.productsService = productsService;
  }

  getAllProducts = async (req: FastifyRequest, reply: FastifyReply) => {
    const products = await this.productsService.getAll();
    reply.send(products);
  };

  getProductById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const product = await this.productsService.getById(id);
    if (product) {
      reply.send(product);
    } else {
      reply.code(404).send({ message: "Product not found" });
    }
  };

  createProduct = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, description, price } = req.body as any;
    const newProduct = await this.productsService.create({
      name,
      description,
      price,
    });
    reply.code(201).send(newProduct);
  };
}
