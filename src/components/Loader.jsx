import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ size = 44 }) {
  return (
    <div className="loader-wrap">
      <CircularProgress
        size={size}
        thickness={4}
        sx={{ color: "var(--primary)" }}
      />
    </div>
  );
}

export function Spinner({ size = 22, light = false, inline = false }) {
  return (
    <CircularProgress
      size={size}
      thickness={5}
      sx={{
        color: light ? "#fff" : "var(--primary)",
        marginInlineStart: inline ? "8px" : 0,
        verticalAlign: "middle",
      }}
    />
  );
}
