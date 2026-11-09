// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "@mui/material/styles";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import theme from "./theme";
// import { AuthProvider } from "./context/AuthContext";
// import ScrollToTop from "./components/ScrollToTop";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Book from "./pages/Book";
// import MyAppointments from "./pages/MyAppointments";
// import Dashboard from "./pages/Dashboard"

// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <AuthProvider>
//         <BrowserRouter>
//           <ScrollToTop />
//           <Navbar />
//           <main>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route
//                 path="/book"
//                 element={
//                   <ProtectedRoute roles={["patient"]}>
//                     <Book />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/my-appointments"
//                 element={
//                   <ProtectedRoute roles={["patient"]}>
//                     <MyAppointments />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute roles={["nurse", "doctor"]}>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </main>
//           <Footer />
//           <a
//             href="https://wa.me/963900000000"
//             target="_blank"
//             rel="noreferrer"
//             className="whatsapp-float"
//             aria-label="WhatsApp"
//           >
//             <WhatsAppIcon />
//           </a>
//         </BrowserRouter>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import MyAppointments from "./pages/MyAppointments";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/book"
                element={
                  <ProtectedRoute roles={["patient"]}>
                    <Book />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-appointments"
                element={
                  <ProtectedRoute roles={["patient"]}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["nurse", "doctor"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}