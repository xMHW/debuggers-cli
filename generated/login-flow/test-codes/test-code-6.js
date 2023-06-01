/**
 * Test Scenario 6: Task Assignment
 * - Test the process of assigning a task to a team member, and ensure the task is successfully assigned.
 * - Test the process of assigning a task to an invalid user, and ensure the system prompts an error message.
 */

const request = require("supertest");
const app = require("../app");
const { User } = require("../models/user");
const { Task } = require("../models/task");

describe("Test Scenario 6: Task Assignment", () => {
  let user1, user2, user3, task;

  beforeAll(async () => {
    // Create test users and a task
    user1 = await User.create({ username: "user1", password: "password1" });
    user2 = await User.create({ username: "user2", password: "password2" });
    user3 = await User.create({ username: "user3", password: "password3" });

    task = await Task.create({ name: "Sample Task", createdBy: user1.id });
  });

  afterAll(async () => {
    // Cleanup
    await Task.destroy({ where: { id: task.id } });
    await User.destroy({ where: { id: [user1.id, user2.id, user3.id] } });
  });

  test("Assigning a task to a valid team member", async () => {
    const res = await request(app)
      .put(`/tasks/${task.id}/assign`)
      .send({ userId: user2.id })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.assignedTo).toBe(user2.id);
  });

  test("Assigning a task to an invalid user", async () => {
    const res = await request(app)
      .put(`/tasks/${task.id}/assign`)
      .send({ userId: "invalid-user-id" })
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid user");
  });
});
