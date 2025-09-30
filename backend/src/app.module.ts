import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { LiqPayService } from './liqpay/liqpay.service';
import { LiqPayController } from './liqpay/liqpay.controller';
import { UserController } from './user/user.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Product } from './product/product.entity';
import { ProductResolver } from './product/product.resolver';
import { MediaService } from './media/media.service';
import { MediaController } from './media/media.controller';
import { Balance } from './balance/balance.entity';
import { BalanceService } from './balance/balance.service';
import { BalanceController } from './balance/balance.controller';
import { EmailService } from './common/email.service';
import { SmsService } from './common/sms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { HealthController } from './health.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      process.env.DB_USE_SQLITE === 'true'
        ? {
            type: 'sqlite',
            database: process.env.SQLITE_PATH || 'dev.sqlite',
            entities: [User, Product, Balance],
            synchronize: true,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'your_password',
            database: process.env.DB_DATABASE || 'fanatik_db',
            entities: [User, Product, Balance],
            synchronize: true,
          },
    ),
    AuthModule,
    TypeOrmModule.forFeature([User, Product, Balance]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      sortSchema: true,
  context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [MediaController, BalanceController, LiqPayController, ProductController, UserController, HealthController],
  providers: [MediaService, BalanceService, LiqPayService, ProductService, ProductResolver, EmailService, SmsService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await this.users.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const hash = await bcrypt.hash(adminPass, 10);
      admin = this.users.create({ email: adminEmail, password: hash, role: 'admin', isActive: true });
      await this.users.save(admin);
      // eslint-disable-next-line no-console
      console.log(`Admin created: ${adminEmail}`);
    }
  }
}
