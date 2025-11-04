import { http, HttpResponse } from "msw";

const baseURL = "https://forum-api.dicoding.dev/v1";

export const handlers = [
  // Login handler
  http.post(`${baseURL}/login`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    if (email === "testuser@example.com" && password === "password123") {
      return HttpResponse.json({
        status: "success",
        message: "User berhasil login",
        data: {
          token: "mock-token-12345",
        },
      });
    }

    return HttpResponse.json(
      {
        status: "fail",
        message: "email or password is wrong",
      },
      { status: 401 },
    );
  }),

  // Get user info handler
  http.get(`${baseURL}/users/me`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (authHeader && authHeader.includes("mock-token")) {
      return HttpResponse.json({
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
      });
    }

    return HttpResponse.json(
      {
        status: "fail",
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }),

  // Register handler
  http.post(`${baseURL}/register`, async ({ request }) => {
    const body = await request.json();
    const { email } = body;

    if (email === "existing@example.com") {
      return HttpResponse.json(
        {
          status: "fail",
          message: "email is already taken",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: "success",
      message: "User berhasil dibuat",
    });
  }),
];
