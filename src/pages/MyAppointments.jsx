// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { useAuth } from "../context/AuthContext";
// import { STATUS_LABELS } from "../data/clinic";
// import Loader from "../components/Loader";
// import {
//   cancelAppointment,
//   getMyAppointments,
// } from "../services/appointments";

// const todayStr = () => {
//   const d = new Date();
//   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//   return d.toISOString().slice(0, 10);
// };

// export default function MyAppointments() {
//   const { user } = useAuth();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const load = async () => {
//     try {
//       setItems(await getMyAppointments(user.uid));
//     } catch (err) {
//       console.error(err);
//       setError("تعذّر تحميل المواعيد");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleCancel = async (appt) => {
//     if (!window.confirm("هل تريد إلغاء هذا الموعد؟")) return;
//     try {
//       await cancelAppointment(appt);
//       await load();
//     } catch (err) {
//       console.error(err);
//       setError("تعذّر إلغاء الموعد");
//     }
//   };

//   return (
//     <section className="appts-page">
//       <div className="appts-inner">
//         <h2 className="section-title">مواعيدي</h2>
//         <p className="section-sub">جميع مواعيدك في مكان واحد</p>

//         {error && <div className="auth-error">{error}</div>}

//         {loading && <Loader />}

//         {!loading && items.length === 0 && (
//           <div className="empty-box">
//             <p>لا توجد لديك مواعيد بعد</p>
//             <Link to="/book" className="btn btn-primary">احجز موعدك الأول</Link>
//           </div>
//         )}

//         <div className="appts-list">
//           {items.map((a) => {
//             const canCancel =
//               (a.status === "pending" || a.status === "confirmed") &&
//               a.date >= todayStr();
//             return (
//               <div key={a.id} className="appt-card">
//                 <div className="appt-top">
//                   <h3>{a.service}</h3>
//                   <span className={`badge badge-${a.status}`}>
//                     {STATUS_LABELS[a.status] || a.status}
//                   </span>
//                 </div>

//                 <p className="appt-meta">
//                   <span><CalendarMonthIcon fontSize="small" /> {a.date}</span>
//                   <span><AccessTimeIcon fontSize="small" /> {a.time}</span>
//                 </p>

//                 {a.notes && <p className="appt-notes">{a.notes}</p>}

//                 {canCancel && (
//                   <button
//                     className="btn btn-outline nav-btn appt-cancel"
//                     onClick={() => handleCancel(a)}
//                   >
//                     إلغاء الموعد
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useAuth } from "../context/AuthContext";
import { STATUS_LABELS } from "../data/clinic";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  cancelAppointment,
  getMyAppointments,
} from "../services/appointments";

const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function MyAppointments() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [target, setTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    try {
      setItems(await getMyAppointments(user.uid));
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

  const confirmCancel = async () => {
    setCancelling(true);
    setError("");
    try {
      await cancelAppointment(target);
      await load();
      setTarget(null);
    } catch (err) {
      console.error(err);
      setError("تعذّر إلغاء الموعد");
      setTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section className="appts-page">
      <div className="appts-inner">
        <h2 className="section-title">مواعيدي</h2>
        <p className="section-sub">جميع مواعيدك في مكان واحد</p>

        {error && <div className="auth-error">{error}</div>}

        {loading && <Loader />}

        {!loading && items.length === 0 && (
          <div className="empty-box">
            <p>لا توجد لديك مواعيد بعد</p>
            <Link to="/book" className="btn btn-primary">احجز موعدك الأول</Link>
          </div>
        )}

        <div className="appts-list">
          {items.map((a) => {
            const canCancel =
              (a.status === "pending" || a.status === "confirmed") &&
              a.date >= todayStr();
            return (
              <div key={a.id} className="appt-card">
                <div className="appt-top">
                  <h3>{a.service}</h3>
                  <span className={`badge badge-${a.status}`}>
                    {STATUS_LABELS[a.status] || a.status}
                  </span>
                </div>

                <p className="appt-meta">
                  <span><CalendarMonthIcon fontSize="small" /> {a.date}</span>
                  <span><AccessTimeIcon fontSize="small" /> {a.time}</span>
                </p>

                {a.notes && <p className="appt-notes">{a.notes}</p>}

                {canCancel && (
                  <button
                    className="btn btn-outline nav-btn appt-cancel"
                    onClick={() => setTarget(a)}
                  >
                    إلغاء الموعد
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={!!target}
        Icon={EventBusyIcon}
        danger
        loading={cancelling}
        title="إلغاء الموعد"
        message={
          target
            ?`هل أنت متأكد من إلغاء موعد «${target.service}» بتاريخ ${target.date} الساعة ${target.time}؟ سيصبح هذا الوقت متاحاً لمرضى آخرين.`
            : ""
        }
        confirmText="نعم، إلغاء الموعد"
        cancelText="تراجع"
        onConfirm={confirmCancel}
        onClose={() => setTarget(null)}
      />
    </section>
  );
}