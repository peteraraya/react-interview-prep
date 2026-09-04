import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: ESTADO
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear un carrito de compras con persistencia de estado"
 * 
 * Requisitos:
 * 1. Agregar productos al carrito
 * 2. Actualizar cantidades
 * 3. Eliminar productos
 * 4. Calcular total
 * 5. Persistir estado en localStorage
 */

// SOLUCIÓN PROPUESTA

// Datos de productos disponibles
const productosDisponibles = [
  { id: 1, nombre: "Laptop Pro", precio: 1299, imagen: "https://via.placeholder.com/100?text=Laptop" },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 29, imagen: "https://via.placeholder.com/100?text=Mouse" },
  { id: 3, nombre: "Teclado Mecánico", precio: 89, imagen: "https://via.placeholder.com/100?text=Teclado" },
  { id: 4, nombre: "Monitor 4K", precio: 499, imagen: "https://via.placeholder.com/100?text=Monitor" },
  { id: 5, nombre: "Auriculares", precio: 199, imagen: "https://via.placeholder.com/100?text=Auriculares" }
];

function ProductoCard({ producto, onAgregar }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
      transition: 'transform 0.2s'
    }}>
      <img 
        src={producto.imagen} 
        alt={producto.nombre}
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h4 style={{ margin: '10px 0 5px' }}>{producto.nombre}</h4>
      <p style={{ color: '#666', margin: '0 0 10px' }}>${producto.precio}</p>
      <button
        onClick={() => onAgregar(producto)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Agregar al Carrito
      </button>
    </div>
  );
}

function ItemCarrito({ item, onActualizarCantidad, onEliminar }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px',
      borderBottom: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
        <img 
          src={item.imagen} 
          alt={item.nombre}
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        />
        <div>
          <h4 style={{ margin: 0 }}>{item.nombre}</h4>
          <p style={{ margin: '5px 0 0', color: '#666' }}>${item.precio} c/u</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
          disabled={item.cantidad <= 1}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: item.cantidad <= 1 ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: item.cantidad <= 1 ? 'not-allowed' : 'pointer'
          }}
        >
          -
        </button>
        
        <span style={{ 
          minWidth: '30px', 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {item.cantidad}
        </span>
        
        <button
          onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        
        <span style={{ 
          minWidth: '80px', 
          textAlign: 'right', 
          fontWeight: 'bold',
          color: '#2e7d32'
        }}>
          ${item.precio * item.cantidad}
        </span>
        
        <button
          onClick={() => onEliminar(item.id)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function ShoppingCartChallenge() {
  // Estado del carrito con persistencia en localStorage
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });
  
  const [mostrarResumen, setMostrarResumen] = useState(false);
  
  // Persistir carrito en localStorage cuando cambie
  React.useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);
  
  const agregarAlCarrito = (producto) => {
    setCarrito(carritoActual => {
      const productoExistente = carritoActual.find(item => item.id === producto.id);
      
      if (productoExistente) {
        // Si ya existe, incrementar cantidad
        return carritoActual.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, agregar nuevo producto
        return [...carritoActual, { ...producto, cantidad: 1 }];
      }
    });
  };
  
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(carritoActual =>
      carritoActual.map(item =>
        item.id === id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };
  
  const eliminarDelCarrito = (id) => {
    setCarrito(carritoActual => carritoActual.filter(item => item.id !== id));
  };
  
  const vaciarCarrito = () => {
    setCarrito([]);
  };
  
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  return (
    <div className="desafio">
      <h2>Desafío: Carrito de Compras con Persistencia</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Sección de productos disponibles */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>Productos Disponibles</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            {productosDisponibles.map(producto => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        </div>
        
        {/* Sección del carrito */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0 }}>Carrito de Compras</h3>
              <span style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {totalItems} items
              </span>
            </div>
            
            {carrito.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                <p>El carrito está vacío</p>
                <p>Agrega productos desde la lista</p>
              </div>
            ) : (
              <>
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  {carrito.map(item => (
                    <ItemCarrito
                      key={item.id}
                      item={item}
                      onActualizarCantidad={actualizarCantidad}
                      onEliminar={eliminarDelCarrito}
                    />
                  ))}
                </div>
                
                {/* Resumen del carrito */}
                <div style={{ 
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <span>Subtotal ({totalItems} items):</span>
                    <span style={{ fontWeight: 'bold' }}>${totalPrecio}</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '15px',
                    paddingTop: '10px',
                    borderTop: '1px solid #ddd'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                      ${totalPrecio}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={vaciarCarrito}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Vaciar Carrito
                    </button>
                    
                    <button
                      onClick={() => alert(`Compra realizada por $${totalPrecio}`)}
                      style={{
                        flex: 2,
                        padding: '12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. MANEJO DE ESTADO COMPLEJO:
 *    - Estado del carrito como array de objetos
 *    - Cada item tiene: id, nombre, precio, imagen, cantidad
 *    - Funciones para agregar, actualizar y eliminar
 * 
 * 2. INMUTABILIDAD:
 *    - Nunca mutar el array carrito directamente
 *    - Usar map() para actualizar items existentes
 *    - Usar filter() para eliminar items
 *    - Usar spread operator para agregar nuevos items
 * 
 * 3. LÓGICA DE NEGOCIO:
 *    - Verificar si producto ya existe antes de agregar
 *    - Actualizar cantidad en lugar de duplicar items
 *    - Calcular totales usando reduce()
 * 
 * 4. PERSISTENCIA:
 *    - useState con función inicial para leer de localStorage
 *    - useEffect para guardar en localStorage cuando el carrito cambie
 * 
 * 5. COMPONENTES MODULARES:
 *    - ProductoCard: componente reutilizable para mostrar productos
 *    - ItemCarrito: componente para cada item del carrito
 *    - ShoppingCartChallenge: componente principal con toda la lógica
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Cómo manejarías errores al guardar en localStorage?
 * - ¿Cómo optimizarías el rendimiento con muchos items?
 * - ¿Cómo implementarías un sistema de cupones de descuento?
 * - ¿Cómo sincronizarías el carrito entre múltiples pestañas?
 */