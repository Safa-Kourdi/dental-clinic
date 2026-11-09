import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "../context/AuthContext";
import { SERVICES, TIME_SLOTS } from "../data/clinic";
import { bookAppointment, getBookedTimes } from "../services/appointments";
import { Spinner } from "../components/Loader";

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const nowTime = () => new Date().toTimeString().slice(0, 5);
const isFriday = (s) => new Date(s + "T12:00:00").getDay() === 5;

export default function Book() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBooked = async (d) => {
    setLoadingSlots(true);
    try {
      setBooked(await getBookedTimes(d));
    } catch (err) {
      console.error(err);
      setError("تعذّر تحميل الأوقات المتاحة");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    setTime("");
    setError("");
    if (date && !isFriday(date)) loadBooked(date);
    else setBooked([]);
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time) {
      setError("يرجى اختيار التاريخ والوقت");
      return;
    }

    setSaving(true);
    try {
      await bookAppointment({ user, profile, service, date, time, notes });
      navigate("/my-appointments");
    } catch (err) {
      console.error(err);
      if (err.code === "permission-denied") {
        setError("تم حجز هذا الموعد للتو، يرجى اختيار وقت آخر");
        setTime("");
        loadBooked(date);
      } else {
        setError("تعذّر حجز الموعد، حاول مرة أخرى");
      }
      setSaving(false);
    }
  };

  const closed = date && isFriday(date);

  const summary = (
    <>
      <h3>ملخص الحجز</h3>
      <ul className="summary-list">
        <li>
          <MedicalServicesIcon />
          <span>الخدمة</span>
          <strong>{service}</strong>
        </li>
        <li>
          <CalendarMonthIcon />
          <span>التاريخ</span>
          <strong>{date || "—"}</strong>
        </li>
        <li>
          <AccessTimeIcon />
          <span>الوقت</span>
          <strong>{time || "—"}</strong>
        </li>
      </ul>
      <div className="summary-note">
        <InfoOutlinedIcon fontSize="small" />
        <p>
          ساعات الدوام: السبت – الخميس، من 9 صباحاً حتى 7 مساءً.
          العيادة مغلقة يوم الجمعة. يمكنك إلغاء الموعد من صفحة «مواعيدي».
        </p>
      </div>
    </>
  );

  return (
    <section className="book-page">
      <div className="book-layout">
        <form className="book-form" onSubmit={handleSubmit}>
          <h2>حجز موعد</h2>
          <p className="auth-sub">اختر الخدمة والتاريخ والوقت المناسب</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="form-row">
            <div>
              <label>الخدمة</label>
              <select value={service} onChange={(e) => setService(e.target.value)}>
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select></div>
            <div>
              <label>التاريخ</label>
              <input
                type="date"
                min={todayStr()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {closed && <div className="auth-error">العيادة مغلقة يوم الجمعة</div>}

          {date && !closed && (
            <>
              <label>
                الأوقات المتاحة : {loadingSlots && <Spinner size={18} inline />}
              </label>
              <div className="slots-grid">
                {TIME_SLOTS.map((t) => {
                  const disabled =
                    booked.includes(t) || (date === todayStr() && t <= nowTime());
                  return (
                    <button
                      type="button"
                      key={t}
                      disabled={disabled}
                      className={`slot-btn ${time === t ? "active" : ""}`}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <label>ملاحظات (اختياري)</label>
          <textarea
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            
          />

          {/* يظهر على الشاشات الصغيرة فقط، فوق زر التأكيد */}
          <div className="summary-inline">{summary}</div>

          <button
            className="btn btn-primary auth-btn"
            disabled={saving || closed}
          >
            {saving ? <Spinner light /> : "تأكيد الحجز"}
          </button>
        </form>

        {/* يظهر على الشاشات الكبيرة فقط، بجانب الفورم */}
        <aside className="book-summary">{summary}</aside>
      </div>
    </section>
  );
}