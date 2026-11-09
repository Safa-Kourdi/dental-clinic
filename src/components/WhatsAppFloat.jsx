import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAuth } from "../context/AuthContext";

export default function WhatsAppFloat() {
  const { role } = useAuth();

  if (role === "nurse") return null;

  return (
    <a
      href="https://wa.me/963900000000"
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="واتساب"
    >
      <WhatsAppIcon />
    </a>
  );
}
