import { createBrowserHistory, createMemoryHistory } from 'history';


export default typeof window === 'object' ? createBrowserHistory() : createMemoryHistory();
