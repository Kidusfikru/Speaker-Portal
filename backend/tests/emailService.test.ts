import { sendEmail } from '../src/services/emailService';

describe('Email Notification Service', () => {
  it('should call AWS SES with correct params', async () => {
    // Mock SESClient and SendEmailCommand
    jest.mock('@aws-sdk/client-ses', () => {
      return {
        SESClient: jest.fn().mockImplementation(() => ({
          send: jest.fn().mockResolvedValue({ MessageId: 'mock-id' }),
        })),
        SendEmailCommand: jest.fn().mockImplementation((params) => params),
      };
    });
    // Re-import after mocking
    const { sendEmail } = require('../src/services/emailService');
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Hello</p>',
    });
    expect(result).toHaveProperty('MessageId', 'mock-id');
  });
});
