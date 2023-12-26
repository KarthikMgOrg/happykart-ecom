import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "Your API description",
    },
    servers: [
      {
        url: "http://localhost:3001", // Replace with your actual server URL
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          name: "Authorization",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./index.js", "./src/api/products.js"], // Update the paths based on your project structure
};

const specs = swaggerJsdoc(options);

export default specs;
