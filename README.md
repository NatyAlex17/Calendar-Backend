# 🛠️ MyCalendarApp Backend

**Node.js + Express backend powering the MyCalendarApp calendar management platform.**  
Handles event CRUD, time zone normalization, notifications, and recurrence logic.

---

![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Framework-Express-red?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-mongoDB-green?logo=mongoDB&logoColor=white)
![JWT Auth](https://img.shields.io/badge/Auth-JWT-yellowgreen?logo=jsonwebtokens)
![Deployed on Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway)

---

## 📦 Features

- 🔁 **Recurring events** (daily, weekly, custom repeat logic)
- 🌍 **Timezone adjustment** 
- 🔔 **Event notifications** via email or web push
- 🔐 **JWT-based authentication**
- 🗃️ **MongoDB** with mongoose 
- 📊 **RESTful JSON APIs** for frontend clients

---

## 🧩 Stack

| Layer      | Tech              |
|------------|-------------------|
| Language   | JavaScript / TypeScript |
| Server     | Express.js        |
| Database   | PostgreSQL        |
| Auth       | JWT               |
| Scheduler  | `node-cron`       |
| Mailer     | `nodemailer`      |

---

## 🏁 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/mycalendar-backend.git
cd mycalendar-backend

# Install dependencies
npm install

# Create and configure .env
cp .env.example .env

# Run locally
npm run dev
