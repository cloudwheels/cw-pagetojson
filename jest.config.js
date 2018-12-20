module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
        'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    // eslint-disable-next-line max-len
    '<rootDir>/test/(*.test.(js|jsx|ts|tsx))',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  verbose: true,

};
