import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

export const initializeDatabase = () => {
  db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT)");
    db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT)");

    // Add test users
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['alice', 'password', 'admin']);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['bobby', 'password', 'user']);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['charlie', 'password', 'user']);
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['danny', 'password', 'user']);
    
  });
};

export default db;
