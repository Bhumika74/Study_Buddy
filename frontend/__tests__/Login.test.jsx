/**
 * Login component unit tests
 * Tests the form logic without rendering the full React tree.
 * Firebase and react-router are mocked so no real network calls happen.
 */

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
}));

// Mock AuthContext
const mockLogin = jest.fn();
jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Login = require('../../src/pages/Login').default;

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => null), setItem: jest.fn(), removeItem: jest.fn() },
      writable: true,
    });
  });

  test('renders email and password fields', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('renders Sign In button', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('calls login with provided email and password', async () => {
    mockLogin.mockResolvedValue({ success: true });
    // Mock localStorage user
    window.localStorage.getItem.mockReturnValue(JSON.stringify({ role: 'student' }));

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'student@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'mypassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('student@test.com', 'mypassword');
    });
  });
});
