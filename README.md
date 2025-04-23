# Election Commission Website

A full-stack web application simulating an Election Commission portal with user registration, voting, result visualization, and more.

## Live Demo

**[View Live Demo](https://web-mini-project-ec.onrender.com/website.html)** - Experience the application in action!

## Features

- **User Authentication**: Complete registration and login system with validation
- **Dashboard**: User profile management with CRUD operations
- **Election Results**: Interactive data visualization using React and Chart.js
- **Candidates Section**: Information about election candidates
- **Services Portal**: Various election-related services
- **Mobile Responsive**: Fully optimized for desktop and mobile devices

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- React.js for interactive components
- Chart.js for data visualization
- Font Awesome icons
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

## Installation and Setup

- Currently connected to MongoDB Atlas, so while cloning is possible, the code for the backend needs to be changed to run on localhost

## Project Structure

```
Web-Mini-Project/
├── models/
│   └── User.js
├── public/
│   ├── js/
│   │   └── results-react.js
│   ├── images/
│   ├── styles_website.css
│   ├── results.html
│   ├── services.html
│   ├── website.html
│   └── ...
├── routes/
│   └── userRoutes.js
├── server.js
└── package.json
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account

### Election Results
- `GET /api/election-results` - Get all election results years
- `GET /api/election-results/:year` - Get results for a specific year

## Key Features Explained

### User Registration & Authentication
- Form validation for all input fields
- Password security requirements
- Secure storage in MongoDB

### Interactive Election Results
- React-based interface with Chart.js integration
- Dynamic data loading from MongoDB
- Year selection for historical data
- Visual representation with pie charts
- Tabular breakdown of voting data

### Responsive Design
- Mobile-first approach ensuring compatibility across devices
- Breakpoints optimized for phones, tablets, and desktops
- Responsive navigation and layouts

## Deployment

This project is deployed using [Render](https://render.com/). The MongoDB database is hosted on MongoDB Atlas.

## Screenshots

- Home Page
- Registration Page
- Dashboard
- Results Page with Charts
- Candidate Information

## Contributors

- [NotTakahashiRyo](https://github.com/NotTakahashiRyo) - Full Stack Developer
