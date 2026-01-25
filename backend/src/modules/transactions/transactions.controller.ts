import { FastifyReply, FastifyRequest } from "fastify";
import TransactionService from "./transactions.service.js";

export class TransactionsController {
  private transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  createTransaction = async (req: FastifyRequest, reply: FastifyReply) => {
    const transaction = await this.transactionService.create(req.body as any);
    reply.code(201).send(transaction);
  };

  getTransaction = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const transaction = await this.transactionService.getById(id);
    reply.send(transaction);
  };

  getTransactionsByUserId = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const { user_id } = req.params as any;
    const transactions = await this.transactionService.getByUserId(user_id);
    reply.send(transactions);
  };

  getAllTransactions = async (req: FastifyRequest, reply: FastifyReply) => {
    const transactions = await this.transactionService.getAll();
    reply.send(transactions);
  };
}
