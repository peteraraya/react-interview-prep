import React from 'react';

/**
 * MÓDULO 01: JSX (JavaScript XML)
 * 
 * JSX es una extensión de sintaxis que permite escribir HTML-like code dentro de JavaScript.
 * Es la base de React y permite crear interfaces de usuario de forma declarativa.
 * 
 * Conceptos clave:
 * - JSX se compila a React.createElement()
 * - Debe tener un solo elemento raíz (o usar Fragmentos)
 * - Las expresiones JavaScript se usan con llaves {}
 * - Los atributos usan camelCase (className en vez de class)
 * - Los eventos usan camelCase (onClick en vez of onclick)
 */

// Ejemplo 1: Componente básico con JSX
function SaludoBasico() {
  const nombre = "Juan";
  const esEstudiante = true;
  
  return (
    <div className="componente">
      <h2>Ejemplo 1: JSX Básico</h2>
      {/* Expresión JavaScript dentro de JSX */}
      <p>Hola, {nombre}!</p>
      
      {/* Renderizado condicional con operador ternario */}
      <p>{esEstudiante ? "Eres estudiante" : "No eres estudiante"}</p>
      
      {/* Renderizado de listas con map */}
      <ul>
        {[1, 2, 3].map((numero) => (
          <li key={numero}>Número: {numero}</li>
        ))}
      </ul>
    </div>
  );
}

// Ejemplo 2: JSX con elementos anidados y fragmentos
function PerfilUsuario() {
  const usuario = {
    nombre: "María García",
    edad: 28,
    habilidades: ["React", "JavaScript", "CSS"]
  };
  
  return (
    // Fragmento para agrupar sin agregar nodo extra al DOM
    <>
      <div className="perfil">
        <h2>Perfil de Usuario</h2>
        {/* Acceso a propiedades de objetos */}
        <p><strong>Nombre:</strong> {usuario.nombre}</p>
        <p><strong>Edad:</strong> {usuario.edad}</p>
        
        {/* Renderizado condicional con && */}
        {usuario.edad >= 18 && <p>Es mayor de edad</p>}
        
        {/* Renderizado de array de habilidades */}
        <div className="habilidades">
          <h3>Habilidades:</h3>
          <ul>
            {usuario.habilidades.map((habilidad, indice) => (
              <li key={indice}>{habilidad}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// Ejemplo 3: JSX con estilos en línea y atributos especiales
function TarjetaProducto() {
  const producto = {
    nombre: "Laptop Pro",
    precio: 1299,
    enStock: true,
    imagen: "https://via.placeholder.com/150"
  };
  
  // Estilos en línea como objeto JavaScript
  const estilosTarjeta = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const estilosBoton = {
    backgroundColor: producto.enStock ? '#4CAF50' : '#ccc',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: producto.enStock ? 'pointer' : 'not-allowed'
  };
  
  return (
    <div style={estilosTarjeta}>
      <h2>Producto</h2>
      {/* Atributo src para imágenes */}
      <img 
        src={producto.imagen} 
        alt={producto.nombre}
        style={{ width: '100%', height: 'auto' }}
      />
      
      {/* Uso de className para estilos CSS */}
      <h3 className="producto-nombre">{producto.nombre}</h3>
      <p className="producto-precio">${producto.precio}</p>
      
      {/* Renderizado condicional para botón */}
      <button 
        style={estilosBoton}
        disabled={!producto.enStock}
      >
        {producto.enStock ? "Agregar al carrito" : "Agotado"}
      </button>
      
      {/* Atributo disabled condicional */}
      {!producto.enStock && (
        <p style={{ color: 'red', fontSize: '14px' }}>
          Producto no disponible
        </p>
      )}
    </div>
  );
}

// Componente principal que exporta todos los ejemplos
export default function JSXExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 01: JSX (JavaScript XML)</h1>
      <p className="descripcion">
        JSX permite escribir HTML dentro de JavaScript, haciendo que la creación de UI sea más intuitiva.
      </p>
      
      <div className="ejemplos">
        <SaludoBasico />
        <PerfilUsuario />
        <TarjetaProducto />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>Expresiones JSX:</strong> Se usan llaves {} para insertar código JavaScript</li>
          <li><strong>Renderizado condicional:</strong> Operador ternario o && para mostrar elementos condicionalmente</li>
          <li><strong>Listas:</strong> Usar map() con key única para renderizar arrays</li>
          <li><strong>Estilos:</strong> className para CSS, style para estilos en línea (objeto)</li>
          <li><strong>Fragmentos:</strong> &lt;&gt;&lt;/&gt; para agrupar sin agregar nodos al DOM</li>
        </ul>
      </div>
    </div>
  );
}