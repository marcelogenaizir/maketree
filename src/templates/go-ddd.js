module.exports = {
  key: 'go-ddd',
  aliases: ['go', 'golang'],
  description: 'Go Clean Architecture & Domain-Driven Design',
  content: `# Go Clean Architecture & DDD

\`\`\`folderTree
go-ddd-app/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── domain/
│   │   ├── entity/
│   │   │   └── user.go
│   │   ├── repository/
│   │   │   └── user_repository.go
│   │   └── service/
│   │       └── user_service.go
│   ├── application/
│   │   ├── usecase/
│   │   │   └── create_user.go
│   │   └── dto/
│   │       └── user_dto.go
│   └── infrastructure/
│       ├── adapter/
│       │   └── postgres_repo.go
│       ├── http/
│       │   ├── handler/
│       │   │   └── user_handler.go
│       │   ├── router/
│       │   │   └── router.go
│       │   └── middleware/
│       │       └── auth.go
│       └── config/
│           └── config.go
├── pkg/
│   └── logger/
│       └── logger.go
├── db/
│   └── migrations/
│       └── 000001_init.up.sql
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
├── Makefile
└── README.md
\`\`\`
`,
};