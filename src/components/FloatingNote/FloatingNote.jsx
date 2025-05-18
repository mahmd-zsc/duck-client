// FloatingNote.jsx
import { useState, useRef, useEffect } from "react";

export default function FloatingNote() {
  /* ---------- State ---------- */
  const [open, setOpen] = useState(false); // حالة المربع
  const [note, setNote] = useState(""); // النص المكتوب
  const [pos, setPos] = useState({ x: 40, y: 40 }); // مكان الدايرة
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  /* ---------- Drag handlers ---------- */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragRef.current) return;
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };
    const handleMouseUp = () => (dragRef.current = null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDrag = (e) => {
    dragRef.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  /* ---------- UI ---------- */
  return (
    <>
      {/* الدايرة الصغيرة */}
      {!open && (
        <div
          onMouseDown={startDrag}
          onDoubleClick={() => setOpen(true)}
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "#0aa",
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            userSelect: "none",
            zIndex: 9999,
          }}
          title="Double-click to add note"
        >
          📝
        </div>
      )}

      {/* البوكس الكبير */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={() => setOpen(false)} // اقفل لو ضغطت برا البوكس
        >
          <div
            onClick={(e) => e.stopPropagation()} // منع غلق البوكس لو ضغطت جواه
            style={{
              width: 400,
              maxWidth: "90%",
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <textarea
              autoFocus
              rows={6}
              placeholder="اكتب ملاحظتك هنا..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ resize: "vertical", padding: 10 }}
            />
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: "6px 12px",
                  background: "#ccc",
                  border: 0,
                  borderRadius: 4,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Saved note:", note);
                  setNote("");
                  setOpen(false);
                }}
                style={{
                  padding: "6px 12px",
                  background: "#0aa",
                  color: "#fff",
                  border: 0,
                  borderRadius: 4,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
