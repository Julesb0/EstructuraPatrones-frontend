export const colors = {
  indigo: '#2F2D6A',
  purple: '#6A3A7E',
  magenta: '#D64AA5',
  pink: '#FF72B2',
  softPink: '#FFC0CB',
  text: '#1E1E1E',
  white: '#FFFFFF'
}

export const ui = {
  container: {
    maxWidth: 960,
    margin: '24px auto',
    padding: 16
  },
  card: {
    background: colors.white,
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  heading: {
    color: colors.indigo
  },
  button: {
    background: colors.magenta,
    color: colors.white,
    border: 'none',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer'
  },
  input: {
    border: `1px solid ${colors.purple}`,
    borderRadius: 6,
    padding: '6px 8px'
  },
  nav: {
    background: `linear-gradient(90deg, ${colors.indigo}, ${colors.purple})`,
    padding: 12,
    display: 'flex',
    gap: 12
  },
  link: {
    color: colors.white,
    textDecoration: 'none',
    fontWeight: 600
  },
  tableHead: {
    background: colors.purple,
    color: colors.white
  },
  tableRow: {
    background: '#fff'
  },
  pageBg: {
    background: `linear-gradient(${colors.indigo}, ${colors.purple}, ${colors.magenta}, ${colors.pink}, ${colors.softPink})`,
    minHeight: '100vh'
  }
}
