import { server } from '../index';

afterAll((done) => {
  server.close(done);
});
