// import { Link } from "react-router-dom";

// export default function Hero() {
//   return (
//     <section id="home" className="hero">
//       <div className="container">
//         <span className="hero-badge">طب أسنان متكامل</span>
//         <h1>
//           ابتسامتك <span>تستحق</span> الأفضل
//         </h1>
//         <p>
//           نقدّم لك رعاية متكاملة للأسنان بأحدث التقنيات، وبيئة مريحة وفريق ذو
//           خبرة يهتم بكل التفاصيل.
//         </p>
//         <div className="hero-buttons">
//           <Link to="/book" className="btn btn-primary">
//             احجز موعدك الآن
//           </Link>
//           <a href="#services" className="btn btn-outline">
//             خدماتنا
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { role } = useAuth();
  const isStaff = role === "nurse" || role === "doctor";

  return (
    <section id="home" className="hero">
      <div className="container">
        <span className="hero-badge">طب أسنان متكامل</span>
        <h1>
          ابتسامتك <span>تستحق</span> الأفضل
        </h1>
        <p>
          نقدّم لك رعاية متكاملة للأسنان بأحدث التقنيات، وبيئة مريحة وفريق ذو
          خبرة يهتم بكل التفاصيل.
        </p>
        <div className="hero-buttons">
          {isStaff ? (
            <Link to="/dashboard" className="btn btn-primary">
              الانتقال إلى لوحة التحكم
            </Link>
          ) : (
            <Link to="/book" className="btn btn-primary">
              احجز موعدك الآن
            </Link>
          )}
          <a href="#services" className="btn btn-outline">
            خدماتنا
          </a>
        </div>
      </div>
    </section>
  );
}