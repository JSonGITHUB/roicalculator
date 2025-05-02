import { useState } from 'react';
import debounce from './components/utils/Debouncer';
import ROICalculator from './components/eye/ROICalculator';
import './assets/css/App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import history from './components/utils/history';

const App = () => {

    const [state, setState] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const base = 'roicalculator/';

    let path = window.location.pathname;
    
    const widthChanged = () => (window.innerWidth !== state.width ? true : false);
    const heightChanged = () =>
        window.innerHeight !== state.height ? true : false;
    const updateState = () => {
        setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    const setIt = () =>
        widthChanged() || heightChanged() ? updateState() : false;

    window.addEventListener('resize', debounce(setIt, 250));
    path = `/${window.location.pathname.split('/')[2]}`
    localStorage.setItem('path', path)
    
    return (
        <div className='containerBox'>
            
            <Router basename={base} history={history}>

                <div className='App'>
                    <div className='fadeIn'>
                        <Switch>
                            <Route
                                exact
                                path='/'
                                component={ROICalculator}
                            />
                            <Route
                                path='/ROICalculator'
                                render={(props) => (
                                    <ROICalculator />
                                )}
                            />
                            <Route
                                path='/MGrxROI'
                                render={(props) => (
                                    <ROICalculator />
                                )}
                            />
                        </Switch>
                    </div>
                </div>
            </Router>
        </div>
    );
}
export default App;