```javascript
/**
 * Test Scenario 5: Project editing
 *  - Test the process of editing an existing project's details, and ensure the changes are saved successfully.
 *  - Test the process of updating a project with invalid input, and ensure an error message is displayed.
 */

const { navigateToProject, editProject, waitForMessage, getErrorMessage } = require('./testUtils');

describe('Project editing E2E tests', () => {
  beforeAll(async () => {
    await navigateToProject();
  });

  test('Edit an existing project with valid inputs', async () => {
    const project = {
      name: 'Updated Project',
      description: 'This is an updated project description.',
      startDate: '2022-03-01',
      endDate: '2022-03-30',
    };
    
    await editProject(project);
    const messageDisplayed = await waitForMessage('Project updated successfully');
    
    expect(messageDisplayed).toBe(true);
  });

  test('Edit a project with invalid input', async () => {
    const invalidProject = {
      name: '',
      description: 'This is a project description without a name.',
      startDate: '2022-02-01',
      endDate: '2022-01-30',
    };
    
    await editProject(invalidProject);
    const errorMessage = await getErrorMessage();
    
    expect(errorMessage).toBe('Name field and end date validations are not passed');
  });
});
```