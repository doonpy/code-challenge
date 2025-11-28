import app from "./app.js";

function bootstrap() {
  app.listen(process.env.PORT, () => {
    console.log(`-> Server is running on port ${process.env.PORT}`);
  });
}

bootstrap();