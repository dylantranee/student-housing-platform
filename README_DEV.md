# HouPlatform Frontend

## Overview

This is the frontend for HouPlatform, a housing rental platform built with React, TypeScript, Vite, and Material-UI (MUI v5). It features custom authentication, property listing, map search (Leaflet + Nominatim), and a full-featured Add Rental Property form.

## Key Features

- **Authentication:** Custom sign up, sign in, and profile editing
- **Property Listing:** Add, view, and compare rental properties
- **Map Search:** Leaflet map with address search (Nominatim API)
- **Protected Routes:** Only authenticated users can add rental properties

## Project Structure

- `src/components/` - Reusable UI components (Header, PropertyCard, LeafletMapSearch, etc.)
- `src/pages/` - Main pages (Home, Profile, AddRentalProperty, ComparePrices, etc.)
- `src/service/` - API service functions
- `src/types/` - TypeScript types
- `src/data/` - Mock data for development

## Setup & Development

1. **Install dependencies:**
   ```powershell
   npm install
   ```
2. **Start development server:**
   ```powershell
   npm run dev
   ```
3. **Environment:**
   - Node.js >= 16
   - Vite for fast development
   - Material-UI v5
   - Leaflet for maps

## Map Search

- Uses Leaflet and Nominatim API for address search and reverse geocoding
- See `src/components/common/LeafletMapSearch.tsx`

## Add Rental Property

- Accessible only to signed-in users
- See `src/pages/AddRentalPropertyPage.tsx`
- Includes detailed address, amenities, images, and contact info

## Authentication

- Custom logic, not using Firebase or Auth0
- See `src/screen/auth/` and `src/components/auth/`

## Notes for Developers

- **uses Leaflet**
- **Backend integration:** See backend repo for endpoints
- **Validation:** Basic validation included, extend as needed
