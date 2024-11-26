/// <reference types="cypress" />

import { cy, Cypress } from 'cypress'

describe("FeedbackForm Component", () => {
  beforeEach(() => {
    cy.visit("/feedback");
  });

  it("renders the form correctly", () => {
    cy.get("textarea[aria-label='Enter your feedback']").should("be.visible");
    cy.get("button").contains("Upload File").should("be.visible");
    cy.get("button").contains("Submit Feedback").should("be.visible");
    cy.get("[data-testid='google-map']").should("exist");
  });

  it("allows user to type feedback and upload a file", () => {
    const feedbackText = "This is a feedback message!";
    const fileName = "test.png";


    cy.get("textarea[aria-label='Enter your feedback']").type(feedbackText).should("have.value", feedbackText);


    cy.get("input[type='file']").selectFile({
      contents: Cypress.Buffer.from("file content"),
      fileName,
      mimeType: "image/png",
    });


    cy.get("img[alt='Preview']").should("be.visible");
  });

  it("allows user to select a location on the map", () => {

    cy.get("[data-testid='google-map']")
      .click(200, 200); 


    cy.get(".gm-style").find("img").should("have.attr", "src").and("include", "marker");
  });

  it("submits feedback successfully with all fields", () => {
    const feedbackText = "This is a feedback message!";
    const fileName = "test.png";


    cy.get("textarea[aria-label='Enter your feedback']").type(feedbackText);


    cy.get("input[type='file']").selectFile({
      contents: Cypress.Buffer.from("file content"),
      fileName,
      mimeType: "image/png",
    });

    cy.get("[data-testid='google-map']")
      .click(200, 200);

    cy.get("button").contains("Submit Feedback").click();


    cy.get(".MuiModal-root").should("contain.text", "Feedback submitted successfully!");
  });

  it("displays error if required fields are missing", () => {

    cy.get("button").contains("Submit Feedback").click();

  
    cy.get(".MuiModal-root").should("contain.text", "Please select a file and location before submitting.");
  });
});
