import * as reactRouterDom from "react-router-dom";
import { screen, fireEvent, waitFor, renderWithProviders } from "../../../test-utils";
import LoginPage from "../../auth/LoginPage";
import { loginWithLoading, getMeWithLoading } from "../../../store/slices/authSlice";

jest.mock("axios");

jest.mock("../../../store/slices/authSlice", () => {
  const actual = jest.requireActual("../../../store/slices/authSlice");
  const mockLoginThunk = jest.fn((payload) => (dispatch) => {
    const promise = Promise.resolve({ token: "test-token" });
    promise.unwrap = () => promise;
    return promise;
  });

  const mockGetMeThunk = jest.fn(() => (dispatch) => {
    const promise = Promise.resolve({ id: "user-1", name: "Test User" });
    promise.unwrap = () => promise;
    return promise;
  });

  return {
    ...actual,
    loginWithLoading: mockLoginThunk,
    getMeWithLoading: mockGetMeThunk,
  };
});

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

// Skenario pengujian: Menguji komponen LoginPage untuk memastikan form login berfungsi dengan benar, termasuk validasi input, submit form, penanganan error, dan menampilkan pesan error dari Redux state.
describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const preloadedState = {
    auth: { user: null, token: null, error: null },
  };

  it("should render login form", () => {
    renderWithProviders(<LoginPage />, { preloadedState });

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should show validation error when email is empty", async () => {
    renderWithProviders(<LoginPage />, { preloadedState });

    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
    expect(loginWithLoading).not.toHaveBeenCalled();
  });

  it("should show validation error when password is empty", async () => {
    renderWithProviders(<LoginPage />, { preloadedState });

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
    expect(loginWithLoading).not.toHaveBeenCalled();
  });

  it("should call loginWithLoading and getMeWithLoading on successful submit", async () => {
    renderWithProviders(<LoginPage />, { preloadedState });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginWithLoading).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should display error message on login failure", async () => {
    loginWithLoading.mockImplementation((payload) => (dispatch) => {
      const promise = Promise.resolve().then(() => {
        throw new Error("Invalid credentials");
      });

      promise.unwrap = () => promise;

      return promise;
    });

    renderWithProviders(<LoginPage />, { preloadedState });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginWithLoading).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should display error from redux state", () => {
    const preloadedStateWithError = {
      auth: { user: null, token: null, error: "Redux error message" },
    };

    renderWithProviders(<LoginPage />, { preloadedState: preloadedStateWithError });

    expect(screen.getByText("Redux error message")).toBeInTheDocument();
  });
});
