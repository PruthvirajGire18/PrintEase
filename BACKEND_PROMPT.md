# Backend Implementation Prompt for PrintEase

I need to implement a complete backend for PrintEase document printing service. Here are the requirements:

## Tech Stack
- Node.js with Express
- MongoDB with Mongoose
- Cloudinary for file storage
- Razorpay for payment gateway
- JWT for authentication

## Database Models Needed

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  createdAt: Date
}
```

### Order Model
```javascript
{
  userId: ObjectId (ref: User),
  orderNumber: String (unique),
  files: [{
    filename: String,
    cloudinaryUrl: String,
    publicId: String,
    pages: Number,
    copies: Number,
    color: String,
    doubleSided: Boolean
  }],
  totalPages: Number,
  totalAmount: Number,
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  paymentId: String (Razorpay payment ID),
  orderStatus: String (enum: ['pending', 'processing', 'ready', 'delivered']),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Required

### Authentication
1. `POST /api/signup` - User registration
   - Body: { name, email, password, role }
   - Hash password
   - Return: { message, user }

2. `POST /api/login` - User login
   - Body: { email, password }
   - Verify credentials
   - Generate JWT token
   - Return: { token, user: { _id, name, email, role } }

### File Upload & Orders
3. `POST /api/upload` - Upload files and create order
   - Middleware: JWT authentication
   - **Request Body (multipart/form-data):**
     - `files`: Array of files (PDF, DOCX, JPG, PNG)
     - `filesData`: JSON string with array of objects:
       ```json
       [
         {
           "name": "document.pdf",
           "pages": 6,
           "copies": 2,
           "color": "color",
           "doubleSided": true
         }
       ]
       ```
     - `paymentId`: Razorpay payment ID (from payment success)
   - Process:
     1. Upload files to Cloudinary
     2. For each file, store:
        - Original filename
        - Cloudinary URL
        - Cloudinary public_id
        - Pages count
        - Copies requested
        - Color mode (color/bw)
        - Double-sided flag
     3. Calculate: totalPages = sum(all pages), totalAmount = sum(pages × copies × pricePerPage) for each file
       - Use price per page based on color mode: ₹5 for color, ₹2 for BW
     4. Create order in database with:
        - paymentStatus: 'paid'
        - paymentId: provided Razorpay payment ID
        - orderStatus: 'processing'
     5. Generate unique order number (e.g., ORDER-20250103-123456)
   - Return: { success: true, order: { orderNumber, _id, orderStatus, paymentStatus, totalAmount, totalPages } }

4. `POST /api/orders/:orderId/payment` - Verify Razorpay payment (OPTIONAL - payment already verified before upload)
   - Middleware: JWT authentication
   - Can verify Razorpay signature if needed
   - Return: { success: true, message }
   
   Note: Since payment happens on frontend before file upload, this endpoint may not be needed. The /upload endpoint already marks payment as 'paid'.

### Order Management
5. `GET /api/orders` - Get user's orders (for dashboard)
   - Middleware: JWT authentication
   - Return user's orders sorted by date

6. `GET /api/orders/:orderNumber` - Track order by order number
   - Public endpoint (no auth required for tracking)
   - Return order details including status

### Admin Endpoints
7. `GET /api/admin/orders` - Get all orders (admin only)
   - Middleware: JWT authentication + admin check
   - Return all orders with user details

8. `PUT /api/admin/orders/:orderId/status` - Update order status (admin only)
   - Middleware: JWT authentication + admin check
   - Body: { status }
   - Update order status
   - Return: { success: true, order }

9. `GET /api/admin/stats` - Get dashboard statistics (admin only)
   - Total orders
   - Pending orders
   - Processing orders
   - Ready orders
   - Total revenue

## Environment Variables Needed
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/printease
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_Ra9fEmIOrbpoXw
RAZORPAY_KEY_SECRET=Q1Tvv4AcNkw7tjTRMqxiiBxh
```

## Key Features to Implement

1. **File Upload with Cloudinary**
   - Accept multiple files
   - Store in Cloudinary
   - Keep track of public_id for deletion if needed

2. **Razorpay Integration**
   - No need to create orders on backend for now (frontend handles it)
   - Just verify payment signature on callback

3. **Order Tracking**
   - Unique order number format: ORDER-YYYYMMDD-XXXXXX
   - Public tracking endpoint

4. **Admin Dashboard**
   - View all orders
   - Update order status
   - View statistics

## Important Notes

1. Frontend sends payment data from Razorpay, backend needs to verify signature
2. File upload should accept multiple files
3. Each file needs to store: original name, Cloudinary URL, pages, copies, color, doubleSided
4. Calculate totalAmount based on pages × copies × price per page
   - Color printing: ₹5 per page
   - Black & White printing: ₹2 per page
5. User can be 'user' or 'admin' (admin created manually or via signup)
6. Use bcrypt for password hashing
7. Use jsonwebtoken for JWT tokens
8. CORS enabled for frontend (localhost:5173)

## Dependencies to Install
```
express
mongoose
bcryptjs
jsonwebtoken
cloudinary
razorpay
multer
cors
dotenv
```

Please implement a clean, production-ready backend with proper error handling, validation, and security best practices.

