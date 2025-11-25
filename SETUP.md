# Croxora - Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB:
  ```bash
  # Windows
  net start MongoDB
  
  # macOS/Linux
  sudo systemctl start mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `backend/.env`

### 3. Get Stripe API Keys

1. Sign up at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy **Publishable key** and **Secret key** (test mode)
4. Add to both `backend/.env` and `frontend/.env`

**Test Card Number:** 4242 4242 4242 4242 (any future date, any CVC)

### 4. Get Cloudinary Credentials (Optional)

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy **Cloud Name**, **API Key**, and **API Secret**
4. Add to `backend/.env`

### 5. Configure Environment Files

**Backend:** Copy `backend/.env.example` to `backend/.env` and update:
```env
MONGO_URI=mongodb://localhost:27017/croxora
JWT_SECRET=your_long_random_secret_key_min_32_characters
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend:** Copy `frontend/.env.example` to `frontend/.env` and update:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 6. Seed Database (Optional)

Add sample products and admin user:

```bash
cd backend
npm run seed
```

**Admin Login:**
- Email: admin@croxora.com
- Password: admin123

### 7. Start the Application

**Option A: Run Both Servers (Recommended)**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 8. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## Default Accounts After Seeding

**Admin Account:**
- Email: admin@croxora.com
- Password: admin123
- Can create/edit/delete products

**Create User Account:**
- Register at http://localhost:5173/register
- Normal user permissions

## Common Issues

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- For Atlas: whitelist your IP address

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

### Stripe Errors
- Ensure you're using **test mode** keys
- Keys must match in both backend and frontend
- Test card: 4242 4242 4242 4242

### CORS Errors
- Check CLIENT_URL in `backend/.env` matches frontend URL
- Default: http://localhost:5173

## Next Steps

1. ✅ Browse products at http://localhost:5173/products
2. ✅ Register a new account
3. ✅ Add items to cart
4. ✅ Complete checkout with test card
5. ✅ View orders in profile

## Admin Features

Login with admin account to:
- Create new products
- Update existing products
- Delete products
- Manage orders

Admin routes are protected and require admin role.

## Development Tips

- Backend auto-reloads with Nodemon
- Frontend auto-reloads with Vite HMR
- Check terminal for errors
- MongoDB logs: `mongod.log`
- API testing: Use Postman or Thunder Client

Enjoy building with Croxora! 🚀
