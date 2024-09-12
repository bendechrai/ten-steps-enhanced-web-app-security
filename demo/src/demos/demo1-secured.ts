import { Router, Request, Response } from "express";
import db from "../lib/database";
import { Comment } from "../lib/types";
import escapeHtml from "escape-html";

const router = Router();

const getComments = (
  callback: (err: Error | null, comments: Comment[]) => void
) => {
  db.all<Comment>("SELECT * FROM comments", callback);
};

router.get("/", async (req: Request, res: Response) => {
  getComments((err, comments) => {
    if (err) {
      res.status(500).json({ error: "Error loading comments: " + err.message });
    } else {
      res.render("demo1-secured", { comments });
    }
  });
});

router.post("/search", (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  // SECURE WITH PREPARED STATEMENTS
  const query = "SELECT * FROM users WHERE username = ?";
  db.all(query, [name], (err, users) => {
    if (err) {
      res.status(500).json({ error: "Error occurred: " + err.message });
    } else {
      res.json(users);
    }
  });
});

router.post("/comment", (req: Request, res: Response) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: "Comment is required" });
  }

  // ESCAPE COMMENT CONTENT
  const escapedComment = escapeHtml(comment);

  // SECURE WITH PREPARED STATEMENTS
  const query = "INSERT INTO comments (comment) VALUES (?)";
  db.run(query, [escapedComment], (err) => {
    if (err) {
      res.status(500).json({ error: "Error saving comment: " + err.message });
    } else {
      getComments((err, comments) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Error loading comments: " + err.message });
        } else {
          res.json(comments);
        }
      });
    }
  });
});

export const demo1Secured = router;
