# 📝 Blog App Backend (Node.js + Express + MongoDB + Redis)

An industry-grade **Blog RESTful API** built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Redis caching**.  
It includes **user authentication, posts, comments, likes, replies, and admin moderation** — designed for performance, scalability, and real-world deployment.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 📋 Table of Contents
- [🚀 Overview](#-overview)
- [✨ Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📁 API Endpoints](#-api-endpoints)
- [🛠️ Installation](#️-installation)
- [⚡ Redis Caching](#-redis-caching)
- [☁️ Cloudinary Integration](#️-cloudinary-integration)
- [💻 Deployment](#-deployment)
- [👨‍💻 Author](#-author)
- [📄 License](#-license)

---

## 🚀 Overview

This **Blog App backend** demonstrates a **complete production-ready API** for managing blog posts, comments, likes, and replies with authentication and role-based access.  
It follows **clean architecture principles**, **reusable utilities**, and **Redis caching** for fast API responses.

Main goals:
- Showcase backend development expertise with **Node.js + MongoDB**
- Demonstrate **real-world features** used in production systems
- Provide **secure, scalable, and optimized REST APIs**

---

## ✨ Features

### 🧑‍💻 User & Auth
- User registration and login with **JWT authentication**
- Password hashing using **bcrypt**
- Role-based access control (User / Admin)
- Secure login and logout functionality

### 📰 Post Management
- Create, update, delete, and fetch blog posts
- Upload cover images using **Cloudinary**
- Advanced filtering:
  - Search by title/content
  - Filter by category, tag, or author
- Pagination and sorting
- Like/unlike functionality
- Auto caching for all posts and single post via **Redis**

### 💬 Comment System
- Add, update, delete comments
- Approve comments (admin only)
- Reply to comments
- Like/unlike comments
- Get comments per post
- Automatic cache invalidation after any comment change

### ⚡ Admin Features
- Approve comments before publishing
- Fetch all comments with pagination, sorting, and monthly analytics

---

## 🧱 Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Caching** | Redis |
| **Image Storage** | Cloudinary |
| **Validation & Error Handling** | Joi, Custom Middleware |
| **Environment Config** | dotenv |
| **Utilities** | ApiError, ApiResponse, asyncHandler |

---

## 📁 API Endpoints

### 👤 Auth APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/user/register` | Register new user | Public |
| `POST` | `/api/user/login` | Login user | Public |

---

### 📰 Post APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/posts` | Create post (with cover image) | Private |
| `GET` | `/api/posts` | Get all posts (with filters, pagination) | Public |
| `GET` | `/api/posts/:id` | Get single post | Public |
| `PUT` | `/api/posts/:id` | Update post | Private |
| `DELETE` | `/api/posts/:id` | Delete post | Private |
| `PUT` | `/api/posts/:id/like` | Like/unlike post | Private |

---

### 💬 Comment APIs
| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| `POST` | `/api/comments/:postId` | Add comment to post | Private |
| `GET` | `/api/comments/:postId` | Get comments of a post | Public |
| `PUT` | `/api/comments/:id` | Update comment | Private |
| `DELETE` | `/api/comments/:id` | Delete comment | Private/Admin |
| `PUT` | `/api/comments/:id/like` | Like/unlike comment | Private |
| `POST` | `/api/comments/:id/reply` | Reply to a comment | Private |
| `PUT` | `/api/comments/:id/approve` | Approve comment (Admin only) | Admin |
| `GET` | `/api/comments` | Get all comments with analytics | Admin |

---
## Installation
 - Install Dependencies
 - npm install
 - Create .env File
 - PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development

- REDIS_HOST=127.0.0.1
- REDIS_PORT=6379
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret
- Run Server
- npm run dev
### Clone the Repository

- git clonehttps://github.com/Alishba234/blogcore-backend.git
- cd blog-app-backend

## Redis Caching
- This project uses Redis for performance optimization:
- Caches frequently fetched data like:
- All posts
- Single post
- Comments by post


## 💻 Deployment
- Deployed on Render / Railway (or mention “Ready for deployment on Render, Railway, or AWS”)
- Uses environment variables for secure configuration
- Supports CI/CD pipelines for continuous updates


## Author
- Developer: Alishba
- Role: Backend Developer
- Email: your-name@gmail.com
- GitHub: github.com/Alishba234
- LinkedIn: linkedin.com/in/your-link

📄 License
- This project is open-source and available under the MIT License.
- ⭐ If you like this project, don’t forget to star the repo and share it!