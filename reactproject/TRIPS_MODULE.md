# Trips Module - Complete Implementation Guide

## Overview
A comprehensive, production-ready Trips module for a tourism website built with React, TypeScript, Bootstrap, and React Query. The module includes public-facing pages, an advanced admin dashboard, and complete trip management features.

## Features Implemented

### 1. **Public Pages**

#### `/trips` - Trips Listing Page
- **Features:**
  - Display trips as modern responsive cards
  - Advanced filtering sidebar (search, destination, price range, trip type)
  - Sorting options (price low→high, price high→low, newest)
  - Pagination with configurable page size
  - Skeleton loaders during data fetch
  - Empty states with helpful messages
  - Error handling with retry functionality
  - Responsive grid layout (1 column mobile, 2 columns desktop)

- **Components Used:**
  - `FilterSidebar` - Advanced filtering with multiple filter options
  - `TripCard` - Individual trip card display
  - `Pagination` - Page navigation component
  - `TripCardSkeleton` - Loading placeholder
  - `ErrorComponent` - Error state display

#### `/trips/:id` - Trip Details Page
- **Features:**
  - Full trip information display
  - Gallery slider with primary image support
  - Sections: Highlights, Includes, Excludes, What to Bring
  - Related trips display (recommended enhancement)
  - Booking CTA section
  - Back to trips navigation
  - Responsive layout with sticky sidebar

- **Displays:**
  - All multilingual content
  - Available days and duration
  - Pricing for adults and children
  - Trip type and destination
  - Comprehensive trip details

### 2. **Admin Dashboard**

#### `/dashboard/trips` - Trips Management Table
- **Features:**
  - Table view of all trips
  - Search functionality
  - Filtering options
  - Pagination
  - Status badges (Active/Inactive)
  - Quick actions dropdown
  - Trip image thumbnails
  - Duration and price display

- **Actions:**
  - Edit trip (navigate to edit page)
  - Deactivate trip (with confirmation)
  - Reactivate trip (with confirmation)
  - View trip details

#### `/dashboard/trips/create` - Create Trip (Multi-step Form)
- **Features:**
  - 4-step wizard interface with progress bar
  - Form validation with Zod schema
  - Toast notifications for feedback
  - Error handling and display

**Step 1: Basic Information**
- Multilingual name input (8 languages: en, fr, ru, it, ro, es, de, bl)
- Multilingual destination input
- Multilingual description input
- English required validation

**Step 2: Trip Details**
- Start time (datetime picker)
- Duration value and type (days/hours)
- Adult and child pricing
- Trip type selection (dynamic dropdown from API)
- Available days selection (Monday-Sunday checkboxes)

**Step 3: Dynamic Lists**
- Highlights (multilingual, add/remove items)
- Includes (multilingual, add/remove items)
- Excludes (multilingual, add/remove items)
- What to Bring (multilingual, add/remove items)

**Step 4: Review & Submit**
- Summary table of all entered data
- Visual confirmation before submission
- Submit button triggers API POST request

#### `/dashboard/trips/edit/:id` - Edit Trip
- **Features:**
  - Pre-populated form with existing trip data
  - Same 4-step wizard as create
  - Image management sidebar (sticky)
  - Split layout: Form (left) + Images (right)

**Image Management:**
- Drag & drop file upload
- Multiple file upload support
- Image preview with thumbnails
- Set primary image functionality
- Delete image with confirmation
- Upload progress indicator
- Upload/delete/set-primary error handling

## API Integration

### Endpoints Used
```javascript
// List trips with filtering
GET /api/Trips?page=1&pageSize=6&search=...&typeId=...&minPrice=...&maxPrice=...&sortBy=...

// Get single trip
GET /api/Trips/:id

// Create trip
POST /api/Trips
Body: {
  name: { en: string, ... },
  destination: { en: string, ... },
  description: { en: string, ... },
  timeFrom: string | null,
  durationValue: number,
  durationType: 'days' | 'hours',
  adultPrice: number,
  childPrice: number,
  tripTypeId: number,
  availabilityDays: number[],
  highlights: object[],
  includes: object[],
  excludes: object[],
  whatToBring: object[],
  isActive: boolean
}

// Update trip
PUT /api/Trips/:id
Body: (same as POST)

// Deactivate trip
DELETE /api/Trips/:id/deactivate

// Reactivate trip
PUT /api/Trips/:id/reactivate

// Upload image
POST /api/Trips/:id/image
Content-Type: multipart/form-data
Body: { image: File }

// Delete image
DELETE /api/Trips/:id/image/:imageId

// Set primary image
PUT /api/Trips/:id/image/:imageId/set-primary

// Get trip types (for dropdowns)
GET /api/TripTypes
```

### Multilingual Support
- All requests automatically include `Accept-Language` header from localStorage
- Supports 8 languages: en, fr, ru, it, ro, es, de, bl
- Language stored in localStorage key: `ethereal-lang`

## State Management

### React Query Integration
All data fetching uses React Query with:
- Automatic caching
- Background refetching
- Optimistic updates support
- Stale-while-revalidate pattern

### Custom Hooks
```javascript
// Queries
useTrips(params)           // List trips with pagination & filters
useTrip(id)               // Get single trip

// Mutations
useCreateTrip()           // Create new trip
useUpdateTrip()           // Update existing trip
useDeactivateTrip()       // Deactivate trip
useReactivateTrip()       // Reactivate trip
useUploadTripImages()     // Upload images
useDeleteTripImage()      // Delete image
useSetPrimaryImage()      // Set primary image
```

## Form Validation

### Zod Schema
Located in implementation:
- All multilingual fields require English version
- Price validation (must be >= 0)
- Duration validation (must be >= 1)
- At least one available day required
- Trip type required

### Error Handling
- Field-level validation errors displayed under inputs
- Form submission validation blocks if errors exist
- API error messages shown in toast notifications
- 400/404 errors automatically handled with user feedback

## UI/UX Components

### Loading States
- Skeleton loaders for trip cards
- Spinner for full-page loading
- Progressive enhancement during navigation

### Empty States
- Friendly messages when no trips found
- Helpful instructions in image upload area
- Empty list placeholders

### Notifications
- Success messages after create/update
- Error messages with specific failure reasons
- Toast notifications (react-hot-toast) for all actions

### Modals & Confirmations
- Confirmation dialogs for destructive actions (delete, deactivate)
- Prevent accidental data loss

### Responsive Design
- Mobile-first approach
- Bootstrap grid system (col-1, col-md-2, etc.)
- Sticky sidebar for image management
- Touch-friendly buttons and controls
- Optimized for: Mobile, Tablet, Desktop

## File Structure

```
src/
├── pages/
│   ├── Trips/
│   │   ├── Trips.jsx                    # Public trips listing
│   │   └── Trips.module.css
│   ├── TripDetails/
│   │   ├── TripDetails.jsx              # Public trip details
│   │   └── TripDetails.module.css
│   └── AdminDashboard/TripsAdmin/
│       ├── TripsAdmin.jsx               # Admin trips table
│       ├── CreateTrip.jsx               # Create trip page
│       ├── EditTrip.jsx                 # Edit trip page
│       ├── TripFormWizard.jsx           # 4-step form wizard
│       ├── TripFormWizard.module.css
│       ├── Step1BasicInfo.jsx           # Step 1 component
│       ├── Step2TripDetails.jsx         # Step 2 component
│       ├── Step3Lists.jsx               # Step 3 component
│       ├── Step4Review.jsx              # Step 4 component
│       └── TripForm.jsx                 # Legacy modal form (kept)
├── components/
│   ├── TripCard/
│   │   ├── TripCard.jsx
│   │   └── TripCard.module.css
│   ├── FilterSidebar/
│   │   ├── FilterSidebar.jsx
│   │   └── FilterSidebar.module.css
│   ├── ImageManagement.jsx              # Image upload/delete UI
│   ├── ui/
│   │   ├── Loading.jsx                  # Skeleton loaders
│   │   └── Error.jsx                    # Error component
│   └── pagination/
│       └── Pagination.jsx
├── hooks/
│   └── useTrips.js                      # All trip-related hooks
├── services/
│   └── trips.service.js                 # API service layer
├── routes/
│   └── AppRoutes.jsx                    # Updated with new routes
└── context/
    ├── LanguageContext.jsx              # Multilingual support
    └── AuthContext.jsx
```

## How to Use

### For Users
1. Navigate to `/trips` to browse available trips
2. Use filters to find specific trips (search, price, type)
3. Sort trips by price or newest
4. Click on a trip card to view full details at `/trips/:id`
5. See pricing, duration, highlights, and booking info

### For Admins
1. Go to `/dashboard/trips` to see all trips
2. Click "Add Trip" button to create new trip → `/dashboard/trips/create`
3. Fill out 4-step form:
   - Step 1: Basic info (name, destination, description in all languages)
   - Step 2: Details (pricing, duration, availability)
   - Step 3: Lists (highlights, includes, excludes, what to bring)
   - Step 4: Review before submit
4. After creation, manage images
5. Click edit button on trip row → `/dashboard/trips/edit/:id`
6. Update trip details and manage images (upload, delete, set primary)
7. Deactivate/reactivate trips using status buttons

## Configuration

### Environment Variables
```
VITE_API_BASE_URL=https://your-api-url.com
```

### Multilingual Languages
Edit the `SUPPORTED_LANGUAGES` array in `TripFormWizard.jsx`:
```javascript
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ru', 'it', 'ro', 'es', 'de', 'bl'];
```

### Default Pagination
- Page size: 6 items (configurable)
- Max page size: 100 items

## Best Practices Implemented

✅ **Separation of Concerns**
- API logic in `services/`
- Data fetching in custom hooks
- UI in components/pages
- Validation in schemas

✅ **Performance**
- React Query caching prevents unnecessary API calls
- Skeleton loaders improve perceived performance
- Lazy image loading
- Component memoization where needed

✅ **Error Handling**
- Try-catch blocks in mutation handlers
- Graceful API error display
- User-friendly error messages
- Automatic retry for failed requests

✅ **Accessibility**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

✅ **Code Quality**
- Modular, reusable components
- Consistent naming conventions
- Comments for complex logic
- Error boundaries for crash prevention

## Future Enhancements

Recommended additions:
1. ✨ Image reordering (drag & drop)
2. ✨ Bulk trip operations (select multiple, export CSV)
3. ✨ Trip templates for quick creation
4. ✨ Analytics dashboard (views, bookings)
5. ✨ SEO fields (slug, meta title, description)
6. ✨ Trip availability calendar
7. ✨ Featured trips section
8. ✨ Related trips recommendation engine
9. ✨ Trip reviews and ratings
10. ✨ Email notifications for trip updates

## Troubleshooting

### Trips not loading
- Check network tab for API errors
- Verify API endpoint is correct in `trips.service.js`
- Check authentication token in browser localStorage

### Images not uploading
- Ensure `Content-Type: multipart/form-data` header is set
- Check file size limits on server
- Verify image format is supported (jpg, png, gif, webp)

### Filters not working
- Check if query parameters are being sent to API
- Verify API supports the filter parameters
- Check filterSidebar state updates

### Form validation errors
- Ensure English name is provided (required)
- Check all required fields are filled
- Verify price values are non-negative numbers

## Dependencies
- ✅ @tanstack/react-query (Data fetching & caching)
- ✅ react-hook-form (Form management)
- ✅ @hookform/resolvers (Form validation resolvers)
- ✅ zod (Schema validation)
- ✅ react-hot-toast (Notifications)
- ✅ react-bootstrap (UI components)
- ✅ bootstrap (CSS framework)
- ✅ react-icons (Icon library)
- ✅ react-router-dom (Routing)
- ✅ axios (HTTP client)

## Production Checklist

- [ ] Run `npm run build` and verify no errors
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Test image upload with multiple files
- [ ] Verify multilingual form submission
- [ ] Test on mobile devices
- [ ] Check keyboard navigation
- [ ] Verify error states and error messages
- [ ] Test with slow network (DevTools throttle)
- [ ] Verify all API endpoints are correct
- [ ] Test authentication/authorization
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

## Support & Maintenance

For issues or questions:
1. Check browser console for errors
2. Check network tab for API responses
3. Review React Query DevTools cache
4. Test with sample data first
5. Verify API endpoint responses match expected format

---

**Built with ❤️ for Tourism Web Applications**
