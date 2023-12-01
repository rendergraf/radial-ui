/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  "rules": {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    'unicorn/filename-case': [
      'error',
      {
        case: 'pascalCase',
      },
    ],
  }
};
