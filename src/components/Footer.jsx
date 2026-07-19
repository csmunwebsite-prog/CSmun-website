import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(26, 29, 43, 0.06)',
      background: '#f0f2f7',
      padding: '1.25rem 0',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <p style={{
          fontSize: '0.82rem',
          color: '#8890a4',
          margin: 0
        }}>
          © 2026 CSMUN. All rights reserved. Built with purpose.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/csmunerode/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(26, 29, 43, 0.04)',
              border: '1px solid rgba(26, 29, 43, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5c6278',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139,30,30,0.06)';
              e.currentTarget.style.borderColor = 'rgba(139,30,30,0.2)';
              e.currentTarget.style.color = '#a72828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 29, 43, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(26, 29, 43, 0.08)';
              e.currentTarget.style.color = '#5c6278';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          {/* Email */}
          <a
            href="mailto:csmun@csacademy.in"
            aria-label="Email"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(26, 29, 43, 0.04)',
              border: '1px solid rgba(26, 29, 43, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5c6278',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139,30,30,0.06)';
              e.currentTarget.style.borderColor = 'rgba(139,30,30,0.2)';
              e.currentTarget.style.color = '#a72828';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 29, 43, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(26, 29, 43, 0.08)';
              e.currentTarget.style.color = '#5c6278';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
