# ReLoop Platform API Documentation

## Overview

The ReLoop Platform API provides a comprehensive set of endpoints for managing circular economy operations, including feedstock management, routing, carrier services, messaging, and marketplace transactions.

## Base URL

```
Production: https://api.reloop.eco/v1
Development: http://localhost:3001/api/v1
```

## Authentication

All API requests require authentication using JWT tokens.

### Obtaining a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "role": "supplier",
    "profile": {
      "name": "John Doe",
      "company": "Eco Foods Inc."
    }
  }
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {
      "resource": "listing",
      "id": "lst_123"
    }
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination using cursor-based pagination:

```http
GET /api/v1/listings?limit=20&cursor=eyJpZCI6MTIzfQ
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTQzfQ",
    "hasMore": true,
    "total": 150
  }
}
```

## API Endpoints

### Authentication

#### Login
```http
POST /auth/login
```
Authenticate a user and receive a JWT token.

#### Register
```http
POST /auth/register
```
Create a new user account.

#### Refresh Token
```http
POST /auth/refresh
```
Refresh an expired JWT token.

#### Logout
```http
POST /auth/logout
```
Invalidate the current JWT token.

### Users

#### Get Current User
```http
GET /users/me
```
Get the authenticated user's profile.

#### Update Profile
```http
PUT /users/me
```
Update the authenticated user's profile.

#### Upload Avatar
```http
POST /users/me/avatar
```
Upload a profile avatar image.

### Listings

#### Get All Listings
```http
GET /listings
```
Query parameters:
- `type`: Filter by feedstock type
- `location`: Filter by location (lat,lng)
- `radius`: Search radius in km (default: 50)
- `status`: Filter by status (available, pending, completed)
- `sort`: Sort order (created_desc, price_asc, price_desc, volume_desc)
- `limit`: Results per page (max: 100)
- `cursor`: Pagination cursor

**Example Request:**
```http
GET /listings?type=cooking-oil&location=51.5074,-0.1278&radius=25&status=available&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "lst_123",
      "type": "cooking-oil",
      "title": "Used Cooking Oil - Restaurant Grade",
      "description": "High-quality used cooking oil from restaurant operations",
      "volume": 500,
      "unit": "liters",
      "price": 0.85,
      "currency": "USD",
      "location": {
        "address": "123 Main St, London",
        "coordinates": {
          "lat": 51.5074,
          "lng": -0.1278
        }
      },
      "availability": {
        "startDate": "2024-01-15",
        "endDate": "2024-01-30",
        "recurring": false
      },
      "supplier": {
        "id": "usr_456",
        "name": "Restaurant Chain Ltd",
        "rating": 4.8,
        "verificationStatus": "verified"
      },
      "images": [
        "https://storage.reloop.eco/listings/lst_123/image1.jpg"
      ],
      "certifications": [
        {
          "type": "ISCC",
          "number": "ISCC-EU-123456",
          "validUntil": "2024-12-31"
        }
      ],
      "carbonFootprint": {
        "emissions": 0.12,
        "unit": "kgCO2e/liter",
        "verified": true
      },
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6MTQzfQ",
    "hasMore": true,
    "total": 45
  }
}
```

#### Get Single Listing
```http
GET /listings/{id}
```

#### Create Listing
```http
POST /listings
```

**Request Body:**
```json
{
  "type": "cooking-oil",
  "title": "Used Cooking Oil - Restaurant Grade",
  "description": "High-quality used cooking oil",
  "volume": 500,
  "unit": "liters",
  "price": 0.85,
  "currency": "USD",
  "location": {
    "address": "123 Main St, London",
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    }
  },
  "availability": {
    "startDate": "2024-01-15",
    "endDate": "2024-01-30",
    "recurring": false
  },
  "certifications": [
    {
      "type": "ISCC",
      "number": "ISCC-EU-123456",
      "validUntil": "2024-12-31"
    }
  ]
}
```

#### Update Listing
```http
PUT /listings/{id}
```

#### Delete Listing
```http
DELETE /listings/{id}
```

#### Upload Listing Images
```http
POST /listings/{id}/images
```
Upload multiple images for a listing.

### Routes

#### Calculate Route
```http
POST /routes/calculate
```
Calculate optimal collection routes.

**Request Body:**
```json
{
  "origin": {
    "lat": 51.5074,
    "lng": -0.1278
  },
  "destinations": [
    {
      "id": "loc_1",
      "lat": 51.5154,
      "lng": -0.1423,
      "volume": 200,
      "timeWindow": {
        "start": "09:00",
        "end": "12:00"
      }
    },
    {
      "id": "loc_2",
      "lat": 51.4954,
      "lng": -0.1123,
      "volume": 150,
      "timeWindow": {
        "start": "13:00",
        "end": "17:00"
      }
    }
  ],
  "vehicle": {
    "capacity": 1000,
    "type": "truck",
    "emissionClass": "EURO6"
  },
  "optimize": ["distance", "time", "emissions"]
}
```

**Response:**
```json
{
  "route": {
    "id": "rt_789",
    "waypoints": [
      {
        "id": "loc_1",
        "arrivalTime": "09:30",
        "departureTime": "09:45",
        "distance": 5.2,
        "duration": 15
      },
      {
        "id": "loc_2",
        "arrivalTime": "10:05",
        "departureTime": "10:20",
        "distance": 3.8,
        "duration": 20
      }
    ],
    "totals": {
      "distance": 15.6,
      "duration": 55,
      "emissions": 2.34,
      "cost": 45.80
    },
    "polyline": "encoded_polyline_string",
    "alternatives": []
  }
}
```

#### Get Saved Routes
```http
GET /routes
```

#### Save Route
```http
POST /routes/{id}/save
```

### Carriers

#### Search Carriers
```http
GET /carriers
```
Query parameters:
- `service`: Service type (collection, processing, transport)
- `location`: Service area center
- `radius`: Service radius in km
- `capacity`: Minimum capacity required
- `certification`: Required certifications
- `availability`: Date range

**Response:**
```json
{
  "data": [
    {
      "id": "car_123",
      "name": "EcoTransport Ltd",
      "services": ["collection", "transport"],
      "coverage": {
        "areas": ["London", "Birmingham", "Manchester"],
        "radius": 100
      },
      "fleet": {
        "vehicles": 25,
        "types": ["van", "truck"],
        "capacity": {
          "min": 100,
          "max": 5000,
          "unit": "liters"
        }
      },
      "certifications": [
        {
          "type": "ISO14001",
          "validUntil": "2025-06-30"
        }
      ],
      "rating": 4.7,
      "completedJobs": 1250,
      "responseTime": "2 hours",
      "pricing": {
        "model": "per_km_and_volume",
        "baseRate": 50,
        "perKm": 2.5,
        "perLiter": 0.05
      },
      "sustainability": {
        "fleetEmissionClass": "EURO6",
        "carbonOffset": true,
        "greenEnergy": 80
      }
    }
  ],
  "pagination": {
    "cursor": "eyJpZCI6MTQzfQ",
    "hasMore": true
  }
}
```

#### Get Carrier Details
```http
GET /carriers/{id}
```

#### Request Quote
```http
POST /carriers/{id}/quote
```

**Request Body:**
```json
{
  "service": "collection",
  "locations": [
    {
      "address": "123 Main St",
      "coordinates": {
        "lat": 51.5074,
        "lng": -0.1278
      },
      "volume": 200
    }
  ],
  "date": "2024-01-20",
  "timeWindow": {
    "start": "09:00",
    "end": "12:00"
  },
  "requirements": {
    "certification": ["ISCC"],
    "equipment": ["pump", "sealed_container"]
  }
}
```

### Messages

#### Get Conversations
```http
GET /messages/conversations
```

#### Get Messages
```http
GET /messages/conversations/{id}/messages
```

#### Send Message
```http
POST /messages/conversations/{id}/messages
```

**Request Body:**
```json
{
  "content": "Hello, I'm interested in your cooking oil listing.",
  "attachments": [
    {
      "type": "route",
      "data": {
        "routeId": "rt_789",
        "summary": "Optimized route for 5 pickups"
      }
    }
  ]
}
```

#### Create Conversation
```http
POST /messages/conversations
```

### Transactions

#### Create Transaction
```http
POST /transactions
```

**Request Body:**
```json
{
  "type": "purchase",
  "listingId": "lst_123",
  "quantity": 300,
  "price": 255,
  "deliveryDetails": {
    "method": "carrier",
    "carrierId": "car_456",
    "scheduledDate": "2024-01-25"
  },
  "payment": {
    "method": "bank_transfer",
    "terms": "net_30"
  }
}
```

#### Get Transaction
```http
GET /transactions/{id}
```

#### Update Transaction Status
```http
PUT /transactions/{id}/status
```

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Delivery completed successfully"
}
```

### Analytics

#### Get Dashboard Stats
```http
GET /analytics/dashboard
```

**Response:**
```json
{
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": {
    "totalVolume": 15000,
    "totalTransactions": 45,
    "totalRevenue": 12750,
    "carbonSaved": 1850,
    "activeListings": 23,
    "completionRate": 0.92
  },
  "trends": {
    "volume": [
      {"date": "2024-01-01", "value": 450},
      {"date": "2024-01-02", "value": 520}
    ],
    "revenue": [
      {"date": "2024-01-01", "value": 382.50},
      {"date": "2024-01-02", "value": 442.00}
    ]
  }
}
```

#### Get Supply Trends
```http
GET /analytics/supply-trends
```

#### Get Carbon Impact
```http
GET /analytics/carbon-impact
```

### Notifications

#### Get Notifications
```http
GET /notifications
```

#### Mark as Read
```http
PUT /notifications/{id}/read
```

#### Update Preferences
```http
PUT /notifications/preferences
```

## Webhooks

Configure webhooks to receive real-time updates:

### Available Events
- `listing.created`
- `listing.updated`
- `transaction.created`
- `transaction.status_changed`
- `message.received`
- `route.optimized`

### Webhook Payload Format
```json
{
  "event": "transaction.status_changed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "transactionId": "trx_123",
    "oldStatus": "pending",
    "newStatus": "confirmed",
    "metadata": {}
  }
}
```

### Webhook Security
All webhook requests include a signature header:
```http
X-Webhook-Signature: sha256=a1b2c3d4e5f6...
```

Verify the signature using your webhook secret.

## SDKs and Code Examples

### JavaScript/TypeScript
```typescript
import { ReLoopClient } from '@reloop/sdk';

const client = new ReLoopClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Get listings
const listings = await client.listings.list({
  type: 'cooking-oil',
  location: { lat: 51.5074, lng: -0.1278 },
  radius: 25
});

// Calculate route
const route = await client.routes.calculate({
  origin: { lat: 51.5074, lng: -0.1278 },
  destinations: [
    { id: 'loc_1', lat: 51.5154, lng: -0.1423, volume: 200 }
  ]
});
```

### Python
```python
from reloop import ReLoopClient

client = ReLoopClient(
    api_key='your-api-key',
    environment='production'
)

# Get listings
listings = client.listings.list(
    type='cooking-oil',
    location={'lat': 51.5074, 'lng': -0.1278},
    radius=25
)

# Calculate route
route = client.routes.calculate(
    origin={'lat': 51.5074, 'lng': -0.1278},
    destinations=[
        {'id': 'loc_1', 'lat': 51.5154, 'lng': -0.1423, 'volume': 200}
    ]
)
```

### cURL Examples
```bash
# Get listings
curl -X GET 'https://api.reloop.eco/v1/listings?type=cooking-oil&limit=10' \
  -H 'Authorization: Bearer your-token'

# Create listing
curl -X POST 'https://api.reloop.eco/v1/listings' \
  -H 'Authorization: Bearer your-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "cooking-oil",
    "title": "Restaurant Grade Oil",
    "volume": 500,
    "unit": "liters",
    "price": 0.85
  }'
```

## Support

For API support:
- Email: api@reloop.eco
- Developer Portal: https://developers.reloop.eco
- Status Page: https://status.reloop.eco
