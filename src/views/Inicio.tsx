export default function Inicio() {
  const isAuthed = !!localStorage.getItem('token')
  return (
    <div>
      <h1>Inicio</h1>
      {!isAuthed && (
        <p>
          Bienvenido. Esta aplicación permite registrar ingresos y gastos, ver tu
          dashboard financiero, revisar historial de transacciones y recibir recomendaciones.
          Para empezar, crea una cuenta en "Registro" o accede desde "Login".
        </p>
      )}
      {isAuthed && (
        <p>
          Ya estás autenticado. Usa el menú para ir a tu Dashboard o Bienvenida.
        </p>
      )}
    </div>
  )
}
