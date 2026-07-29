## Backend

# Folder

```
backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│
├── src/
│   ├── index.js
│   │
│   ├── config/
│   │   ├── cors.js
│   │   ├── env.js
│   │   └── prisma.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── service-request.routes.js
│   │   └── admin.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── service-request.controller.js
│   │   └── admin.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── service-request.service.js
│   │   └── admin.service.js
│   │
│   ├── repositories/
│   │   ├── user.repository.js
│   │   └── service-request.repository.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── service-request.validator.js
│   │   └── admin.validator.js
│   │
│   ├── errors/
│   │   ├── AppError.js
│   │   ├── ValidationError.js
│   │   ├── AuthenticationError.js
│   │   ├── AuthorizationError.js
│   │   ├── NotFoundError.js
│   │   └── ConflictError.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── response.js
│   │   └── constants.js
│   │
│   └── types/
│       └── roles.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
