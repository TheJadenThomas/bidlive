# BidLive - Real-Time Auction Platform
## University Mini-Project Report

### 1. Problem Statement
Traditional auction systems are limited by geographical boundaries, physical constraints, and asynchronous bidding methods that lack excitement and immediacy. Participants often miss out on items because they cannot track bids in real-time or receive instant notifications when they are outbid. There is a need for a modern, accessible, and highly responsive platform where users can participate in live auctions from anywhere in the world.

### 2. Objectives
- **Real-Time Interaction**: Implement a WebSocket-based system to broadcast bids instantly to all participants without page reloads.
- **Security & Authentication**: Ensure secure user registration, password hashing (bcrypt), and protected API endpoints using JWT authentication.
- **Modern User Experience**: Design a responsive, mobile-first frontend using ReactJS and Tailwind CSS.
- **Scalability & Deployment**: Containerize the application using Docker and set up CI/CD pipelines for automated deployment to Vercel (Frontend) and Render (Backend).
- **Progressive Web App (PWA)**: Allow users to install the application on their devices for a native-like experience.

### 3. Architecture Diagram
```text
[ Client (React + Vite + Tailwind + PWA) ]
      |
      | (HTTP & WebSocket)
      v
[ Server (Node.js + Express + Socket.IO) ]
      |
      | (Mongoose ODM)
      v
[ Database (MongoDB Atlas) ]
```

### 4. Frontend Implementation
The frontend is built as a Single Page Application (SPA) using React and Vite. It leverages `react-router-dom` for client-side routing.
- **State Management**: React Context (`AuthContext.jsx`) is used to manage global user state.
- **Styling**: Tailwind CSS is used extensively to create a modern, clean, and responsive design, featuring gradients, hover states, and smooth transitions.
- **Real-Time Integration**: The `socket.io-client` library connects to the backend, enabling the `AuctionDetails.jsx` page to dynamically update the current bid when an event is broadcasted.

### 5. Backend Development
The backend is an Express.js RESTful API integrated with Socket.IO.
- **Routes**: REST endpoints for Authentication (`/api/auth`) and Auctions (`/api/auctions`).
- **WebSockets**: The `auctionSocket.js` module handles `joinAuction`, `placeBid`, and `bidUpdate` events to facilitate real-time communication.
- **Security**: Integrates Helmet for HTTP header security, Express Rate Limit to prevent brute-force attacks, and Mongo Sanitize to prevent NoSQL injections.

### 6. Database Integration
MongoDB Atlas is used as the cloud database, interfacing with the Node server via Mongoose.
- **User Model**: Stores user credentials, hashed passwords, and roles.
- **Auction Model**: Stores item details, current bid, end time, and a reference to the user who created it.
- **Bid Model**: Tracks the history of bids placed, linking `userId` and `auctionId`.

### 7. Deployment
The application is fully Dockerized with `Dockerfile`s for both the client and server, alongside a `docker-compose.yml` for unified local orchestration.
- **CI/CD**: A GitHub Actions workflow is implemented to run on pushes to the `main` branch, ensuring that the Node environments build successfully before deployment triggers.
- **Hosting**: The frontend is optimized for deployment on Vercel (`vercel.json` included for SPA routing), while the backend is designed to be hosted on Render.

### 8. Conclusion
BidLive successfully demonstrates a complete, modern full-stack web application. By integrating RESTful principles with real-time WebSocket communication, it solves the problem of asynchronous bidding and provides users with a highly interactive, secure, and responsive auction experience.
