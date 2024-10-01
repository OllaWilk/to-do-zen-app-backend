# :construction_worker: To-Do-Zen v0.1.0 backend

The To-Do-Zen application is a simple tool that allows users to manage their task list. It enables adding, removing, and marking tasks as completed. This web application is accessible through an internet browser. Additionally, the application offers the functionality to review one's progress over time, acting not only as a task list but also as a habit tracker. This feature allows users not just to manage current tasks but also to monitor their habits and progress towards long-term goals. This added functionality makes the application a more versatile tool for time management and personal development.

## 🧘‍♀️ Resources

**Live demo:** IN PROGRESS \
**Github frontend:** [https://github.com/OllaWilk/to-do-zen-app-frontend](https://github.com/OllaWilk/to-do-zen-app-frontend)

**Github backend:** [https://github.com/OllaWilk/to-do-zen-app-backend](https://github.com/OllaWilk/to-do-zen-app-backend)

## 🐞 Tech Stack

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

## :camel: Project structure

```
to-do-zen-app-back/
├── records/
|   ├── task.record.ts
│   └── event.record.ts
├── routes/
│   ├── events/
│   │   └── events.routes.ts
│   └── tasks/
│        └── tasks.routes.ts
├── types/
│   ├── task/
|   |    ├── index.ts
|   |    └── task--record.ts
│   └── index.ts
├── utils/
│   ├── db.ts
│   └── errors.ts
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json

```

## 🦋 Installation project

**Clone the project:**

```
git clone https://github.com/OllaWilk/to-do-zen-app-frontend.git
```

**Go to the project directory:**

```
cd to-do-zen-app-frontend
```

**Install dependencies:**

```
npm install
```

**Start the server:**

```
npm start
```
