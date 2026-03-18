import "@testing-library/jest-native/extend-expect";

jest.mock("moti", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MotiView = React.forwardRef(({ children, ...props }: any, ref: any) =>
    React.createElement(View, { ...props, ref }, children),
  );

  return {
    AnimatePresence: ({ children }: any) => children,
    MotiView,
  };
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    LinearGradient: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
  };
});
