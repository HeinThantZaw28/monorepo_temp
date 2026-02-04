import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 3001;
  const isProd = process.env.NODE_ENV === "production";
  const enableSwagger = process.env.SWAGGER_ENABLED === "true" || !isProd;

  // Baseline security hardening.
  app.use(helmet());
  app.use(json({ limit: "1mb" }));
  app.use(urlencoded({ extended: true, limit: "1mb" }));

  // Expose Swagger only in non-production unless explicitly enabled.
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle("API")
      .setDescription("API documentation")
      .setVersion("1.0.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("swagger", app, document);
  }

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}

void bootstrap();
