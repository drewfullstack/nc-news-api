# nc-news-api

This is the backend component of a Reddit like news server, that provides a RESTful API for interacting with the components of this service.

## Getting Started

To get started with this project, follow these steps:

### 1. Clone the Repository

Clone this repository to your local machine

### 2. Create .env files

This project requires 2 .env files, one for development and one for testing. Please create 2 files:
".env.development"
".env.test"

Use the .env.example as a guide for what they should contain.

Please replace the <database-name> in each with the actual name of the databases.

The .env.example file can now be deleted.

### 3. Setup the databases

Run the command "npm run setup-dbs".

This will create the databases needed to run this project.

### 4. Install dependencies

Run the command "npm install".

This will run all necessary dependencies that can be found in the package.json file.

### 5. Seed the databases

Run the command "npm run seed".

This will run the file, run-seed.js, which will populate the databases with the necessary tables and seed data.

### 6. Running the test file

To ensure everything has been setup correctly, run the command "npm test", which will run the test suite with Jest.

If everything has been setup correctly, all tests should pass.
