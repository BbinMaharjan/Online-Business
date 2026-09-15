import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as path from "path";

const openapiDocument = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce Backend API",
    version: "1.0.0",
    description: "E-Commerce Backend API Documentation",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    database: {
                      type: "string",
                      example: "connected",
                    },
                    timestamp: {
                      type: "string",
                      format: "date-time",
                      example: "2026-01-01T00:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        summary: "Customer registration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string", format: "email" },
                  phone: { type: "string" },
                  password: { type: "string" },
                },
                required: ["firstName", "lastName", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          "409": {
            description: "User with this email already exists",
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Customer login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Invalid email or password",
          },
        },
      },
    },
    "/api/v1/products": {
      get: {
        summary: "Get products with filtering and pagination",
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Keyword search",
            schema: { type: "string" },
          },
          {
            name: "category",
            in: "query",
            description: "Category ID filter",
            schema: { type: "string" },
          },
          {
            name: "brand",
            in: "query",
            description: "Brand ID filter",
            schema: { type: "string" },
          },
          {
            name: "minPrice",
            in: "query",
            description: "Minimum price filter",
            schema: { type: "number" },
          },
          {
            name: "maxPrice",
            in: "query",
            description: "Maximum price filter",
            schema: { type: "number" },
          },
          {
            name: "sort",
            in: "query",
            description: "Sort parameter (e.g., price_asc, price_desc)",
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            description: "Page number",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            description: "Items per page (max 100)",
            schema: { type: "integer", default: 20, maximum: 100 },
          },
        ],
        responses: {
          "200": {
            description: "Products retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: { type: "object" },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        total: { type: "integer" },
                        totalPages: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/products/:id": {
      get: {
        summary: "Get product by ID",
        responses: {
          "200": {
            description: "Product retrieved successfully",
          },
          "404": {
            description: "Product not found",
          },
        },
      },
    },
    "/api/v1/cart/:userId": {
      get: {
        summary: "Get cart for user",
        responses: {
          "200": {
            description: "Cart retrieved successfully",
          },
        },
      },
      post: {
        summary: "Add item to cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  variantId: { type: "string" },
                  quantity: { type: "integer", minimum: 1 },
                },
                required: ["productId", "quantity"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Product added to cart successfully",
          },
        },
      },
    },
    "/api/v1/orders/:userId": {
      get: {
        summary: "Get orders for user",
        responses: {
          "200": {
            description: "Orders retrieved successfully",
          },
        },
      },
      post: {
        summary: "Create order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  shippingAddressId: { type: "string" },
                  billingAddressId: { type: "string" },
                  couponCode: { type: "string" },
                  paymentMethod: { type: "string" },
                },
                required: ["shippingAddressId", "paymentMethod"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created successfully",
          },
        },
      },
    },
    "/api/v1/admin/dashboard/summary": {
      get: {
        summary: "Get admin dashboard summary",
        security: [
          { bearerAuth: [] }
        ],
        responses: {
          "200": {
            description: "Dashboard summary retrieved successfully",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const swaggerDocs = (app: any) => {
  // Serve Swagger UI at /api/docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

  // Serve OpenAPI JSON at /api-docs
  app.get("/api-docs", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openapiDocument);
  });
};