import { Notification } from 'element-ui';

const latest = {};

const instance = {};
const methods = ['success', 'warning', 'info', 'error'];

function createNotification(opts) {
  const key = opts.title + opts.message;
  const previous = latest[key];

  if (previous && (Date.now() - previous) < (opts.duration || 4500)) return;
  latest[key] = Date.now();

  Notification(opts);
}

methods.forEach((type) => {
  instance[type] = (opts) => {
    createNotification({ ...opts, type });
  };
});

export default instance;
