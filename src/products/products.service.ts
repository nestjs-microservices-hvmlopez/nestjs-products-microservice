import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  onModuleInit() {
    this.$connect();
    this.logger.log('database connected products service');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(PaginationDto: PaginationDto) {
    const { page, limit } = PaginationDto;
    console.log({page, limit})
    const totalPages = await this.product.count({
      where: {
        available: true,
      },
    });
    const lastPage = Math.ceil(totalPages / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        available: true,
      },
    });
    return {
      data: products,
      meta: {
        page: page,
        total: totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });
    if (!product) {
      throw new RpcException({
        message: 'Product not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    const findProduct = await this.findOne(id);
    if (!findProduct) {
      throw new RpcException('Product to update not found');
    }

    const newProduct = await this.product.update({
      where: {
        id,
      },
      data: data,
    });
    return newProduct;
  }

  async remove(id: number) {
    const findProduct = await this.findOne(id);
    if (!findProduct) {
      throw new RpcException('Product to remove not found');
    }
    const product = await this.product.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
    });
    return product;
  }
}
