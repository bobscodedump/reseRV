module.exports = {
  apps: [
    {
      script: './dist/telebot.js',
      watch: '.',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
