const reviews = [
  {
    name: "سارة محمد",
    text: "تعامل راقٍ وعيادة نظيفة جداً. ما حسّيت بأي ألم أثناء العلاج.",
  },
  {
    name: "خالد العلي",
    text: "ركّبت التقويم عندهم والنتيجة فاقت توقعاتي. أنصح فيهم بشدة.",
  },
  {
    name: "ليلى حسن",
    text: "أحسن عيادة جربتها لأولادي، الدكتور صبور ومرّحب مع الأطفال.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <h2 className="section-title">آراء المرضى</h2>
        <p className="section-sub">ثقة مرضانا هي أكبر إنجاز لنا</p>
        <div className="testimonials-grid">
          {reviews.map((r) => (
            <div key={r.name} className="testimonial">
              <div className="stars">★★★★★</div>
              <p>"{r.text}"</p>
              <strong>{r.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
