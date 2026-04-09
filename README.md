# Perfect Pick Store — Backend API

A RESTful API for Perfect Pick, a retail store selling bags, shoes, jewelry, and gifts. Built with Node.js, Express, and MongoDB Atlas.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT + bcryptjs
- **Deployment:** Koyeb

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- npm

### Installation

```bash
git clone https://github.com/winstone-1/Perfect-Pick-server.git
cd Perfect-Pick-server
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Private |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/cart` | Private |
| POST | `/api/cart` | Private |
| PUT | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart` | Private |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/myorders` | Private |
| GET | `/api/orders/:id` | Private |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/admin/products` | Admin |
| PUT | `/api/admin/products/:id` | Admin |
| DELETE | `/api/admin/products/:id` | Admin |
| GET | `/api/admin/orders` | Admin |
| PUT | `/api/admin/orders/:id` | Admin |
| GET | `/api/admin/users` | Admin |

## Query Parameters

Products endpoint supports:
- `?category=bags` — filter by category (bags, shoes, jewelry, gifts)
- `?search=keyword` — search by product name
- `?sort=price_asc` — sort by price ascending
- `?sort=price_desc` — sort by price descending

## Inventory

Stock is tracked per variant (size or color) on each product. Orders automatically deduct stock on placement.

