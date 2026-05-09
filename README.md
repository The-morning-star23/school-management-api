# 🏫 School Management API

A robust RESTful API built with Node.js and Express to manage school data. This system allows users to seamlessly add new schools to a database and retrieve a dynamically sorted list of schools based on their geographical proximity to a user-specified location.

---

## 🚀 Live Demo & Testing

| Resource | Link |
|----------|------|
| **Live API Base URL** | https://school-management-api-navy.vercel.app/ |
| **Postman Collection** | Pre-configured `School_Management_API.postman_collection.json` included in root directory |

---

## ✨ Key Features

- ✅ **Add Schools** — Securely add new schools with built-in validation for names, addresses, and geographical coordinates
- 📍 **Proximity Sorting** — Utilizes the **Haversine formula** to calculate the great-circle distance between two points on a sphere, returning schools sorted by distance from user's location
- ☁️ **Cloud Database** — Integrated with a live MySQL database hosted on Aiven
- 🚀 **Serverless Deployment** — Fully deployed and optimized for serverless execution on Vercel

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | Node.js, Express.js |
| **Database** | MySQL (Cloud-hosted via Aiven) |
| **Database Driver** | `mysql2` (with Connection Pooling) |
| **Deployment** | Vercel |

---

## 📖 API Documentation

### Endpoint 1: Add a New School

**POST** `/addSchool`

**Description:** Adds a new school to the database. Validates that all fields are present and coordinates are valid numbers.

#### Request Payload

```json
{
    "name": "Phusro High School",
    "address": "Phusro Bazar, Main Road",
    "latitude": 23.7650,
    "longitude": 85.9950
}
```

#### Success Response (201 Created)

```json
{
    "message": "School added successfully!",
    "schoolId": 1
}
```

#### Error Response (400 Bad Request)

Returned if fields are missing or data types are incorrect.

---

### Endpoint 2: List Schools by Proximity

**GET** `/listSchools`

**Description:** Fetches all schools and sorts them based on their distance (in kilometers) from the provided user coordinates.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `lat` | float | The user's latitude |
| `lng` | float | The user's longitude |

#### Example Request

```
/listSchools?lat=23.7600&lng=85.9900
```

#### Success Response (200 OK)

```json
[
    {
        "id": 1,
        "name": "Phusro High School",
        "address": "Phusro Bazar, Main Road",
        "latitude": 23.765,
        "longitude": 85.995,
        "distanceInKm": 0.75 
    },
    {
        "id": 2,
        "name": "Ranchi International Academy",
        "address": "Kanke Road, Ranchi",
        "latitude": 23.3441,
        "longitude": 85.3096,
        "distanceInKm": 83.21
    }
]
```

---

## 💻 Local Setup & Installation

### Prerequisites

- ✓ Node.js installed
- ✓ Git installed
- ✓ A local or cloud MySQL instance

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/The-morning-star23/school-management-api.git
cd school-management-api
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your database credentials:

```env
PORT=3000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
```

#### 4. Initialize the Database

Run the following SQL script in your MySQL environment to create the required table:

```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
```

#### 5. Start the Development Server

```bash
npm run dev
```

The server will start running on `http://localhost:3000`.

---

## 🧠 Algorithm Highlight: Haversine Formula

Because standard SQL does not inherently support geospatial sorting without specialized extensions (like PostGIS or MySQL Spatial), this application calculates distance dynamically at the application level.

When `/listSchools` is called, the API fetches the database records and applies the **Haversine formula** to calculate the great-circle distance between the user's coordinates and each school's coordinates, ensuring highly accurate sorting even over long distances.