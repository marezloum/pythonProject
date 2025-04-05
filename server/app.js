const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db"); // Import the database connection module
const cors = require("cors");
const bcrypt = require("bcrypt"); //hash password

const app = express(); //فانکشن اکسپرس رو که اجرا میکنیم ، یه آبجکت تحویل میده که نقش وب سرور رو داره
const port = 3008;

// Middleware
app.use(bodyParser.json());
app.use(cors()); //اجازه میدی ریکویست از دامنه های دیگه هم بیاد

//اگه لوکال هاست رو با آدرس پایین و متد "گت" صدا بزنه، من فانکشن نوشته شده رو اجرا میکنم
// Routes
app.get("/search", (req, res) => {
  const searchTerm = req.params.term; //localhost/search?term=book    searchterm=book
  db.query(
    `SELECT * FROM normalwords WHERE title like "%${searchTerm}%"`,
    (err, results) => {
      //ترم رو هرجای کلمه که پیدا کردی نشون بده
      if (err) throw err; // دیبی. کوئری خودش یک متدی از آبجکت دیبی هستش که دوتا ورودی داره
      //queryString and callback Function

      res.json(results); //نتیجه یرای کاربر ارسال میشه
    }
  );
});

//endPoint=adress
app.get("/categories", (req, res) => {
  db.query(`SELECT * FROM categories`, (err, results) => {
    if (err) throw err; // دیبی. کوئری خودش یک متدی از آبجکت دیبی هستش که دوتا ورودی داره
    //queryString and callback Function

    res.json(results); //نتیجه یرای کاربر ارسال میشه
  });
});
//endpoint for filter
app.post("/filter", (req, res) => {
  // وقتی کاربر  سرچ رو میزنه، مرورگر این آدرس اندپوینت مارو صدا میزنه- سرور اطلاعات فرستاده شده از طرف کاربر رو
  //داخل آبجکت req
  //قرار میده،  اینجوری ما به دیتای پست دسترسی پیدا میکنیم.
  //res: اطلاعات رو میبره تحویل مرورگرمیده

  // alphabets  :   ["Г"]
  // categories  :   ["2"]
  // input  :   ""
  // withImage  :   false
  // withVideo  :   false
  req.body.alphabets;
  req.body.categories;
  req.body.input;
  req.body.withImage;
  req.body.withVideo;
  //هرچیزی که ما فرستادیم  میره به عنوان پراپرتی داخل
  //req.body  قرار میگیره
  const { alphabets, categories, input, withImage, withVideo } = req.body; //req.body destructured- به اضای هر کدوم از پراپرتی هاش  اینجا یه سری
  //variable تعریف کردیم و مقادیش نظیر به نظیر برار شده
  //مثال:
  //const alphabets= req.body.alphabets

  // normalwords table structure
  // id, title, category, image, video
  // for alphabet, titel start with alphabet
  // for input, input exists in title
  let query = `SELECT * FROM normalwords WHERE 1=1`;
  const queryParams = []; // Array for parameterized query values

  // Filter by input if provided
  if (input) {
    query += ` AND title LIKE ?`;
    queryParams.push(`%${input}%`);
  }

  // Filter by alphabets if provided
  if (alphabets && alphabets.length > 0) {
    const alphabetConditions = alphabets
      .map((alphabet) => `title LIKE ?`)
      .join(" OR ");
    query += ` AND (${alphabetConditions})`;
    queryParams.push(...alphabets.map((alphabet) => `${alphabet}%`)); // Add alphabet conditions
  }

  // Filter by categories if provided
  if (categories && categories.length > 0) {
    const categoryConditions = categories
      .map(() => `category = ?`)
      .join(" OR ");
    query += ` AND (${categoryConditions})`;
    queryParams.push(...categories); // Add category conditions
  }

  // Include image/video filters if specified
  if (withImage) {
    query += ` AND image IS NOT NULL`;
  }
  if (withVideo) {
    query += ` AND video IS NOT NULL`;
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ error: "Database query error" });
    }

    res.json(results); // Send the results back to the client
  });
});

// Sign Up Endpoint
app.post("/signup", async (req, res) => {
  const { displayName, email, password } = req.body; //destructure
  if (!displayName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // User already exists
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      //رفت واسه ساخت یوزر
      // Proceed to create the user
      const query =
        "INSERT INTO users (display_name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [displayName, email, hashedPassword, 2, 1],
        (error, results) => {
          if (error) {
            console.error("Error inserting user:", error);
            return res.status(500).json({ error: "Database error" });
          }
          res.status(201).json({ message: "User created successfully" });
        }
      );
    }
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      const user = results[0];

      // Compare the password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Authentication successful
        res.status(200).json({ message: "Login successful", userId: user.id });
      } else {
        // Invalid password
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      // User not found
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // واسه اینکه بفهمیم سرور استارت شده کنسول لاگ نوشتیم
});

//سرور روی پورت داده شده که الان 3000 است اجرا می شود
//در صورت موفقیت آمیز بودن، کال بک فانکشن که ورودی دوم listen
// است، اجرا می شود
