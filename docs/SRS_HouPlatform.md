Software Requirements Specification
HouPlatform
. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the functional and non-functional requirements for the HouPlatform system, a web-based student housing rental platform designed to streamline the process of finding and listing rental properties near educational institutions. This document serves as the primary reference for all stakeholders involved in the development, implementation, and maintenance of the system.
The intended audience for this document includes development team members who will implement the system features, project stakeholders and sponsors who require visibility into system capabilities and progress, quality assurance personnel responsible for testing and validation, system administrators who will maintain the production environment, and future developers who may extend or modify the system. Each section of this document is structured to provide clear, unambiguous requirements that can be verified through testing and evaluation.
1.2 Scope
Product Name: HouPlatform

Objectives:
HouPlatform aims to simplify the student housing rental process by providing a centralized, user-friendly platform where students can search for affordable accommodations near their educational institutions, and property owners can list their rental properties. The platform focuses on transparency, ease of use, and location-based search capabilities to match students with suitable housing options.

Main Features:

- Property Search and Browse: Users can view all available rental properties and filter by location, type, and price range
- Interactive Map-Based Price Comparison: Visual comparison of rental prices across different locations using map markers
- Property Listing Management: Property owners can add, update, and manage their rental listings with detailed information
- User Authentication: Secure registration and login system with JWT-based authentication
- User Profile Management: Users can view and update their personal information
- Location-Based Search: Integration with map services to search and visualize properties by geographic location
- Responsive Design: Full mobile and desktop compatibility for access anywhere

  1.3 Definitions, Acronyms, and Abbreviations
  Term Definition
  API Application Programming Interface
  SRS Software Requirements Specification
  UI User Interface
  UX User Experience
  MUI Material-UI (React component library)
  SPA Single Page Application
  REST Representational State Transfer
  JWT JSON Web Token
  CRUD Create, Read, Update, Delete operations

  1.4 References

- React Documentation: https://react.dev/
- Material-UI Documentation: https://mui.com/
- Leaflet Map Library: https://leafletjs.com/
- TypeScript Documentation: https://www.typescriptlang.org/
- Vite Build Tool: https://vitejs.dev/

1.5 Overview
This document is organized into 8 main sections:
 Section 1 provides an introduction and overview
 Section 2 describes the overall product perspective and context
 Section 3 details functional requirements organized by features
 Section 4 specifies external interface requirements
 Section 5 outlines non-functional requirements
 Section 6 provides system models and diagrams
 Section 7 includes other requirements (legal, compliance)
 Section 8 contains appendices and supporting materials

2 Overall Description
2.1 Product Perspective
HouPlatform is a standalone web-based Single Page Application (SPA) designed to operate as a specialized rental marketplace for student housing. The system consists of:

System Context:

- Frontend Application: React-based SPA serving as the user interface
- Backend API: RESTful API service providing data and business logic (separate system)
- Map Services: Integration with OpenStreetMap/Leaflet for location visualization
- Authentication Service: JWT-based authentication for secure user sessions

System Boundaries:
The frontend application handles all user interactions, data presentation, and client-side routing. It communicates exclusively through HTTP/HTTPS with the backend API for data persistence and retrieval. The system does not directly interact with databases or external payment systems in the current scope.

Related Systems:

- Backend API Service: Provides all data operations and business logic
- OpenStreetMap: External service for map tiles and geocoding
- Web Browsers: Chrome, Firefox, Safari, Edge (rendering environment)

Operating Environment:
The application operates in modern web browser environments and requires an active internet connection. It is designed as a client-side application that can be deployed on any web server or CDN capable of serving static files.
2.2 Product Functions
The HouPlatform system provides the following main functions:

1. User Management:

   - User registration with validation (name, age, phone, email, password)
   - User login with email and password authentication
   - Profile viewing and editing capabilities
   - Session management using JWT tokens

2. Property Browsing and Search:

   - Display all available rental properties in a grid layout
   - Filter properties by location (partial text match)
   - Filter properties by property type
   - Filter properties by price range (minimum and maximum)
   - View detailed property information including images, price, location, amenities

3. Property Management:

   - Add new rental properties with comprehensive details
   - Upload property images
   - Specify location using interactive map picker
   - Input property details: title, address, price, bedrooms, bathrooms, area, description
   - Associate properties with owner email

4. Price Comparison:

   - View rental properties on an interactive map
   - Compare prices across different geographic locations
   - Search for properties near specific addresses
   - Visual markers showing property locations and prices

5. Navigation and Routing:

   - Client-side routing for seamless page transitions
   - Protected routes requiring authentication (Profile page)
   - Public routes for browsing and comparison features
     2.3 User Characteristics
     The HouPlatform serves two primary user groups:

6. Students (Renters):

   - Age Range: Primarily 18-30 years old
   - Technical Expertise: Basic to intermediate computer literacy
   - Needs:
     - Find affordable housing near educational institutions
     - Compare rental prices across different areas
     - View detailed property information quickly
     - Access platform from various devices (mobile, desktop)
   - Behavior:
     - Price-sensitive decision making
     - Location proximity to campus is critical
     - Prefer visual information (maps, images)
     - May access platform multiple times before deciding

7. Property Owners (Landlords):
   - Age Range: Typically 25-65 years old
   - Technical Expertise: Basic computer skills, may vary widely
   - Needs:
     - List properties with detailed information
     - Reach student tenant demographic
     - Manage property listings easily
     - Update property information as needed
   - Behavior:
     - May manage multiple properties
     - Need clear, simple forms for data entry
     - Require accurate location specification
     - Value quick listing creation process

General User Expectations:

- Intuitive, easy-to-navigate interface
- Fast page load times and responsive interactions
- Clear visual presentation of information
- Reliable system with minimal errors
- Secure handling of personal information
  2.4 Assumptions and Dependencies
  Assumptions:
- Users have access to modern web browsers
- Users have stable internet connectivity
- Property owners provide accurate property information
- Students have valid email addresses for registration
- Map services (OpenStreetMap) remain accessible
- Backend API follows documented contract
  Dependencies:
- Backend API availability and reliability (API endpoint: http://localhost:3000)
- JWT authentication service for user authentication
- OpenStreetMap/Leaflet services for mapping functionality
- Third-party geocoding services for address-to-coordinate conversion
- Node.js runtime for development and build processes

3 System Features (Functional Requirements)

3.1 User Authentication and Authorization

3.1.1 Feature Description
The system provides secure user registration and login functionality using JWT-based authentication. Users can create accounts, log in, and maintain authenticated sessions throughout their interaction with the platform.

3.1.2 Functional Requirements

FR-AUTH-01: User Registration

- Input: Name, age, phone number, email, password
- Validation:
  - Name: Required, letters and spaces only
  - Age: Required, numeric, must be ≥ 18
  - Phone: Required, exactly 10 digits
  - Email: Required, valid email format, unique in system
  - Password: Required, minimum 8 characters
- Process: Send registration data to backend API, validate response
- Output: Account creation confirmation, automatic login, redirect to home page
- Error Handling: Display specific error messages for duplicate email/phone

FR-AUTH-02: User Login

- Input: Email address, password
- Validation: Both fields required, email format validation
- Process: Authenticate credentials via backend API, receive JWT token
- Output: Store access token in cookie, redirect to home page
- Error Handling: Display "Invalid email or password" message on failure

FR-AUTH-03: Session Management

- Process: Store JWT token in browser cookie with path='/'
- Session Persistence: Token stored for authenticated requests
- Protected Routes: Redirect to login if token absent for protected pages

  3.2 Property Search and Browsing

  3.2.1 Feature Description
  Users can browse all available rental properties and filter results based on location, property type, and price range. The system provides a responsive grid layout for property display.

  3.2.2 Functional Requirements

FR-SEARCH-01: Display All Properties

- Input: None (automatic on page load)
- Process: Fetch all properties from backend API endpoint GET /houseDetail
- Output: Display properties in responsive grid (4 columns on large screens, adaptive)
- Loading State: Show circular progress indicator during fetch
- Error Handling: Log error to console, show empty state

FR-SEARCH-02: Location-Based Filtering

- Input: Location search text (partial match)
- Process: Filter properties where location field contains search text (case-insensitive)
- Output: Update displayed properties list with matching results
- Behavior: Real-time filtering without page reload

FR-SEARCH-03: Property Type Filtering

- Input: Property type keyword
- Process: Filter properties where title or description contains keyword
- Output: Update displayed properties list

FR-SEARCH-04: Price Range Filtering

- Input: Minimum price, maximum price
- Process: Filter properties where price falls within specified range (inclusive)
- Output: Update displayed properties list
- Behavior: All filters work cumulatively

FR-SEARCH-05: Property Card Display

- Display Elements: Property image, title, location, price, bedrooms, bathrooms, area
- Interaction: Cards are clickable for detailed view
- Layout: Responsive grid adapting to screen size

  3.3 Property Management

  3.3.1 Feature Description
  Property owners can add new rental listings with comprehensive details including images, location coordinates, and property specifications.

  3.3.2 Functional Requirements

FR-PROP-01: Add New Property

- Input Fields:
  - Title (text, required)
  - Email (auto-populated from user profile)
  - Address/Location (text, required)
  - Price (number, required, VND)
  - Bedrooms (number, required)
  - Bathrooms (number, required)
  - Area (number, required, square meters)
  - Description (text area, required)
  - Image upload (file input)
  - Latitude/Longitude (from map picker)
- Validation: All fields required except image
- Process: Submit data to POST /houseDetail endpoint
- Output: Success alert, form reset
- Error Handling: Display error alert on failure

FR-PROP-02: Location Selection via Map

- Input: Interactive map click or address search
- Process: Capture latitude and longitude coordinates
- Output: Store coordinates in form state
- Integration: Uses Leaflet map component

FR-PROP-03: Image Upload

- Input: Image file selection
- Validation: Accept image files
- Process: Store file in form state, send filename in array to API
- Output: Image filename included in property data

FR-PROP-04: Auto-populate User Email

- Process: Fetch user profile on component mount
- Output: Pre-fill email field with authenticated user's email
- Error Handling: Log error if profile fetch fails

  3.4 Price Comparison with Map Visualization

  3.4.1 Feature Description
  Users can view and compare rental properties on an interactive map, visualizing price distribution across different geographic locations.

  3.4.2 Functional Requirements

FR-MAP-01: Display Properties on Map

- Input: Property data with lat/lng coordinates
- Process: Render map markers for each property location
- Output: Interactive map with property markers
- Map Provider: OpenStreetMap via Leaflet

FR-MAP-02: Search Address on Map

- Input: Address text search
- Process: Geocode address to coordinates, pan map to location
- Output: Map centers on searched location
- Integration: Uses geocoding service

FR-MAP-03: Display Nearby Properties

- Input: Selected location coordinates
- Process: Fetch properties near location via GET /houseDetail/nearby
- Output: Display markers for nearby properties with price information
- Interaction: Click markers to view property details

  3.5 User Profile Management

  3.5.1 Feature Description
  Authenticated users can view and edit their personal profile information including name, age, phone number, and email.

  3.5.2 Functional Requirements

FR-PROFILE-01: View Profile

- Authentication: Required (protected route)
- Process: Fetch user data from GET /user/profile on page load
- Output: Display user information (name, age, phone, email) in read-only format
- Loading State: Show progress indicator during fetch
- Error Handling: Display error message if fetch fails

FR-PROFILE-02: Edit Profile

- Input: Updated name, age, phone, email
- Validation:
  - Name: Required, letters and spaces only
  - Age: Required, numeric, ≥ 18
  - Phone: Required, exactly 10 digits
  - Email: Required, valid email format
- Process: Send updated data to PUT /user/profile
- Output: Update displayed profile, show success message, exit edit mode
- Error Handling: Display field-specific validation errors

FR-PROFILE-03: Edit Mode Toggle

- Actions: Edit button enables editing, Cancel button reverts changes
- Behavior: Cancel restores original values from last fetch
- State Management: Track edit mode separately from data

  3.6 Navigation and Routing

  3.6.1 Feature Description
  The system provides client-side routing for seamless navigation between different pages without full page reloads.

  3.6.2 Functional Requirements

FR-NAV-01: Page Routes

- Public Routes:
  - / (Home Page - property browsing)
  - /login (Login Page)
  - /register (Registration Page)
  - /compare-prices (Price Comparison Map)
  - /add-rental-property (Add Property Form)
- Protected Routes:
  - /profile (User Profile - requires authentication)

FR-NAV-02: Navigation Header

- Display Elements: Logo, navigation links, user actions
- Links: Home, Compare Prices, Add Property, Profile, Login/Logout
- Behavior: Fixed header, persistent across all pages
- Responsive: Adapts to mobile and desktop layouts

FR-NAV-03: Private Route Protection

- Authentication Check: Verify JWT token presence in cookie
- Redirect: Navigate to /login if token absent
- Access: Allow access to protected pages if token present

  3.7 Use Case Descriptions

Use Case 1: Student Searches for Housing

- Actor: Student (Unauthenticated User)
- Precondition: User accesses home page
- Flow:
  1. User views all available properties
  2. User enters location in search field
  3. User sets price range
  4. System filters and displays matching properties
  5. User views property details
- Postcondition: User finds suitable properties

Use Case 2: Property Owner Lists New Property

- Actor: Property Owner (Authenticated User)
- Precondition: User is logged in
- Flow:
  1. User navigates to "Add Rental Property" page
  2. System pre-fills email from user profile
  3. User enters property details
  4. User selects location on map
  5. User uploads property image
  6. User submits form
  7. System creates property listing
  8. System displays success message and resets form
- Postcondition: New property is listed on platform

Use Case 3: User Registers Account

- Actor: New User
- Precondition: User accesses registration page
- Flow:
  1. User enters personal information
  2. System validates all fields
  3. System checks for unique email and phone
  4. System creates account
  5. System automatically logs in user
  6. System redirects to home page
- Postcondition: User has active account and session

Use Case 4: User Compares Rental Prices

- Actor: Any User (Authenticated or Unauthenticated)
- Precondition: User accesses compare prices page
- Flow:
  1. User views map with property locations
  2. User searches for specific address/area
  3. System displays properties near location
  4. User views price markers on map
  5. User compares prices visually
- Postcondition: User understands price distribution

Use Case 5: User Updates Profile

- Actor: Authenticated User
- Precondition: User is logged in and on profile page
- Flow:
  1. User views current profile information
  2. User clicks Edit button
  3. User modifies personal information
  4. System validates changes
  5. User saves changes
  6. System updates profile
  7. System displays success confirmation
- Postcondition: Profile information is updated

4 External Interface Requirements
4.1 User Interfaces
4.1.1 General UI Characteristics

- Design System: Material-UI (MUI) components with custom styling
- Color Scheme:
  o Primary: #FF5A5F (coral red)
  o Accent: #FF385C (hover state)
  o Neutral: Grayscale palette
- Typography: Sans-serif font family, responsive font sizes
- Responsive Design: Mobile-first approach, breakpoints for xs, sm, md, lg, xl
- Accessibility: WCAG 2.1 Level AA compliance target

4.1.2 Key UI Screens

- No direct hardware interfaces required
- System operates entirely through web browser
- User devices: Desktop, laptop
- Input devices: Mouse, keyboard, touch screen

4.1.3 UI Components

- Header: Fixed navigation bar with logo, menu items, user actions
- Property Card: Reusable card component
- Search Section: Composite component with inputs and suggestions
- Location Picker: Map-based location selector
- Form Inputs: Validated text fields, number inputs, dropdowns

4.2 Hardware Interfaces
The HouPlatform frontend application does not directly interface with any specialized hardware components. All hardware interactions are mediated through the web browser and standard operating system APIs:

- No direct hardware interfaces required
- System operates entirely through web browser environment
- Standard hardware interactions:
  - Display: Any screen capable of rendering HTML/CSS (desktop monitors, laptop screens, tablets)
  - Input Devices: Mouse, keyboard, touchscreen (for mobile devices)
  - Network Interface: WiFi or Ethernet connection for internet access
  - Storage: Browser-managed storage for cookies and session data

All hardware-related functionality (camera for image uploads, GPS for location, etc.) would be accessed through standard browser APIs (File API, Geolocation API) rather than direct hardware interfaces.
4.3 Software Interfaces
4.3.1 Backend API

- Interface Type: RESTful HTTP API
- Base URL: http://localhost:3000/api (development)
- Communication: JSON format request/response
- Authentication: Bearer token (JWT assumed)
  API Endpoints:
  Method Endpoint Purpose
  GET /houseDetail Fetch all properties
  POST /houseDetail Create new property
  PUT /houseDetail/:id Update property
  GET /houseDetail/nearby Get nearby properties
  GET /user/profile Get user profile
  PUT /user/profile Update user profile
  POST /auth/login User login
  POST /auth/register User registration

4.3.2 Third-Party Libraries

- React 19.2.0: UI library
- React Router 7.9.6: Client-side routing
- Axios 1.13.2: HTTP client
- Material-UI 7.3.5: Component library
- Leaflet 1.9.4: Map rendering
- React-Leaflet 5.0.0: React wrapper for Leaflet
  4.3.3 External Services
- OpenStreetMap: Map tiles and data
- Geocoding Service: Address to coordinates conversion

4.4 Communications Interfaces
4.4.1 Network Protocols

- HTTP/HTTPS: Primary communication protocol
- WebSocket: (Future) Real-time updates
  4.4.2 Data Formats
- JSON: Primary data exchange format
- Multipart/form-data: Image uploads
  HouseDetail Object:
  {
  \_id: string,
  title: string,
  location: string,
  price: number,
  bedrooms: number,
  bathrooms: number,
  area: number,
  description: string,
  images: string[],
  lat?: number,
  lng?: number
  }

User Object:
{
name: string,
age: number,
phone: string,
email: string,
password: string,
role?: string,
}

4.4.4 Security Requirements

- HTTPS: All production communications encrypted
- CORS: Cross-Origin Resource Sharing configured
- Authentication: JWT tokens
- API Rate Limiting: (Backend responsibility)

5 Non-functional Requirements

5.1 Performance
NFR-PERF-01: Page Load Time

- Initial page load: < 3 seconds on broadband connection
- Subsequent page navigation: < 1 second (SPA routing)
- Target: Optimized bundle size through code splitting

NFR-PERF-02: API Response Handling

- Display loading indicators for operations > 500ms
- Timeout threshold: 30 seconds for API requests
- Implement error recovery for failed requests

NFR-PERF-03: Image Optimization

- Images should be optimized for web delivery
- Lazy loading for property images in grid view
- Progressive loading for large image sets

NFR-PERF-04: Search and Filter Performance

- Filter operations: < 100ms for client-side filtering
- Smooth UI updates without blocking main thread
- Efficient re-rendering using React optimization techniques

NFR-PERF-05: Map Rendering

- Map tiles load progressively
- Smooth pan and zoom interactions
- Efficient marker clustering for large property sets

  5.2 Security
  NFR-SEC-01: Authentication

- JWT token-based authentication
- Tokens stored securely in HTTP-only cookies (where possible)
- Session timeout: Configurable based on token expiration
- Automatic logout on token expiration

NFR-SEC-02: Data Transmission

- HTTPS required for all production deployments
- No sensitive data stored in browser localStorage
- CORS headers properly configured for API requests

NFR-SEC-03: Input Validation

- Client-side validation for all user inputs
- Sanitization of user-provided text to prevent XSS
- Server-side validation as primary security layer

NFR-SEC-04: Password Security

- Minimum password length: 8 characters
- Passwords never displayed or logged
- Password transmission only over secure connections

NFR-SEC-05: Protected Routes

- Authentication required for profile and property management pages
- Automatic redirect to login for unauthorized access attempts
- Token validation before rendering protected content

  5.3 Usability
  NFR-USE-01: User Interface

- Intuitive navigation with clear labels and icons
- Consistent design language across all pages
- Material-UI components for familiar interaction patterns
- Visual feedback for all user actions (hover, click, loading)

NFR-USE-02: Responsive Design

- Full functionality on devices from 320px to 2560px width
- Mobile-first design approach
- Breakpoints: xs (0-600px), sm (600-960px), md (960-1280px), lg (1280-1920px), xl (1920px+)
- Touch-friendly interface elements (minimum 44x44px tap targets)

NFR-USE-03: Accessibility

- Target: WCAG 2.1 Level AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Sufficient color contrast ratios (4.5:1 for text)
- Alt text for all images
- Form labels and error messages clearly associated

NFR-USE-04: Error Messages

- Clear, user-friendly error messages
- Field-specific validation feedback
- Actionable guidance for error resolution
- Non-technical language for end users

NFR-USE-05: Learning Curve

- New users should complete basic tasks within 5 minutes
- Self-explanatory interface requiring minimal instructions
- Consistent interaction patterns throughout application

  5.4 Reliability
  NFR-REL-01: Error Handling

- Graceful degradation when backend services unavailable
- User-friendly error messages for all failure scenarios
- No unhandled exceptions causing application crashes
- Console logging for debugging (development mode)

NFR-REL-02: Data Integrity

- Validation before form submission
- Confirmation messages for successful operations
- Error recovery: Form data preserved on submission failure
- Atomic operations: All-or-nothing form submissions

NFR-REL-03: State Management

- Consistent application state across navigation
- Session persistence using cookies
- Proper cleanup of resources on component unmount
- No memory leaks from event listeners or timers

NFR-REL-04: Browser Compatibility

- Support for latest 2 versions of major browsers:
  - Chrome
  - Firefox
  - Safari
  - Edge
- Graceful degradation for older browsers
- Progressive enhancement approach

  5.5 Maintainability
  NFR-MAIN-01: Code Quality

- TypeScript for type safety
- ESLint configuration for code consistency
- Modular component architecture
- Clear separation of concerns (components, services, utilities)

NFR-MAIN-02: Code Organization

- Logical folder structure by feature/type
- Reusable components in common/ directory
- Service layer for API interactions
- Centralized configuration and constants

NFR-MAIN-03: Documentation

- Code comments for complex logic
- README files for setup and development
- API endpoint documentation
- Component prop types documented

NFR-MAIN-04: Development Tools

- Vite for fast development builds
- Hot module replacement for rapid iteration
- TypeScript compiler for type checking
- Version control using Git

NFR-MAIN-05: Dependency Management

- Package.json for all dependencies
- Regular updates for security patches
- Minimal dependency footprint
- Well-maintained, popular libraries

  5.6 Portability
  NFR-PORT-01: Platform Independence

- Runs on any platform supporting modern web browsers:
  - Windows 10/11
  - macOS 10.15+
  - Linux (major distributions)
  - iOS 12+
  - Android 8+

NFR-PORT-02: Deployment Flexibility

- Static file deployment to any web server
- Compatible with CDNs (CloudFront, Cloudflare, etc.)
- Configurable API endpoint (environment variables)
- No server-side runtime requirements

NFR-PORT-03: Data Format Portability

- Standard JSON for all data exchange
- RESTful API design for backend independence
- No vendor-specific data formats

NFR-PORT-04: Build Process

- Cross-platform build scripts
- Node.js-based tooling (Windows, macOS, Linux compatible)
- Containerization-ready (Docker)
- CI/CD pipeline compatible
  6 System Models and Diagrams
  This section provides required diagrams to clarify the functional and structural aspects of the system.
  6.1 Use Case Diagram
  Include a Use Case Diagram to show interactions between users and the system.
  6.2 Class Diagram
  Provide a Class Diagram to illustrate the system’s structure, classes, attributes, and relationships.
  6.3 Sequence Diagram
  Use Sequence Diagrams to show interaction sequences for specific scenarios.
  6.4 Activity Diagram
  Include Activity Diagrams to detail workflows or sequences of actions within the system.
  6.5 State Diagram
  Provide State Diagrams to depict lifecycle states and transitions for key objects or components.
  7 Other Requirements (Optional)
  Include any additional requirements, such as legal, regulatory, or compliance requirements, and technical
  limitations.
  8 Appendix (Optional)
  8.1 Data Dictionary

Property/HouseDetail Entity:
| Field Name | Data Type | Length | Required | Description | Validation Rules |
|------------|-----------|--------|----------|-------------|------------------|
| \_id | String | Variable | Yes | Unique identifier | MongoDB ObjectId format |
| title | String | 1-200 | Yes | Property listing title | Non-empty string |
| location | String | 1-200 | Yes | Property address/location | Non-empty string |
| price | Number | - | Yes | Monthly rental price in VND | Positive number |
| bedrooms | Number | - | Yes | Number of bedrooms | Integer ≥ 0 |
| bathrooms | Number | - | Yes | Number of bathrooms | Integer ≥ 0 |
| area | Number | - | Yes | Property area in square meters | Positive number |
| description | String | 1-2000 | Yes | Detailed property description | Non-empty string |
| images | Array[String] | - | No | URLs or filenames of property images | Array of strings |
| lat | Number | - | No | Latitude coordinate | -90 to 90 |
| lng | Number | - | No | Longitude coordinate | -180 to 180 |
| email | String | - | No | Property owner contact email | Valid email format |

User Entity:
| Field Name | Data Type | Length | Required | Description | Validation Rules |
|------------|-----------|--------|----------|-------------|------------------|
| name | String | 1-100 | Yes | User's full name | Letters and spaces only |
| age | Number | - | Yes | User's age | Integer, ≥ 18, ≤ 120 |
| phone | String | 10 | Yes | User's phone number | Exactly 10 digits, unique |
| email | String | 5-100 | Yes | User's email address | Valid email format, unique |
| password | String | 8+ | Yes | User's password (hashed) | Minimum 8 characters |
| role | String | - | No | User role in system | Optional field |

Authentication Token:
| Field Name | Data Type | Description |
|------------|-----------|-------------|
| accessToken | String (JWT) | JSON Web Token for authentication |
| expiresIn | Number | Token expiration time in seconds |

Search Filter Parameters:
| Field Name | Data Type | Required | Description |
|------------|-----------|----------|-------------|
| location | String | No | Location search text (partial match) |
| propertyType | String | No | Property type keyword |
| minPrice | Number | No | Minimum price filter |
| maxPrice | Number | No | Maximum price filter |

API Response Wrapper:
| Field Name | Data Type | Description |
|------------|-----------|-------------|
| data | Object/Array | Response payload |
| error | String | Error message (if any) |
| message | String | Success/info message |
8.2 Technology Stack Summary
Frontend:

- React 19.2.0
- TypeScript 5.9
- Vite 7.2 (build tool)
- Material-UI 7.3.5
- React Router 7.9.6
- Axios 1.13.2
- Leaflet 1.9.4
- Tailwind CSS 4.1
  Development Tools:
- ESLint (code quality)
- TypeScript (type checking)
- Git (version control)
  External Services:
- OpenStreetMap (maps)
- Backend API (Node.js/Express assumed)
  8.3 Glossary

| Term                | Definition                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Access Token        | A JWT (JSON Web Token) used to authenticate API requests after successful login                |
| Authentication      | The process of verifying a user's identity through credentials (email and password)            |
| Authorization       | The process of determining what resources an authenticated user can access                     |
| Backend API         | The server-side application that handles business logic, data storage, and API endpoints       |
| Bearer Token        | An authentication token passed in HTTP Authorization header as "Bearer <token>"                |
| CDN                 | Content Delivery Network - distributed servers for faster static content delivery              |
| Client-Side Routing | Navigation between pages without full page reloads, handled by JavaScript                      |
| Component           | A reusable, self-contained piece of UI in React                                                |
| CORS                | Cross-Origin Resource Sharing - mechanism allowing restricted resources from different origins |
| Geocoding           | Converting addresses to geographic coordinates (latitude/longitude)                            |
| Grid Layout         | A responsive layout system organizing content in rows and columns                              |
| Hook                | React function allowing state and lifecycle features in functional components                  |
| JWT                 | JSON Web Token - compact, self-contained way to securely transmit information                  |
| Landlord            | Property owner who lists rental properties on the platform                                     |
| Lazy Loading        | Deferring loading of resources until they're needed to improve performance                     |
| Leaflet             | Open-source JavaScript library for interactive maps                                            |
| Listing             | A rental property advertisement with details, images, and pricing                              |
| Material-UI (MUI)   | React component library implementing Google's Material Design                                  |
| OpenStreetMap       | Collaborative project creating free, editable map data                                         |
| Private Route       | A route requiring authentication to access                                                     |
| Property Card       | UI component displaying summary information for a single property                              |
| Protected Resource  | API endpoint or page requiring valid authentication                                            |
| Renter              | Student or user searching for rental housing                                                   |
| RESTful API         | API following REST architectural principles using HTTP methods                                 |
| Reverse Geocoding   | Converting geographic coordinates to human-readable addresses                                  |
| Session             | Period during which a user is authenticated and can access protected resources                 |
| SPA                 | Single Page Application - web app loading single HTML page, dynamically updating content       |
| State               | Data that determines component rendering and behavior in React                                 |
| Token Expiration    | When an authentication token becomes invalid after a specified time                            |
| TypeScript          | Typed superset of JavaScript adding static type definitions                                    |
| Validation          | Process of ensuring user input meets specified requirements before processing                  |
| Vite                | Fast build tool and development server for modern web projects                                 |
| VND                 | Vietnamese Dong - currency used for rental pricing                                             |
| WCAG                | Web Content Accessibility Guidelines - standards for accessible web content                    |

8.4 Sample Data
Sample HouseDetail
{
"\_id": "507f1f77bcf86cd799439011",
"title": "Modern Studio near Hanoi University",
"location": "Cau Giay, Hanoi",
"price": 4500000,
"bedrooms": 1,
"bathrooms": 1,
"area": 30,
"description": "Cozy studio apartment perfect for students...",
"images": [
"https://example.com/image1.jpg",
"https://example.com/image2.jpg"
],
"lat": 21.0285,
"lng": 105.8542
}
