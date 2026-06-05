export default {
  apps: [
    {
      name: 'elite-shop',
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
      // Restart policy - 7/24 optimized settings
      min_uptime: '5s',
      max_restarts: 50,
      restart_delay: 2000,
      // Health monitoring - Enhanced for 24/7 operation
      health_check_grace_period: 60000,
      health_check_fatal_exceptions: true,
      kill_timeout: 3000,
      listen_timeout: 10000,
      // Memory and performance optimization
      node_args: '--max-old-space-size=2048',
      exec_mode: 'cluster',
      // Advanced features
      ignore_watch: ['node_modules', 'logs', '.git'],
      watch_options: {
        followSymlinks: false
      },
      source_map_support: true,
      disable_source_map_support: false,
      // Network and proxy optimization
      log_type: 'json',
      combine_logs: true,
      // Auto startup and crash recovery
      restart_on_change: true,
      exp_backoff_restart_delay: 100
    }
  ],
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:mericulasK/EliteShop.git',
      path: '/var/www/production',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
