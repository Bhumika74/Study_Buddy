/**
 * Backend Auth Controller & Middleware Tests
 */

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Mock the EXACT path the controller uses
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedpassword')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

const bcrypt = require('bcrypt');
const UserModel = require('../models/User');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ── authMiddleware ─────────────────────────────────────────────────────────────
describe('authMiddleware', () => {
  const authMiddleware = require('../middleware/authMiddleware');

  afterEach(() => jest.clearAllMocks());

  test('returns 401 if no Authorization header is provided', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if token is invalid / tampered', () => {
    const req = { headers: { authorization: 'Bearer totallywrongtoken' } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() and attaches decoded user for a valid token', () => {
    const payload = { id: 'user-123', role: 'student' };
    const token = jwt.sign(payload, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 'user-123', role: 'student' });
  });
});

// ── authController.login ───────────────────────────────────────────────────────
describe('authController.login', () => {
  const authController = require('../controllers/authController');

  afterEach(() => jest.clearAllMocks());

  test('returns 404 when user is not found', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const req = { body: { email: 'nobody@test.com', password: 'pass' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 401 when password does not match', async () => {
    UserModel.findOne.mockResolvedValue({ id: '1', email: 'user@test.com', password: 'hashed', role: 'student' });
    bcrypt.compare.mockResolvedValueOnce(false);
    const req = { body: { email: 'user@test.com', password: 'wrongpass' } };
    const res = mockRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('returns a signed token and user on successful login', async () => {
    const fakeUser = { id: '42', email: 'user@test.com', password: 'hashed', role: 'educator' };
    UserModel.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValueOnce(true);
    const req = { body: { email: 'user@test.com', password: 'correctpass' } };
    const res = mockRes();

    await authController.login(req, res);

    const call = res.json.mock.calls[0][0];
    expect(call).toHaveProperty('token');
    expect(call).toHaveProperty('user');
    expect(typeof call.token).toBe('string');
  });
});
