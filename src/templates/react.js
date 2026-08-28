module.exports = {
  key: 'react',
  aliases: ['reactjs', 'vite-react'],
  description: 'Estructura moderna para aplicaciones React (Vite / CRA)',
  content: `# React Application Architecture

\`\`\`folderTree
my-react-app/
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   └── Button.jsx
│   │   └── Header.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.ico
├── .env
├── package.json
└── README.md
\`\`\`
`,
};