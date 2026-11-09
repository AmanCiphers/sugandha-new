import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
jest.mock('next/link', ({ children, href, ...props }) => (
  <a href={href} {...props}>{children}</a>
));

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const icons = {};
  const iconNames = [
    'X', 'Send', 'Sparkles', 'Loader2', 'MessageSquare', 'ShoppingCart', 
    'ExternalLink', 'Star', 'Package', 'Clock', 'Truck', 'ChevronLeft',
    'ChevronRight', 'Search', 'User', 'Menu', 'Trash2', 'Pencil', 'Plus',
    'Minus', 'Heart', 'Mail', 'Eye', 'EyeOff', 'MapPin', 'Shield', 'RefreshCw',
    'IndianRupee', 'ShoppingBag', 'Users', 'TrendingUp', 'AlertTriangle',
    'ChevronDown', 'GripVertical', 'Lock', 'Nose', 'Flower2', 'Brain', 'Zap'
  ];
  iconNames.forEach(name => {
    icons[name] = ({ className, ...props }) => <svg className={className} {...props} data-testid={`icon-${name.toLowerCase()}`} />;
  });
  return icons;
});

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter', className: 'font-inter' }),
  Playfair_Display: () => ({ variable: '--font-playfair', className: 'font-playfair' }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console.error in tests (optional - remove if you want to see errors)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) return;
    if (args[0]?.includes?.('act(...)')) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});