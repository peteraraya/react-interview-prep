import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: TESTING
 * 
 * Ejercicio: "Escribir tests para un componente de Shopping Cart"
 * 
 * Componente a testear:
 * - Muestra items del carrito
 * - Permite agregar/eliminar items
 * - Calcula el total
 * - Maneja estado vacío
 */

// ============================================
// COMPONENTE PARA TESTEAR
// ============================================

export function ShoppingCart({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  
  const addItem = (item) => {
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      setItems(items.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };
  
  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };
  
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(items.map(i => i.id === id ? { ...i, quantity } : i));
    }
  };
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (items.length === 0) {
    return (
      <div data-testid="empty-cart">
        <p>Your cart is empty</p>
      </div>
    );
  }
  
  return (
    <div data-testid="shopping-cart">
      <h3>Shopping Cart ({totalItems} items)</h3>
      
      <ul data-testid="cart-items">
        {items.map(item => (
          <li key={item.id} data-testid={`cart-item-${item.id}`}>
            <span>{item.name}</span>
            <span data-testid={`item-price-${item.id}`}>${item.price}</span>
            <span data-testid={`item-quantity-${item.id}`}>x{item.quantity}</span>
            <button 
              onClick={() => removeItem(item.id)}
              data-testid={`remove-${item.id}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      
      <div data-testid="cart-total">
        Total: ${total}
      </div>
    </div>
  );
}

// ============================================
// SOLUCIÓN: TESTS ESCRITOS
// ============================================

/**
 * ARCHIVO: ShoppingCart.test.jsx
 * 
 * IMPORTS NECESARIOS:
 * import { render, screen, fireEvent } from '@testing-library/react';
 * import userEvent from '@testing-library/user-event';
 * import { ShoppingCart } from './Example';
 */

const mockProducts = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
];

export default function TestingChallenge() {
  const [showTests, setShowTests] = useState(false);
  
  return (
    <div className="desafio">
      <h2>Desafío: Testing para Shopping Cart</h2>
      
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        {/* Componente interactivo */}
        <div>
          <h4>Componente</h4>
          <ShoppingCart initialItems={mockProducts} />
          
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setShowTests(!showTests)} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {showTests ? 'Ocultar Tests' : 'Ver Tests Solución'}
            </button>
          </div>
        </div>
        
        {/* Tests */}
        <div>
          <h4>Tests</h4>
          
          {showTests ? (
            <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '8px', overflow: 'auto', fontSize: '12px', maxHeight: '500px' }}>{`import { render, screen, fireEvent } from '@testing-library/react';
import { ShoppingCart } from './Example';

describe('ShoppingCart', () => {
  
  // TEST 1: Estado vacío
  test('shows empty message when cart is empty', () => {
    render(<ShoppingCart />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.queryByTestId('shopping-cart')).not.toBeInTheDocument();
  });
  
  // TEST 2: Renderiza items correctamente
  test('renders items passed as props', () => {
    const items = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Mouse', price: 29 }
    ];
    
    render(<ShoppingCart initialItems={items} />);
    
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByTestId('item-price-1')).toHaveTextContent('$999');
    expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('x1');
  });
  
  // TEST 3: Calcula total correctamente
  test('calculates total correctly', () => {
    const items = [
      { id: 1, name: 'Laptop', price: 999, quantity: 1 },
      { id: 2, name: 'Mouse', price: 29, quantity: 2 }
    ];
    
    render(<ShoppingCart initialItems={items} />);
    
    // 999 + (29 * 2) = 1057
    expect(screen.getByTestId('cart-total'))
      .toHaveTextContent('Total: $1057');
  });
  
  // TEST 4: Elimina item
  test('removes item when clicking remove button', async () => {
    const items = [{ id: 1, name: 'Laptop', price: 999 }];
    render(<ShoppingCart initialItems={items} />);
    
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('remove-1'));
    
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
  
  // TEST 5: Muestra cantidad correcta de items
  test('displays correct number of items in header', () => {
    const items = [
      { id: 1, name: 'A', price: 10, quantity: 2 },
      { id: 2, name: 'B', price: 20, quantity: 1 }
    ];
    
    render(<ShoppingCart initialItems={items} />);
    
    // 2 + 1 = 3 items
    expect(screen.getByText(/Shopping Cart/))
      .toHaveTextContent('3 items');
  });
  
  // TEST 6: Total se actualiza al eliminar
  test('updates total after removing item', () => {
    const items = [
      { id: 1, name: 'Laptop', price: 100 },
      { id: 2, name: 'Mouse', price: 50 }
    ];
    
    render(<ShoppingCart initialItems={items} />);
    expect(screen.getByTestId('cart-total'))
      .toHaveTextContent('Total: $150');
    
    fireEvent.click(screen.getByTestId('remove-1'));
    
    expect(screen.getByTestId('cart-total'))
      .toHaveTextContent('Total: $50');
  });
});`}</pre>
          ) : (
            <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <p>Haz clic en el botón para ver la solución de tests.</p>
              
              <h5>Estructura de un test:</h5>
              <ol style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li><strong>Arrange:</strong> Preparar datos y renderizar</li>
                <li><strong>Act:</strong> Ejecutar la acción (click, type, etc.)</li>
                <li><strong>Assert:</strong> Verificar el resultado</li>
              </ol>
              
              <h5 style={{ marginTop: '20px' }}>Tips de entrevista:</h5>
              <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
                <li>Testea el comportamiento, no la implementación</li>
                <li>Usa data-testid como último recurso</li>
                <li>Cubre casos happy path y edge cases</li>
                <li>Tests deben ser independientes</li>
                <li>Usa describe() para agrupar tests relacionados</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * DESGLOSE DE TESTS:
 * 
 * 1. EMPTY STATE: Verificar UI cuando no hay datos
 * 2. RENDER: Verificar que los datos se muestran correctamente
 * 3. CALCULATIONS: Verificar cálculos (total)
 * 4. INTERACTIONS: Verificar que las acciones funcionan
 * 5. UPDATES: Verificar que la UI se actualiza correctamente
 * 
 * PATRONES COMUNES EN ENTREVISTAS:
 * 
 * - "Testea este componente" -> Cubrir los casos principales
 * - "¿Cómo testearías un error?" -> Mock rechazar promise
 * - "¿Cómo testearías loading?" -> waitFor + findBy
 * - "¿Qué no testearías?" -> Implementación interna
 */