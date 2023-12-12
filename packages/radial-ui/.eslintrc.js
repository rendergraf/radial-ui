/** @type {import("eslint").Linter.Config}*/
module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "react/no-unknown-property": ['error', { ignore: ['css'] }],
    'unicorn/filename-case': [
      'error',
      {
        case: 'pascalCase',
      },
    ],
    "react/button-has-type": "off"
  }
};
