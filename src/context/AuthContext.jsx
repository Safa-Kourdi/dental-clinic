// // import { createContext, useContext, useEffect, useState } from "react";
// // import { onAuthStateChanged, signOut } from "firebase/auth";
// // import { doc, getDoc } from "firebase/firestore";
// // import { auth, db } from "../firebase";

// // const AuthContext = createContext(null);

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [profile, setProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const loadProfile = async (u) => {
// //     if (!u) {
// //       setProfile(null);
// //       return;
// //     }
// //     const snap = await getDoc(doc(db, "users", u.uid));
// //     setProfile(snap.exists() ? snap.data() : null);
// //   };

// //   useEffect(() => {
// //     const unsub = onAuthStateChanged(auth, async (u) => {
// //       setUser(u);
// //       await loadProfile(u);
// //       setLoading(false);
// //     });
// //     return unsub;
// //   }, []);

// //   const logout = () => signOut(auth);
// //   const refreshProfile = () => loadProfile(auth.currentUser);

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         profile,
// //         role: profile?.role,
// //         loading,
// //         logout,
// //         refreshProfile,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => useContext(AuthContext);
// import { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../firebase";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadProfile = async (u) => {
//     if (!u) {
//       setProfile(null);
//       return;
//     }
//     try {
//       const snap = await getDoc(doc(db, "users", u.uid));
//       setProfile(snap.exists() ? snap.data() : null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       setUser(u);
//       setLoading(false);
//       loadProfile(u); // بالخلفية، بدون انتظار
//     });
//     return unsub;
//   }, []);

//   const logout = () => signOut(auth);
//   const refreshProfile = () => loadProfile(auth.currentUser);
//   const role = user ? (profile?.role ?? "patient") : null;

//   return (
//     <AuthContext.Provider
//       value={{ user, profile, role, loading, logout, refreshProfile }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

// إذا تأخر التحميل أكثر من 8 ثواني، منكمّل بدون ما نعلّق الموقع
const withTimeout = (promise, ms = 8000) =>
  Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u) => {
    if (!u) {
      setProfile(null);
      return;
    }
    try {
      const snap = await getDoc(doc(db, "users", u.uid));
      setProfile(snap.exists() ? snap.data() : null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      // منحمّل الدور أولاً، وبعدها منعلن عن المستخدم (مع بعض)
      await withTimeout(loadProfile(u));
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = () => signOut(auth);
  const refreshProfile = () => loadProfile(auth.currentUser);
  const role = user ? (profile?.role ?? "patient") : null;

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);