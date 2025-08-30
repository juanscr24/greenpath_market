# GreenPath Market - Frontend

A modern, responsive marketplace frontend built with vanilla JavaScript, HTML, and CSS, designed to connect rural producers with consumers through a direct digital marketplace.

## Project Overview

GreenPath Market is an innovative solution aimed at rural-area merchants. Its main goal is to strengthen the local economy by providing a digital space where producers can sell their goods directly, without intermediaries.

## Project Structure

```
frontend/
├── index.html              # Landing page
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite build configuration
├── db.json                 # Mock database for development
├── src/
│   ├── assets/
│   │   ├── css/           # Stylesheets organized by feature
│   │   │   ├── index.css
│   │   │   ├── auth.css
│   │   │   ├── admin.css
│   │   │   ├── dashboard.css
│   │   │   ├── navbar.css
│   │   │   ├── card.css
│   │   │   ├── ofers.css
│   │   │   ├── profile.css
│   │   │   └── shopping_car.css
│   │   ├── js/            # JavaScript modules
│   │   │   ├── main.js
│   │   │   ├── auth.js
│   │   │   ├── login.js
│   │   │   ├── register.js
│   │   │   ├── logout.js
│   │   │   ├── dashboard.js
│   │   │   ├── admin.js
│   │   │   ├── profile.js
│   │   │   ├── search.js
│   │   │   ├── addProduct.js
│   │   │   └── guard/     # Route guards
│   │   │       ├── hero.guard.js
│   │   │       ├── dashboard.guard.js
│   │   │       └── login.guard.js
│   │   ├── img/           # Images and assets
│   │   └── icons/         # Social media icons
│   ├── components/        # Reusable components
│   │   ├── navbar/
│   │   │   ├── navbar.html
│   │   │   └── navbar.css
│   │   └── footer/
│   │       ├── footer.html
│   │       └── footer.css
│   └── views/             # Application pages
│       ├── auth.html      # Authentication page
│       ├── dashboard.html # Main dashboard
│       ├── offers.html    # Product offers
│       ├── profile.html   # User profile
│       ├── shopping_car.html # Shopping cart
│       └── admin.html     # Admin panel
```

## Technologies Used

- **Vite** - Fast build tool and development server
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with custom properties
- **HTML5** - Semantic markup
- **Axios** - HTTP client for API requests
- **JSON Server** - Mock API for development

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

The built files will be available in the `dist/` directory.

## Features

### Authentication System
- User registration and login
- JWT token management
- Route protection with guards
- Session persistence

### User Interface
- **Landing Page**: Welcome screen with call-to-action
- **Authentication**: Unified login/register form
- **Dashboard**: Main marketplace interface
- **Product Management**: Add, edit, and view products
- **Shopping Cart**: Add products and manage purchases
- **User Profile**: Personal information and settings
- **Admin Panel**: User and content management

### Responsive Design
- Mobile-first approach
- Cross-browser compatibility
- Adaptive layouts for all screen sizes

## Design Principles

- **Clean UI**: Minimalist design focused on content
- **Intuitive Navigation**: Easy-to-use interface
- **Performance**: Optimized assets and lazy loading
- **Accessibility**: WCAG compliant where possible

## Configuration

### Vite Configuration
The project uses Vite with multiple entry points configured in `vite.config.js`:

```javascript
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                auth: resolve(__dirname, "./src/views/auth.html"),
                dashboard: resolve(__dirname, "./src/views/dashboard.html"),
                ofers: resolve(__dirname, "./src/views/ofers.html"),
                profile: resolve(__dirname, "./src/views/profile.html"),
                shoppingCard: resolve(__dirname, "./src/views/shopping_card.html"),
                admin: resolve(__dirname, "./src/views/admin.html")
            },
        },
    },
});
```

### Environment Variables
Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=GreenPath Market
```

## API Integration

The frontend communicates with the backend API through Axios:

```javascript
// Example API call
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE}/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Login failed');
    }
}
```

## Testing

### Development Testing
1. Start both development servers:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend (if using mock data)
   npx json-server --watch db.json --port 3001
   ```

2. Open `http://localhost:5173` in your browser

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Team

- **Juan Cardona** - Development & Design
- **Forlan Ordoñez** - Development & Design
- **Daniel Rojas** - Development
- **Camilo Parra** - Development
- **Wilson Delgado** - Development

## Support

For support or questions, please create an issue in the GitHub repository or contact the development team.

---

**GreenPath Market** - Connecting rural producers with consumers since 2025 🌱
