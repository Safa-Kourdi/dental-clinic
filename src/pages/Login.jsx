// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";
// import { authError } from "../utils/authErrors";
// import Spinner from "../components/Loader";

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/");
//     } catch (err) {
//       setError(authError(err.code));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="auth-page">
//       <form className="auth-card" onSubmit={handleSubmit}>
//         <h2>تسجيل الدخول</h2>
//         <p className="auth-sub">أهلاً بعودتك</p>

//         {error && <div className="auth-error">{error}</div>}

//         <label>البريد الإلكتروني</label>
//         <input
//           type="email"
//           dir="ltr"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <label>كلمة المرور</label>
//         <input
//           type="password"
//           dir="ltr"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button className="btn btn-primary auth-btn" disabled={loading}>
//           {loading ? <Spinner light/>: "دخول"}
//         </button>

//         <p className="auth-switch">
//           ما عندك حساب؟ <Link to="/register">أنشئ حساباً</Link>
//         </p>
//       </form>
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { authError } from "../utils/authErrors";
import { Spinner } from "../components/Loader";

export default function Login() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // بعد تسجيل الدخول: الموظفون للوحة التحكم، والمرضى للصفحة الرئيسية
  useEffect(() => {
    if (authLoading || !user) return;
    const isStaff = role === "nurse" || role === "doctor";
    navigate(isStaff ? "/dashboard" : "/", { replace: true });
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(authError(err.code));
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>
        <p className="auth-sub">أهلاً بعودتك</p>

        {error && <div className="auth-error">{error}</div>}

        <label>البريد الإلكتروني</label>
        <input
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>كلمة المرور</label>
        <input
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary auth-btn" disabled={loading}>
          {loading ? <Spinner light /> : "دخول"}
        </button>

        <p className="auth-switch">
          ليس لديك حساب؟ <Link to="/register">أنشئ حساباً</Link>
        </p>
      </form>
    </section>
  );
}