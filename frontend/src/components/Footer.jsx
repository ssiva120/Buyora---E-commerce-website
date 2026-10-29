import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563eb' }}>
          BUYOra E-Commerce
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '500px' }}>
          A full-stack e-commerce project built with React, Spring Boot, Hibernate ORM, and JWT Security.
        </p>
        <div className="footer-tech">
          <span className="tech-tag">React 18</span>
          <span className="tech-tag">Spring Boot 3</span>
          <span className="tech-tag">Hibernate / JPA</span>
          <span className="tech-tag">Spring Security & JWT</span>
          <span className="tech-tag">H2 Database</span>
          <span className="tech-tag">REST APIs</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          © 2026 BUYOra Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
