import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: PROPS
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear un sistema de tarjetas de producto reutilizable con diferentes variantes"
 * 
 * Requisitos:
 * 1. Crear un componente ProductCard que acepte props para personalización
 * 2. Implementar diferentes variantes de estilo (normal, destacado, agotado)
 * 3. Manejar eventos de click a través de callbacks
 * 4. Usar children para contenido personalizado
 */

// SOLUCIÓN PROPUESTA

// Componente principal de tarjeta de producto
function ProductCard({ 
  nombre, 
  precio, 
  descripcion, 
  imagen, 
  variante = 'normal', // 'normal', 'destacado', 'agotado'
  onAgregarCarrito,
  children 
}) {
  // Estilos base
  const estilosBase = {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    margin: '10px',
    width: '280px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    overflow: 'hidden'
  };
  
  // Variantes de estilo
  const variantes = {
    normal: {
      backgroundColor: 'white'
    },
    destacado: {
      backgroundColor: '#fff9c4',
      border: '2px solid #ffc107',
      boxShadow: '0 6px 12px rgba(255,193,7,0.3)'
    },
    agotado: {
      backgroundColor: '#f5f5f5',
      opacity: 0.8,
      filter: 'grayscale(50%)'
    }
  };
  
  // Badge de variante
  const badgeVariante = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: variante === 'destacado' ? '#ffc107' : 
                    variante === 'agotado' ? '#6c757d' : '#007bff'
  };
  
  const estilosFinales = {
    ...estilosBase,
    ...variantes[variante]
  };
  
  const handleAgregarCarrito = () => {
    if (variante !== 'agotado' && onAgregarCarrito) {
      onAgregarCarrito({ nombre, precio });
    }
  };
  
  return (
    <div style={estilosFinales}>
      <span style={badgeVariante}>
        {variante === 'destacado' ? '⭐ Destacado' : 
         variante === 'agotado' ? 'Agotado' : 'Normal'}
      </span>
      
      <img 
        src={imagen} 
        alt={nombre}
        style={{ 
          width: '100%', 
          height: '180px', 
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '15px'
        }}
      />
      
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3em' }}>{nombre}</h3>
      <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '0.9em' }}>{descripcion}</p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2e7d32' }}>
          ${precio}
        </span>
        
        <button
          onClick={handleAgregarCarrito}
          disabled={variante === 'agotado'}
          style={{
            padding: '8px 16px',
            backgroundColor: variante === 'agotado' ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: variante === 'agotado' ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {variante === 'agotado' ? 'No disponible' : 'Agregar'}
        </button>
      </div>
      
      {/* Children para contenido personalizado */}
      {children && (
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '15px',
          marginTop: '10px'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// Componente hijo que se pasa como children
function InfoExtra({ texto }) {
  return (
    <div style={{ 
      backgroundColor: '#e3f2fd', 
      padding: '8px', 
      borderRadius: '4px',
      fontSize: '12px',
      color: '#1976d2'
    }}>
      {texto}
    </div>
  );
}

// Componente principal del desafío
export default function ProductCardChallenge() {
  const [carrito, setCarrito] = useState([]);
  
  const productos = [
    {
      id: 1,
      nombre: "iPhone 15 Pro",
      precio: 999,
      descripcion: "El último iPhone con chip A17 Pro",
      imagen: "https://via.placeholder.com/300x200?text=iPhone+15",
      variante: "destacado"
    },
    {
      id: 2,
      nombre: "Samsung Galaxy S24",
      precio: 899,
      descripcion: "Smartphone Android premium",
      imagen: "https://via.placeholder.com/300x200?text=Galaxy+S24",
      variante: "normal"
    },
    {
      id: 3,
      nombre: "iPhone 14",
      precio: 699,
      descripcion: "Modelo anterior con gran rendimiento",
      imagen: "https://via.placeholder.com/300x200?text=iPhone+14",
      variante: "agotado"
    }
  ];
  
  const handleAgregarCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    console.log(`Agregado al carrito: ${producto.nombre}`);
  };
  
  return (
    <div className="desafio">
      <h2>Desafío: Sistema de Tarjetas de Producto</h2>
      
      {/* Resumen del carrito */}
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #c8e6c9'
      }}>
        <h3>Carrito de Compras ({carrito.length} items)</h3>
        {carrito.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {carrito.map((item, index) => (
              <li key={index}>{item.nombre} - ${item.precio}</li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Grid de productos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px'
      }}>
        {productos.map(producto => (
          <ProductCard
            key={producto.id}
            nombre={producto.nombre}
            precio={producto.precio}
            descripcion={producto.descripcion}
            imagen={producto.imagen}
            variante={producto.variante}
            onAgregarCarrito={handleAgregarCarrito}
          >
            {/* Children personalizado para cada producto */}
            {producto.variante === 'destacado' && (
              <InfoExtra texto="¡Oferta especial por tiempo limitado!" />
            )}
            {producto.variante === 'agotado' && (
              <InfoExtra texto="Próximamente disponible" />
            )}
          </ProductCard>
        ))}
      </div>
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. DISEÑO DEL COMPONENTE:
 *    - Componente reutilizable con props claras y documentadas
 *    - Uso de valores por defecto para props opcionales
 *    - Prop children para contenido personalizable
 * 
 * 2. COMUNICACIÓN ENTRE COMPONENTES:
 *    - Callback onAgregarCarrito para comunicación ascendente (hijo a padre)
 *    - Datos del producto se pasan como objeto a través del callback
 * 
 * 3. ESTILOS CONDICIONALES:
 *    - Variantes de estilo basadas en la prop variante
 *    - Objetos de estilos dinámicos según el estado
 * 
 * 4. PATRONES DE DISEÑO:
 *    - Componente presentacional con lógica mínima
 *    - Separación de concerns (presentación vs comportamiento)
 *    - Reutilizabilidad a través de props
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Cómo harías este componente accesible (accessibility)?
 * - ¿Cómo optimizarías el rendimiento con muchos productos?
 * - ¿Cómo manejarías errores en las imágenes?
 * - ¿Cómo implementarías animaciones de transición?
 */