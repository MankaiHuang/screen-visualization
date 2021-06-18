// create history
const history = require('history/createHashHistory').default({
  basename: '/screen/',
});
window.g_history = history;
export default history;
