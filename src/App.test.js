// harus paling atas, sebelum import apa pun yang menyentuh api.js
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "./test-utils";
import App from "./App";

jest.mock("axios");

test("renders app", () => {
  // App sudah punya BrowserRouter sendiri, jadi tidak perlu MemoryRouter
  const store = makeStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  // App should render without errors
  expect(document.body).toBeInTheDocument();
});
