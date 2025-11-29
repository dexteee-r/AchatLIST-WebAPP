import { useState, useRef, useEffect } from 'react';

export default function ExportMenu({ onExportCSV, onExportJSON }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleExport = (type) => {
    if (type === 'csv') {
      onExportCSV();
    } else if (type === 'json') {
      onExportJSON();
    }
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        className="btn ghost"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu d'export"
        aria-expanded={isOpen}
      >
        📥 Exporter
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: '180px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <button
            onClick={() => handleExport('csv')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>📊</span>
            <div>
              <div style={{ fontWeight: '500' }}>Exporter en CSV</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Format tableur (Excel, Google Sheets)
              </div>
            </div>
          </button>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          <button
            onClick={() => handleExport('json')}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '18px' }}>💾</span>
            <div>
              <div style={{ fontWeight: '500' }}>Exporter en JSON</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Sauvegarde complète avec date
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
