export default {
  apps: [
    {
      name: 'elegant-commerce',
      script: 'dist/index.js',
      cwd: process.cwd(),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      // Restart policy
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 1000,
      // Health monitoring
      health_check_grace_period: 30000,
      health_check_fatal_exceptions: true,
      kill_timeout: 1600,
      listen_timeout: 8000,
      // Advanced features
      ignore_watch: ['node_modules', 'logs', '.git'],
      watch_options: {
        followSymlinks: false
      },
      source_map_support: true,
      disable_source_map_support: false
    }
  ],
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:mericulasK/ElegantCommerce.git',
      path: '/var/www/production',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
