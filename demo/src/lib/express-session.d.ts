import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number; // Add any other custom properties here
  }
}
