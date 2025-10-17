# Hotel Booking System - Frontend

This is the React frontend application for the Hotel Room Booking Management System built with Material-UI.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   The application will automatically open at `http://localhost:3000`

## 🎨 Features

### Room Management
- **View All Rooms** - Comprehensive table with filtering and sorting
- **Add New Room** - Form with validation and multi-select amenities
- **Edit Room** - Pre-populated form with availability toggle
- **Delete Room** - Confirmation dialog with safety checks

### Advanced Features
- **Real-time Search** - Search by room number or type
- **Filtering** - Filter by room type and availability
- **Sorting** - Sort by price (ascending/descending) and room number
- **Statistics** - Dashboard with room counts and average pricing
- **Responsive Design** - Works on desktop, tablet, and mobile

### User Experience
- **Loading Indicators** - Visual feedback during API operations
- **Error Handling** - User-friendly error messages
- **Success Notifications** - Confirmation of successful operations
- **Form Validation** - Real-time validation with helpful messages

## 🏗️ Component Structure

### Main Components

#### App.js
- Main application component
- Sets up routing and theme
- Provides global layout structure

#### Navbar.jsx
- Navigation header with active route highlighting
- Clean, responsive design with Material-UI AppBar

#### RoomList.jsx
- Main dashboard component
- Displays rooms in a responsive table
- Includes filtering, searching, and sorting functionality
- Shows statistics cards
- Handles room deletion with confirmation

#### AddRoom.jsx
- Form for creating new rooms
- Comprehensive validation
- Multi-select amenities dropdown
- Real-time character counting
- Success/error handling

#### EditRoom.jsx
- Pre-populated form for editing existing rooms
- Availability toggle switch
- Same validation as AddRoom
- Fetches room data on component mount

### Services

#### api.js
- Centralized API service using Axios
- Handles all HTTP requests to the backend
- Includes proper error handling
- Base URL configuration

## 🎨 UI/UX Design

### Material-UI Theme
- Custom theme with primary and secondary colors
- Consistent spacing and typography
- Responsive breakpoints

### Color Scheme
- **Primary**: Blue (#1976d2)
- **Secondary**: Pink (#dc004e)
- **Success**: Green (for available rooms)
- **Error**: Red (for occupied rooms and errors)

### Typography
- Clean, readable fonts
- Proper hierarchy with different font sizes
- Consistent spacing and alignment

## 📱 Responsive Design

### Breakpoints
- **xs**: 0px and up (mobile)
- **sm**: 600px and up (tablet)
- **md**: 900px and up (desktop)
- **lg**: 1200px and up (large desktop)

### Mobile Optimization
- Responsive tables that stack on mobile
- Touch-friendly buttons and inputs
- Optimized form layouts for small screens

## 🔧 Configuration

### API Configuration
The frontend is configured to connect to the backend at:
```
http://localhost:5000/api
```

### Proxy Configuration
The `package.json` includes a proxy setting for development:
```json
"proxy": "http://localhost:5000"
```

## 📊 State Management

### Local State
- Uses React hooks (useState, useEffect)
- Component-level state for forms and UI
- No external state management library required

### Data Flow
1. Components fetch data from API service
2. Local state updates trigger re-renders
3. User interactions update state and trigger API calls
4. Success/error states provide user feedback

## 🎯 User Interactions

### Room List
- **Search**: Real-time search with debouncing
- **Filter**: Dropdown filters for type and availability
- **Sort**: Sort options for price and room number
- **Toggle Availability**: Click chip to toggle room status
- **Edit**: Click edit icon to navigate to edit form
- **Delete**: Click delete icon for confirmation dialog

### Forms
- **Validation**: Real-time validation with error messages
- **Auto-format**: Room numbers automatically uppercase
- **Multi-select**: Amenities with chip display
- **Character Count**: Real-time description character count
- **Loading States**: Disabled inputs during submission

## 🚨 Error Handling

### API Errors
- Network errors show user-friendly messages
- Validation errors display specific field issues
- Server errors provide generic fallback messages

### Form Validation
- Client-side validation before submission
- Real-time validation feedback
- Server-side validation error handling

### User Feedback
- Snackbar notifications for success/error
- Loading spinners during operations
- Disabled states during processing

## 🧪 Testing

### Manual Testing
1. **CRUD Operations**: Test all create, read, update, delete operations
2. **Filtering**: Test all filter combinations
3. **Search**: Test search functionality
4. **Validation**: Test form validation
5. **Responsive**: Test on different screen sizes

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Build and Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify** - Easy deployment with continuous integration
- **Vercel** - Optimized for React applications
- **GitHub Pages** - Free hosting for static sites
- **AWS S3** - Scalable cloud storage
- **Firebase Hosting** - Google's hosting platform

## 📦 Dependencies

### Core Dependencies
- **react** - Frontend library
- **react-dom** - DOM rendering
- **react-router-dom** - Client-side routing

### UI Dependencies
- **@mui/material** - Material-UI components
- **@mui/icons-material** - Material icons
- **@emotion/react** - CSS-in-JS styling
- **@emotion/styled** - Styled components

### Utility Dependencies
- **axios** - HTTP client for API calls

## 🔄 Development Workflow

### File Structure
```
src/
├── components/          # React components
│   ├── Navbar.jsx
│   ├── RoomList.jsx
│   ├── AddRoom.jsx
│   └── EditRoom.jsx
├── services/           # API services
│   └── api.js
├── App.js              # Main app component
└── index.js            # Entry point
```

### Component Guidelines
- Use functional components with hooks
- Implement proper prop validation
- Follow Material-UI design patterns
- Include comprehensive error handling
- Use consistent naming conventions

## 🎨 Customization

### Theme Customization
Edit the theme in `src/index.js`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
    secondary: {
      main: '#your-color',
    },
  },
});
```

### Adding New Features
1. Create new components in `src/components/`
2. Add new API endpoints in `src/services/api.js`
3. Update routing in `src/App.js`
4. Follow existing patterns for consistency

## 🐛 Troubleshooting

### Common Issues
1. **API Connection**: Ensure backend is running on port 5000
2. **CORS Errors**: Check backend CORS configuration
3. **Build Errors**: Clear node_modules and reinstall
4. **Port Conflicts**: Change port in package.json scripts

### Debug Mode
- Use React Developer Tools
- Check browser console for errors
- Verify network requests in DevTools
- Test API endpoints directly
