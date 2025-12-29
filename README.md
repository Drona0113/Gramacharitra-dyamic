#  Grama Charithra

A comprehensive MERN stack application dedicated to exploring and preserving the sacred villages and rich cultural heritage of Andhra Pradesh. This platform allows users to discover, review, and learn about the historical significance of villages across the region.

##  Features

-  **User Authentication** - Secure login and registration system with JWT tokens
-  **Role-Based Access** - Separate user and admin functionalities
-  **Village Management** - Admin panel for adding, editing, and managing village information
-  **Reviews & Ratings** - Users can share their experiences and rate villages
-  **Smart Search** - Find villages by name or district with ease
-  **Responsive Design** - Seamless experience across all devices
-  **District-Based Filtering** - Explore villages by specific districts in Andhra Pradesh

##  Technology Stack

### Frontend
- **React** - Modern UI library for building interactive interfaces
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast and minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing for security

##  Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Drona0113/Gramacharitra-dyamic.git
cd Gramacharitra-dyamic
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to your `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

```bash
# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
touch .env
```

Add the following to your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Gramacharitra-dyamic/
├── backend/
│   ├── config/          # Database and configuration files
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication and validation
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── context/     # React Context API
│   │   ├── utils/       # Helper functions
│   │   └── App.js       # Main App component
│   └── package.json
│
└── README.md
```

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Villages
- `GET /api/villages` - Get all villages
- `GET /api/villages/:id` - Get single village
- `POST /api/villages` - Create village (admin only)
- `PUT /api/villages/:id` - Update village (admin only)
- `DELETE /api/villages/:id` - Delete village (admin only)
- `GET /api/villages/search?query=` - Search villages

### Reviews
- `POST /api/villages/:id/reviews` - Add review (authenticated)
- `GET /api/villages/:id/reviews` - Get village reviews
- `DELETE /api/reviews/:id` - Delete review (admin/owner)

##  User Roles

### Regular User
- Browse and search villages
- View village details and reviews
- Create and manage their own reviews
- Rate villages

### Admin
- All user permissions
- Add new villages
- Edit village information
- Delete villages
- Moderate reviews

##  Key Features in Detail

### Village Information
Each village page includes:
- Historical background
- Cultural significance
- Geographic location
- District information
- Photo gallery
- User ratings and reviews

### Search & Filter
- Search by village name
- Filter by district
- Sort by ratings
- View on map

##  Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Development Guidelines

- Follow ESLint rules for code consistency
- Write meaningful commit messages
- Add comments for complex logic
- Test features before submitting PR
- Update documentation for new features

##  Known Issues

- Check the [Issues](https://github.com/Drona0113/Gramacharitra-dyamic/issues) page for current bugs and feature requests


##  Authors

- **Drona** - [@Drona0113](https://github.com/Drona0113)
- **Prem Sai Teja** - [@PREMSAITEJA](https://github.com/PREMSAITEJA)

## Acknowledgments

- Thanks to all contributors who help preserve Andhra Pradesh's cultural heritage
- Inspired by the need to document and share village histories
- Built with passion for cultural preservation

##  Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the maintainers

##  Future Enhancements

- [ ] Multi-language support (Telugu, English)
- [ ] Interactive maps integration
- [ ] Mobile application
- [ ] Photo upload functionality
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] PDF export for village information

---

**Made with ❤️ for preserving Andhra Pradesh's cultural heritage**
