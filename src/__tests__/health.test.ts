import request from 'supertest';
import { app } from '../index';

describe('Health Check Endpoint', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', 'Service is healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });

  it('should return valid JSON content-type', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
  });
});

describe('Root Endpoint', () => {
  it('should return 200 and API info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Express.js TypeScript API Boilerplate');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
});