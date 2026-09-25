# SafeTravels

Travel planning and safety MVP, built with React, Express and MongoDB.

## Run locally
Install Node.js 18+ and MongoDB. Configure `SERPAPI_API_KEY`, `GEMINI_API_KEY`, `JWT_SECRET`, and `MONGODB_URI` in `backend/.env`, then run `npm install`, `npm --prefix backend install`, `npm --prefix frontend install`, and `npm run dev`. Open http://localhost:5173.

Discovery uses SerpAPI from the server. Gemini arranges real SerpAPI activity listings into a date-aware itinerary; the server validates every suggested activity and uses a deterministic schedule if Gemini is not configured or temporarily unavailable. Provider keys stay on the server. The UI can run in demo mode with sample data.

## API map
- Hotels: SerpAPI Google Hotels engine, including available photos, review scores, and prices.
- Activities and emergency places: separate SerpAPI Google Maps searches; emergency listings are sorted by calculated GPS distance when coordinates are available.
- General web research and weather: SerpAPI Google Search engine.
- Itinerary: Gemini organizes real SerpAPI Maps listings into date and time slots; invalid suggestions are rejected and a deterministic fallback is available.

Emergency location is submitted only after the traveler selects a nearby search button. Urgent mode uses emergency-focused local searches and saves an urgent request, but this MVP does not call or notify responders or contacts and does not stream location. For immediate danger, call the local emergency number.
