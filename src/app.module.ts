import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import ormConfig from "./config/orm.config";
import { ProjectModule } from "./project/project.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }), MikroOrmModule.forRoot(ormConfig), ProjectModule],
})
export class AppModule {}
