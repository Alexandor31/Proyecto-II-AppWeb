import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/api/prestamos')
      .then(res => setPrestamos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📚 Todos los préstamos activos</h2>
      {prestamos.length === 0 ? (
        <p>No hay préstamos activos.</p>
      ) : (
        <ul>
          {prestamos.map(p => (
            <li key={p.id}>
              Usuario ID: {p.usuarioId} - Ejemplar ID: {p.ejemplarId} - Devuelve hasta: {new Date(p.fecha_devolucion).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <h2>👥 Usuarios registrados</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <ul>
          {usuarios.map(u => (
            <li key={u.id}>
              ID: {u.id} - {u.nombre} - Tipo: {u.tipo} - Estado: {u.estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PanelAdmin;
