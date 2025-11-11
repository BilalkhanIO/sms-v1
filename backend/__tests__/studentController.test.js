import cloudinary from '../utils/cloudinary.js';
import { deleteStudent } from '../controllers/studentController.js';
import Student from '../models/Student.js';
import Activity from '../models/Activity.js';

jest.mock('../utils/cloudinary.js', () => ({
  uploader: {
    destroy: jest.fn(),
  },
}));

jest.mock('../models/Student.js');
jest.mock('../models/Activity.js');

describe('deleteStudent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'studentId' },
      user: { _id: 'userId' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Activity.logActivity = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle public_ids with dots', async () => {
    const student = {
      _id: 'studentId',
      admissionNumber: '12345',
      documents: [
        { url: 'http://res.cloudinary.com/demo/image/upload/v12345/folder/version_1.0/image.jpg' },
      ],
      deleteOne: jest.fn(),
    };
    Student.findById.mockResolvedValue(student);
    Student.deleteOne.mockResolvedValue({});

    await deleteStudent[2](req, res);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('folder/version_1.0/image');
  });
});
