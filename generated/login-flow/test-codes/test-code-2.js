```javascript
// Test Scenario 2: User login
// - Test the user login process with valid credentials and ensure successful login.
// - Test the user login with incorrect credentials, and ensure the system prompts an error message.

const { login } = require('./js/utils/auth.js');
const { fakeServer } = require('./js/utils/fakeServer.js');

describe('User Login', () => {
  const validUser = { username: 'testuser', password: 'testpassword' };

  beforeAll(async () => {
    // Register a valid user for testing
    await fakeServer.register(validUser.username, validUser.password, () => {});
  });

  afterEach(() => {
    // Logout after each test case
    fakeServer.logout(() => {});
  })

  test('User login with valid credentials should be successful', (done) => {
    login(validUser.username, validUser.password, (success) => {
      expect(success).toBeTruthy();
      expect(fakeServer.loggedIn()).toBeTruthy();
      done();
    });
  });

  test('User login with incorrect credentials should prompt an error message', (done) => {
    const invalidUser = { username: 'testuser', password: 'wrongpassword' };

    login(invalidUser.username, invalidUser.password, (success, errMsg) => {
      expect(success).toBeFalsy();
      expect(errMsg).toBeDefined();
      expect(errMsg).toBe('Username or password is incorrect');
      done();
    });
  });
});
```