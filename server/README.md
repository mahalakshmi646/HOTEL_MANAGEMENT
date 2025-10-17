# Hotel Booking System - Backend

This is the backend server for the Hotel Room Booking Management System built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start MongoDB**
   Make sure MongoDB is running on `mongodb://localhost:27017`

3. **Run the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Test the API**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
- **GET** `/health` - Check if the API is running

### Rooms Endpoints

#### Get All Rooms
- **GET** `/rooms`
- **Query Parameters:**
  - `type` - Filter by room type
  - `availability` - Filter by availability (true/false)
  - `sort` - Sort by (price_asc, price_desc, room_asc, room_desc)
  - `search` - Search by room number or type

#### Get Single Room
- **GET** `/rooms/:id`
- **Parameters:** `id` - Room ID

#### Create Room
- **POST** `/rooms`
- **Body:**
  ```json
  {
    "roomNumber": "101",
    "type": "Single",
    "pricePerNight": 150,
    "amenities": ["WiFi", "TV"],
    "description": "Comfortable single room"
  }
  ```

#### Update Room
- **PUT** `/rooms/:id`
- **Parameters:** `id` - Room ID
- **Body:** Partial room object with fields to update

#### Delete Room
- **DELETE** `/rooms/:id`
- **Parameters:** `id` - Room ID

## 🗄️ Database Schema

### Room Model
```javascript
{
  _id: ObjectId,           // Auto-generated
  roomNumber: String,      // Required, unique
  type: String,           // Enum: Single, Double, Suite, Deluxe, Executive
  pricePerNight: Number,  // Required, minimum 0
  availability: Boolean,  // Default: true
  amenities: [String],    // Array of strings
  description: String,    // Optional, max 500 characters
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/hotelDB
PORT=5000
NODE_ENV=development
```

## 📝 Example API Calls

### Create a Room
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "roomNumber": "101",
    "type": "Single",
    "pricePerNight": 150,
    "amenities": ["WiFi", "TV", "Air Conditioning"],
    "description": "Comfortable single room with city view"
  }'
```

### Get Available Rooms
```bash
curl "http://localhost:5000/api/rooms?availability=true"
```

### Search Rooms
```bash
curl "http://localhost:5000/api/rooms?search=101"
```

### Sort by Price
```bash
curl "http://localhost:5000/api/rooms?sort=price_asc"
```

## 🛠️ Development

### Project Structure
```
server/
├── config/
│   └── database.js      # MongoDB connection
├── models/
│   └── Room.js         # Room schema/model
├── routes/
│   └── rooms.js        # API routes
├── package.json        # Dependencies
└── server.js           # Entry point
```

### Available Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload

### Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload (dev dependency)

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed validation errors"]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 CORS Configuration

The server is configured to allow requests from:
- `http://localhost:3000` (React development server)
- Any origin in development mode

## 📊 Validation Rules

### Room Number
- Required
- Unique
- Letters, numbers, and hyphens only

### Room Type
- Required
- Must be one of: Single, Double, Suite, Deluxe, Executive

### Price per Night
- Required
- Must be a positive number
- Maximum: $10,000

### Description
- Optional
- Maximum length: 500 characters

## 🧪 Testing

Test the API using:
1. **Postman** - Import the collection
2. **cURL** - Command line testing
3. **Frontend** - Use the React application

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Install dependencies
4. Start the server

### Cloud Deployment
- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Simple deployment platform
- **DigitalOcean** - VPS deployment
- **AWS** - EC2 or Elastic Beanstalk

### Production Considerations
- Use environment variables for sensitive data
- Enable HTTPS
- Set up proper logging
- Configure CORS for production domains
- Use PM2 for process management
