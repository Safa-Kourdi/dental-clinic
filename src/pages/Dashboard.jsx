import { useEffect, useMemo, useState } from "react";
import TodayIcon from "@mui/icons-material/Today";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useAuth } from "../context/AuthContext";
import { STATUS_LABELS } from "../data/clinic";
import Loader, { Spinner } from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../services/appointments";

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const timeLabel = (d) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const TABS = [
  { key: "upcoming", label: "القادمة" },
  { key: "pending", label: "بانتظار التأكيد" },
  { key: "confirmed", label: "مؤكد" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي / مرفوض" },
  { key: "all", label: "الكل" },
];

const matchStatus = (a, key, today) => {
  if (key === "all") return true;
  if (key === "upcoming") {
    return (
      a.date >= today && (a.status === "pending" || a.status === "confirmed")
    );
  }
  if (key === "cancelled") {
    return a.status === "cancelled" || a.status === "rejected";
  }
  return a.status === key;
};

const DIALOGS = {
  reject: {
    status: "rejected",
    title: "رفض الموعد",
    confirmText: "نعم، رفض الموعد",
    danger: true,
    Icon: EventBusyIcon,
    text: (a) =>
      ` هل تريد رفض موعد ${a.patientName} (${a.service}) بتاريخ ${a.date} الساعة ${a.time}؟ سيصبح هذا الوقت متاحاً للحجز من جديد.,`,
  },
  cancel: {
    status: "cancelled",
    title: "إلغاء الموعد",
    confirmText: "نعم، إلغاء الموعد",
    danger: true,
    Icon: EventBusyIcon,
    text: (a) =>
      `هل تريد إلغاء موعد ${a.patientName} (${a.service}) بتاريخ ${a.date} الساعة ${a.time}؟ سيصبح هذا الوقت متاحاً للحجز من جديد.,`,
  },
  complete: {
    status: "completed",
    title: "تسجيل الحضور",
    confirmText: "تم الحضور",
    danger: false,
    Icon: DoneAllIcon,
    text: (a) =>
      `هل حضر المريض ${a.patientName} موعده بتاريخ ${a.date} الساعة ${a.time}؟ سيتم تسجيل الموعد كمكتمل.,`,
  },
};

export default function Dashboard() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("upcoming");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [dialog, setDialog] = useState(null); // { type, appt }
  const [working, setWorking] = useState(false);

  const today = todayStr();

  const load = async () => {
    setError("");
    try {
    //   setItems(await getAllAppointments());
    setItems(await getAllAppointments());
    setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("تعذّر تحميل المواعيد");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

const handleRefresh = async () => {
  setRefreshing(true);
  await Promise.all([load(), new Promise((r) => setTimeout(r, 700))]);
  setRefreshing(false);
};

  const stats = useMemo(
    () => ({
      today: items.filter(
        (a) =>
          a.date === today && !["cancelled", "rejected"].includes(a.status),
        // (a) => a.date === today && ["pending", "confirmed"].includes(a.status),
      ).length,
      pending: items.filter((a) => a.status === "pending").length,
      confirmed: items.filter(
        (a) => a.status === "confirmed" && a.date >= today,
      ).length,
      total: items.length,
    }),
    [items, today],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(
      (a) =>
        matchStatus(a, tab, today) &&
        (!date || a.date === date) &&
        (!q ||
          a.patientName?.toLowerCase().includes(q) ||
          a.phone?.includes(q)),
    );
    // القادمة: الأقرب أولاً، وباقي التبويبات: الأحدث أولاً
    return tab === "upcoming" ? list : [...list].reverse();
  }, [items, tab, date, query, today]);

  const handleConfirm = async (a) => {
    setBusyId(a.id);
    setError("");
    try {
      await updateAppointmentStatus(a, "confirmed");
      await load();
    } catch (err) {
      console.error(err);
      setError("تعذّر تأكيد الموعد");
    } finally {
      setBusyId(null);
    }
  };

  const runDialog = async () => {
    setWorking(true);
    setError("");
    try {
      await updateAppointmentStatus(dialog.appt, DIALOGS[dialog.type].status);
      await load();
    } catch (err) {
      console.error(err);
      setError("تعذّر تنفيذ العملية");
    } finally {
      setWorking(false);
      setDialog(null);
    }
  };

  const cfg = dialog ? DIALOGS[dialog.type] : null;

  const statCards = [
    { Icon: TodayIcon, label: "مواعيد اليوم", value: stats.today },
    { Icon: HourglassTopIcon, label: "بانتظار التأكيد", value: stats.pending },
    { Icon: EventAvailableIcon, label: "مؤكدة قادمة", value: stats.confirmed },
    { Icon: ListAltIcon, label: "إجمالي المواعيد", value: stats.total },
  ];

  return (
    <section className="dash-page">
      <div className="dash-head">
        <div>
          <h2>{role === "doctor" ? "لوحة الطبيب" : "لوحة الممرضة"}</h2>
          <p>إدارة مواعيد المرضى</p>
         </div>
        {/* <button className="chip refresh-btn" onClick={load}>
          <RefreshIcon fontSize="small" /> تحديث
        </button>  */}
        <div className="dash-tools">
          {lastUpdated && (
            <span className="last-updated">
              آخر تحديث: {timeLabel(lastUpdated)}
            </span>
          )}
          <button
            className="chip refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Spinner size={18} />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
            تحديث
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(({ Icon, label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon">
              <Icon />
            </div>
            <div>
              <strong>{value}</strong>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="chips">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`chip ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              <span className="chip-count">
                {items.filter((a) => matchStatus(a, t.key, today)).length}
              </span>
            </button>
          ))}
        </div>

        <div className="filters">
          <div className="search-box">
            <SearchIcon fontSize="small" />
            <input
              placeholder="ابحث باسم المريض أو رقم هاتفه"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="date-filter"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="chip" onClick={() => setDate(today)}>
            اليوم
          </button>
          {date && (
            <button className="chip" onClick={() => setDate("")}>
              إزالة التاريخ
            </button>
          )}
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="table-empty">لا توجد مواعيد مطابقة</div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>المريض</th>
                  <th>الخدمة</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.patientName}</strong>
                      <span className="cell-sub" dir="ltr">
                        {a.phone}
                      </span>
                    </td>
                    <td>
                      {a.service}
                      {a.notes && <span className="cell-sub">{a.notes}</span>}
                    </td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td>
                      <span className={`badge badge-${a.status}`}>
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        {busyId === a.id ? (
                          <Spinner size={22} />
                        ) : a.status === "pending" ? (
                          <>
                            <button
                              className="act-btn act-confirm"
                              onClick={() => handleConfirm(a)}
                            >
                              <CheckIcon fontSize="small" /> تأكيد
                            </button>
                            <button
                              className="act-btn act-reject"
                              onClick={() =>
                                setDialog({ type: "reject", appt: a })
                              }
                            >
                              <CloseIcon fontSize="small" /> رفض
                            </button>
                          </>
                        ) : a.status === "confirmed" ? (
                          <>
                            {a.date <= today && (
                              <button
                                className="act-btn act-neutral"
                                onClick={() =>
                                  setDialog({ type: "complete", appt: a })
                                }
                              >
                                <DoneAllIcon fontSize="small" /> تم الحضور
                              </button>
                            )}
                            <button
                              className="act-btn act-reject"
                              onClick={() =>
                                setDialog({ type: "cancel", appt: a })
                              }
                            >
                              <CloseIcon fontSize="small" /> إلغاء
                            </button>
                          </>
                        ) : (
                          "—"
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!dialog}
        Icon={cfg?.Icon}
        danger={cfg?.danger}
        loading={working}
        title={cfg?.title || ""}
        message={cfg ? cfg.text(dialog.appt) : ""}
        confirmText={cfg?.confirmText}
        cancelText="تراجع"
        onConfirm={runDialog}
        onClose={() => setDialog(null)}
      />
    </section>
  );
}
