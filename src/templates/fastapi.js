module.exports = {
  key: 'fastapi',
  aliases: ['python-fastapi', 'python'],
  description: 'Estructura modular para REST API con Python FastAPI',
  content: `# Python FastAPI Architecture

\`\`\`folderTree
fastapi-app/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── users.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   │   └── user.py
│   ├── schemas/
│   │   └── user.py
│   ├── services/
│   │   └── user_service.py
│   └── main.py
├── tests/
│   └── test_main.py
├── .env
├── requirements.txt
└── README.md
\`\`\`
`,
};