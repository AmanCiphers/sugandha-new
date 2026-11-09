import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '@/features/cart/context/cart-context';
import { Button } from '@/components/ui/button';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const TestComponent = () => {
  const { items, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <div data-testid="items">
        {items.map(item => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            {item.productName} - {item.quantity}
            <button onClick={() => removeItem(item.id)} data-testid={`remove-${item.id}`}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={() => addItem('prod-1', 1, { variantId: 'var-1', sizeMl: 6, price: 330, productName: 'Test Attar' })} data-testid="add-btn">
        Add Item
      </button>
      <button onClick={() => clearCart()} data-testid="clear-btn">Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
  };

  it('starts with empty cart', () => {
    renderWithProvider();
    expect(screen.getByTestId('item-count').textContent).toBe('0');
  });

  it('adds item to cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    const itemElement = screen.getByTestId('items').querySelector('[data-testid^="item-"]');
    expect(itemElement).not.toBeNull();
    expect(itemElement.textContent).toContain('Test Attar');
  });

  it('increments quantity for same product+variant', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('add-btn'));
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('item-count').textContent).toBe('2');
    // Match only item divs (not item-count)
    const items = screen.getAllByTestId(/^item-\d+$/);
    expect(items).toHaveLength(1);
  });

  it('removes item from cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('add-btn'));
    // Find the remove button by role since ID is generated
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    expect(screen.getByTestId('item-count').textContent).toBe('0');
  });

  it('clears cart', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('add-btn'));
    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(screen.getByTestId('item-count').textContent).toBe('0');
  });

  it('persists to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('Test Attar')
    );
  });

  it('loads from localStorage on init', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{
      id: '1',
      productId: 'prod-1',
      variantId: 'var-1',
      sizeMl: 6,
      price: 330,
      productName: 'Saved Attar',
      quantity: 2,
      cartKey: 'prod-1-var-1',
    }]));
    renderWithProvider();
    expect(screen.getByTestId('item-count').textContent).toBe('2');
  });
});