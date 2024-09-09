import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";

//* // Original Code
/*/ // Secured Code
import escapeHtml from "escape-html";
// */

const app = express();
const db = new sqlite3.Database(":memory:");

app.use(bodyParser.urlencoded({ extended: true }));

// Initialize the database with users and comments tables
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, name TEXT, email TEXT)");
  db.run(
    "INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com')"
  );
  db.run(
    "INSERT INTO users (id, name, email) VALUES (2, 'Bob', 'bob@example.com')"
  );
  db.run(
    "INSERT INTO users (id, name, email) VALUES (3, 'Charlie', 'charlie@example.com')"
  );

  db.run(
    "CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT)"
  );
});

app.get("/", (req: Request, res: Response) => {
  db.all<{ id: number; comment: string }>(
    "SELECT * FROM comments",
    (err, comments) => {
      if (err) {
        res.send(renderPage("Error loading comments", []));
      } else {
        res.send(renderPage("", comments));
      }
    }
  );
});

app.post("/search", (req: Request, res: Response) => {
  const name = req.body.name;

    //* // Original Code
    const query = `SELECT * FROM users WHERE name = '${name}'`;
    db.all<{ id: number; name: string; email: string }>(query, (err, rows) => {

    /*/ // Secured Code
    const query = "SELECT * FROM users WHERE name = ?";
    db.all(query, [name], (err, rows) => {
    //*/
  
    if (err) {
      res.send(renderPage("Error occurred", []));
    } else {
      db.all<{ id: number; comment: string }>(
        "SELECT * FROM comments",
        (err, comments) => {
          res.send(
            renderPage(
              `Search Results: <pre>${JSON.stringify(rows, null, 4)}</pre>`,
              comments
            )
          );
        }
      );
    }
  });
});

app.post("/comment", (req: Request, res: Response) => {
  const comment = req.body.comment;

    //* // Original Code
    db.run("INSERT INTO comments (comment) VALUES (?)", [comment], (err) => {

    /*/ // Secured Code
    const escapedComment = escapeHtml(comment);
    db.run("INSERT INTO comments (comment) VALUES (?)", [escapedComment], (err) => {
    //*/

    if (err) {
      res.send(renderPage("Error saving comment", []));
    } else {
      db.all<{ id: number; comment: string }>(
        "SELECT * FROM comments",
        (err, comments) => {
            res.redirect("/");
        }
      );
    }
  });
});

// Render the HTML page with results and comments
function renderPage(
  result: string,
  comments: { id: number; comment: string }[]
) {
  const commentsHtml = comments.map((c) => `<p>${c.comment}</p>`).join("");
  return `
    <h1>Demo 1 - Preventing Common Vulnerabilities</h1>

    <form action="/search" method="post">
      <label>Search User by Name:</label>
      <input id="name" name="name" size="30">
      <button type="submit">Search</button>
    </form>
    <p><a onclick="document.getElementById('name').value = '\\' OR \\'1\\'=\\'1';">...</a></p>
    <div id="result" style="margin-top: 20px;">${result}</div>

    <form action="/comment" method="post" style="margin-top: 20px;">
      <label>Leave a Comment:</label>
      <input id="comment" name="comment" size="30">
      <button type="submit">Submit</button>
    </form>
    <p><a onclick="document.getElementById('comment').value = '&lt;script&gt;alert(\\'Cross Site Scripting Attack\\')&lt;/script&gt;'">...</a></p>
    
    <h2>Comments</h2>
    <p><a href="/">Refresh</a></p>
    <div>${commentsHtml}</div>
  `;
}

app.listen(3101, () => {
  console.log("Demo 1 running on http://localhost:3101");
});
