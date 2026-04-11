import { useState } from 'react';

export default function TagInput({ tags = [], onChange }) {
  const [input_value, setInputValue] = useState('');

  function commit(raw) {
    const values = raw
      .split(',')
      .map(v => v.trim())
      .filter(v => v && !tags.includes(v));
    if (values.length === 0) return;
    onChange([...tags, ...values]);
    setInputValue('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit(input_value);
    } else if (e.key === ',') {
      e.preventDefault();
      commit(input_value);
    }
  }

  function handleChange(e) {
    const val = e.target.value;
    // Auto-commit if the user pastes a comma-separated string and tabs out
    if (val.endsWith(',')) {
      commit(val);
    } else {
      setInputValue(val);
    }
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag));
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          placeholder="Ex: PC, Maison…"
          style={{ flex: 1 }}
          value={input_value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="btn" onClick={() => commit(input_value)}>+</button>
      </div>
      {tags.length > 0 && (
        <div className="chips" style={{ marginTop: 6 }}>
          {tags.map(tag => (
            <span key={tag} className="badge">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 0 0 2px',
                  lineHeight: 1,
                  color: 'inherit',
                  fontSize: 14,
                }}
                aria-label={`Supprimer le tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
