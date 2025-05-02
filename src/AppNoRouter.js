import { useState } from 'react';
import debounce from './components/utils/Debouncer';
import ROICalculator from './components/eye/ROICalculator'; 
import './assets/css/App.css';
import Route from './components/utils/Route';
import initializeData from './components/utils/InitializeData';

export default ({ 
    props 
}) => {

    const [ width, setWidth ] = useState(window.innerWidth);
    const [ height, setHeight ] = useState(window.innerHeight);

    const widthChanged = () => (window.innerWidth !== width) ? true : false;
    const heightChanged = () => (window.innerHeight !== height) ? true : false;

    const updateState = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }
    const setIt = () => (widthChanged() || heightChanged()) ? updateState() : false;
    
    window.addEventListener('resize', debounce(setIt, 250));

    const logIdExists = (window.location.search.includes('logId')) ? true : false;
    const startIndex = () => window.location.search.indexOf('logId=')+6;
    const endIndex = () => window.location.search.length;
    const getLogId = () => window.location.search.substring(startIndex(), endIndex());
    const logId = (logIdExists) ? getLogId() : initializeData('logId', null);

    return (
        <div>
            <div className='App'>
                <div className='fadeIn'>
                    <Route path='/'>
                        <ROICalculator />
                    </Route>
                    <Route path='/ROICalculator'><ROICalculator /></Route>
                    <Route path='/MGrxROI'><ROICalculator /></Route>
                </div>
             </div>
        </div>
    )
}