const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db"); // Import the database connection module
const cors = require("cors");
const bcrypt = require("bcrypt"); //hash password
const multer = require("multer");
const path = require("path");

const app = express(); //فانکشن اکسپرس رو که اجرا میکنیم ، یه آبجکت تحویل میده که نقش وب سرور رو داره
const port = 3008;

// Middleware
app.use(bodyParser.json());
app.use(cors()); //اجازه میدی ریکویست از دامنه های دیگه هم بیاد

//اگه لوکال هاست رو با آدرس پایین و متد "گت" صدا بزنه، من فانکشن نوشته شده رو اجرا میکنم
// Routes
app.get("/search", (req, res) => {
  const searchTerm = req.query.term; //localhost/search?term=book    searchterm=book
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

// Daily word endpoint
app.get("/dailyword", (req, res) => {
  const currentMinute = new Date().getMinutes() % 10; // Get the current minute remainder

  const normalwordsQuery = `
    SELECT w.id, w.title, w.translate, COUNT(l.id) AS likes_count
    FROM normalwords w
    LEFT JOIN likes l ON w.id = l.visual_word_id
    WHERE w.id = ?
    GROUP BY w.id
    ORDER BY likes_count
  `;

  db.query(normalwordsQuery, [Math.min(currentMinute, 2)], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/allcategories", (req, res) => {
  const categoriesQuery = "SELECT id, name FROM categories";

  db.query(categoriesQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/interactivedictionaries", (req, res) => {
  const categoriesQuery = "SELECT * FROM interactive_dictionaries";

  db.query(categoriesQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/interactivewords", (req, res) => {
  const categoryId = req.body.topicId;
  const categoryWordsQuery = `
    SELECT w.id, w.title, w.translate, c.name AS category, w.image, w.tags
    FROM interactive_words w
    JOIN interactive_dictionaries c ON w.dictionary_id = c.id 
    WHERE w.dictionary_id ="${categoryId}"`;

  db.query(categoryWordsQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/category", (req, res) => {
  const categoryId = req.body.categoryId;
  const categoryWordsQuery = `
    SELECT w.id, w.title, w.translate, w.description, c.name AS category_name, w.video, w.image, w.tags, w.examples, COUNT(l.id) AS likes
    FROM normalwords w
    LEFT JOIN likes l ON w.id = l.visual_word_id
    JOIN Categories c ON w.category = c.id 
    WHERE w.category ="${categoryId}"
    GROUP BY w.id
    ORDER BY likes`;

  db.query(categoryWordsQuery, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
//endpoint for filter
app.post("/filter", (req, res) => {
  // وقتی کاربر  سرچ رو میزنه، مرورگر این آدرس اندپوینت مارو صدا میزنه- سرور اطلاعات فرستاده شده از طرف کاربر رو
  //داخل آبجکت req
  //قرار میده،  اینجوری ما به دیتای پست دسترسی پیدا میکنیم.
  //res: اطلاعات رو میبره تحویل مرورگرمیده

  // alphabets  :   ["Г"]
  // category  :   "2"
  // input  :   ""
  // withVideo  :   false
  req.body.alphabets;
  req.body.category;
  req.body.input;
  req.body.withVideo;
  //هرچیزی که ما فرستادیم  میره به عنوان پراپرتی داخل
  //req.body  قرار میگیره
  const { alphabets, category, input, withVideo } = req.body; //req.body destructured- به اضای هر کدوم از پراپرتی هاش  اینجا یه سری
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
      .map((alphabet) => `title LIKE '${alphabet}%'`)
      .join(" OR ");
    query += ` AND (${alphabetConditions})`;
  }

  // Filter by category if provided

  if (category) {
    query += ` category = ?`;
    queryParams.push(`${category}`); // Add category conditions
  }

  // Include image/video filters if specified

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

  const query = `SELECT u.id, u.display_name as name, r.name as user_role, a.url as avatar_url, u.password
    FROM users u
    LEFT JOIN roles r ON r.id = u.role
    LEFT JOIN avatars a ON a.id = u.avatar
    WHERE u.email = ?`;
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
        res.status(200).json({ message: "Login successful", user });
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

// Login Endpoint
app.post("/fetchuser", (req, res) => {
  const { userId } = req.body;

  const query = `
  SELECT 
    u.id, 
    u.display_name AS name, 
    r.name AS user_role, 
    a.url AS avatar_url,
    nw.id AS visual_word_id,
    nw.title AS visual_word_title,
    idic.id AS interactive_dictionary_id,
    idic.name AS interactive_dictionary_name,
    lid.id AS like_id
  FROM users u
  LEFT JOIN roles r ON r.id = u.role
  LEFT JOIN avatars a ON a.id = u.avatar
  LEFT JOIN likes lid ON lid.user_id = u.id
  LEFT JOIN normalwords nw ON nw.id = lid.visual_word_id
  LEFT JOIN interactive_dictionaries idic ON idic.id = lid.interactive_dictionary_id
  WHERE u.id = ?`;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      const user = results[0];
      const likedItems = {
        visualWords: results
          .filter((row) => row.visual_word_id)
          .map((row) => ({
            likeId: row.like_id,
            wordId: row.visual_word_id,
            title: row.visual_word_title,
          })),
        interactiveDictionaries: results
          .filter((row) => row.interactive_dictionary_id)
          .map((row) => ({
            likeId: row.like_id,
            dictionaryId: row.interactive_dictionary_id,
            dictionaryName: row.interactive_dictionary_name,
          })),
      };
      user.likedItems = likedItems;
      res.status(200).json({ message: "User fetched successfully", user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Word Endpoint

app.get("/visualword", (req, res) => {
  const wordId = req.query.id; //localhost/search?term=book    searchterm=book
  db.query(
    `
    SELECT w.title, w.translate, w.description, c.name AS category_name, c.id AS category_id, w.video, w.image, w.tags, w.examples, COUNT(l.id) AS likes
    FROM normalwords w
    LEFT JOIN likes l ON w.id = l.visual_word_id
    JOIN Categories c ON w.category = c.id 
    WHERE w.id ="${wordId}"
    GROUP BY w.id
    ORDER BY likes`,
    (err, results) => {
      //ترم رو هرجای کلمه که پیدا کردی نشون بده
      if (err) throw err; // دیبی. کوئری خودش یک متدی از آبجکت دیبی هستش که دوتا ورودی داره
      //queryString and callback Function
      const wordData = results[0];
      const category = wordData["category_id"];
      // Query to get related words in the same category
      const relatedWordsQuery = `
        SELECT w.id, w.title, w.translate, w.image, COUNT(l.id) AS likes
        FROM normalwords w
        LEFT JOIN likes l ON w.id = l.visual_word_id
        WHERE w.category = ?
        AND w.id != ?
        GROUP BY w.id
        ORDER BY likes`;

      db.query(relatedWordsQuery, [category, wordId], (err, relatedResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }
        function shuffleArray(array) {
          for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
          }
          return array;
        }
        res.json({ wordData, relatedWords: shuffleArray(relatedResults) });
      });
    }
  );
});

// Add Noraml Word Endpoint
app.post(
  "/addnormalword",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, path.join(__dirname, "../client/public/img/")); // Directory for images
        } else if (file.mimetype.startsWith("video/")) {
          cb(null, path.join(__dirname, "../client/public/videos/")); // Directory for videos
        } else {
          cb(new Error("Invalid file type"), false);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
      },
    }),
  }).fields([{ name: "image" }, { name: "video" }]),
  (req, res) => {
    const {
      title,
      translate,
      description,
      tags,
      dictionary,
      category,
      examples,
    } = req.body;
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const videoFile = req.files["video"] ? req.files["video"][0] : null;

    const insertQuery = `
      INSERT INTO normalwords (title, translate, description, category, image, video, tags, examples)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      title, // From req.body
      translate, // From req.body
      description, // From req.body
      category, // From req.body
      imageFile ? "/img/" + imageFile.filename : null, // From multer
      videoFile ? "/videos/" + videoFile.filename : null, // From multer
      tags, // Assuming you have tags in your req.body
      examples, // From req.body
    ];

    // Execute the insert query
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res
        .status(201)
        .json({ message: "Word added successfully", id: results.insertId });
    });
  }
);

// Add Interactive Word Endpoint
app.post(
  "/addinteractiveword",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, path.join(__dirname, "../client/public/img/")); // Directory for images
        } else {
          cb(new Error("Invalid file type"), false);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
      },
    }),
  }).fields([{ name: "image" }]),
  (req, res) => {
    const { title, translate, dictionary, tags } = req.body;
    const imageFile = req.files["image"] ? req.files["image"][0] : null;

    const insertQuery = `
      INSERT INTO interactive_words (title, translate, dictionary_id, image, tags)
      VALUES (?, ?, ?, ?, ?)`;

    const values = [
      title, // From req.body
      translate, // From req.body
      dictionary, // From req.body
      imageFile ? "/img/" + imageFile.filename : null, // From multer
      tags, // Assuming you have tags in your req.body
    ];

    // Execute the insert query
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res
        .status(201)
        .json({ message: "Word added successfully", id: results.insertId });
    });
  }
);

// Add Normal word category
app.post(
  "/addcategory",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, path.join(__dirname, "../client/public/img/")); // Directory for images
        } else {
          cb(new Error("Invalid file type"), false);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
      },
    }),
  }).fields([{ name: "image" }]),
  (req, res) => {
    const { name } = req.body;
    const imageFile = req.files["image"] ? req.files["image"][0] : null;

    const insertQuery = `INSERT INTO categories (name, image) VALUES (?, ?)`;

    const values = [
      name, // From req.body
      imageFile ? imageFile.filename : null, // From multer
    ];

    // Execute the insert query
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res
        .status(201)
        .json({ message: "category added successfully", id: results.insertId });
    });
  }
);

// Add interactive word dictionary
app.post(
  "/addinteractivedictionary",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, path.join(__dirname, "../client/public/img/")); // Directory for images
        } else {
          cb(new Error("Invalid file type"), false);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
      },
    }),
  }).fields([{ name: "image" }]),
  (req, res) => {
    const { name } = req.body;
    const imageFile = req.files["image"] ? req.files["image"][0] : null;

    const insertQuery = `INSERT INTO interactive_dictionaries (name, image) VALUES (?, ?)`;

    const values = [
      name, // From req.body
      imageFile ? imageFile.filename : null, // From multer
    ];

    // Execute the insert query
    db.query(insertQuery, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      res
        .status(201)
        .json({
          message: "dictionary added successfully",
          id: results.insertId,
        });
    });
  }
);

app.post("/like", (req, res) => {
  const { userId, visualWordId, interactiveDictionaryId } = req.body;

  // Check if the user already liked the visual word
  const checkLikeQuery = `
    SELECT * FROM likes 
    WHERE user_id = ? AND (visual_word_id = ? OR interactive_dictionary_id = ?)`;

  db.query(
    checkLikeQuery,
    [userId, visualWordId, interactiveDictionaryId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Already liked" });
      }

      // Insert like
      const insertLikeQuery = `
      INSERT INTO likes (user_id, visual_word_id, interactive_dictionary_id) 
      VALUES (?, ?, ?)`;

      db.query(
        insertLikeQuery,
        [userId, visualWordId, interactiveDictionaryId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }
          res
            .status(201)
            .json({ message: "Liked successfully", likeId: result.insertId });
        }
      );
    }
  );
});

app.delete("/dislike/:id", (req, res) => {
  const likeId = req.params.id;

  const deleteLikeQuery = `
    DELETE FROM likes WHERE id = ?`;

  db.query(deleteLikeQuery, [likeId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Disliked successfully" });
  });
});

// Endpoint to fetch clickable dictionary data
app.get("/clickable-dictionary/:id", (req, res) => {
  const dictionaryId = req.params.id;

  const query = `
    SELECT imageSrc, title, shapes
    FROM clickable_dictionary
    WHERE id = ?;
  `;

  db.query(query, [dictionaryId], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Dictionary not found." });
    }

    const dictionary = results[0];
    dictionary.shapes = JSON.parse(dictionary.shapes); // Parse the JSON string into an object
    res.json(dictionary);
  });
});

// Endpoint to fetch clickable dictionary data
app.get("/clickable-dictionaries", (req, res) => {
  const query = `
    SELECT id, imageSrc, title, shapes
    FROM clickable_dictionary;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data." });
    }

    const dictionaries = results;
    console.log(dictionaries)

    res.json(dictionaries);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // واسه اینکه بفهمیم سرور استارت شده کنسول لاگ نوشتیم
});

//سرور روی پورت داده شده که الان 3000 است اجرا می شود
//در صورت موفقیت آمیز بودن، کال بک فانکشن که ورودی دوم listen
// است، اجرا می شود
