import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _session from "express-session";
import { Request, Response, NextFunction } from "express";
import db from "./database";
import { config } from "../config";

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user: User) => {
      if (err || !user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send("Invalid credentials");
      }
      req.session.userId = user.id;
      res.redirect("/");
    }
  );
};

export const secureSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

export const session = (params: _session.SessionOptions) => {
  const defaults = {
    secret: "",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  };
  return _session({ ...defaults, ...params });
};
