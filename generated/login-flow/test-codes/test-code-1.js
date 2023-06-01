```
/*
  Test Scenario: User Registration
  1. Test a new user registration process with valid credentials and ensure successful account creation.
  2. Test user registration with an existing email address or username, and ensure the system prompts an error message.
  3. Test user registration with invalid email formats and ensure the error message is displayed.
*/

const { register } = require('../js/utils/auth');

describe('User Registration', () => {
  test('successful user registration with valid credentials', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const response = await register(newUser.username, newUser.email, newUser.password);
    
    expect(response.success).toBe(true);
    expect(response.message).toBe('Registration successful');
  });
  
  test('user registration with existing email or username', async () => {
    const existingUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const response = await register(existingUser.username, existingUser.password);
    
    expect(response.success).toBe(false);
    expect(response.message).toBe('A user with this email/username already exists');
  });
  
  test('user registration with invalid email format', async () => {
    const invalidEmailUser = {
      username: 'testuser2',
      email: 'invalidemail',
      password: 'password123',
    };
    const response = await register(invalidEmailUser.username, invalidEmailUser.password);
    
    expect(response.success).toBe(false);
    expect(response.message).toBe('Invalid email format');
  });
});
```