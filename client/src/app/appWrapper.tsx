import { ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryProvider } from "./providers/QueryProvider";
import { store } from "./store";

const appWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  );
};

export default appWrapper;