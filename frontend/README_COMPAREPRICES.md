# Compare Rental Prices Feature - Detailed Report

## 1. What is it?

The **Compare Rental Prices** feature is an interactive map-based tool that allows users to search and discover rental properties within a specific geographic radius. It provides a visual representation of property locations and their rental prices, enabling users to compare different rental options in their desired area.

**Key Components:**

- Interactive map interface powered by Leaflet
- Location-based property search
- Radius-based filtering (default 2km, adjustable)
- Visual markers for properties and user location
- Real-time property count and pricing information

## 2. Why Do We Need It?

This feature addresses several critical user needs in the rental property market:

### Market Research & Price Comparison

- Users can **compare rental prices** across different neighborhoods without visiting multiple listings
- Helps users understand the **average market rate** for their desired location
- Enables informed decision-making about where to rent based on budget

### Geographic Context

- Provides **spatial awareness** of property distribution
- Shows properties relative to landmarks, universities, or workplaces
- Helps users find properties in specific radius from important locations

### User Experience Benefits

- **Visual discovery** is more intuitive than text-based filtering
- Reduces time spent browsing irrelevant properties
- Offers a bird's-eye view of available options in target areas

### Budget Planning

- Users can identify areas within their budget range
- Discover potentially cheaper alternatives nearby
- Understand price variations across neighborhoods

## 3. How Does It Work?

### A. User Interface Flow

**Navigation:**

- Accessible via route: `/compare-prices`
- Public page (no authentication required)
- Rendered by `src/pages/ComparePricesPage.tsx`

**Page Structure:**

```
Header
  ↓
Title & Description
  ↓
LeafletMapSearch Component
```

### B. Search Mechanism

Users can search in three ways:

1. **Address Search**

   - Enter any address (e.g., "District 1, Ho Chi Minh City")
   - Uses Nominatim OpenStreetMap API for geocoding
   - Converts address to coordinates

2. **Coordinate Search**

   - Direct input of latitude and longitude
   - Useful for precise location targeting
   - Automatically reverse geocodes to display address

3. **Interactive Map Selection**
   - Click anywhere on the map
   - Drag the red marker to desired location
   - Updates coordinates and address automatically

### C. Property Discovery Algorithm

**Step 1: Fetch All Properties**

```typescript
// From getPropertiesNearby.service.ts
- API call to: http://localhost:3000/api/houseDetail
- Retrieves complete property database
```

**Step 2: Filter by Radius**

```typescript
// Uses Haversine formula (calculateArea.ts)
filterPropertiesInRadius(lat, lng, allProperties, radiusKm);
```

The **Haversine formula** calculates the great-circle distance between two points on Earth:

- Accounts for Earth's curvature (radius: 6,371 km)
- Returns accurate distances in kilometers
- Filters properties within specified radius

**Step 3: Display Results**

- Blue markers for properties
- Red marker for user's selected location
- Circle overlay showing search radius
- Property count badge

### D. Visual Representation

**Map Features:**

- Base layer: OpenStreetMap tiles
- **Red marker**: User's selected search location (draggable)
- **Blue markers**: Rental properties within radius
- **Dashed circle**: Visual representation of search radius
- **Popups**: Property details on marker click

**Property Popup Information:**

- Property title
- Monthly rent price (formatted with currency)
- Location address
- Number of bedrooms
- Number of bathrooms
- Property area in m²

### E. Technical Implementation

**State Management:**

```typescript
- position: [lat, lng] - Current search center
- address: string - Human-readable address
- properties: Property[] - Filtered results
- loading: boolean - Loading state
- radiusKm: number - Search radius (adjustable)
```

**Real-time Updates:**

- `useEffect` hook monitors position and radius changes
- Automatically fetches new properties when values change
- Debounced search (400ms) to avoid excessive API calls
- Map pans smoothly to new locations

## 4. How Is It Created?

### A. Architecture & File Structure

```
src/
├── pages/
│   └── ComparePricesPage.tsx          # Main page container
├── components/
│   └── common/
│       ├── LeafletMapSearch.tsx       # Core map component
│       └── PropertyCard.tsx           # Property display component
├── service/
│   └── properties/
│       └── getPropertiesNearby.service.ts  # Data fetching
└── util/
    └── calculateArea.ts               # Distance calculations
```

### B. Technology Stack

**Frontend Libraries:**

- **React**: Component framework
- **React Router**: Page routing
- **Material-UI (MUI)**: UI components (TextField, Button, Chip, etc.)
- **Leaflet**: Interactive map library
- **React-Leaflet**: React bindings for Leaflet

**Map Plugins:**

- `leaflet-control-geocoder`: Address search functionality
- Nominatim API: Free geocoding service

**APIs Used:**

- **OpenStreetMap**: Map tiles and rendering
- **Nominatim**: Geocoding (address ↔ coordinates)
- **Local Backend**: Property data (localhost:3000)

### C. Data Flow

```
User Input (Address/Coordinates)
         ↓
   Geocoding API
         ↓
   Update Map Position
         ↓
   getPropertiesNearby()
         ↓
   Fetch All Properties from API
         ↓
   filterPropertiesInRadius()
         ↓
   Calculate distances (Haversine)
         ↓
   Filter by radius
         ↓
   Update UI with markers
```

### D. Key Functions

**Distance Calculation:**

```typescript
calculateDistance(lat1, lng1, lat2, lng2): number
// Returns distance in kilometers using Haversine formula
```

**Property Filtering:**

```typescript
filterPropertiesInRadius(centerLat, centerLng, properties, radiusKm);
// Returns properties within radius
```

**Geocoding:**

```typescript
// Forward: Address → Coordinates
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);

// Reverse: Coordinates → Address
fetch(
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
);
```

### E. User Experience Enhancements

**Loading States:**

- CircularProgress spinner during property fetch
- Prevents UI confusion

**Visual Feedback:**

- Property count badge updates in real-time
- Color-coded (green when properties found, default otherwise)
- Loading indicator during search

**Responsive Design:**

- Mobile-friendly search form layout
- Flexible grid for coordinate inputs
- Adaptive map height

**Interactive Features:**

- Draggable marker
- Clickable map (sets new search center)
- Popup details on property markers
- Hover effects on property cards
- Adjustable search radius (0.5km - 10km)

## 5. Integration with Other Features

### Property Listing

- Reuses `Property` type from `src/service/properties/getProperties.service.ts`
- Consistent data structure across application

### Property Display

- Uses `PropertyCard.tsx` component (though not currently visible in Compare page)
- Can be extended to show property cards below map

### Navigation

- Integrated in `App.tsx` routing
- Accessible from main navigation via `Header.tsx`

## 6. Potential Enhancements

### Current Limitations & Future Improvements

1. **Performance:**

   - Currently fetches ALL properties then filters client-side
   - **Improvement**: Backend endpoint with lat/lng/radius parameters

2. **Property Display:**

   - Only shows markers, no list view
   - **Improvement**: Add PropertyCard grid below map

3. **Filtering:**

   - No price range, bedrooms, or amenity filters
   - **Improvement**: Add filter sidebar

4. **Comparison:**

   - No direct side-by-side comparison
   - **Improvement**: Multi-select properties for detailed comparison

5. **Analytics:**
   - No average price calculation
   - **Improvement**: Show price statistics for selected area

---

## Summary

The **Compare Rental Prices** feature is a sophisticated location-based property discovery tool that combines interactive mapping, geospatial calculations, and real-time data filtering to help users make informed rental decisions. Built with modern React practices and leveraging powerful open-source mapping libraries, it provides an intuitive and visually engaging way to explore the rental market within specific geographic areas.
