Natours Project - README

Demo Login Credentials:
----------------------
Email: demo-admin@example.com
Password: password123
Role: admin

Tech Stack:
-----------
Frontend:
- Pug (Templating engine)
- Leaflet.js (Map integration)

Backend:
- Node.js with Express.js
- Authentication using JSON Web Tokens (JWT)

Database:
- MongoDB
  Collections: Tours, Users, Bookings, Reviews

Payments:
- Stripe (Test payments)

Emails:
- NodeMailer (Password reset and notifications)

Deployment:
- Render.com

Stripe Test Card:
-----------------
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date (MM/YY)
CVC: Any 3-digit number

Features:
---------
User:
- Signup & Login
- Forgot Password via Email
- Book Tours & Cancel Bookings
- Add & Delete Reviews

Admin:
- Create, Edit, Delete Tours
- Manage Bookings
- Manage Users
- Access Admin Dashboard

Notes:
------
- This project uses JWT for authentication, stored and managed via cookies.
