import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { authError } from "../utils/authErrors";
import { Spinner } from "../components/Loader";

const normalizePhone = (p) => {
  let d = p.replace(/\D/g, "");
  if (d.startsWith("963")) d = "0" + d.slice(3);
  return d;
};

const withTimeout = (promise, ms = 8000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);

export default function Register() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    const phone = normalizePhone(form.phone);
    if (!/^09\d{8}$/.test(phone)) {
      setError("رقم الهاتف غير صحيح ");
      return;
    }

    setLoading(true);

    // 1) فحص سريع لرسالة أوضح
    try {
      const taken = await withTimeout(getDoc(doc(db, "phones", phone)));
      if (taken.exists()) {
        setError("رقم الهاتف مسجّل مسبقاً");
        setLoading(false);
        return;
      }
    } catch {
      setError("تعذّر التحقق من رقم الهاتف، حاول مرة أخرى");
      setLoading(false);
      return;
    }

    // 2) إنشاء الحساب
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
    } catch (err) {
      setError(authError(err.code));
      setLoading(false);
      return;
    }

    // 3) حفظ الرقم وبيانات المستخدم بعملية وحدة
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "phones", phone), { uid: cred.user.uid });
      batch.set(doc(db, "users", cred.user.uid), {
        name: form.name,
        phone,
        email: form.email,
        role: "patient",
        createdAt: serverTimestamp(),
      });
      await batch.commit();

      updateProfile(cred.user, { displayName: form.name }).catch(console.error);
      await refreshProfile();
      navigate("/");
    } catch (err) {
      await cred.user.delete().catch(console.error);
      setError(
        err.code === "permission-denied"
          ? "رقم الهاتف مسجّل مسبقاً"
          : "تعذّر إكمال التسجيل، حاول مرة أخرى",
      );
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>إنشاء حساب جديد</h2>
        <p className="auth-sub">قم بالتسجيل لحجز مواعيدك بسهولة </p>

        {error && <div className="auth-error">{error}</div>}

        <label>الاسم الكامل</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>رقم الهاتف</label>
        <input
          name="phone"
          type="tel"
          dir="ltr"
          placeholder="0912345678"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label>البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          dir="ltr"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>كلمة المرور</label>
        <input
          name="password"
          type="password"
          dir="ltr"
          value={form.password}
          onChange={handleChange}
          required
        />
        <label>تأكيد كلمة المرور</label>
        <input
          name="confirm"
          type="password"
          dir="ltr"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary auth-btn" disabled={loading}>
          {loading ? <Spinner light/>: "إنشاء الحساب"}
        </button>

        <p className="auth-switch">
          عندك حساب؟ <Link to="/login">سجّل الدخول</Link>
        </p>
      </form>
    </section>
  );
}