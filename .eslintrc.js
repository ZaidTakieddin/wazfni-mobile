module.exports = {
  root: true,
  extends: ["universe/native", "plugin:react-native/all"],
  plugins: ["react-native"],
  rules: {
    "react-native/no-unused-styles": 2,
    "react-native/no-inline-styles": 1,
    "react-native/no-raw-text": 0,
    "react-native/no-single-element-style-arrays": 2,
    "react-native/no-color-literals": 0,
  },
};
