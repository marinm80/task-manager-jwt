jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock('../src/utils/jwt', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

const prisma = require('../src/config/db');
const { generateAccessToken, verifyRefreshToken } = require('../src/utils/jwt');
const { refresh } = require('../src/controllers/authController');

describe('authController.refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve accessToken y el perfil mínimo para hidratar Redux', async () => {
    const refreshToken = 'refresh-cookie';
    const user = {
      id: 21,
      name: 'QA Taskly',
      email: 'qa@taskly.test',
      role: 'USER',
      refreshToken,
      password: 'never-return-this',
    };
    verifyRefreshToken.mockReturnValue({ id: user.id });
    prisma.user.findUnique.mockResolvedValue(user);
    generateAccessToken.mockReturnValue('new-access-token');
    const req = { cookies: { refreshToken } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await refresh(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      accessToken: 'new-access-token',
      user: { id: 21, name: 'QA Taskly', email: 'qa@taskly.test', role: 'USER' },
    });
  });
});
