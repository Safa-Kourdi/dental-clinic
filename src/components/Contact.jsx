const whatsappLink =
  "https://wa.me/963900000000?text=" +
  encodeURIComponent("مرحباً، بدي أحجز موعد بالعيادة");

export default function Contact() {
  return (
    <section id="contact" className="section section-soft">
      <div className="container">
        <h2 className="section-title">تواصل معنا</h2>
        <p className="section-sub">يسعدنا استقبالك وحجز موعدك</p>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="service-icon">📍</div>
            <h3>العنوان</h3>
            <p>حمص، شارع الحمرا، بجانب الساعة</p>
          </div>
          <div className="contact-card">
            <div className="service-icon">🕘</div>
            <h3>ساعات الدوام</h3>
            <p>السبت - الخميس: 9 صباحاً - 7 مساءً</p>
          </div>
          <div className="contact-card">
            <div className="service-icon">📞</div>
            <h3>الهاتف</h3>
            <p dir="ltr">+963 900 000 000</p>
          </div>
        </div>
        <div className="contact-cta">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            احجز عبر واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
