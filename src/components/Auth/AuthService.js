// import { jwtDecode } from "jwt-decode";

// const BASE_URL = "http://localhost:8080/api";

// export const AuthService = {
//   login: async (email, password) => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
//         {
//           method: 'POST',
//           headers: {
//             Accept: 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//       const token = await response.text();
//       localStorage.setItem("token", token);

//       const decoded = jwtDecode(token); // ✅ Fixed usage
//       localStorage.setItem("user", JSON.stringify(decoded));

//       return token;

//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   },

//   getToken: () => localStorage.getItem("token"),

//   isAuthenticated: () => !!localStorage.getItem("token"),

//   getUser: () => {
//     const user = localStorage.getItem("user");
//     return user ? JSON.parse(user) : null;
//   }
// };
