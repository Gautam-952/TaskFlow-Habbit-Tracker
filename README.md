# TaskFlow

> A modern, all-in-one productivity desktop application for managing tasks, projects, habits, notes, and daily progress.

TaskFlow is a productivity application built with **React and Vite**, designed to bring everyday planning and personal organization into one clean workspace.

The V1 release includes task management, project organization, habit tracking, calendar views, analytics, notes, and application settings — all with local data persistence.

---

## ✨ Features

### 📋 Task Management

* Create, edit, and delete tasks
* Set task priority
* Add due dates
* Organize tasks by projects
* Add tags and summaries
* Mark tasks as completed
* Filter and sort tasks

### 📁 Project Management

* Create and manage projects
* Organize tasks by project
* Track project-related work

### 🔥 Habit Tracker

* Create and manage habits
* Track daily completion
* Maintain habit streaks
* Monitor consistency over time

### 📅 Calendar

* View tasks and scheduled activities
* Organize your workload by date

### 📊 Analytics

* Track productivity
* View task completion statistics
* Monitor habit progress
* Visualize productivity data

### 📝 Notes

* Create and manage personal notes
* Keep important information inside TaskFlow

### ⚙️ Settings

* Application preferences
* Theme settings
* Notification preferences
* Data management options

---

## 🖥️ Desktop Application

TaskFlow V1 is packaged as a Windows desktop application using **Electron**.

The application provides a native desktop experience while using the existing React frontend.

### Desktop Features

* Windows `.exe` installer
* Desktop shortcut
* Start Menu shortcut
* Resizable application window
* Maximized workspace
* Custom TaskFlow application icon
* Local data persistence

---

## 🛠️ Tech Stack

| Technology       | Purpose                     |
| ---------------- | --------------------------- |
| React            | Frontend UI                 |
| Vite             | Development & build tooling |
| Tailwind CSS     | Styling                     |
| React Router     | Application routing         |
| Lucide React     | Icons                       |
| Electron         | Desktop application         |
| Electron Builder | Windows packaging           |
| JavaScript       | Application logic           |
| LocalStorage     | Local data persistence      |
| Git & GitHub     | Version control             |

---

## 📂 Project Structure

```text
Task-Flow-V1/
│
├── build/
│   └── ICON.ico
│
├── public/
│   ├── icons/
│   ├── logo/
│   └── textures/
│
├── src/
│   ├── Components/
│   ├── Pages/
│   ├── Routes/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── electron.cjs
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Navigate to the project

```bash
cd Task-Flow-V1
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the web development version

```bash
npm run dev
```

### 5. Run the Electron version

```bash
npm run electron
```

---

## 📦 Build the Windows Application

To create the Windows installer:

```bash
npm run dist
```

The generated installer will be available inside the:

```text
release/
```

directory.

---

## 💾 Data Storage

TaskFlow V1 uses **browser LocalStorage** for local data persistence.

The application currently stores:

```text
app_tasks
app_projects
app_habits
app_notes
```

No external database is required for the current version.

---

## 🔒 Privacy

TaskFlow V1 is designed around local-first data storage.

Your tasks, projects, habits, and notes are stored locally on your device rather than being sent to a remote server.

---

## 🗺️ Future Plans

TaskFlow is intended to grow beyond the V1 release.

Potential future improvements include:

* 🤖 AI-powered task management
* 💬 Natural-language task and habit updates
* 🔄 Smarter task automation
* ☁️ Cloud synchronization
* 📱 Mobile application
* 🔐 User accounts
* 📈 More advanced analytics
* 🔔 Improved notifications
* 🧠 AI productivity assistant

---

## 📌 Version

**TaskFlow V1.0.0**

First stable desktop release.

---

## 👨‍💻 Developer

Built as an independent project with the goal of creating a complete, practical productivity application from the ground up.

---

## ⭐ Support

If you find TaskFlow useful, consider giving the repository a ⭐ on GitHub.

---

**TaskFlow — Plan. Track. Improve.**
