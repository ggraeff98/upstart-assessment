describe("Weather Forecast App", () => {
  it("shows forecast cards with date headings", () => {
    cy.visit("/");
    cy.get("input").type("1600 Pennsylvania Ave NW, Washington, DC");
    cy.contains("Get Forecast").click();

    cy.get("a h3", { timeout: 10000 })
      .first()
      .invoke("text")
      .then((text) => {
        expect(text).to.match(/\d{1,2}/); // checks that day number exists
      });
  });

  it("navigates to forecast detail page via card click", () => {
    cy.visit("/");
    cy.get("input").type("1600 Pennsylvania Ave NW, Washington, DC");
    cy.contains("Get Forecast").click();

    cy.get("a", { timeout: 10000 }).first().click();

    cy.get("h2").should("exist");
    cy.contains(/°F|°C/).should("exist");

    cy.contains("Back to Forecast").click();
    cy.get("input").should("exist");
  });

  it("shows error for invalid address", () => {
    cy.visit("/");
    cy.get("input").type("Invalid Address");
    cy.contains("Get Forecast").click();
    cy.contains(/No match found/i, { timeout: 10000 }).should("exist");
  });
});
