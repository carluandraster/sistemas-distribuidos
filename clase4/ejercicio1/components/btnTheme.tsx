"use client";

export default function BtnTheme({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
    return (
        <button
            type="button"
            onClick={toggleTheme}
            style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: dark ? '#1e293b' : '#ffffff',
                color: dark ? '#f1f5f9' : '#0f172a',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            aria-label="Toggle theme"
        >
            {dark ? '☀️' : '🌙'}
        </button>
    )
}