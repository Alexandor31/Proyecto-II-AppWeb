import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EstadoUsuario() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/usuarios/1')
      .then(res => setUsuario(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h2>Estado del Usuario</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Tipo:</strong> {usuario.tipo}</p>
      <p><strong>Estado actual:</strong> {usuario.estado}</p>

      {usuario.estado === 'multado' && usuario.multa && (
        <div style={{ background: '#ffe0e0', padding: '0.5rem', marginTop: '1rem' }}>
          <strong>⚠ Multa activa</strong>
          <p><strong>Inicio:</strong> {new Date(usuario.multa.fecha_inicio).toLocaleDateString()}</p>
          <p><strong>Días de penalización:</strong> {usuario.multa.dias_acumulados}</p>
          <p><strong>Disponible después del:</strong> {new Date(usuario.multa.fecha_finalizacion).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default EstadoUsuario;
