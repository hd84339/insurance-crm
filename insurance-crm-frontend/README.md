# Insurance CRM Frontend

React-based frontend application for the Insurance & Mutual Fund CRM system.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:5000

### Installation

1. **Install Dependencies**
   ```bash
   cd insurance-crm-frontend
   npm install
   ```

2. **Environment Setup**
   
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Frontend will run at: http://localhost:3000

## 📁 Project Structure

```
insurance-crm-frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.jsx   # Main layout with navigation
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   ├── Policies.jsx
│   │   ├── Claims.jsx
│   │   ├── Reminders.jsx
│   │   ├── Targets.jsx
│   │   └── Reports.jsx
│   ├── services/        # API services
│   │   └── api.js       # Axios configuration & API calls
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
└── package.json         # Dependencies
```

## 🎨 Features

### Implemented
- ✅ Dashboard with statistics
- ✅ Client management listing
- ✅ Responsive navigation
- ✅ API integration
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

### Pages Structure
- **Dashboard** - Overview with stats and charts
- **Clients** - Client list with search and filters
- **Policies** - Policy management
- **Claims** - Claims tracking
- **Reminders** - Notification management
- **Targets** - Performance tracking
- **Reports** - Analytics and exports

## 🔧 Technologies

- **React 18** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Recharts** - Charts (ready to use)

## 📡 API Integration

All API calls are centralized in `src/services/api.js`:

```javascript
import { clientAPI, policyAPI, claimAPI } from './services/api';

// Example usage
const clients = await clientAPI.getAll({ page: 1, limit: 10 });
const policy = await policyAPI.getById(id);
const claim = await claimAPI.create(data);
```

Available APIs:
- `clientAPI` - Client operations
- `policyAPI` - Policy operations
- `claimAPI` - Claim operations
- `reminderAPI` - Reminder operations
- `targetAPI` - Target operations
- `reportAPI` - Report generation

## 🎯 Development

### Running Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔐 Authentication

Currently, the frontend has basic authentication setup. To add full authentication:

1. Implement login page
2. Store JWT token in localStorage
3. Add token to API requests (already configured)
4. Add protected routes
5. Handle token expiration

## 🎨 Styling

### Tailwind CSS Utilities

Pre-configured utility classes in `index.css`:

```css
.btn-primary      /* Blue primary button */
.btn-secondary    /* Gray secondary button */
.btn-danger       /* Red danger button */
.input-field      /* Styled input field */
.card             /* White card container */
.badge            /* Small badge */
.badge-success    /* Green badge */
.badge-warning    /* Yellow badge */
.badge-danger     /* Red badge */
```

### Customization

Edit `tailwind.config.js` to customize:
- Colors
- Spacing
- Fonts
- Breakpoints

## 📱 Responsive Design

The UI is mobile-responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔄 State Management

Currently using React hooks (useState, useEffect). For complex state:

Consider adding:
- **React Context** - Global state
- **React Query** - Server state management
- **Zustand** - Lightweight state management

## 🧪 Testing

To add testing:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Create `vite.config.js` test configuration and add tests in `__tests__` folders.

## 📦 Production Deployment

### Build
```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Deploy Options

**Vercel**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy
```

**AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
```

**Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/insurance-crm/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 Environment Variables

Create `.env` for different environments:

**.env.development**
```env
VITE_API_URL=http://localhost:5000/api
```

**.env.production**
```env
VITE_API_URL=https://api.yourcompany.com/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
export default defineConfig({
  server: {
    port: 3001
  }
})
```

### API Connection Failed
- Check backend is running
- Verify VITE_API_URL in .env
- Check CORS settings in backend

### Build Errors
```bash
# Clear cache
rm -rf node_modules
npm install
```

## 📚 Additional Features to Implement

- [ ] Complete CRUD forms for all entities
- [ ] Advanced filtering and sorting
- [ ] Data visualization charts
- [ ] File upload for documents
- [ ] Bulk operations
- [ ] Export to Excel/PDF
- [ ] Print functionality
- [ ] Email integration
- [ ] Calendar view for reminders
- [ ] Real-time notifications

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC License
