import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [usuariosSistema, setUsuariosSistema] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [prestamosSistema, setPrestamosSistema] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [librosRelacionados, setLibrosRelacionados] = useState([]);
  const [autoresVisibles, setAutoresVisibles] = useState({});

  const [nuevoLibro, setNuevoLibro] = useState({
    isbn: '',
    titulo: '',
    autor: '',
    num_paginas: '',
    num_ejemplares: '',
    portada_uri: '',
  });

  const [nuevoUsuario, setNuevoUsuario] = useState({
  tipo: '',
  login: '',
  password: '',
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  numero: '',
  piso: '',
  ciudad: '',
  codigo_postal: '',
  telefono_padres: '',
  departamento: ''
});

const registrarUsuario = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:3000/api/usuarios', nuevoUsuario);
    setMensaje('Usuario registrado correctamente');
    setNuevoUsuario({
      tipo: '',
      login: '',
      password: '',
      nombre: '',
      apellidos: '',
      correo: '',
      calle: '',
      numero: '',
      piso: '',
      ciudad: '',
      codigo_postal: '',
      telefono_padres: '',
      departamento: ''
    });
    await cargarDatos();
  } catch (err) {
    setMensaje(err.response?.data?.error || 'Error al registrar usuario');
  }
};


  const cargarDatos = async () => {
    try {
      const [resUsuariosSistema, resLibros] = await Promise.all([
        axios.get('http://localhost:3000/api/usuarios'),
        axios.get('http://localhost:3000/api/libros'),
      ]);

      setUsuariosSistema(resUsuariosSistema.data);
      setLibros(resLibros.data);

      if (usuarioId) {
        const resUsuario = await axios.get(`http://localhost:3000/api/usuarios/${usuarioId}`);
        const resPrestamos = await axios.get(`http://localhost:3000/api/prestamos/usuario/${usuarioId}`);
        const resHistorial = await axios.get(`http://localhost:3000/api/prestamos/historial/${usuarioId}`);
        const resPrestamosSistema = await axios.get(`http://localhost:3000/api/prestamos`);

        setUsuario(resUsuario.data);
        setPrestamos(resPrestamos.data);
        setHistorial(resHistorial.data);
        setPrestamosSistema(resPrestamosSistema.data);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const pedirPrestamo = async (ejemplarId) => {
    try {
      await axios.post('http://localhost:3000/api/prestamos', {
        usuarioId,
        ejemplarId,
      });
      setMensaje('Préstamo realizado correctamente');
      await cargarDatos();
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al pedir préstamo');
    }
  };

  const devolverPrestamo = async (prestamoId) => {
    try {
      await axios.delete(`http://localhost:3000/api/prestamos/${prestamoId}`);
      setMensaje('Libro devuelto con éxito');
      await cargarDatos();
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al devolver libro');
    }
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
    const relacionados = libros.filter(l => l.autor === libro.autor && l.id !== libro.id);
    setLibrosRelacionados(relacionados);
  };

  const toggleAutor = (autor) => {
    setAutoresVisibles(prev => ({ ...prev, [autor]: !prev[autor] }));
  };

  const agregarLibro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/libros', {
        ...nuevoLibro,
        num_paginas: parseInt(nuevoLibro.num_paginas),
        num_ejemplares: parseInt(nuevoLibro.num_ejemplares),
      });
      setMensaje('Libro agregado correctamente');
      setNuevoLibro({
        isbn: '',
        titulo: '',
        autor: '',
        num_paginas: '',
        num_ejemplares: '',
        portada_uri: '',
      });
      await cargarDatos();
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al agregar libro');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [usuarioId]);

  const librosPorAutor = libros.reduce((acc, libro) => {
    if (!acc[libro.autor]) acc[libro.autor] = [];
    acc[libro.autor].push(libro);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>📚 Gestión de Biblioteca</h1>

      <div>
        <label><strong>Seleccionar usuario:</strong> </label>
        <select value={usuarioId || ''} onChange={(e) => setUsuarioId(Number(e.target.value))}>
          <option value="" disabled>-- Selecciona un usuario --</option>
          {usuariosSistema.map(u => (
            <option key={u.id} value={u.id}>
              {u.nombre} {u.apellidos} ({u.tipo})
            </option>
          ))}
        </select>
      </div>

      {usuario && (
        <div style={{ border: '1px solid #ccc', padding: 10, marginTop: 20 }}>
          <h2>👤 Estado del Usuario</h2>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Tipo:</strong> {usuario.tipo}</p>
          <p><strong>Estado actual:</strong> {usuario.estado}</p>
          {usuario.multa && (
            <div style={{ color: 'red' }}>
              <p><strong>Penalizado hasta:</strong> {new Date(usuario.multa.fecha_finalizacion).toLocaleDateString()}</p>
              <p>Días acumulados: {usuario.multa.dias_acumulados}</p>
            </div>
          )}
        </div>
      )}

      <h2>📚 Libros disponibles por autor</h2>
      {mensaje && <p>{mensaje}</p>}

      {Object.keys(librosPorAutor).map(autor => (
        <div key={autor} style={{ marginBottom: 10 }}>
          <button onClick={() => toggleAutor(autor)} style={{ marginBottom: 5 }}>
            {autoresVisibles[autor] ? '🔽 Ocultar' : '▶️'} {autor}
          </button>
          {autoresVisibles[autor] && (
            <ul style={{ marginLeft: 20 }}>
              {librosPorAutor[autor].map(libro => (
                <li key={libro.id}>
                  <strong>{libro.titulo}</strong> {' '}
                  <button onClick={() => pedirPrestamo(libro.id)}>Pedir préstamo</button>{' '}
                  <button onClick={() => seleccionarLibro(libro)}>Ver detalles</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {libroSeleccionado && (
        <div style={{ marginTop: 20, border: '1px solid #888', padding: 15 }}>
          <h3>📖 Detalles del libro</h3>
          <p><strong>Título:</strong> {libroSeleccionado.titulo}</p>
          <p><strong>Autor:</strong> {libroSeleccionado.autor}</p>
          <p><strong>Páginas:</strong> {libroSeleccionado.num_paginas}</p>
          <p><strong>Total de ejemplares:</strong> {libroSeleccionado.num_ejemplares}</p>
          <p><strong>Ejemplares disponibles:</strong> {libroSeleccionado.ejemplares_disponibles}</p>

          {libroSeleccionado.portada_uri && (
            <div style={{ marginTop: 10 }}>
              <img
                src={libroSeleccionado.portada_uri}
                alt="Portada del libro"
                style={{ maxWidth: 200, border: '1px solid #ccc' }}
              />
            </div>
          )}

          {librosRelacionados.length > 0 && (
            <>
              <h4 style={{ marginTop: 20 }}>📚 Libros relacionados</h4>
              <ul>
                {librosRelacionados.map((l) => (
                  <li key={l.id}>
                    {l.titulo} ({l.num_paginas} páginas)
                    <button onClick={() => seleccionarLibro(l)} style={{ marginLeft: 10 }}>Ver detalles</button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <h2>Mis préstamos</h2>
      {prestamos.length === 0 ? (
        <p>No hay préstamos activos.</p>
      ) : (
        <ul>
          {prestamos.map((p) => (
            <li key={p.id}>
              Ejemplar ID: {p.ejemplarId} - Devuelve antes del: {new Date(p.fecha_devolucion).toLocaleDateString()}{' '}
              <button onClick={() => devolverPrestamo(p.id)}>Devolver</button>
            </li>
          ))}
        </ul>
      )}

      <h2>Historial de préstamos</h2>
      {historial.length === 0 ? (
        <p>No hay historial registrado.</p>
      ) : (
        <ul>
          {historial.map((h) => (
            <li key={h.id}>
              Ejemplar ID: {h.ejemplarId} | Prestado: {new Date(h.fecha_prestamo).toLocaleDateString()} | Devuelto: {new Date(h.fecha_real_devolucion).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h2>📊 Panel de Administración</h2>

      <h3>➕ Agregar nuevo libro al catálogo</h3>
      <form onSubmit={agregarLibro}>
        <input placeholder="ISBN" value={nuevoLibro.isbn} onChange={e => setNuevoLibro({ ...nuevoLibro, isbn: e.target.value })} required />
        <input placeholder="Título" value={nuevoLibro.titulo} onChange={e => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })} required />
        <input placeholder="Autor" value={nuevoLibro.autor} onChange={e => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })} required />
        <input type="number" placeholder="Páginas" value={nuevoLibro.num_paginas} onChange={e => setNuevoLibro({ ...nuevoLibro, num_paginas: e.target.value })} required />
        <input type="number" placeholder="Ejemplares" value={nuevoLibro.num_ejemplares} onChange={e => setNuevoLibro({ ...nuevoLibro, num_ejemplares: e.target.value })} required />
        <input placeholder="URL portada (opcional)" value={nuevoLibro.portada_uri} onChange={e => setNuevoLibro({ ...nuevoLibro, portada_uri: e.target.value })} />
        <button type="submit">Agregar libro</button>
      </form>

      <h3>📚 Todos los préstamos activos</h3>
      {prestamosSistema.length === 0 ? (
        <p>No hay préstamos activos en el sistema.</p>
      ) : (
        <ul>
          {prestamosSistema.map((p) => (
            <li key={p.id}>
              Usuario ID: {p.usuarioId} - Ejemplar ID: {p.ejemplarId} - Devuelve hasta: {new Date(p.fecha_devolucion).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <h3>👥 Usuarios registrados</h3>
      {usuariosSistema.length === 0 ? (
        <p>No hay usuarios en el sistema.</p>
      ) : (
        <ul>
          {usuariosSistema.map((u) => (
            <li key={u.id}>
              ID: {u.id} - {u.nombre} {u.apellidos} - Tipo: {u.tipo} - Estado: {u.estado}
            </li>
          ))}
        </ul>
      )}

      <h3>📝 Registrar nuevo usuario</h3>
<form onSubmit={registrarUsuario}>
  <select required value={nuevoUsuario.tipo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, tipo: e.target.value })}>
    <option value="">Tipo de usuario</option>
    <option value="alumno">Alumno</option>
    <option value="profesor">Profesor</option>
  </select>
  <input placeholder="Login" required value={nuevoUsuario.login} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, login: e.target.value })} />
  <input placeholder="Password" type="password" required value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} />
  <input placeholder="Nombre" required value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} />
  <input placeholder="Apellidos" required value={nuevoUsuario.apellidos} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellidos: e.target.value })} />
  <input placeholder="Correo electrónico" required value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} />

  <input placeholder="Calle" value={nuevoUsuario.calle} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, calle: e.target.value })} />
  <input placeholder="Número" value={nuevoUsuario.numero} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, numero: e.target.value })} />
  <input placeholder="Piso" value={nuevoUsuario.piso} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, piso: e.target.value })} />
  <input placeholder="Ciudad" value={nuevoUsuario.ciudad} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, ciudad: e.target.value })} />
  <input placeholder="Código Postal" value={nuevoUsuario.codigo_postal} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, codigo_postal: e.target.value })} />

  {nuevoUsuario.tipo === 'alumno' && (
    <input placeholder="Teléfono padres" value={nuevoUsuario.telefono_padres} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono_padres: e.target.value })} />
  )}
  {nuevoUsuario.tipo === 'profesor' && (
    <input placeholder="Departamento" value={nuevoUsuario.departamento} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, departamento: e.target.value })} />
  )}
  <button type="submit">Registrar usuario</button>
</form>


    </div>
  );
};

export default App;
