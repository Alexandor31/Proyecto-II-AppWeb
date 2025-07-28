import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const cargarPrestamos = () => {
    axios.get('http://localhost:3000/api/prestamos/usuario/1')
      .then(res => setPrestamos(res.data))
      .catch(err => console.error(err));
  };

  const cargarHistorial = () => {
    axios.get('http://localhost:3000/api/prestamos/historial/1')
      .then(res => setHistorial(res.data))
      .catch(err => console.error(err));
  };

  const devolver = (id) => {
    axios.delete(`http://localhost:3000/api/prestamos/${id}`)
      .then(() => {
        cargarPrestamos();
        cargarHistorial();
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarPrestamos();
    cargarHistorial();
  }, []);

  return (
    <div>
      <h2>Mis préstamos</h2>
      {prestamos.length === 0 ? (
        <p>No hay préstamos activos.</p>
      ) : (
        <ul>
          {prestamos.map(p => (
            <li key={p.id}>
              Ejemplar ID: {p.ejemplarId} - Devuelve antes del: {new Date(p.fecha_devolucion).toLocaleDateString()}
              <button onClick={() => devolver(p.id)}>Devolver</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Historial de préstamos</h2>
      {historial.length === 0 ? (
        <p>No hay historial registrado.</p>
      ) : (
        <ul>
          {historial.map(h => (
            <li key={h.id}>
              Ejemplar ID: {h.ejemplarId} - Prestado: {new Date(h.fecha_prestamo).toLocaleDateString()} - Devuelto: {new Date(h.fecha_devolucion).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisPrestamos;
