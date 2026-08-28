module.exports = {
  key: 'node',
  aliases: ['express', 'express-api', 'node-api'],
  description: 'Arquitectura MVC / REST API con Node.js y Express',
  content: `# Express API Architecture

\`\`\`folderTree
express-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── tests/
│   └── user.test.js
├── .env
├── package.json
└── server.js
\`\`\`
`,
};