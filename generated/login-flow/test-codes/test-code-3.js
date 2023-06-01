```javascript
/**
 * E2E Test Scenario 3: User Profile
 *   - Test updating user profile information and ensure the changes are saved successfully.
 *   - Test updating a user's profile with invalid data formats, and ensure the system prompts an error message.
 */

const fakeAuth = require('./js/utils/auth');
const fakeRequest = require('./js/utils/fakeRequest');
const { fakeServer } = require('./js/utils/fakeServer');

// Set up and start fake server
fakeServer.init();

// Test updating user profile information and ensure the changes are saved successfully
test('Update user profile information with valid data', async () => {
  const username = 'testuser';
  const password = 'testpassword';

  // First, register a new user
  await new Promise((resolve) => {
    fakeAuth.register(username, password, resolve);
  });

  // Then, log in the new user
  await new Promise((resolve) => {
    fakeAuth.login(username, password, resolve);
  });

  // Update user's profile information
  const newProfileInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const updatedProfileResponse = await new Promise((resolve) => {
    fakeRequest.post('/profile/update', newProfileInfo, resolve);
  });

  // Check if the changes were saved successfully
  expect(updatedProfileResponse.status).toBe(200);
  expect(updatedProfileResponse.body).toEqual({
    firstName: newProfileInfo.firstName,
    lastName: newProfileInfo.lastName,
    email: newProfileInfo.email,
  });
});

// Test updating a user's profile with invalid data formats
test('Update user profile information with invalid data', async () => {
  const username = 'testuser';
  const password = 'testpassword';

  // First, register a new user
  await new Promise((resolve) => {
    fakeAuth.register(username, password, resolve);
  });

  // Then, log in the new user
  await new Promise((resolve) => {
    fakeAuth.login(username, password, resolve);
  });

  // Update user's profile with invalid email format
  const newProfileInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example', // Invalid email format
  };

  const updatedProfileResponse = await new Promise((resolve) => {
    fakeRequest.post('/profile/update', newProfileInfo, resolve);
  });

  // Check if the system prompts an error message
  expect(updatedProfileResponse.status).toBe(400);
  expect(updatedProfileResponse.body.message).toContain('Invalid email format.');
});
```