const config = {
  branches: ['main'],
  ci: false,
  dryRun: false,
  debug: false,
  extends: 'semantic-release-npm-github-publish',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};

module.exports = config;
