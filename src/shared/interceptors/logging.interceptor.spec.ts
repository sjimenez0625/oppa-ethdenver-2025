import { ExecutionContext } from '@nestjs/common';

import { AppLogger } from '../logger/logger.service';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let loggingInterceptor: LoggingInterceptor;

  const mockRequest = {
    headers: {},
    url: 'mock-url',
    header: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn(),
    pipe: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    loggingInterceptor = new LoggingInterceptor(new AppLogger());
  });

  it('should be defined', () => {
    expect(loggingInterceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('intercept', async () => {
      (
        mockExecutionContext.switchToHttp().getRequest as jest.Mock<any, any>
      ).mockReturnValueOnce(mockRequest);
      mockCallHandler.handle.mockReturnValueOnce({
        pipe: jest.fn(),
      });

      loggingInterceptor.intercept(mockExecutionContext, mockCallHandler);

      expect(mockExecutionContext.switchToHttp().getRequest).toHaveBeenCalled();
    });
  });
});
