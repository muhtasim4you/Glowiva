module.exports = {
  apps: [{
    name: 'glowivaa-api',
    script: 'server.js',
    cwd: '/var/www/glowivaa/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/www/glowivaa/logs/api-error.log',
    out_file: '/var/www/glowivaa/logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
