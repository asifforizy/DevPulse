# DevPulse – Internal Issue & Feature Tracker

DevPulse is a backend REST API for managing software issues and feature requests. It supports authentication, role-based access control, and full CRUD operations using Node.js, TypeScript, Express, and PostgreSQL with raw SQL queries.

## Live link:  
- https://dev-pulse-inky-nine.vercel.app/

##  Tech Stack

- Node.js (LTS 24+)
- TypeScript
- Express.js
- PostgreSQL (Raw SQL using pg driver)
- JWT Authentication
- bcrypt (password hashing)



##  Features

- User registration and login with JWT authentication
- Role-based access control (Contributor, Maintainer)
- Create, read, update, and delete issues
- Filter and sort issues (type, status, date)
- Secure password storage
- Modular and scalable architecture


## End Points
- /api/auth/signup
- /api/auth/login
- /api/issues
- /api/issues?sort=newest
- /api/issues/:id



