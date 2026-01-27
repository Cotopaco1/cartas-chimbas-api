import db from '../config/database';

export const findUserByEmail = (email: string) => {
  // prepare() compila la query. get() ejecuta y devuelve 1 resultado.
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

export const createUser = (email: string, username: string) => {
  const stmt = db.prepare('INSERT INTO users (email, username) VALUES (?, ?)');
  
  // run() ejecuta cambios (INSERT, UPDATE, DELETE)
  const info = stmt.run(email, username);
  
  // info.lastInsertRowid te da el ID generado (útil para devolverlo al front)
  return info.lastInsertRowid;
};