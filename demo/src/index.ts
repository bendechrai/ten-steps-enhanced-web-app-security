import express from "express";
import bodyParser from "body-parser";
import { session } from "./lib/security";
import { config } from "./config";
import { demo1Vulnerable } from "./demos/demo1-vulnerable";
import { demo1Secured } from "./demos/demo1-secured";
import db, { initializeDatabase } from "./lib/database";
import { User } from "./lib/types";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: config.SECRET_KEY,
  })
);

app.set("view engine", "ejs");
app.set("views", "./src/views");

initializeDatabase();

app.get("/", async (req, res) => {
  const userId = req.session.userId;

  const getUserById = (id: number) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  };

  const user = userId
    ? await getUserById(userId).catch((err) => {
        console.error("Error fetching user from database:", err);
        return null;
      })
    : null;

  res.render("index", { user, error: req.query.error });
});

app.post("/login", (req, res) => {
  const { user_name, login_pass } = req.body;

  // Dummy validation, replace with actual database check
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [user_name, login_pass],
    (err, user: User) => {
      if (err || !user) {
        return res.redirect("/?error=Invalid%20credentials");
      }

      // Set the session user ID
      req.session.userId = user.id;

      // Save session and then redirect
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("Session save error:", saveErr);
          return res.redirect("/?error=Session%20error");
        }
        res.redirect("/");
      });
    }
  );
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

app.use("/demo1-vulnerable", demo1Vulnerable);
app.use("/demo1-secured", demo1Secured);

app.listen(3000, () => {
  console.log("Demo app running on http://localhost:3000");
});
