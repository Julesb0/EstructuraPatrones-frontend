export default function Welcome() {
  const username = localStorage.getItem('username') || 'usuario'
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = '/login'
  }
  return (
    <div>
      <h1>Hola {username}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
