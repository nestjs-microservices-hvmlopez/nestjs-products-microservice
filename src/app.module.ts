import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [ProductsModule, NatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
