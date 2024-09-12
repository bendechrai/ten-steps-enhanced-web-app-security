export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
  }
  
  export interface Comment {
    id: number;
    comment: string;
    user_id: number;
  }
  
  export interface UserSearchResult {
    id: number;
    name: string;
    email: string;
  }
  