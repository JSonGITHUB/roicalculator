import { useState, useEffect } from 'react';
import initializeData from '../utils/InitializeData';
import SquarespaceFormIframe from './SquarespaceFormIframe';
// #e3964a, #76a947
const ROICalculator = () => {

    const [mode, setMode] = useState('dark');
    const [patientsPerWeek, setPatientsPerWeek] = useState(50);
    const [screenedPct, setScreenedPct] = useState(5);
    const [convertedPct, setConvertedPct] = useState(5);
    const [ultraPct, setUltraPct] = useState(2);
    const [compressPct, setCompressPct] = useState(2);
    const [duoPct, setDuoPct] = useState(1);
    const [scrubPct, setScrubPct] = useState(2);
    const [showForm, setShowForm] = useState(false);
    const [isLease, setIsLease] = useState(false); // State to toggle between Lease and Purchase

    const WEEKS_PER_YEAR = 52;

    /////////////////
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [userInput, setUserInput] = useState('');

    const openPrompt = () => {
        setIsPromptOpen(true);
    };

    const handleConfirm = (input) => {
        setUserInput(input);
        //setIsPromptOpen(false);
        //alert(`You entered: ${input}`);
    };

    const handleCancel = () => {
        //setIsPromptOpen(false);
    };
    const [pricePerScreened, setPricePerScreened] = useState(25);
    const [pricePerTreatment, setPricePerTreatment] = useState(400);
    const [pricePerUltra, setPricePerUltra] = useState(53);
    const [pricePerCompress, setPricePerCompress] = useState(20);
    const [pricePerDuo, setPricePerDuo] = useState(50);
    const [pricePerScrub, setPricePerScrub] = useState(10);
    const maxPatientsPerWeek = 100;
    const background = () => (mode === 'lite') ? 'bg-white' : null;
    const headerBackground = () => (mode === 'lite') ? 'bg-black' : null;
    const containedHeaderBackground = () => (mode === 'lite') ? 'bg-tintedMedium' : null;
    const calculateProfit = () => {

        const screenedProfit = screenedPct * pricePerScreened;
        const treatmentProfit = convertedPct * pricePerTreatment;
        const ultraProfit = ultraPct * pricePerUltra;
        const compressProfit = compressPct * pricePerCompress;
        const duoProfit = duoPct * pricePerDuo;
        const scrubProfit = scrubPct * pricePerScrub;
        //const weeklyProfit = screenedProfit + treatmentProfit + ultraProfit + compressProfit + duoProfit + scrubProfit;
        //const weeklyProfit = treatmentProfit + ultraProfit + compressProfit + duoProfit + scrubProfit;
        const weeklyProfit = treatmentProfit + ultraProfit;
        const monthlyProfit = weeklyProfit * WEEKS_PER_YEAR / 12;

        return {
            screenedProfit,
            treatmentProfit,
            ultraProfit,
            compressProfit,
            duoProfit,
            scrubProfit,
            weeklyProfit,
            monthlyProfit
        };
    };

    const profit = calculateProfit();
    const EYE_EXAM_REVENUE = 105;
    const totalAnnualProfit = profit.monthlyProfit * 12;
    const eyeExamsRequired = Math.ceil(totalAnnualProfit / EYE_EXAM_REVENUE);
    
    const formatCurrency = (amount) => {
        return `$${Math.round(Number(amount)).toLocaleString('en-US')}`;
    };

    useEffect(() => {
        //console.log(`patientsPerWeekly:<br/> ${formatCurrency(patientsPerWeek)}`);
    }, [patientsPerWeek]);

    useEffect(() => {
        const localMode = initializeData('mode', 'dark');
        setMode(localMode);
    }, []);

    const isROICalculator = window.location.pathname === '/roicalculator/ROICalculator';
    const isMGrxROI = window.location.pathname === '/roicalculator/MGrxROI';
    const isMGrxLease = window.location.pathname === '/roicalculator/MGrxLease';
    console.log('Is current path /ROICalculator:', window.location.pathname);
    console.log('isMGrxLease:', isMGrxLease);

    const MGRX_LEASE_PAYMENT = 600;
    const MONTHLY_DE_PRODUCT_PURCHASES = (profit.ultraProfit * 4) + (compressPct * 15) + (duoPct * 45) + (scrubPct * 15);
    //const MONTHLY_DE_PRODUCT_PURCHASES = (compressPct * 15) + (duoPct * 45) + (scrubPct * 15);
    const MONTHLY_CREDIT_PERCENT = 0.25;
    const MONTHLY_CREDIT = MONTHLY_DE_PRODUCT_PURCHASES * MONTHLY_CREDIT_PERCENT;
    const NET_LEASE_PAYMENT = MGRX_LEASE_PAYMENT - MONTHLY_CREDIT;
    //const MONTHLY_PRODUCT_PROFITS = (profit.ultraProfit + profit.compressProfit + profit.duoProfit + profit.scrubProfit) * 4;
    const ADJUSTED_NET_LEASE_PAYMENT = MONTHLY_CREDIT - MGRX_LEASE_PAYMENT;
    const MONTHLY_PROFIT = (profit.weeklyProfit * WEEKS_PER_YEAR / 12).toFixed(2);
    const FIRST_YEAR_PROFIT = MONTHLY_PROFIT * 12;
    const SECOND_YEAR_PROFIT = FIRST_YEAR_PROFIT * 1.15; // 15% increase
    const THIRD_YEAR_PROFIT = SECOND_YEAR_PROFIT * 1.15; // 15% increase
    const FIRST_YEAR_NET_PROFIT = FIRST_YEAR_PROFIT + NET_LEASE_PAYMENT * 12;
    const SECOND_YEAR_NET_PROFIT = SECOND_YEAR_PROFIT + NET_LEASE_PAYMENT * 12;
    const THIRD_YEAR_NET_PROFIT = THIRD_YEAR_PROFIT + NET_LEASE_PAYMENT * 12;
    const netProfit = (profit.treatmentProfit * WEEKS_PER_YEAR).toFixed(2);
    console.log(`netProfit: ${netProfit}`);

    const [MGRX_SYSTEM_COST, setMGRX_SYSTEM_COST] = useState(15995);
    const [MGRX_SYSTEM_LEASE, setMGRX_SYSTEM_LEASE] = useState(600);
    const MEIBOVUE_COST = 2900;
    const SYSTEM_FIRST_YEAR_PROFIT = Number(Number(netProfit) + (Number(MGRX_SYSTEM_COST) * -1));
    const SYSTEM_FIRST_YEAR_LEASE_PROFIT = Number(Number(netProfit) + (Number(MGRX_SYSTEM_LEASE * 12) * -1));
    const SYSTEM_SECOND_YEAR_PROFIT = netProfit; // 15% increase
    const SYSTEM_THIRD_YEAR_PROFIT = netProfit; // 15% increase
    const ROI_MONTHS = (
        MGRX_SYSTEM_COST /
        ((profit.treatmentProfit) * WEEKS_PER_YEAR / 12)
        //((profit.screenedProfit + profit.treatmentProfit) * WEEKS_PER_YEAR / 12)
    ).toFixed(2);
    //const ROI_LEASEMONTHS = (((MGRX_SYSTEM_LEASE * 12)) / ((profit.screenedProfit + profit.treatmentProfit) * WEEKS_PER_YEAR / 12)).toFixed(2);
    const ROI_LEASEMONTHS = (((MGRX_SYSTEM_LEASE * 12)) / ((profit.treatmentProfit) * WEEKS_PER_YEAR / 12)).toFixed(2);

    const annualTreatmentProfit = () => (((patientsPerWeek * pricePerTreatment) * WEEKS_PER_YEAR) / 12);
    const meibovuePrint = (!isROICalculator) ? '' : `<li> Screened for MGD(Meibovue): ${screenedPct} X $${pricePerScreened}</li >`;
    const ultraPrint = (!isROICalculator) ? '' : `<li>Buying Ultra Dry Eye Supplement: ${ultraPct} X $${pricePerUltra}</li>`;
    const compressPrint = (!isROICalculator) ? '' : `<li>Buying Dry Eye Compress (microwaveable): ${compressPct} X $${pricePerCompress}</li>`;
    const duoPrint = (!isROICalculator) ? '' : `<li>Buying Duo USB Compress: ${duoPct} X $${pricePerDuo}</li>`;
    const scrubPrint = (!isROICalculator) ? '' : `<li>Buying Lid Scrub: ${scrubPct} X $${pricePerScrub}</li>`;
    const sendEmail = (email, clinic, reportContent) => {
        const to = email;
        const subject = encodeURIComponent((isMGrxLease) ? 'MGrx Lease and Rebate Program' : (isMGrxROI) ? 'MGrx Profitability Calculator' : 'Dry Eye Profitability Report');
        const body = encodeURIComponent(`${(isMGrxLease) ? 'MGrx Lease and Rebate Program' : (isMGrxROI) ? 'MGrx Profitability Calculator' : 'Dry Eye Profitability Report'} Request\n\n${clinic}\n${email}\n${reportContent}`);
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }

    const CustomPrompt = ({
        isOpen,
        message,
        onConfirm,
        onCancel
    }) => {
        const [email, setEmail] = useState('example@email.com');
        const [clinic, setClinic] = useState('Example Ophthalmology');

        if (!isOpen) return null;

        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    <h3>{message}</h3>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    <div style={styles.buttons}>
                        <button onClick={() => onConfirm(email)} style={styles.button}>Confirm</button>
                        <button onClick={onCancel} style={styles.button}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        modal: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            width: '300px',
            textAlign: 'center',
        },
        input: {
            padding: '8px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '4px',
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        button: {
            padding: '8px 16px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
        }
    };

    const purchasePrint = (!isMGrxROI) ? '' : `<div class='section'>
        <h2>${(isLease) ? 'MGrx System Lease' : 'MGrx System Purchase'}</h2>
        <table>
            <thead className='pt-10 pb-10'>
                <tr>
                    <th className='pt-10 pb-10'>Category</th>
                    ${
                        (isLease)
                        ? `<th className='pt-10 pb-10'>Monthly Profit</th>`
                        : ''
                    }
                    <th className='pt-10 pb-10'>1st Year Profit</th>
                    <th className='pt-10 pb-10'>2nd Year Profit</th>
                    <th className='pt-10 pb-10'>3rd Year Profit</th>
                    <th className='pt-10 pb-10'>Assumptions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='pt-10 pb-10'>${isLease ? 'Payment' : 'MGrx System Purchase'}</td>
                    <td className='pt-10 pb-10'>
                        ${isLease ? formatCurrency(-MGRX_LEASE_PAYMENT) : formatCurrency(Number(MGRX_SYSTEM_COST))}
                    </td>
                    <td className='pt-10 pb-10'>${isLease ? formatCurrency(-MGRX_LEASE_PAYMENT * 12) : ''}</td>
                    <td className='pt-10 pb-10'>${isLease ? formatCurrency(-MGRX_LEASE_PAYMENT * 12) : ''}</td>
                    ${
                        (isLease)
                        ? `<td className='pt-10 pb-10'>${isLease ? formatCurrency(-MGRX_LEASE_PAYMENT * 12) : ''}</td>`
                        : ``
                    }
                    <td className='pt-10 pb-10'></td>
                </tr>
                <tr>
                    ${
                        (!isLease)
                        ? `<td className='pt-10 pb-10'>Net Profit</td>`
                        : `<td className='pt-10 pb - 10'>Monthly Profit</td>`
                    }
                    ${
                        (isLease)
                        ? `<td className='pt-10 pb-10'>${formatCurrency(FIRST_YEAR_PROFIT/12)}</td>`
                        : ''
                    }
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(FIRST_YEAR_PROFIT) : formatCurrency(SYSTEM_FIRST_YEAR_PROFIT) }</td>
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(SECOND_YEAR_PROFIT) : formatCurrency(SYSTEM_SECOND_YEAR_PROFIT)}</td>
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(THIRD_YEAR_PROFIT) : formatCurrency(SYSTEM_THIRD_YEAR_PROFIT)}</td>
                    <td className='pt-10 pb-10'></td>
                </tr>
                <tr>
                    ${
                        (!isLease)
                        ? `<td className='pt-10 pb-10'>ROI in Months</td>`
                        : `<td className='pt-10 pb-10'>Net Profit</td>`
                    }
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(Number(MONTHLY_PROFIT) + Number(ADJUSTED_NET_LEASE_PAYMENT)) : ROI_MONTHS}</td>
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(Number(FIRST_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12)):''}</td>
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(Number(SECOND_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12)):''}</td>
                    <td className='pt-10 pb-10'>${(isLease) ? formatCurrency(Number(THIRD_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12)):''}</td>
                    ${
                        (!isLease)
                        ? ``
                        : `<td className='pt-10 pb-10'></td>`
                    }
                    </tr>
                <tr>
                    <td className='pt-10 pb-10'>Equivalent Number<br/>of Eye Exams:</td>
                    ${
                        (isLease)
        ? `<td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(FIRST_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)/12).toString().replace('$', '')}</td>`
                        : ''
                    }
                    <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(FIRST_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                    <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(SECOND_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                    <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(THIRD_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                    <td className='pt-10 pb-10'>National average for eye exam $105</td>
                </tr>
            </tbody>
        </table>
    </div>`
    const profitSummary = `<div class='section'>
                            <h2>Profit Summary</h2>
                            <h3>Total Estimated Profit:</h3>
                            <table>
                                <thead className='pt-10 pb-10'>
                                    <tr>
                                        <th className='pt-10 pb-10'>Category</th>
                                        <th className='pt-10 pb-10'>Weekly Profit</th>
                                        <th className='pt-10 pb-10'>Monthly Profit</th>
                                        <th className='pt-10 pb-10'>Yearly Profit</th>
                                        <th className='pt-10 pb-10'>Assumptions</th>
                                    </tr>
                                </thead >
                                <tbody>
                                    <tr>
                                        <td className='pt-10 pb-10'></td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number(profit.weeklyProfit).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number(profit.monthlyProfit).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.monthlyProfit) * 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'></td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Equivalent Number<br/>of Eye Exams:</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number(eyeExamsRequired / 12 / 4).toFixed(2)).toString().replace('$', '')}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number(eyeExamsRequired / 12).toFixed(2)).toString().replace('$', '')}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number(eyeExamsRequired).toFixed(2)).toString().replace('$', '')}</td>
                                        <td className='pt-10 pb-10'>National average for eye exam $105</td>
                                    </tr>
                                </tbody>
                            </table >
                        </div >`
    
    const profitPrint = (!isROICalculator) ? '' : `<div class='section'>
                            <h2>Profit Breakdown</h2>
                            <table>
                                <thead className='pt-10 pb-10'>
                                    <tr>
                                        <th className='pt-10 pb-10'>Category</th>
                                        <th className='pt-10 pb-10'>Weekly Profit</th>
                                        <th className='pt-10 pb-10'>Monthly Profit</th>
                                        <th className='pt-10 pb-10'>Yearly Profit</th>
                                        <th className='pt-10 pb-10'>Assumptions</th>
                                    </tr>
                                </thead >
                                <tbody>
                                    <tr>
                                        <td className='pt-10 pb-10'>MGrx Treatment</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.treatmentProfit.toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.treatmentProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.treatmentProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>National average is $400 per treatment.</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Ultra Dry Eye</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.ultraProfit.toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.ultraProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.ultraProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>$53 profit per bottle</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Dry Eye Compress (microwaveable)</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.compressProfit.toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.compressProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.compressProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>$20 per Microwave Compress</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Duo USB Compress</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.duoProfit.toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.duoProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.duoProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>$50 per Duo Compress</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Lid Scrub</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.scrubProfit.toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(profit.scrubProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}</td>
                                        <td className='pt-10 pb-10'>${formatCurrency(Number((profit.scrubProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}</td>
                                        <td className='pt-10 pb-10'>$10 per Lid Scrub</td>
                                    </tr>
                                </tbody>
                            </table >
                        </div >`
    const leasePrint = (!isMGrxLease) ? '' : `<div>
                                            <h2>MGrx Lease</h2>
                                            <table>
                                                <thead className='pt-10 pb-10'>
                                                    <tr>
                                                        <th className='pt-10 pb-10'>Category</th>
                                                        <th className='pt-10 pb-10'>Monthly Profit</th>
                                                        <th className='pt-10 pb-10'>1st Year Profit</th>
                                                        <th className='pt-10 pb-10'>2nd Year Profit</th>
                                                        <th className='pt-10 pb-10'>3rd Year Profit</th>
                                                        <th className='pt-10 pb-10'>Assumptions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Payment</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(-MGRX_LEASE_PAYMENT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Monthly DE Product Purchases</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</td>
                                                        <td className='pt-10 pb-10'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Monthly Credit*</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_CREDIT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_CREDIT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_CREDIT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_CREDIT * 12)}</td>
                                                        <td className='pt-10 pb-10'>
                                                            25% credit for DE Product Purchased the previous month, applied against the next months lease payment.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Net Lease Payment</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(ADJUSTED_NET_LEASE_PAYMENT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                                        <td className='pt-10 pb-10'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Monthly Profit</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(MONTHLY_PROFIT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(FIRST_YEAR_PROFIT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(SECOND_YEAR_PROFIT)}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(THIRD_YEAR_PROFIT)}</td>
                                                        <td className='pt-10 pb-10'>15% increase in profitability annually</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Net Profit</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(MONTHLY_PROFIT) + Number(ADJUSTED_NET_LEASE_PAYMENT))}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(FIRST_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12))}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(SECOND_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12))}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(THIRD_YEAR_PROFIT) + (Number(ADJUSTED_NET_LEASE_PAYMENT) * 12))}</td>
                                                        <td className='pt-10 pb-10'></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='pt-10 pb-10'>Equivalent Number<br/>of Eye Exams:</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(eyeExamsRequired / 12).toFixed(2)).toString().replace('$', '')}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(FIRST_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(SECOND_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                                                        <td className='pt-10 pb-10'>${formatCurrency(Number(Math.ceil(THIRD_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}</td>
                                                        <td className='pt-10 pb-10'>National average for eye exam $105</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>`
    const getForm = () => {
        return <SquarespaceFormIframe />
    }

    const generatePrintableReport = () => {
        //const email = prompt('email:', 'account@email.com');
        //const clinic = prompt('clinic name:', 'Example Eye');
        //setIsPromptOpen(true);
        setShowForm(true);
        const reportWindow = window.open('', '_blank');
        const reportContent = `
            <html>
            <head>
                <title>Dry Eye Profitability Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #76a947; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                    th { background-color: #e3964a; color: white; }
                    .summary { margin-top: 20px; font-weight: bold; }
                    .section { margin-top: 30px; }
                </style>
            </head>
            <body>
                <h1>
                    ${(isMGrxLease) ? 'MGrx Lease and Rebate Program' : (isMGrxROI) ? 'MGrx Profitability Report' : 'Dry Eye Profitability Report'}
                </h1>
                <div class='section'>
                    <h2>Overview</h2>
                    <p><strong>Weekly Dry Eye Patients:</strong> ${patientsPerWeek}</p>
                    <p><strong>Weekly Conversions:</strong></p>
                    <ul>
                        <li>Patients Purchasing an MGrx Treatment: ${convertedPct} X $${pricePerTreatment}</li>
                        ${ultraPrint}
                        ${compressPrint}
                        ${duoPrint}
                        ${scrubPrint}
                    </ul>
                </div>
                ${profitPrint}
                ${(isROICalculator) ? profitSummary : ''}
                ${leasePrint}
                ${purchasePrint}
            </body>
            </html>
        `;
        //sendEmail(email, clinic, reportContent);
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
        reportWindow.print();
    };

    /* 
    useEffect(() => {
        
        const sendHeight = () => {
            const height = document.documentElement.scrollHeight;
            window.parent.postMessage({ type: 'setHeight', height }, '*');
        };
    
        sendHeight();
        window.addEventListener('resize', sendHeight);
    
        return () => window.removeEventListener('resize', sendHeight);
     }, []);
     */

    return (
        <div className={`${background()}`}>
            {
                (!isROICalculator && !isMGrxLease && !isMGrxROI)
                    ? null
                    : <div>
                        <div className={`containerDetail brdr-ROIOrange mb-1 p-20 color-roiOrange contentLeft size 25 bold ${headerBackground()}`}>
                            {
                                (isMGrxROI)
                                    ? 'MGrx Profitability Calculator'
                                    : (isMGrxLease)
                                        ? 'MGrx Lease and Rebate Program'
                                        : 'Dry Eye Profitability Calculator'
                            }
                        </div>
                        {
                            (!isROICalculator && !isMGrxLease && !isMGrxROI)
                                ? null
                                : <div className='containerDetail p-10 brdr-ROIGreen mb-1 mt-10'>
                                    <label className='m-5 color-roiGreen contentLeft' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                        Weekly Dry Eye Patients: {patientsPerWeek}
                                    </label>
                                    <div className='flexContainer'>
                                        <div className='flexColumn color-roiGreen p-5'>
                                            0
                                        </div>
                                        <div className='flex2Column color-roiGreen'>
                                            <input
                                                type='range'
                                                min='0'
                                                max={maxPatientsPerWeek}
                                                value={patientsPerWeek}
                                                onChange={(e) => setPatientsPerWeek(Number(e.target.value))}
                                                className='width-100-percent'
                                            />
                                        </div>
                                        <div className='flexColumn color-roiGreen p-5'>
                                            {maxPatientsPerWeek}
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            (!isROICalculator && !isMGrxLease && !isMGrxROI)
                                ? null
                                : <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                    <div>
                                        <div className='flexContainer containerBox pb-15'>
                                            <div className='color-roiGreen contentLeft'>
                                                MGrx Treatment Profit:
                                            </div>
                                            <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                Assumptions
                                            </div>
                                        </div>
                                        <div>
                                            <div className='flexContainer containerBox'>
                                                <div className='flexColumn m-5 color-roiGreen contentLeft size15'>
                                                    <div className=''>
                                                        <label>MGrx Treatment Charge:</label>
                                                        <input
                                                            type='text'
                                                            value={`$${Number(pricePerTreatment).toLocaleString('en-US')}`}
                                                            onChange={(e) => {
                                                                const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                                                                setPricePerTreatment(numericValue);
                                                            }}
                                                            className='containerDetail size25 bold contentLeft mt-10 color-dark ml-5 width-100 bg-white'
                                                        />
                                                        <div className='copyright contentRight mr-5'>input patient charge</div>
                                                    </div>
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                    National average is $400 per treatment.
                                                </div>
                                            </div>
                                            <div className='flexContainer containerBox'>
                                                <div className='flexColumn m-5 color-roiGreen contentLeft size15'>
                                                    Patients Purchasing an MGrx Treatment weekly: <span className='color-roiOrange size25 bold'>{convertedPct}</span>
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i pr-10'>
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    0
                                                </div>
                                                <div className='flex2Column color-roiGreen'>
                                                    <input
                                                        type='range'
                                                        min='0'
                                                        max={patientsPerWeek}
                                                        value={convertedPct}
                                                        onChange={(e) => setConvertedPct(Number(e.target.value))}
                                                        className='width-100-percent'
                                                    />
                                                </div>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    {patientsPerWeek}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='containerBox contentLeft flexContainer bg-lite'>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Weekly:<br /> {formatCurrency(profit.treatmentProfit.toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Monthly:<br /> {formatCurrency(Number((profit.treatmentProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Yearly:<br /> {formatCurrency(Number(profit.treatmentProfit * WEEKS_PER_YEAR).toFixed(2))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            (!isROICalculator)
                                ? null
                                : <div>
                                    <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                        <div>
                                            <div className='flexContainer containerBox pb-15'>
                                                <div className='flex2Column color-roiGreen contentLeft'>
                                                    Ultra Dry Eye Profit:
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                    Assumptions
                                                </div>
                                            </div>
                                            <div>
                                                <div className='flexContainer containerBox'>
                                                    <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                                        Buying Ultra Dry Eye Supplement: <span className='color-roiOrange size25 bold'>{ultraPct}</span> X {`$${Number(pricePerUltra).toLocaleString('en-US')}`}
                                                    </div>
                                                    <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                        National average is $53/bottle.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flexContainer'>
                                            <div className='flexColumn color-roiGreen p-5'>
                                                0
                                            </div>
                                            <div className='flex2Column color-roiGreen'>
                                                <input
                                                    type='range'
                                                    min='0'
                                                    max={patientsPerWeek}
                                                    value={ultraPct}
                                                    onChange={(e) => setUltraPct(Number(e.target.value))}
                                                    className='width-100-percent'
                                                />
                                            </div>
                                            <div className='flexColumn color-roiGreen p-5'>
                                                {patientsPerWeek}
                                            </div>
                                        </div>
                                        <div className='containerBox contentLeft flexContainer bg-lite'>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Weekly:<br /> {formatCurrency(profit.ultraProfit.toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Monthly:<br /> {formatCurrency(profit.ultraProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Yearly:<br /> {formatCurrency(Number((profit.ultraProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                        <div className='flexContainer containerBox pb-15'>
                                            <div className='color-roiGreen contentLeft'>
                                                Dry Eye Compress (microwaveable) Profit:
                                            </div>
                                            <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                Assumptions
                                            </div>
                                        </div>
                                        <div>
                                            <div className='flexContainer containerBox'>
                                                <div className='flexColumn m-5 color-roiGreen contentLeft size15'>
                                                    Buying Dry Eye Compress (microwaveable): <span className='color-roiOrange size25 bold'>{compressPct}</span> X {`$${Number(pricePerCompress).toLocaleString('en-US')}`}
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                    National average is $20 per compress.
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    0
                                                </div>
                                                <div className='flex2Column color-roiGreen'>
                                                    <input
                                                        type='range'
                                                        min='0'
                                                        max={patientsPerWeek}
                                                        value={compressPct}
                                                        onChange={(e) => setCompressPct(Number(e.target.value))}
                                                        className='width-100-percent'
                                                    />
                                                </div>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    {patientsPerWeek}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='containerBox contentLeft flexContainer bg-lite'>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Weekly:<br /> {formatCurrency(profit.compressProfit.toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Monthly:<br /> {formatCurrency(profit.compressProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Yearly:<br /> {formatCurrency(Number((profit.compressProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                        <div className='flexContainer containerBox pb-15'>
                                            <div className='color-roiGreen contentLeft'>
                                                Duo USB Compress Profit:
                                            </div>
                                            <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                Assumptions
                                            </div>
                                        </div>
                                        <div>
                                            <div className='flexContainer containerBox'>
                                                <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                                    Buying Duo USB Compress: <span className='color-roiOrange size25 bold'>{duoPct}</span> X {`$${Number(pricePerDuo).toLocaleString('en-US')}`}
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                    National average is $50 per Duo Compress.
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    0
                                                </div>
                                                <div className='flex2Column color-roiGreen'>
                                                    <input
                                                        type='range'
                                                        min='0'
                                                        max={patientsPerWeek}
                                                        value={duoPct}
                                                        onChange={(e) => setDuoPct(Number(e.target.value))}
                                                        className='width-100-percent'
                                                    />
                                                </div>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    {patientsPerWeek}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='containerBox contentLeft flexContainer bg-lite'>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Weekly:<br /> {formatCurrency(profit.duoProfit.toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Monthly:<br /> {formatCurrency(profit.duoProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Yearly:<br /> {formatCurrency(Number((profit.duoProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`containerDetail brdr-ROIGreen mb-1 mt-10 ${containedHeaderBackground()}`}>
                                        <div className='flexContainer containerBox pb-15'>
                                            <div className='color-roiGreen contentLeft'>
                                                Lid Scrub Profit:
                                            </div>
                                            <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                Assumptions
                                            </div>
                                        </div>
                                        <div>
                                            <div className='containerBox flexContainer'>
                                                <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                                    Buying Lid Scrub: <span className='color-roiOrange size25 bold'>{scrubPct}</span> X {`$${Number(pricePerScrub).toLocaleString('en-US')}`}
                                                </div>
                                                <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                                    National average is $10 per Lid Scrub.
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    0
                                                </div>
                                                <div className='flex2Column color-roiGreen'>
                                                    <input
                                                        type='range'
                                                        min='0'
                                                        max={patientsPerWeek}
                                                        value={scrubPct}
                                                        onChange={(e) => setScrubPct(Number(e.target.value))}
                                                        className='width-100-percent'
                                                    />
                                                </div>
                                                <div className='flexColumn color-roiGreen p-5'>
                                                    {patientsPerWeek}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='containerBox contentLeft flexContainer bg-lite'>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Weekly:<br /> {formatCurrency(profit.scrubProfit.toFixed(2))}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Monthly:<br /> {formatCurrency(profit.scrubProfit.toFixed(2) * WEEKS_PER_YEAR / 12)}
                                            </div>
                                            <div className='columnCenterAlign flex3Column size15'>
                                                Yearly:<br /> {formatCurrency(Number((profit.scrubProfit * WEEKS_PER_YEAR) / 12).toFixed(2))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            (isMGrxLease)
                                ? <div>
                                    <div className='containerDetail brdr-ROIGreen mb-1 mt-10 size15'>
                                        <div className={`containerDetail pl-10 pb-10 pt-10 contentLeft color-roiOrange size25 bold`}>
                                            MGrx Lease
                                        </div>
                                        <div className='containerDetail'>
                                            <div className='flexContainer bg-roiGreen bold brdr-dark'>
                                                <div className='flex6Column pb-10 pt-10 pl-10 text-align-top contentLeft brdr-dark'>Category</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>1st Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>2nd Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>3rd Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>
                                                    Assumptions
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Payment</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                            </div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly DE Product Purchases</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_DE_PRODUCT_PURCHASES * 12)}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Credit*</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_CREDIT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_CREDIT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_CREDIT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_CREDIT * 12)}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                                    25% credit for DE Product Purchased the previous month, applied against the next months lease payment.</div>
                                            </div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Lease Payment</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(ADJUSTED_NET_LEASE_PAYMENT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_PROFIT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(FIRST_YEAR_PROFIT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SECOND_YEAR_PROFIT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(THIRD_YEAR_PROFIT)}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                                    15% increase in profitability annually
                                                </div>
                                            </div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(Number(MONTHLY_PROFIT) + Number(ADJUSTED_NET_LEASE_PAYMENT))}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(FIRST_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SECOND_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(THIRD_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                                </div>
                                            </div>
                                            <div className='flexContainer pt-10 pb-10 pl-10 color-roiOrange size15'>
                                                <div className='pt-5 m-1 contentLeft flex6Column'>
                                                    Equivalent Number<br/>of Eye Exams:
                                                </div>
                                                <div className='pt-5 m-1 contentCenter flex6Column'>
                                                    {formatCurrency(Number(eyeExamsRequired / 12).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className='pt-5 m-1 contentCenter flex6Column'>
                                                    {formatCurrency(Number(Math.ceil(FIRST_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className='pt-5 m-1 contentCenter flex6Column'>
                                                    {formatCurrency(Number(Math.ceil(SECOND_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className='pt-5 m-1 contentCenter flex6Column'>
                                                    {formatCurrency(Number(Math.ceil(THIRD_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className='pt-5 m-1 contentLeft flex6Column'>
                                                    National average for eye exam $105
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                        {
                            (isMGrxLease || isROICalculator)
                                ? null
                                : <div>
                                    <div className='containerDetail pt-20 pb-20 contentLeft'>
                                       <div
                                            title='Choose Purchase'
                                            onClick={() => setIsLease(false)}
                                        className={`w-200 mt-10 containerDetail bg-roiOrange pt-5 ${!isLease ? 'brdr-yellow color-yellow' : 'color-white'} button p-10`}
                                        >
                                        Purchase {isLease ? <div className='fl-right mr-10 bg-green w-20 h-20 r-5 p-5'></div> : <div className='fl-right mr-10 w-20 h-20 '>✅</div>}
                                        </div>
                                        <div
                                            title='Choose Lease'
                                            onClick={() => setIsLease(true)}
                                        className={`w-200 mt-10 containerDetail bg-roiOrange pt-5 ${isLease ? 'brdr-yellow color-yellow' : 'color-white'} button p-10`}
                                        >
                                        Lease {isLease ? <div className='fl-right mr-10 w-20 h-20'>✅</div> : <div className='fl-right mr-10 bg-green w-20 h-20 r-5 p-5'></div>}
                                        </div>
                                        <div className={`color-white flex3Column p-10 size15`}>(Choose one)</div>
                                    </div>
                                    <div className='containerDetail brdr-ROIGreen mb-1 size15'>
                                        <div className={`containerDetail pl-10 pb-10 pt-10 contentLeft color-roiOrange bold size25`}>
                                            MGrx System {isLease ? 'Lease' : 'Purchase'}
                                        </div>
                                        <div className='containerDetail'>
                                            <div className='flexContainer bg-roiGreen bold brdr-dark'>
                                                <div className='flex6Column pb-10 pt-10 pl-10 text-align-top contentLeft brdr-dark'>Category</div>
                                                {
                                                    (isLease) 
                                                    ? <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div> 
                                                    : ''
                                                }
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>1st Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>2nd Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>3rd Year Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>
                                                    Assumptions
                                                </div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex2Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>
                                                    <div className='color-roiOrange bold size25'>
                                                        MGrx System {isLease ? 'Lease Payment' : 'Purchase'}
                                                    </div>
                                                    <div>
                                                        <input
                                                            type='text'
                                                            value={`$${isLease ? `-${Number(MGRX_SYSTEM_LEASE).toLocaleString('en-US')}` : Number(MGRX_SYSTEM_COST).toLocaleString('en-US')}`}
                                                            onChange={(e) => {
                                                                const numericValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                                                                if (isLease) {
                                                                    setMGRX_SYSTEM_LEASE(numericValue);
                                                                } else {
                                                                    setMGRX_SYSTEM_COST(numericValue);
                                                                }

                                                            }}
                                                            className='containerDetail size20 bold contentLeft mt-10 bg-white color-dark'
                                                        />
                                                    </div>
                                                    <div className='size15 i pt-10'>(Input {isLease ? 'Lease Payment' : 'Purchase Price'})</div>
                                                </div>
                                            </div>
                                            {
                                                (isLease)
                                                    ? <div>
                                                        <div className='flexContainer bg-lite'>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>Payment</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-MGRX_LEASE_PAYMENT * 12)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                                        </div>
                                                        <div className='flexContainer'>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(MONTHLY_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(FIRST_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SECOND_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(THIRD_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                                        </div>
                                                        <div className='flexContainer bg-lite'>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Profit</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(Number(MONTHLY_PROFIT) + Number(ADJUSTED_NET_LEASE_PAYMENT))}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(FIRST_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SECOND_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(THIRD_YEAR_PROFIT + (ADJUSTED_NET_LEASE_PAYMENT * 12))}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark color-roiOrange size12 contentLeft pl-10'>
                                                            </div>
                                                        </div>
                                                        {/*
                                                        <div className='flexContainer'>
                                                            <div className='flex6Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>ROI in Months</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{ROI_LEASEMONTHS}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark color-roiOrange'>
                                                            </div>
                                                        </div>
                                                        */}
                                                    </div>
                                                    : <div>
                                                        <div className='flexContainer bg-lite'>
                                                            <div className='flex6Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>Net Profit</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SYSTEM_FIRST_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SYSTEM_SECOND_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(SYSTEM_THIRD_YEAR_PROFIT)}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark color-roiOrange size12 contentLeft pl-10'>
                                                            </div>
                                                        </div>
                                                        <div className='flexContainer'>
                                                            <div className='flex5Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>ROI in Months</div>
                                                            <div className='flex5Column pb-10 pt-10 brdr-dark'>{ROI_MONTHS}</div>
                                                            <div className='flex5Column pb-10 pt-10 brdr-dark'></div>
                                                            <div className='flex5Column pb-10 pt-10 brdr-dark'></div>
                                                            <div className='flex5Column pb-10 pt-10 brdr-dark color-roiOrange'>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                            <div className='flexContainer pt-10 pb-10 pl-10 color-roiOrange size15'>
                                                <div className={`pt-5 m-1 contentLeft ${(isLease)?'flex6Column':'flex5Column'}`}>
                                                    Equivalent Number<br/>of Eye Exams:
                                                </div>
                                                {
                                                    (isLease)
                                                    ? <div className='pt-5 m-1 contentCenter flex6Column'>
                                                        {formatCurrency(Number(eyeExamsRequired / 12).toFixed(2)).toString().replace('$', '')}
                                                    </div> 
                                                    : null 
                                                }
                                                <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                    {formatCurrency(Number(Math.ceil(FIRST_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                    {formatCurrency(Number(Math.ceil(SECOND_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                    {formatCurrency(Number(Math.ceil(THIRD_YEAR_PROFIT / EYE_EXAM_REVENUE)).toFixed(2)).toString().replace('$', '')}
                                                </div>
                                                <div className={`pt-5 m-1 contentLeft ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                    National average for eye exam $105
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        {
                            (!isROICalculator)
                            ? null
                            : <div className='containerDetail brdr-ROIOrange mb-1 mt-10'>
                                <div className={`containerDetail pl-10 pb-20 pt-20 contentLeft color-roiOrange`}>Profit Summary</div>
                                <div className='containerDetail m-1'>
                                    <div className={`pl-5 pt-10 pb-10 color-roiGreen contentLeft ${headerBackground()}`}>
                                        Total Estimated Profit:
                                    </div>
                                    <div className='containerDetail contentLeft flexContainer bg-lite pt-10 pb-10 pl-10'>
                                        <div className='m-1 contentLeft flex5Column size15 color-white'>
                                        </div>
                                        <div className='m-1 contentLeft flex5Column size15 color-white'>
                                            Weekly:<br /> {formatCurrency(Number(profit.weeklyProfit).toFixed(2))}
                                        </div>
                                        <div className='m-1 contentLeft flex5Column size15 color-white'>
                                            Monthly:<br /> {formatCurrency(Number(profit.monthlyProfit).toFixed(2))}
                                        </div>
                                        <div className='m-1 contentLeft flex5Column size15 color-white'>
                                            Yearly:<br /> {formatCurrency(Number(profit.monthlyProfit * 12).toFixed(2))}
                                        </div>
                                        <div className='m-1 contentLeft flex5Column size15'>
                                            Assumptions
                                        </div>
                                    </div>
                                    <div className='flexContainer pt-10 pb-10 pl-10 color-roiOrange size15'>
                                        <div className='pt-5 m-1 contentLeft flex5Column'>
                                            Equivalent Number<br/>of Eye Exams:
                                        </div>
                                        <div className='pt-5 m-1 contentLeft flex5Column'>
                                            {formatCurrency(Number(eyeExamsRequired/12/4).toFixed(2)).toString().replace('$', '')}
                                        </div>
                                        <div className='pt-5 m-1 contentLeft flex5Column'>
                                            {formatCurrency(Number(eyeExamsRequired/12).toFixed(2)).toString().replace('$', '')}
                                        </div>
                                        <div className='pt-5 m-1 contentLeft flex5Column'>
                                            {formatCurrency(Number(eyeExamsRequired).toFixed(2)).toString().replace('$', '')}
                                        </div>
                                        <div className='pt-5 m-1 contentLeft flex5Column'>
                                            National average for eye exam $105
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div onClick={generatePrintableReport} className='containerDetail brdr-ROIOrange mb-1 mt-10 button bg-roiOrange color-white p-20'>
                            Print/Email Report
                        </div>
                        {
                            (showForm)
                                ? null /*getForm()*/
                                : null
                        }
                    </div>
            }
            <div>
                <CustomPrompt
                    isOpen={isPromptOpen}
                    message="Dry Eye Profitability Report Request"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    )
};

export default ROICalculator;