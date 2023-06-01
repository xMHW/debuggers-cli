/*
Test Scenario 7: Task status updates
  1. Test updating a task status, and ensure the new status is reflected in the project progress chart.
  2. Test updating a task status to an invalid value, and ensure an error message is displayed.
*/

const { fakeServer } = require("../../js/utils/fakeServer");
const { fakeRequest } = require("../../js/utils/fakeRequest");

// Utility function to create a sample task
const createTask = (status) => ({ title: "Sample Task", status: status });

describe("Task status updates", () => {
  // Test 7.1: Updating a task status with valid value
  test("Task status should be updated with valid value", async () => {
    const taskStatusEndpoint = "/taskStatus";
    const testData = createTask("In Progress");

    const postRequestResponse = await new Promise((resolve, reject) => {
      fakeRequest.post(taskStatusEndpoint, testData, (response) => {
        resolve(response);
      });
    });

    expect(postRequestResponse.status).toBe("SUCCESS");
    expect(postRequestResponse.message).toBe(
      "Task status updated successfully."
    );
  });

  // Test 7.2: Updating a task status with invalid value
  test("Task status update should fail with invalid value", async () => {
    const taskStatusEndpoint = "/taskStatus";
    const testData = createTask("Invalid Status");

    const postRequestResponse = await new Promise((resolve, reject) => {
      fakeRequest.post(taskStatusEndpoint, testData, (response) => {
        resolve(response);
      });
    });

    expect(postRequestResponse.status).toBe("ERROR");
    expect(postRequestResponse.message).toBe("Invalid task status.");
  });
});
