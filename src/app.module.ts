import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DBConfig } from './db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBConfig,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
