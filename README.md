This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## How to Run the App 
1️⃣ Prerequisites

Node.js ≥ 18

MongoDB installed locally or cloud URI

npm or yarn package manager

2️⃣ Clone the repository
git clone https://github.com/your-username/user-list-app.git
cd user-list-app

3️⃣ Install dependencies
npm install

4️⃣ Set up environment variables

Create a .env.local file in the project root:

MONGO_URI=mongodb://localhost:27017/userlistdb


Replace with your MongoDB URI if using a cloud instance.
Keep .env.local private, never push to GitHub.

5️⃣ Seed the database

Before running the app, you need some dummy users.
Run:

node src/lib/db/seed.js


What happens:

seed.js connects to MongoDB using mongo.js

Generates 50 dummy users with:

Name

Email

CreatedAt timestamp

Inserts them into the users collection

Ensures first-time setup is automatic — no manual DB entry

✅ After running, your database has initial data for pagination, search, and sort testing.

6️⃣ Start the development server
npm run dev


Server runs at http://localhost:3000

Users page: http://localhost:3000/users

7️⃣ App Flow (from user opening page → rendering table)

Browser loads /users

React mounts UsersPage component

useEffect calls fetchUsers()

/api/users route validates query params → calls getUsers service

MongoDB query runs with:

Search filter

Sorting

Skip & limit (pagination)

Response sent back → React updates users and pagination state

Table displays users with pagination, search, and sort controls

User interacts → API called dynamically without full reload

8️⃣ Project Structure
src/
 ├─ app/
 │   ├─ users/page.js          # Client component for UI
 │   └─ api/users/route.js     # API route for fetching users
 ├─ lib/
 │   ├─ db/
 │   │   ├─ mongo.js           # MongoDB connection (global cached)
 │   │   └─ seed.js            # Seed script for dummy users
 │   ├─ services/
 │   │   └─ user.service.js    # DB query & business logic
 │   └─ validators/
 │       └─ user.query.js      # Query validation (page, limit)
 ├─ styles/
 │   └─ globals.css            # Tailwind CSS

9️⃣ Features

Pagination

Search by name with debounce

Sort (newest/oldest first)

Reusable MongoDB connection

Responsive Tailwind table

API error handling

10️⃣ Future Improvements

Cursor pagination for millions of users

Authentication & role-based access

Unit & integration tests

Deploy to Vercel