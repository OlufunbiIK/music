/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.listen(process.env.PORT ?? 3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  //Enables Hot Module Replacement (HMR) for a Node.js app, so changes in the code trigger updates without restarting the server.
  //Excludes unnecessary files (e.g., node_modules) from the bundle for efficiency.
  //Uses Webpack plugins to:
  //Watch for changes.
  //Automatically re-run the application after rebuilding.
  //Ensures clean handling of resource disposal during module updates.
  //This setup is particularly useful for improving the development workflow in server-side Node.js projects.
}
bootstrap();
