# Visual Dictionary Application

A comprehensive full-stack visual dictionary application with a React frontend, Node.js backend, and a Python Telegram bot. The application allows users to explore words with visual representations, translations, and interactive features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Telegram Bot](#telegram-bot)
- [Contributing](#contributing)

## ✨ Features

### User Features
- **Visual Dictionary**: Browse words with images, videos, translations, and descriptions
- **Categories**: Explore words organized by categories
- **Interactive Dictionaries**: Access interactive word collections
- **Clickable Visual Dictionary**: Interactive image-based dictionary with clickable regions
- **Search & Filter**: Search words by term, filter by alphabet, category, and video availability
- **User Authentication**: Sign up and login with secure password hashing
- **User Profiles**: View and manage liked items, change password
- **Daily Word**: Get a featured word based on time
- **Like System**: Like/unlike words, dictionaries, and interactive content
- **Q&A System**: Post questions and replies

### Admin Features
- **Add Content**: Add normal words, interactive words, categories, and interactive dictionaries
- **User Management**: View all users, change user roles, reset passwords
- **Content Management**: Upload images and videos for dictionary entries

### Telegram Bot
- **Category-based Navigation**: Browse dictionary by categories
- **Word Lookup**: Get translations and images for words
- **Interactive Interface**: Keyboard-based navigation

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Routing
- **SCSS** - Styling
- **Axios** - HTTP client
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Bot
- **Python 3** - Programming language
- **python-telegram-bot** - Telegram bot framework

## 📁 Project Structure

```
pythonProject-main/
├── client/                 # React frontend application
│   ├── public/            # Static assets (images, videos)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── App.tsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── app.js            # Express server and routes
│   ├── db.js             # MySQL database connection
│   └── package.json
│
├── visualDicBot/         # Python Telegram bot
│   ├── bot.py           # Bot implementation
│   └── images/          # Bot image assets
│
└── css/                  # Compiled CSS files
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)
- **Python 3** (v3.7 or higher)
- **pip** (Python package manager)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pythonProject-main
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Install Bot Dependencies

```bash
cd ../visualDicBot
pip install python-telegram-bot
```

## ⚙️ Configuration

### Database Configuration

1. Create a MySQL database named `visualdic`:

```sql
CREATE DATABASE visualdic;
```

2. Update database credentials in `server/db.js`:

```javascript
const db = mysql.createConnection({
  host: "localhost",
  user: "root",           // Your MySQL username
  password: "",            // Your MySQL password
  database: "visualdic",
  port: 3307              // Your MySQL port
});
```

3. Import the database schema (you'll need to create tables based on the API endpoints):
   - `users` - User accounts
   - `roles` - User roles (admin, user)
   - `categories` - Word categories
   - `normalwords` - Regular dictionary words
   - `interactive_dictionaries` - Interactive dictionary collections
   - `interactive_words` - Words in interactive dictionaries
   - `clickable_dictionary` - Clickable visual dictionaries
   - `likes` - User likes/favorites
   - `questions` - Q&A system
   - `avatars` - User avatars

### Server Configuration

Update the server port in `server/app.js` if needed (default: 3008):

```javascript
const port = 3008;
```

### Telegram Bot Configuration

Update the bot token in `visualDicBot/bot.py`:

```python
TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"
```

Get a bot token from [@BotFather](https://t.me/botfather) on Telegram.

## 🏃 Running the Application

### Start the Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:3008`

### Start the Frontend Development Server

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000` (default React port)

### Start the Telegram Bot

```bash
cd visualDicBot
python bot.py
```

## 📡 API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /fetchuser` - Get user data with liked items
- `POST /change-password` - Change user password
- `POST /admin-change-password` - Admin password reset

### Words & Dictionary
- `GET /search?term=<term>` - Search words by term
- `GET /visualword?id=<id>` - Get word details with related words
- `GET /dailyword` - Get daily featured word
- `GET /categories` - Get all categories
- `GET /allcategories` - Get all categories with images
- `POST /category` - Get words in a category
- `POST /filter` - Filter words by alphabet, category, input, video

### Interactive Dictionary
- `GET /interactivedictionaries` - Get all interactive dictionaries
- `POST /interactivewords` - Get words in an interactive dictionary

### Clickable Dictionary
- `GET /clickable-dictionaries` - Get all clickable dictionaries
- `GET /clickable-dictionary/:id` - Get specific clickable dictionary

### Content Management (Admin)
- `POST /addnormalword` - Add a normal word (with image/video upload)
- `POST /addinteractiveword` - Add an interactive word
- `POST /addcategory` - Add a category
- `POST /addinteractivedictionary` - Add an interactive dictionary

### User Management (Admin)
- `GET /users` - Get all users
- `POST /change-role` - Change user role

### Likes
- `POST /like` - Like a word/dictionary
- `DELETE /dislike/:id` - Remove a like

### Q&A
- `GET /questions` - Get all questions and replies
- `POST /questions` - Post a question or reply

## 🗄️ Database Schema

Key tables include:

- **users**: User accounts with roles and avatars
- **normalwords**: Dictionary words with title, translate, description, image, video, tags, examples
- **categories**: Word categories with name and image
- **interactive_dictionaries**: Interactive dictionary collections
- **interactive_words**: Words within interactive dictionaries
- **clickable_dictionary**: Clickable visual dictionaries with shapes data
- **likes**: User favorites linking users to words/dictionaries
- **questions**: Q&A system with parent_id for replies
- **roles**: User roles (admin, user)
- **avatars**: User avatar images

## 🤖 Telegram Bot

The Telegram bot provides dictionary access through Telegram:

1. Start the bot with `/start`
2. Choose a category from the keyboard
3. Select a word to see translation and image
4. Navigate back to categories

### Bot Features
- Category-based navigation
- Word lookup with translations
- Image display for words
- Keyboard-based interface

## 🎨 Frontend Pages

- **Home** (`/`) - Main page with search, filter, and category browsing
- **Login** (`/login`) - User authentication
- **Visual Word** (`/word`) - Word detail page
- **Category** (`/category`) - Words in a category
- **Interactive Dictionary** (`/interactivedictionary`) - Interactive dictionary view
- **Add Word** (`/addword`) - Admin content creation
- **Clickable Visual Dictionary** (`/clickable-visual-dictionary`) - Interactive clickable dictionary
- **Profile** (`/profile`) - User profile and liked items
- **Ask** (`/ask`) - Q&A system

## 🔒 Security Features

- Password hashing with bcrypt
- SQL injection protection (parameterized queries)
- CORS configuration
- File upload validation
- Role-based access control

## 📝 Notes

- The server uses MySQL on port 3307 by default
- Image and video uploads are stored in `client/public/img/` and `client/public/videos/`
- The bot token in `bot.py` should be kept secure and not committed to version control
- Admin features require appropriate user roles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Specify your license here]

## 👥 Authors

[Add author information]

## 🙏 Acknowledgments

[Add any acknowledgments]

