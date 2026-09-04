import React, { createContext, useContext, useReducer, useCallback, useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: CONTEXT API
 * 
 * Ejercicio común: "Implementar un carrito de compras global con Context"
 * 
 * Requisitos:
 * 1. Estado global del carrito accesible desde cualquier componente
 * 2. Agregar, actualizar cantidad y eliminar items
 * 3. Persistencia en localStorage
 * 4. Cálculo de totales
 * 5. Separación de concerns (context, reducer, actions)
 */

// SOLUCIÓN PROPUESTA

// ============================================
// PASO 1: Definir tipos de acción
// ============================================
const cartActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// ============================================
// PASO 2: Crear el reducer
// ============================================
function cartReducer(state, action) {
  switch (action.type) {
    case cartActionTypes.ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );
      
      if (existingIndex >= 0) {
        // Si ya existe, incrementar cantidad
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1
        };
        return { ...state, items: newItems };
      }
      
      // Si no existe, agregar nuevo
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    
    case cartActionTypes.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case cartActionTypes.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      };
    }
    
    case cartActionTypes.CLEAR_CART:
      return { ...state, items: [] };
    
    case cartActionTypes.LOAD_CART:
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
}

// ============================================
// PASO 3: Crear Context y Provider
// ============================================
const CartContext = createContext(undefined);

function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], (initial) => {
    // Cargar de localStorage al inicializar
    const saved = localStorage.getItem('cart-items');
    return saved ? JSON.parse(saved) : initial;
  });
  
  // Persistir en localStorage cuando cambien los items
  React.useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items));
  }, [items]);
  
  // Acciones memoizadas
  const addItem = useCallback((product) => {
    dispatch({ type: cartActionTypes.ADD_ITEM, payload: product });
  }, []);
  
  const removeItem = useCallback((id) => {
    dispatch({ type: cartActionTypes.REMOVE_ITEM, payload: id });
  }, []);
  
  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: cartActionTypes.UPDATE_QUANTITY, payload: { id, quantity } });
  }, []);
  
  const clearCart = useCallback(() => {
    dispatch({ type: cartActionTypes.CLEAR_CART });
  }, []);
  
  // Valores computados
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

// ============================================
// PASO 4: Componentes
// ============================================

const products = [
  { id: 1, name: 'Laptop Pro', price: 1299, image: '💻' },
  { id: 2, name: 'Mouse Wireless', price: 29, image: '🖱️' },
  { id: 3, name: 'Teclado Mecánico', price: 89, image: '⌨️' },
  { id: 4, name: 'Monitor 4K', price: 499, image: '🖥️' },
  { id: 5, name: 'Auriculares', price: 199, image: '🎧' }
];

function ProductCard({ product }) {
  const { addItem } = useCart();
  
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>{product.image}</div>
      <h4 style={{ margin: '0 0 5px' }}>{product.name}</h4>
      <p style={{ color: '#666', margin: '0 0 10px' }}>${product.price}</p>
      <button
        onClick={() => addItem(product)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Agregar
      </button>
    </div>
  );
}

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      borderBottom: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>{item.image}</span>
        <div>
          <div style={{ fontWeight: 'bold' }}>{item.name}</div>
          <div style={{ color: '#666', fontSize: '14px' }}>${item.price}</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
        
        <span style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
          ${item.price * item.quantity}
        </span>
        
        <button
          onClick={() => removeItem(item.id)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function Cart() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ margin: 0 }}>Carrito ({totalItems} items)</h4>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Vaciar
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          El carrito está vacío
        </p>
      ) : (
        <>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            borderTop: '2px solid #007bff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span style={{ color: '#28a745' }}>${totalPrice}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CartChallenge() {
  return (
    <CartProvider>
      <div className="desafio">
        <h2>Desafío: Carrito Global con Context API</h2>
        
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* Productos */}
          <div style={{ flex: 2, minWidth: '300px' }}>
            <h3>Productos</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '15px'
            }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          {/* Carrito */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <Cart />
          </div>
        </div>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Características implementadas:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Context Global:</strong> Carrito accesible desde cualquier componente</li>
            <li><strong>useReducer:</strong> Estado complejo con acciones predecibles</li>
            <li><strong>Persuación:</strong> Guarda en localStorage automáticamente</li>
            <li><strong>Acciones memoizadas:</strong> useCallback para evitar re-renders</li>
            <li><strong>Hook personalizado:</strong> useCart encapsula el contexto</li>
          </ul>
        </div>
      </div>
    </CartProvider>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. ARQUITECTURA:
 *    - CartContext: createContext para el contexto
 *    - CartProvider: Maneja estado con useReducer
 *    - useCart: Hook personalizado para consumir
 * 
 * 2. REDUCER PATTERN:
 *    - Acciones tipadas (cartActionTypes)
 *    - Reducer puro: state + action => newState
 *    - Inmutabilidad en cada acción
 * 
 * 3. SEPARACIÓN DE CONCERNS:
 *    - Definición de acciones
 *    - Lógica del reducer
 *    - Provider con estado
 *    - Componentes presentacionales
 * 
 * 4. PERSISTENCIA:
 *    - Carga inicial de localStorage en initializer
 *    - useEffect para guardar cuando cambian items
 * 
 * PREGUNTAS COMUNES:
 * - ¿Cuándo usar Context vs Zustand/Redux?
 * - ¿Cómo optimizar re-renders con Context?
 * - ¿Cómo manejar estado asíncrono con Context?
 */