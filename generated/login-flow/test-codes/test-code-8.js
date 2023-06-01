/**
 * Test Scenario: Notifications
 * Test Case: Test that users receive notifications for their project assignments, upcoming deadlines, and completed tasks.
 *            Test that users receive notifications for critical system updates and announcements.
 */

const { fakeRequest } = require('./js/utils/fakeRequest');
const { fakeServer } = require('./js/utils/fakeServer');
const { auth } = require('./js/utils/auth');

const waitFor = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('Notifications', () => {
  beforeEach(() => {
    fakeServer.init();
  });

  test('User receives notifications for project assignments, deadlines, and task completions', async () => {
    const username = 'testuser';
    const password = 'testpassword';

    auth.register(username, password, () => {});

    auth.login(username, password, () => {});

    const projectAssignments = {
      projectId1: {
        task1: {
          status: 'Assigned',
          deadline: new Date().toISOString(),
        },
      },
      projectId2: {
        task1: {
          status: 'Completed',
          deadline: new Date().toISOString(),
        },
      },
    };

    const sendNotification = jest.fn();

    fakeRequest.post('/projectAssignments', projectAssignments, sendNotification);

    // Wait for fake network latency
    await waitFor(Math.floor(Math.random() * 2000) + 100);

    expect(sendNotification).toHaveBeenCalledTimes(3);
  });

  test('User receives notifications for critical system updates and announcements', async () => {
    const username = 'testuser';
    const password = 'testpassword';

    auth.register(username, password, () => {});

    auth.login(username, password, () => {});

    const systemAnnouncement = {
      type: 'Critical Update',
      message: 'A new version is available. Please update immediately.',
      date: new Date().toISOString(),
    };

    const sendNotification = jest.fn();

    fakeRequest.post('/systemAnnouncements', systemAnnouncement, sendNotification);

    // Wait for fake network latency
    await waitFor(Math.floor(Math.random() * 2000) + 100);

    expect(sendNotification).toHaveBeenCalledTimes(1);
  });
});