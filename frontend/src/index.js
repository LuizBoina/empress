import React from 'react';
import ReactDOM from 'react-dom';
import { useRoutes, navigate } from 'hookrouter';
import routes from './routes';
import PageNotFound from './pages/pageNotFound/PageNotFound';
import Header from './header/Header';
import './index.css';

export const AuthContext = React.createContext(null);

const App = () => {
  const initialState = {
    userId: null,
    role: null,
    token: null,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        localStorage.setItem('userId', JSON.stringify(action.payload.data.login.userId));
        localStorage.setItem('role', JSON.stringify(action.payload.data.login.role));
        localStorage.setItem('token', JSON.stringify(action.payload.data.login.token));
        return {
          ...state,
          userId: action.payload.data.login.userId,
          role: action.payload.data.login.role,
          token: action.payload.data.login.token
        };
      case 'LOGOUT':
        localStorage.clear();
        return {
          ...state,
          userId: null,
          storeId: null,
          role: null
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId') || null);
    const role = JSON.parse(localStorage.getItem('role') || null);
    const token = JSON.parse(localStorage.getItem('token') || null);
    if (userId && token && role) {
      dispatch({
        type: 'LOGIN',
        payload: {
          data: {
            login: {
              userId: userId,
              role: role,
              token: token
            }
          }
        }
      });
      navigate('/home');
    }
    else
      navigate('/auth');
  }, []);
  const routeResult = useRoutes(routes);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}>
      <div className='App'>
        <Header />
        {routeResult || <PageNotFound />}
      </div>
    </AuthContext.Provider>
  );
}

export default AuthContext;

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
