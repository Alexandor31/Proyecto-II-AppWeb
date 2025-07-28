import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Libros() {
  const [libros, setLibros] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const pedirPrestamo = (ejemplarId) => {
    axios.post('http://localhost:3000/api/prestamos', {
      usuarioId: 1,
      ejemplarId: ejemplarId
    })
    .then(() => {
      setMensaje('Préstamo realizado correctamente');
    })
    .catch(err => {
      setMensaje('Error: ' + (err.response?.data?.error || 'No se pudo prestar'));
      console.error(err);
    });
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/libros')
      .then(res => setLibros(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Libros disponibles</h2>
      {mensaje && <p>{mensaje}</p>}
      <ul>
        {libros.map(libro => (
          <li key={libro.id}>
            {libro.titulo} - {libro.autor}
            <button onClick={() => pedirPrestamo(libro.id)}>Pedir préstamo</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Libros;
