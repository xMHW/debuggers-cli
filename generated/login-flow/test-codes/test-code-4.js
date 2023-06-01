// Test Scenario: Project creation
// 4.1 - Test the process of creating a new project with mandatory fields filled, and ensure the project is created successfully.
// 4.2 - Test creating a project while leaving mandatory fields blank, and ensure an error message is displayed.

const { createProject } = require("../src/projectManagement");
const assert = require("assert");

describe("E2E Test Scenario 4: Project creation", () => {
  let projectName = "Test Project";
  let projectDescription = "This is a test project";
  let mandatoryFields = { name: projectName, description: projectDescription };

  test("4.1 - Create a new project with mandatory fields filled", (done) => {
    createProject(mandatoryFields, (error, project) => {
      expect(error).toBeNull();
      expect(project.name).toEqual(projectName);
      expect(project.description).toEqual(projectDescription);
      done();
    });
  });

  test("4.2 - Create a project while leaving mandatory fields blank", (done) => {
    createProject({}, (error, project) => {
      expect(error).toBeDefined();
      expect(error.message).toEqual("Mandatory fields are missing");
      expect(project).toBeUndefined();
      done();
    });
  });
});
