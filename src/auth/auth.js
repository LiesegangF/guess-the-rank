import sha256 from "crypto-js/sha256";

const users = [
  {
    username: "felix",
    passwordHash: "26f0d98e9169f161c5ad39e6812d587704e307ef224ec63caf74d65d6414080c"
  },
  {
    username: "bucher",
    passwordHash: "11409819fd00a6437302a4d3a09b78d610277302e63ec328977edab9fc5773ea"
  }
];

export function login(username, password) {
  const hash = sha256(password).toString();
  const match = users.find(u => u.username === username && u.passwordHash === hash);
  if (match) {
    localStorage.setItem("user", JSON.stringify({ username }));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("user");
}
