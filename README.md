# Sensor Management API

This project provides a RESTful API for managing sensor data using Fastify, a web framework for Node.js. It integrates with Prisma for database operations and Zod for schema validation. The API supports CRUD operations for sensors, including fetching all sensors, retrieving a specific sensor by ID, creating a new sensor, and updating an existing sensor's status.

## Features

- **CRUD Operations**: Full support for Create, Read, Update, and Delete (CRUD) operations on sensor data.
- **Validation**: Utilizes Zod for input validation to ensure data integrity.
- **Database Integration**: Uses Prisma to interact with the database, providing a type-safe API for database operations.
- **Cross-Origin Resource Sharing (CORS)**: Enabled via Fastify's CORS plugin to allow cross-origin requests.

## Setup

1. **Install Dependencies**: Run `npm install` to install all required dependencies.
2. **Environment Configuration**: Ensure `.env` file is configured with the correct `PORT`.
3. **Database Setup**: Initialize and configure your database connection in `./config/db.js`.
4. **Run the Server**: Execute `node index.js` to start the server.

## Endpoints

### GET /sensors

- **Description**: Fetches all sensor records.
- **Response**: An array of sensor objects.

### GET /sensors/:sensor

- **Description**: Retrieves a specific sensor by its ID.
- **Parameters**: `sensor` - The unique identifier of the sensor.
- **Response**: A single sensor object or a 404 error if not found.

### POST /sensors

- **Description**: Creates a new sensor record.
- **Body**: A JSON object containing `name`, `sensor`, `status`, `latitude`, and `longitude`.
- **Response**: The newly created sensor object or a 409 error if the sensor already exists.

### PUT /sensors/:sensor

- **Description**: Updates the status of a specific sensor.
- **Parameters**: `sensor` - The unique identifier of the sensor.
- **Body**: A JSON object containing the new `status`.
- **Response**: The updated sensor object or a 404 error if not found.

## Contributing

Contributions to improve the API's functionality, reliability, or user experience are welcome. Please submit pull requests or open issues on the project repository.
