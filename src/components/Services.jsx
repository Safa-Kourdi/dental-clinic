const services = [
  {
    icon: "🪥",
    title: "تنظيف الأسنان",
    text: "إزالة الجير والتصبغات للحفاظ على لثة وأسنان صحية.",
  },
  {
    icon: "🦷",
    title: "الحشوات",
    text: "علاج التسوس بحشوات تجميلية بلون السن الطبيعي.",
  },
  {
    icon: "😁",
    title: "تقويم الأسنان",
    text: "تقويم معدني وشفاف لابتسامة منتظمة.",
  },
  {
    icon: "🔩",
    title: "زراعة الأسنان",
    text: "تعويض الأسنان المفقودة بزرعات ثابتة وطويلة الأمد.",
  },
  {
    icon: "✨",
    title: "تبييض الأسنان",
    text: "تبييض آمن وفعّال لابتسامة أكثر إشراقاً.",
  },
  {
    icon: "👶",
    title: "أسنان الأطفال",
    text: "رعاية لطيفة للأطفال في جو مريح وبعيد عن الخوف.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <h2 className="section-title">خدماتنا</h2>
        <p className="section-sub">
          نقدّم مجموعة كاملة من خدمات طب الأسنان تحت سقف واحد
        </p>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.title} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
