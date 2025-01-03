# Phreddit
## 🚀 Overview
This project is a full-stack web application that replicates the core functionalities of the popular platform Reddit. Users can create posts, comment, upvote/downvote content, and explore topics organized into categories. Built using the **MERN** stack (MongoDB, Express.js, React, and Node.js), this clone demonstrates scalable architecture and modern web development practices.

## 🌟 Features
- **🔒 User Authentication**: Secure login and signup functionality using JWT.
- **📝 Post Creation**: Users can create, edit, and delete posts.
- **💬 Commenting System**: Nested comments for discussion threads.
- **📊 Voting System**: Upvote and downvote capabilities for posts and comments.
- **📚 Subreddits**: Organize posts by communities.
- **🌐 RESTful API**: Efficient data handling with custom API endpoints.

## 🛠️ Tech Stack
<p align="left">
  <img src="https://img.shields.io/badge/MongoDB-5.0.0-47A248?style=flat&logo=mongodb" alt="MongoDB Badge">
  <img src="https://img.shields.io/badge/Express-4.17.1-000000?style=flat&logo=express" alt="Express Badge">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react" alt="React Badge">
  <img src="https://img.shields.io/badge/Node.js-16.0.0-339933?style=flat&logo=node.js" alt="Node.js Badge">
</p>

- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: CSS
- **Version Control**: Git and GitHub

## ⚙️ Installation

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local instance or cloud-based MongoDB Atlas)
- npm or yarn

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/WazzaPd/reddit-clone.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Phreddit
   ```

3. Install dependencies:
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

4. `.env` file should already be copied over, if not copy it from server/.env

5. Start mongodb server

6. Start the application with two terminals:
- In the client folder:
   ```bash
   npm run dev
   ```
- In the server folder:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- **POST** `/auth/register`: Registers a new user. Validates fields, checks for duplicates, and hashes passwords.
- **POST** `/auth/login`: Authenticates a user, validates credentials, and returns a JWT token.
- **GET** `/auth/logout`: Logs the user out by clearing the authentication token.
- **POST** `/auth/logout`: Logs the user out (alternative method) by clearing the authentication token.
- **GET** `/auth/validate-token`: Validates the JWT token and fetches the user data without exposing passwords.

### Comments Endpoints
- **POST** `/commentsData'/appendComment`: Adds a comment, links to parent or post, and updates comment IDs.
- **POST** `/commentsData'/toggle-vote`: Toggles upvotes or downvotes on comments, updating reputation.
- **GET** `/commentsData'/:commentId`: Retrieves a comment by its ID.
- **DELETE** `/commentsData'/delete/:commentId`: Deletes a comment and its replies recursively.
- **DELETE** `/commentsData'/delete-post-comments/:postId`: Deletes all comments associated with a specific post.
- **PUT** `/commentsData'/edit/:commentId`: Edits a comment's content.
- **GET** `/commentsData'/`: Fetches all comments.

### Communities Endpoints
- **POST** `/communitiesData/appendCommunities`: Creates a new community.
- **POST** `/communitiesData/joinCommunity`: Adds a user to a community.
- **POST** `/communitiesData/leaveCommunity`: Removes a user from a community.
- **DELETE** `/communitiesData/delete/:communityId`: Deletes a community and all associated content.
- **PUT** `/communitiesData/edit/:communityId`: Edits the community name or description.
- **GET** `/communitiesData/`: Fetches all communities.
- **GET** `/communitiesData/:id`: Retrieves a specific community by ID.

### Linkflairs Endpoints
- **POST** `/linkflairsData/appendLinkflair`: Adds a new linkflair.
- **GET** `/linkflairsData/`: Fetches all linkflairs.

### Posts Endpoints
- **POST** `/appendPost`: Creates a new post.
- **POST** `/increment-view`: Increments the view count of a post.
- **POST** `/toggle-vote`: Toggles upvotes or downvotes on posts, updating reputation.
- **DELETE** `/delete/:postId`: Deletes a post and removes it from the associated community.
- **PUT** `/edit/:postId`: Edits the title and content of a post.
- **GET** `/:postId`: Fetches a specific post by ID.
- **GET** `/`: Fetches all posts.

### Users Endpoints
- **GET** `/usersData'/`: Fetches user data.
- **GET** `/usersData'/getUsername`: Retrieves the username from the token.
- **GET** `/usersData'/getUserCommunities`: Retrieves all communities a user is part of.
- **GET** `/usersData'/getAllUsers`: Fetches all users.
- **POST** `/usersData'/getUserReputation`: Fetches the user's reputation.
- **DELETE** `/usersData'/delete/:userId`: Deletes a user and all associated content.

## 📂 Folder Structure
```
reddit-clone/
├── client/                 # Frontend React code
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Backend Express.js code
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── .env
├── README.md
└── package.json
```

---

## 🚀 Future Improvements
- Implement real-time updates with WebSockets.
- Add image and video upload features.
- Introduce private messaging between users.
- Enhance search and filtering options.

