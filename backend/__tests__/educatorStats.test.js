/**
 * Educator Stats Controller Tests
 * Verifies that getStats returns data from the DB instead of random numbers.
 */

const { Course, Assignment, UploadedMaterial, User } = require('../models');

jest.mock('../models', () => ({
  Course: { findAll: jest.fn() },
  Assignment: { findAll: jest.fn() },
  UploadedMaterial: { findAll: jest.fn() },
  User: { count: jest.fn(), findAll: jest.fn() },
  Progress: { findAll: jest.fn() },
  AIConversation: { count: jest.fn() },
}));

describe('educatorController.getStats', () => {
  const educatorController = require('../controllers/educatorController');

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  test('returns real DB counts (not random numbers)', async () => {
    Course.findAll.mockResolvedValue([{}, {}, {}]);          // 3 courses
    Assignment.findAll.mockResolvedValue([{}, {}]);           // 2 assignments
    UploadedMaterial.findAll.mockResolvedValue([{}]);         // 1 material
    User.count.mockResolvedValue(7);                          // 7 students

    const req = { user: { id: 'educator-1' } };
    const res = mockRes();

    await educatorController.getStats(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.activeCourses).toBe(3);
    expect(result.totalStudents).toBe(7);
    expect(result.totalAssignments).toBe(2);
    expect(result.materialsUploaded).toBe(1);

    // Crucially: must NOT be a random number
    expect(typeof result.totalStudents).toBe('number');
    expect(result.totalStudents).not.toBeNaN();
  });

  test('returns 500 on database error', async () => {
    Course.findAll.mockRejectedValue(new Error('DB error'));
    const req = { user: { id: 'educator-1' } };
    const res = mockRes();

    await educatorController.getStats(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
