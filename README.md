## Problem Statement
A real time weather processing application , that fecthes live weather of metro cities , receive alerts based on thresh hold set , visualization utilizing charts and graphs.

## Technology tools/components used
- Typescript
- React.Js
- Node.Js 
- Express
- Redis
- Socket-Io
- MongoDb
- Zustand
- ShadCn
- Tailwind Css

## Getting Started

### How to run this project:

1. Clone the repository from GitHub:
```bash
https://github.com/Monish-2304/RealTime-Weather-Processing-Application-
```
2. Install dependencies for both frontend and backend: (Make sure you have docker installed on system)

```bash
cd frontend
npm install
```
```bash
cd backend
docker-compose up --build
```
3. Setup MongoDb Atlas and paste the MongoDb_Uri string in .env file

4. Sample .env for backend:
```
PORT=5000
OPENWEATHER_API_KEY=paste_your_api_key_here

JWT_SECRET=paste_your_secret_here

REDIS_HOST=redis
REDIS_PORT=6379

MONGO_CONNECTION_URI=paste_your_monngodb_uri_here
```

5. For running the frontend , navigate to the `frontend` directory and start the app: Preferably on port 5173

```bash
cd frontend
npm run dev
```
### Features implemented:

1. The system will continuously retrieve weather data from the OpenWeatherMap API.

2. Fetches and displays live weather conditions like temperature, max temp, min temp, humidity etc for every 5 minutes utilizing web sockets.

3. Every time weather data is fetched in interval of 5 min , their summaries are updated and stored in data base for further analysis on patterns and trends.

4. In home page user can also search for weather of any city.

5. A chart is displayed on home page comparing live temperature of metro cities.

6. User can set and get alerts for a city based on temperature thresh hold he has set.

7. System checks every 5 minutes temperature of city user has set alert for and if it exceeds , an alert is sent and displayed on home page.

8. A maximum of 3 alerts are sent in time span of 6 hours.

9. A help page is provided explaining features implemented.

10. In summary page 2 tabs are provided. In current summary live summary/aggregate weather of all metro cities are provided along with a bar chart for visualization.

11. In weekly summary tab a line chart is displayed to visualize and analyze patterns, trends of metro cities over the past week. Option is given to switch between average temperature,
max temperature and minimum temperature.

12. Security feature implemented:
Login/Sign Up for authentication along with JWT token for enhanced security
Only people who have logged in can set and receive alerts

13.Performance features implemented:
Used Redis for caching and faster retrieval of data
Web sockets is utilized for live data display 
Zustand is used for state management in frontend

14. A icon to indicate day/night based on user’s local time.

15. Website is completely responsive.

16. Included additional weather condition like humidity.

17. All given test cases were implemented and verified.




















