import { Module } from '@nestjs/common';
import { databaseProvider } from 'src/configs/database.provider';

@Module({
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
