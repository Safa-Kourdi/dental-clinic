// import { useState } from "react";
// import { Link } from "react-router-dom";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
// import PersonIcon from "@mui/icons-material/Person";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useAuth } from "../context/AuthContext";
// import ConfirmDialog from "./ConfirmDialog";

// export default function Navbar() {
//   const { user, profile, role, loading, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [askLogout, setAskLogout] = useState(false);
//   const close = () => setOpen(false);

//   const links = [
//     { to: "/#services", label: "خدماتنا" },
//     { to: "/#about", label: "عن الطبيب" },
//     { to: "/#testimonials", label: "آراء المرضى" },
//     { to: "/#contact", label: "تواصل معنا" },
//   ];

//   if (role === "patient") {
//     links.push(
//       { to: "/book", label: "حجز موعد" },
//       { to: "/my-appointments", label: "مواعيدي" }
//     );
//   }

//   if (role === "nurse" || role === "doctor") {
//     links.push({ to: "/dashboard", label: "لوحة التحكم" });
//   }

//   const name = profile?.name || user?.displayName ;

//   const openLogoutDialog = () => {
//     close();
//     setAskLogout(true);
//   };

//   const confirmLogout = () => {
//     setAskLogout(false);
//     logout();
//   };

//   return (
//     <header className="navbar">
//       <div className="nav-inner">
//         <Link to="/" className="logo" onClick={close}>
//           🦷 عيادة ابتسامة
//         </Link>

//         <ul className="nav-links">
//           {links.map((l) => (
//             <li key={l.to}>
//               <Link to={l.to}>{l.label}</Link>
//             </li>
//           ))}
//         </ul>

//         <div className="nav-actions">
//           {loading ? null : user ? (
//             <>
//               <span className="nav-user">
//                 <PersonIcon fontSize="small" />
//                 {name}
//               </span>
//               <button
//                 className="btn btn-outline nav-btn"
//                 onClick={openLogoutDialog}
//               >
//                 خروج
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-outline nav-btn">
//                 دخول
//               </Link>
//               <Link to="/register" className="btn btn-primary nav-btn">
//                 حساب جديد
//               </Link>
//             </>
//           )}
//         </div>

//         <button
//           className="nav-toggle"
//           onClick={() => setOpen(!open)}
//           aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
//           aria-expanded={open}
//         >
//           {open ? <CloseIcon /> : <MenuIcon />}
//         </button>
//       </div>

//       {open && (
//         <nav className="mobile-menu">
//           {links.map((l) => (
//             <Link key={l.to} to={l.to} className="m-link" onClick={close}>
//               {l.label}
//             </Link>
//           ))}
//           <div className="mobile-actions">
//             {loading ? null : user ? (
//               <>
//                 <span className="nav-user">
//                   <PersonIcon fontSize="small" />
//                   {name}
//                 </span>
//                 <button
//                   className="btn btn-outline nav-btn"
//                   onClick={openLogoutDialog}
//                 >
//                   خروج
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="btn btn-outline nav-btn"
//                   onClick={close}
//                 >
//                   دخول
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="btn btn-primary nav-btn"
//                   onClick={close}
//                 >
//                   حساب جديد
//                 </Link>
//               </>
//             )}
//           </div>
//         </nav>
//       )}

//       <ConfirmDialog
//         open={askLogout}
//         Icon={LogoutIcon}
//         title="تسجيل الخروج"
//         message="هل تريد تسجيل الخروج من حسابك؟"
//         confirmText="تسجيل الخروج"
//         cancelText="البقاء"
//         onConfirm={confirmLogout}
//         onClose={() => setAskLogout(false)}
//       />
//     </header>
//   );
// }
 import { useState } from "react";
import { Link } from "react-router-dom";
// import ToothIcon from "./ToothIcon";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

const PUBLIC_LINKS = [
  { to: "/#services", label: "خدماتنا" },
  { to: "/#about", label: "عن الطبيب" },
  { to: "/#testimonials", label: "آراء المرضى" },
  { to: "/#contact", label: "تواصل معنا" },
];

const DASHBOARD_LINK = { to: "/dashboard", label: "لوحة التحكم" };

const PATIENT_LINKS = [
  { to: "/book", label: "حجز موعد" },
  { to: "/my-appointments", label: "مواعيدي" },
];

function getLinks(role, loading) {
  if (loading) return [];
  if (role === "nurse") return [DASHBOARD_LINK];
  if (role === "doctor") return [...PUBLIC_LINKS, DASHBOARD_LINK];
  if (role === "patient") return [...PUBLIC_LINKS, ...PATIENT_LINKS];
  return PUBLIC_LINKS;
}

export default function Navbar() {
  const { user, profile, role, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [askLogout, setAskLogout] = useState(false);
  const close = () => setOpen(false);

  const links = getLinks(role, loading);
  const name = profile?.name || user?.displayName ;
  const logoTo = role === "nurse" ? "/dashboard" : "/";

  const openLogoutDialog = () => {
    close();
    setAskLogout(true);
  };

  const confirmLogout = () => {
    setAskLogout(false);
    logout();
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to={logoTo} className="logo" onClick={close}>
          🦷 عيادة ابتسامة
        </Link>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {loading ? null : user ? (
            <>
              <span className="nav-user">
                <PersonIcon fontSize="small" />
                {name}
              </span>
              <button
                className="btn btn-outline nav-btn"
                onClick={openLogoutDialog}
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline nav-btn">
                دخول
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn">
                حساب جديد
              </Link>
            </>
          )}
        </div>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav className="mobile-menu">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="m-link" onClick={close}>
              {l.label}
            </Link>
          ))}
          <div className="mobile-actions">
            {loading ? null : user ? (
              <>
                <span className="nav-user">
                  <PersonIcon fontSize="small" />
                  {name}
                </span>
                <button
                  className="btn btn-outline nav-btn"
                  onClick={openLogoutDialog}
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline nav-btn"
                  onClick={close}
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary nav-btn"
                  onClick={close}
                >
                  حساب جديد
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
      <ConfirmDialog
        open={askLogout}
        Icon={LogoutIcon}
        title="تسجيل الخروج"
        message="هل تريد تسجيل الخروج من حسابك؟"
        confirmText="تسجيل الخروج"
        cancelText="البقاء"
        onConfirm={confirmLogout}
        onClose={() => setAskLogout(false)}
      />
    </header>
  );
}