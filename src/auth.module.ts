import { Global, Module } from "@nestjs/common";
import { AppService } from "./app.service";

@Global()
@Module({
  imports: [
  ],
  providers: [AppService,],
  exports: [AppService, ]
})
export class AuthModule {
}

