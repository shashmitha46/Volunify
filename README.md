# Volunteer Community Platform

A comprehensive platform for volunteers to connect, discover community services, and make a positive impact.

## Database Setup Options

### Option 1: Supabase (Recommended for Production)

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Set up the Database Schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database/schema.sql`
   - Run the SQL to create all tables and policies

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Update the Application**
   - The app will automatically use Supabase when environment variables are set
   - Authentication, real-time updates, and file storage are handled by Supabase

### Option 2: Local SQLite Database (Development)

1. **Install SQLite Dependencies**
   ```bash
   npm add sqlite3 sqlite
   ```

2. **Use Local Database**
   - The server will automatically create a local SQLite database
   - Database file: `volunteer_platform.db`
   - No additional configuration needed

### Option 3: PostgreSQL (Self-hosted)

1. **Install PostgreSQL**
   - Install PostgreSQL on your server
   - Create a new database: `volunteer_platform`

2. **Run the Schema**
   - Connect to your PostgreSQL database
   - Execute the SQL from `database/schema.sql`

3. **Update Connection String**
   - Modify `server/database.js` to use PostgreSQL connection
   - Add connection string to environment variables

## Features

### User Management
- User registration and authentication
- Profile management with skills and interests
- Profile image upload and management

### Service Discovery
- Browse volunteer opportunities
- Filter by category, location, and date
- Search functionality
- Location-based service discovery

### Community Connection
- Connect with other volunteers
- Private messaging system
- Skill and interest matching

### Dashboard
- Personal volunteer statistics
- Upcoming events and commitments
- Activity timeline
- Recommended opportunities

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `GET /api/services?category=` - Filter by category
- `GET /api/services?search=` - Search services
- `POST /api/volunteer-for-service/:id` - Register for service

### Volunteers
- `GET /api/volunteers` - Get all volunteers
- `GET /api/volunteers/:id` - Get specific volunteer

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read

## Database Schema

### Users Table
- `id` - Unique identifier
- `name` - Full name
- `email` - Email address (unique)
- `skills` - Array of skills
- `interests` - Array of interests
- `location` - User location
- `phone` - Phone number
- `profile_image` - Profile image URL

### Services Table
- `id` - Unique identifier
- `name` - Service name
- `description` - Service description
- `location_*` - Location coordinates and address
- `category` - Service category
- `volunteers_needed` - Number of volunteers needed
- `date` - Service date
- `time` - Service time
- `organizer` - Organization name
- `requirements` - Array of requirements

### Messages Table
- `id` - Unique identifier
- `sender_id` - Sender user ID
- `receiver_id` - Receiver user ID
- `content` - Message content
- `read` - Read status
- `created_at` - Timestamp

### Volunteer Registrations Table
- `id` - Unique identifier
- `user_id` - User ID
- `service_id` - Service ID
- `registered_at` - Registration timestamp

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Row Level Security (RLS) policies
- Input validation and sanitization
- CORS protection
- Rate limiting (recommended for production)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Database** (choose one option above)

3. **Start the Backend**
   ```bash
   npm run server
   ```

4. **Start the Frontend**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Production Deployment

### Frontend (Netlify/Vercel)
- Build the React app: `npm run build`
- Deploy the `dist` folder

### Backend (Railway/Heroku/DigitalOcean)
- Set up environment variables
- Deploy the server code
- Configure database connection

### Database (Supabase/AWS RDS/DigitalOcean)
- Use managed database service
- Configure connection strings
- Set up backups and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details