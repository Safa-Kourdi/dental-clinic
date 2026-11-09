import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Spinner } from "./Loader";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "تراجع",
  Icon,
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, padding: 1 } }}
    >
      {Icon && (
        <div className={`dialog-icon ${danger ? "danger" : ""}`}>
          <Icon />
        </div>
      )}

      <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          gap: 1,
          px: 3,
          paddingBottom: 2.5,
        }}
      >
        <Button
          variant="contained"
          color={danger ? "error" : "primary"}
          onClick={onConfirm}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <Spinner size={22} light /> : confirmText}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            color: danger ? "#111827" : "primary.main",
            borderColor: danger ? "#111827" : "primary.main",
            "&:hover": {
              borderColor: "#000000",
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}