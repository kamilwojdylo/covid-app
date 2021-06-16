const { hostname, protocol } = window.location;
const port = process.env.REACT_APP_BACKEND_PORT;
export const origin = `${protocol}//${hostname}:${port}`;