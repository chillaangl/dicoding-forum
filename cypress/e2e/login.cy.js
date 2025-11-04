// Skenario pengujian: Menguji alur login lengkap dari halaman login hingga redirect ke home page dan penyimpanan token ke localStorage, memastikan seluruh proses autentikasi berjalan dengan benar secara end-to-end.
describe("Login E2E", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.intercept("POST", "https://forum-api.dicoding.dev/v1/login", {
      statusCode: 200,
      body: {
        status: "success",
        message: "User berhasil login",
        data: {
          token: "mock-token-12345",
        },
      },
    }).as("loginRequest");

    cy.intercept("GET", "https://forum-api.dicoding.dev/v1/users/me", {
      statusCode: 200,
      body: {
        status: "success",
        message: "User berhasil didapatkan",
        data: {
          user: {
            id: "user-1",
            name: "Test User",
            email: "testuser@example.com",
            avatar: "",
          },
        },
      },
    }).as("getMeRequest");

    cy.visit("/login");
  });

  it("should successfully login and redirect to home page", () => {
    cy.get('input[type="email"]').type("testuser@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.wait("@getMeRequest");

    cy.url({ timeout: 10000 }).should("eq", "http://localhost:3000/");

    cy.window().its("localStorage").invoke("getItem", "df_token").should("exist");
  });
});
