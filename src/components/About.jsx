export default function About() {
  return (
    <section id="about" className="section section-soft">
      <div className="container about-grid">
        <div className="doctor-photo">👨‍⚕️</div>
        <div className="about-text">
          <h2>د. أحمد الخطيب</h2>
          <p className="about-role">أخصائي طب وجراحة الفم والأسنان</p>
          <p>
            خريج كلية طب الأسنان مع خبرة تتجاوز 10 سنوات في علاج وتجميل الأسنان.
            يؤمن بأن الابتسامة الصحية تبدأ بالعناية الصحيحة وبراحة المريض في كل
            زيارة.
          </p>
          <div className="stats">
            <div className="stat">
              <strong>10+</strong>
              <span>سنوات خبرة</span>
            </div>
            <div className="stat">
              <strong>5000+</strong>
              <span>مريض سعيد</span>
            </div>
            <div className="stat">
              <strong>6</strong>
              <span>خدمات متخصصة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
