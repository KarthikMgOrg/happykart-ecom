# HappyKart E-Commerce Node Express Application

Welcome to HappyKart, a cutting-edge e-commerce platform powered by Node.js and Express. Follow these simple steps to run the application locally on your machine.

https://github.com/KarthikMgOrg/happykart-ecom/assets/35063929/baab1258-9478-4374-96bd-621ea2557d69



Here is the [Design Document](https://docs.google.com/document/d/13T2Ht091cAIbXjRhRk0eOGtR7Fdfyk7c5S8DmN3gBFc/edit)

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

1. ### Clone the repository:

   ```
   git clone https://github.com/your-username/happykart.git
   cd happykart
   ```
2. ### Launch the Microservices
   
      #### Customer
   
   ```
   cd customer
   npm install
   npm run start
   ```
   
      #### Products
   
   ```
   cd products
   npm install
   npm run start
   ```
   
      #### Shopping
   
   ```
   cd shopping
   npm install
   npm run start
   ```
   
      #### UI
   
   ```
   cd frontend/ecommerce-ui
   npm install
   npm run start
   ```
   
4. ### Database Configuration
   1. Ensure you have MongoDB installed on your machine.
   2. Update the database configuration in the .env file.

## Contributing
We welcome contributions! If you find any issues or have improvements to suggest, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
