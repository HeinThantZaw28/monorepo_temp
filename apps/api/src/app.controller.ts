import { Controller, Get } from "@nestjs/common";
import { hello } from "@app/shared";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { status: "ok", message: hello("world") };
  }

  @Get("health")
  getHealth() {
    return { status: "ok", message: hello("world") };
  }
}
