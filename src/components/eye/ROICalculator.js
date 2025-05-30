import { useState, useEffect } from 'react';
import initializeData from '../utils/InitializeData';
import SquarespaceFormIframe from './SquarespaceFormIframe';
// #e3964a, #76a947
const ROICalculator = () => {

    const [mode, setMode] = useState('dark');
    const [email, setEmail] = useState('example@email.com');
    //const [clinic, setClinic] = useState('Example Ophthalmology');
    const [patientsPerWeek, setPatientsPerWeek] = useState(50);
    const [convertedPct, setConvertedPct] = useState(5);
    const [ultraPct, setUltraPct] = useState(2);
    const [compressPct, setCompressPct] = useState(2);
    const [duoPct, setDuoPct] = useState(1);
    const [scrubPct, setScrubPct] = useState(2);
    const [showForm, setShowForm] = useState(false);
    const [isLease, setIsLease] = useState(false);

    const WEEKS_PER_YEAR = 52;
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [MGRX_SYSTEM_COST, setMGRX_SYSTEM_COST] = useState(15995);
    const [MGRX_SYSTEM_LEASE, setMGRX_SYSTEM_LEASE] = useState(600);
    const [pricePerTreatment, setPricePerTreatment] = useState(400);
    const pricePerUltra = 53;
    const pricePerCompress = 20;
    const pricePerDuo = 50;
    const pricePerScrub = 10;
    const maxPatientsPerWeek = 100;

    const formatCurrency = (amount) => {
        //if (typeof (amount) !== Number) return 'Zero'
        const currency = Math.round(amount).toLocaleString('en-US');
        if (currency.includes('-')) return `($${currency.replace('-', '')})`;
        return `$${currency}`;
    };

    const calculateProfit = ({
        convertedPct,
        pricePerTreatment,
        ultraPct,
        pricePerUltra,
        compressPct,
        pricePerCompress,
        duoPct,
        pricePerDuo,
        scrubPct,
        pricePerScrub,
        WEEKS_PER_YEAR,
        MGRX_SYSTEM_LEASE,
        MGRX_SYSTEM_COST
    }) => {

        const weeklyTreatmentTotal = convertedPct * pricePerTreatment;
        const monthlyTreatmentTotal = (weeklyTreatmentTotal * WEEKS_PER_YEAR) / 12;
        const yearlyTreatmentTotal = weeklyTreatmentTotal * WEEKS_PER_YEAR;
        const weeklyTreatmentProfit = formatCurrency(weeklyTreatmentTotal);
        const monthlyTreatmentProfit = formatCurrency(monthlyTreatmentTotal);
        const yearlyTreatmentProfit = formatCurrency(yearlyTreatmentTotal);

        const ultraWeeklyTotal = ultraPct * pricePerUltra;
        const ultraWeeklyProfit = formatCurrency(ultraWeeklyTotal);
        const compressWeeklyTotal = compressPct * pricePerCompress;
        const compressWeeklyProfit = formatCurrency(compressWeeklyTotal);
        const compressMonthlyProfit = formatCurrency((compressWeeklyTotal * WEEKS_PER_YEAR) / 12);
        const compressYearlyProfit = formatCurrency(compressWeeklyTotal * WEEKS_PER_YEAR);
        const duoWeeklyTotal = duoPct * pricePerDuo;
        const duoWeeklyProfit = formatCurrency(duoWeeklyTotal);
        const scrubProfit = scrubPct * pricePerScrub;

        const weeklyProductsTotal = ultraWeeklyTotal + compressWeeklyTotal + duoWeeklyTotal + scrubProfit;
        const weeklyTotal = weeklyTreatmentTotal + weeklyProductsTotal;
        const monthlyProductsTotal = (weeklyProductsTotal * WEEKS_PER_YEAR) / 12;
        const monthlyTotal = (weeklyTotal * WEEKS_PER_YEAR) / 12;
        const yearlyProductsTotal = weeklyProductsTotal * WEEKS_PER_YEAR;
        const yearlyTotal = weeklyTotal * WEEKS_PER_YEAR;
        const secondYearProductsTotal = yearlyProductsTotal * 1.15;
        const secondYearTotal = (yearlyTotal) * 1.15;
        const thirdYearProductsTotal = secondYearProductsTotal * 1.15;
        const thirdYearTotal = secondYearTotal * 1.15;

        const yearlyProductProfit = formatCurrency((weeklyProductsTotal) * WEEKS_PER_YEAR);
        const monthlyProductProfit = formatCurrency(monthlyProductsTotal);
        const secondYearProductsProfit = formatCurrency(secondYearProductsTotal);
        const thirdYearProductsProfit = formatCurrency(thirdYearProductsTotal);

        const weeklyProfit = formatCurrency(weeklyTotal);
        const monthlyProfit = formatCurrency(monthlyTotal);
        const yearlyProfit = formatCurrency(yearlyTotal);
        const secondYearProfit = formatCurrency(secondYearTotal);
        const thirdYearProfit = formatCurrency(thirdYearTotal);

        const netProfit = (weeklyTreatmentTotal * WEEKS_PER_YEAR);

        const SYSTEM_FIRST_YEAR_TOTAL = netProfit + (MGRX_SYSTEM_COST * -1);
        const SYSTEM_SECOND_YEAR_TOTAL = netProfit * 1.15; // 15% increase
        const SYSTEM_THIRD_YEAR_TOTAL = (netProfit * 1.15) * 1.15; // 15% increase

        const SYSTEM_FIRST_YEAR_PROFIT = formatCurrency(SYSTEM_FIRST_YEAR_TOTAL);
        const SYSTEM_SECOND_YEAR_PROFIT = formatCurrency(SYSTEM_SECOND_YEAR_TOTAL); // 15% increase
        const SYSTEM_THIRD_YEAR_PROFIT = formatCurrency(SYSTEM_THIRD_YEAR_TOTAL); // 15% increase

        const ROI_MONTHS = (
            MGRX_SYSTEM_COST /
            monthlyTreatmentTotal
        ).toFixed(2);

        const MGRX_LEASE_PAYMENT = MGRX_SYSTEM_LEASE;
        const yearlyLease = formatCurrency(-MGRX_LEASE_PAYMENT * 12);
        const MONTHLY_CREDIT_PERCENT = 0.25;
        const MONTHLY_CREDIT = monthlyProductsTotal * MONTHLY_CREDIT_PERCENT;
        const ADJUSTED_NET_LEASE_PAYMENT = MONTHLY_CREDIT - MGRX_LEASE_PAYMENT;
        
        const weeklyNetTotal = weeklyTotal + (ADJUSTED_NET_LEASE_PAYMENT/4);
        const monthlyNetTotal = monthlyTotal + ADJUSTED_NET_LEASE_PAYMENT;
        const yearlyNetTotal = yearlyTotal + (ADJUSTED_NET_LEASE_PAYMENT * 12);
        const secondYearNetTotal = secondYearTotal + (ADJUSTED_NET_LEASE_PAYMENT * 12);
        const thirdYearNetTotal = thirdYearTotal + (ADJUSTED_NET_LEASE_PAYMENT * 12);

        const monthlyNetProfit = formatCurrency(monthlyNetTotal);
        const yearlyNetProfit = formatCurrency(yearlyNetTotal);
        const secondYearNetProfit = formatCurrency(secondYearNetTotal);
        const thirdYearNetProfit = formatCurrency(thirdYearNetTotal);

        return {
            weeklyTreatmentProfit,
            monthlyTreatmentProfit,
            yearlyTreatmentProfit,
            ultraWeeklyTotal,
            ultraWeeklyProfit,
            compressWeeklyTotal,
            compressWeeklyProfit,
            compressMonthlyProfit,
            compressYearlyProfit,
            duoWeeklyTotal,
            duoWeeklyProfit,
            scrubProfit,
            monthlyProductProfit,
            yearlyProductProfit,
            weeklyProfit,
            monthlyProfit,
            yearlyProfit,
            weeklyTotal,
            monthlyTotal,
            yearlyTotal,
            weeklyProductsTotal,
            monthlyProductsTotal,
            yearlyProductsTotal,
            secondYearProductsTotal,
            secondYearProfit,
            secondYearTotal,
            secondYearProductsProfit,
            thirdYearProductsTotal,
            thirdYearTotal,
            thirdYearProductsProfit,
            thirdYearProfit,
            netProfit,
            SYSTEM_FIRST_YEAR_PROFIT,
            SYSTEM_SECOND_YEAR_PROFIT,
            SYSTEM_THIRD_YEAR_PROFIT,
            ROI_MONTHS,
            MGRX_LEASE_PAYMENT,
            yearlyLease,
            MONTHLY_CREDIT,
            ADJUSTED_NET_LEASE_PAYMENT,
            monthlyNetProfit,
            yearlyNetProfit,
            secondYearNetProfit,
            thirdYearNetProfit,
            weeklyNetTotal,
            monthlyNetTotal,
            yearlyNetTotal,
            secondYearNetTotal,
            thirdYearNetTotal,
            SYSTEM_FIRST_YEAR_TOTAL,
            SYSTEM_SECOND_YEAR_TOTAL,
            SYSTEM_THIRD_YEAR_TOTAL
        };
    };

    const [profit, setProfit] = useState(() =>
        calculateProfit({
            convertedPct,
            pricePerTreatment,
            ultraPct,
            pricePerUltra,
            compressPct,
            pricePerCompress,
            duoPct,
            pricePerDuo,
            scrubPct,
            pricePerScrub,
            WEEKS_PER_YEAR,
            MGRX_SYSTEM_COST,
            MGRX_SYSTEM_LEASE
        })
    );

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
    
    const background = () => (mode === 'lite') ? 'bg-white' : null;
    const headerBackground = () => (mode === 'lite') ? 'bg-black' : null;
    const containedHeaderBackground = () => (mode === 'lite') ? 'bg-tintedMedium' : null;

    useEffect(() => {
        //setProfit(calculateProfit());
    }, [patientsPerWeek]);

    useEffect(() => {
        const localMode = initializeData('mode', 'dark');
        setMode(localMode);
        //setProfit(calculateProfit());
    }, []);

    useEffect(() => {
        setProfit(
            calculateProfit({
                convertedPct,
                pricePerTreatment,
                ultraPct,
                pricePerUltra,
                compressPct,
                pricePerCompress,
                duoPct,
                pricePerDuo,
                scrubPct,
                pricePerScrub,
                WEEKS_PER_YEAR,
                MGRX_SYSTEM_COST,
                MGRX_SYSTEM_LEASE
            })
        );
    }, [
        convertedPct,
        pricePerTreatment,
        ultraPct,
        pricePerUltra,
        compressPct,
        pricePerCompress,
        duoPct,
        pricePerDuo,
        scrubPct,
        pricePerScrub,
        WEEKS_PER_YEAR,
        MGRX_SYSTEM_COST,
        MGRX_SYSTEM_LEASE,
        patientsPerWeek
    ]);

    const isROICalculator = window.location.pathname === '/roicalculator/ROICalculator';
    const isMGrxROI = window.location.pathname === '/roicalculator/MGrxROI';
    const isMGrxLease = window.location.pathname === '/roicalculator/MGrxLease';

    console.log('Is current path /ROICalculator:', window.location.pathname);
    console.log('isMGrxLease:', isMGrxLease);

    const EYE_EXAM_REVENUE = 105;
    const eyeExamsRequired = (total) => Math.ceil(total / EYE_EXAM_REVENUE);
    
    const ultraPrint = (!isROICalculator) ? '' : `<li>Patients buying Ultra Dry Eye Supplement weekly: ${ultraPct} X $${pricePerUltra}</li>`;
    const compressPrint = (!isROICalculator) ? '' : `<li>Patients buying Dry Eye Compress (microwavable) weekly: ${compressPct} X $${pricePerCompress}</li>`;
    const duoPrint = (!isROICalculator) ? '' : `<li>Patients buying Duo USB Compress weekly: ${duoPct} X $${pricePerDuo}</li>`;
    const scrubPrint = (!isROICalculator) ? '' : `<li>Patients buying Lid Scrub weekly: ${scrubPct} X $${pricePerScrub}</li>`;
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

    const purchasePrint = (!isMGrxROI) 
                            ? '' 
                            : `<div class='section'>
                                <h2>
                                    ${
                                        (isLease) 
                                        ? 'MGrx System Lease' 
                                        : 'MGrx System Purchase'
                                    }
                                </h2>
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
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? 'Payment' 
                                                    : 'MGrx System Purchase'
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? formatCurrency(-profit.MGRX_LEASE_PAYMENT) 
                                                    : formatCurrency(MGRX_SYSTEM_COST)
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.yearlyLease 
                                                    : ''
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>${(isLease) ? profit.yearlyLease : ''}</td>
                                            ${
                                                (isLease)
                                                ? `<td className='pt-10 pb-10'>${(isLease) ? profit.yearlyLease : ''}</td>`
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
                                                ? `<td className='pt-10 pb-10'>${profit.monthlyProfit}</td>`
                                                : ''
                                            }
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.yearlyProfit 
                                                    : profit.SYSTEM_FIRST_YEAR_PROFIT 
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.secondYearProfit
                                                    : profit.SYSTEM_SECOND_YEAR_PROFIT
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.thirdYearProfit
                                                    : profit.SYSTEM_THIRD_YEAR_PROFIT
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                            ${
                                                (isLease)
                                                ? ''
                                                : 'growth of 15% year over year'
                                            }
                                            </td>
                                        </tr>
                                        <tr>
                                            ${
                                                (isLease)
                                                ? `<td className='pt-10 pb-10'>Net Profit</td>`
                                                : `<td className='pt-10 pb-10'>ROI in Months</td>`
                                            }
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.monthlyNetProfit 
                                                    : profit.ROI_MONTHS
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.yearlyNetProfit
                                                    : ''
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.secondYearNetProfit
                                                    : ''
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease) 
                                                    ? profit.thirdYearNetProfit
                                                    : ''
                                                }
                                            </td>
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
                                                ? `<td className='pt-10 pb-10'>
                                                    ${eyeExamsRequired(profit.monthlyNetTotal)}
                                                </td>`
                                                : ''
                                            }

                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease)
                                                    ? eyeExamsRequired(profit.yearlyNetTotal)
                                                    : eyeExamsRequired(profit.SYSTEM_FIRST_YEAR_TOTAL)
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease)
                                                    ? eyeExamsRequired(profit.secondYearNetTotal)
                                                    : eyeExamsRequired(profit.SYSTEM_SECOND_YEAR_TOTAL)
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>
                                                ${
                                                    (isLease)
                                                    ? eyeExamsRequired(profit.thirdYearNetTotal)
                                                    : eyeExamsRequired(profit.SYSTEM_THIRD_YEAR_TOTAL)
                                                }
                                            </td>
                                            <td className='pt-10 pb-10'>National average for eye exam $105</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>`
    const profitSummary = `<div class='section'>
                            <h2>Profit Summary</h2>
                            <h3>Total Estimated:</h3>
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
                                        <td className='pt-10 pb-10'>
                                            ${profit.weeklyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.monthlyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.yearlyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'></td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Equivalent Number<br/>of Eye Exams:</td>
                                        <td className='pt-10 pb-10'>
                                            ${eyeExamsRequired(profit.weeklyTotal)}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${eyeExamsRequired(profit.monthlyTotal) }
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${eyeExamsRequired(profit.yearlyTotal)}
                                        </td>
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
                                        <td className='pt-10 pb-10'>
                                            ${profit.weeklyTreatmentProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.monthlyTreatmentProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.yearlyTreatmentProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>National average is $400 per treatment.</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Ultra Dry Eye</td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.ultraWeeklyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency((profit.ultraWeeklyTotal * WEEKS_PER_YEAR) / 12)}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency(profit.ultraWeeklyTotal * WEEKS_PER_YEAR)}
                                        </td>
                                        <td className='pt-10 pb-10'>$53 profit per bottle</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Dry Eye Compress (microwavable)</td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.compressWeeklyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.compressMonthlyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.compressYearlyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>$20 per Microwave Compress</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Duo USB Compress</td>
                                        <td className='pt-10 pb-10'>
                                            ${profit.duoWeeklyProfit}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency((profit.duoWeeklyTotal * WEEKS_PER_YEAR) / 12)}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency(profit.duoWeeklyTotal * WEEKS_PER_YEAR)}
                                        </td>
                                        <td className='pt-10 pb-10'>$50 per Duo Compress</td>
                                    </tr>
                                    <tr>
                                        <td className='pt-10 pb-10'>Lid Scrub</td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency(profit.scrubProfit)}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency((profit.scrubProfit * WEEKS_PER_YEAR) / 12)}
                                        </td>
                                        <td className='pt-10 pb-10'>
                                            ${formatCurrency(profit.scrubProfit * WEEKS_PER_YEAR)}
                                        </td>
                                        <td className='pt-10 pb-10'>$10 per Lid Scrub</td>
                                    </tr>
                                </tbody>
                            </table >
                        </div >`
    const leasePrint = (!isMGrxLease) 
                        ? '' 
                        : `<div>
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
                                            <td className='pt-10 pb-10'>${formatCurrency(-profit.MGRX_LEASE_PAYMENT)}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyLease}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyLease}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyLease}</td>
                                            <td className='pt-10 pb-10'></td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Monthly DE Product Purchases</td>
                                            <td className='pt-10 pb-10'>${profit.monthlyProductProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyProductProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyProductProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyProductProfit}</td>
                                            <td className='pt-10 pb-10'></td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Monthly Credit*</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.MONTHLY_CREDIT)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.MONTHLY_CREDIT * 12)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.MONTHLY_CREDIT * 12)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.MONTHLY_CREDIT * 12)}</td>
                                            <td className='pt-10 pb-10'>
                                                25% credit for DE Product Purchased the previous month, applied against the next months lease payment.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Net Lease Payment</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                            <td className='pt-10 pb-10'>${formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</td>
                                            <td className='pt-10 pb-10'></td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Monthly Profit</td>
                                            <td className='pt-10 pb-10'>${profit.monthlyProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.secondYearProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.thirdYearProfit}</td>
                                            <td className='pt-10 pb-10'>15% increase in profitability annually</td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Net Profit</td>
                                            <td className='pt-10 pb-10'>${profit.monthlyNetProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.yearlyNetProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.secondYearNetProfit}</td>
                                            <td className='pt-10 pb-10'>${profit.thirdYearNetProfit}</td>
                                            <td className='pt-10 pb-10'></td>
                                        </tr>
                                        <tr>
                                            <td className='pt-10 pb-10'>Equivalent Number<br/>of Eye Exams:</td>
                                            <td className='pt-10 pb-10'>${eyeExamsRequired(profit.monthlyNetTotal)}</td>
                                            <td className='pt-10 pb-10'>${eyeExamsRequired(profit.yearlyNetTotal)}</td>
                                            <td className='pt-10 pb-10'>${eyeExamsRequired(profit.secondYearNetTotal)}</td>
                                            <td className='pt-10 pb-10'>${eyeExamsRequired(profit.thirdYearNetTotal)}</td>
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
                    ${
                        (isMGrxLease) 
                        ? 'MGrx Lease and Rebate Program' 
                        : (isMGrxROI) 
                            ? 'MGrx Profitability Report' 
                            : 'Dry Eye Profitability Report'
                    }
                </h1>
                <div class='section'>
                    <h2>Overview</h2>
                    <p><strong>Weekly Dry Eye Patients:</strong> ${patientsPerWeek}</p>
                    <p><strong>Weekly Conversions:</strong></p>
                    <ul>
                        <li>
                            Patients Purchasing an MGrx Treatment weekly: ${convertedPct} X $${pricePerTreatment}
                        </li>
                        ${ultraPrint}
                        ${compressPrint}
                        ${duoPrint}
                        ${scrubPrint}
                    </ul>
                </div>
                ${profitPrint}
                ${
                    (isROICalculator) 
                    ? profitSummary 
                    : ''
                }
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
                                        MGrx Treatment weekly:
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
                                        Weekly:<br /> {profit.weeklyTreatmentProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Monthly:<br /> {profit.monthlyTreatmentProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Yearly:<br /> {profit.yearlyTreatmentProfit}
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
                                            Ultra Dry Eye:
                                        </div>
                                        <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                            Assumptions
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flexContainer containerBox'>
                                            <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                                Patients buying Ultra Dry Eye Supplement weekly: <span className='color-roiOrange size25 bold'>{ultraPct}</span> X {`$${Number(pricePerUltra).toLocaleString('en-US')}`}
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
                                        Weekly:<br /> {profit.ultraWeeklyProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Monthly:<br /> {formatCurrency((profit.ultraWeeklyTotal * WEEKS_PER_YEAR) / 12)}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Yearly:<br /> {formatCurrency(profit.ultraWeeklyTotal * WEEKS_PER_YEAR)}
                                    </div>
                                </div>
                            </div>
                            <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                <div className='flexContainer containerBox pb-15'>
                                    <div className='color-roiGreen contentLeft'>
                                        Dry Eye Compress (microwavable):
                                    </div>
                                    <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                        Assumptions
                                    </div>
                                </div>
                                <div>
                                    <div className='flexContainer containerBox'>
                                        <div className='flexColumn m-5 color-roiGreen contentLeft size15'>
                                            Patients buying Dry Eye Compress (microwavable) weekly: <span className='color-roiOrange size25 bold'>{compressPct}</span> X {`$${Number(pricePerCompress).toLocaleString('en-US')}`}
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
                                        Weekly:<br /> {profit.compressWeeklyProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Monthly:<br /> {profit.compressMonthlyProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Yearly:<br /> {profit.compressYearlyProfit}
                                    </div>
                                </div>
                            </div>
                            <div className='containerDetail brdr-ROIGreen mb-1 mt-10'>
                                <div className='flexContainer containerBox pb-15'>
                                    <div className='color-roiGreen contentLeft'>
                                        Duo USB Compress:
                                    </div>
                                    <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                        Assumptions
                                    </div>
                                </div>
                                <div>
                                    <div className='flexContainer containerBox'>
                                        <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                            Patients buying Duo USB Compress weekly: <span className='color-roiOrange size25 bold'>{duoPct}</span> X {`$${Number(pricePerDuo).toLocaleString('en-US')}`}
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
                                        Weekly:<br /> {profit.duoWeeklyProfit}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Monthly:<br /> {formatCurrency(profit.duoWeeklyTotal * WEEKS_PER_YEAR / 12)}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Yearly:<br /> {formatCurrency(profit.duoWeeklyTotal * WEEKS_PER_YEAR)}
                                    </div>
                                </div>
                            </div>
                            <div className={`containerDetail brdr-ROIGreen mb-1 mt-10 ${containedHeaderBackground()}`}>
                                <div className='flexContainer containerBox pb-15'>
                                    <div className='color-roiGreen contentLeft'>
                                        Lid Scrub:
                                    </div>
                                    <div className='flex2Column columnRightAlign mr-10 color-roiOrange size15 i'>
                                        Assumptions
                                    </div>
                                </div>
                                <div>
                                    <div className='containerBox flexContainer'>
                                        <div className='flexColumn m-5 color-roiGreen contentLeft size15' style={{ display: 'block', marginBottom: '0.5rem' }}>
                                            Patients buying Lid Scrub weekly: <span className='color-roiOrange size25 bold'>{scrubPct}</span> X {`$${Number(pricePerScrub).toLocaleString('en-US')}`}
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
                                        Weekly:<br /> {formatCurrency(profit.scrubProfit)}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Monthly:<br /> {formatCurrency(profit.scrubProfit * WEEKS_PER_YEAR / 12)}
                                    </div>
                                    <div className='columnCenterAlign flex3Column size15'>
                                        Yearly:<br /> {formatCurrency(profit.scrubProfit * WEEKS_PER_YEAR)}
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
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-profit.MGRX_LEASE_PAYMENT)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                    </div>
                                    <div className='flexContainer bg-lite'>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly DE Product Purchases</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.monthlyProductProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyProductProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyProductProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyProductProfit}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                    </div>
                                    <div className='flexContainer'>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Credit*</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.MONTHLY_CREDIT)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.MONTHLY_CREDIT * 12)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.MONTHLY_CREDIT * 12)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.MONTHLY_CREDIT * 12)}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                            25% credit for DE Product Purchased the previous month, applied against the next months lease payment.</div>
                                    </div>
                                    <div className='flexContainer bg-lite'>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Lease Payment</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(profit.ADJUSTED_NET_LEASE_PAYMENT * 12)}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark'></div>
                                    </div>
                                    <div className='flexContainer'>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.monthlyProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.secondYearProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.thirdYearProfit}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                            15% increase in profitability annually
                                        </div>
                                    </div>
                                    <div className='flexContainer bg-lite'>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Profit</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.monthlyNetProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyNetProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.secondYearNetProfit}</div>
                                        <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.thirdYearNetProfit}</div>
                                        <div className='flex6Column size12 color-roiOrange pb-10 pt-10 brdr-dark contentLeft pl-5'>
                                        </div>
                                    </div>
                                    <div className='flexContainer pt-10 pb-10 pl-10 color-roiOrange size15'>
                                        <div className='pt-5 m-1 contentLeft flex6Column'>
                                            Equivalent Number<br/>of Eye Exams:
                                        </div>
                                        <div className='pt-5 m-1 contentCenter flex6Column'>
                                            {eyeExamsRequired(profit.monthlyNetTotal)}
                                        </div>
                                        <div className='pt-5 m-1 contentCenter flex6Column'>
                                            {eyeExamsRequired(profit.yearlyNetTotal)}
                                        </div>
                                        <div className='pt-5 m-1 contentCenter flex6Column'>
                                            {eyeExamsRequired(profit.secondYearNetTotal)}
                                        </div>
                                        <div className='pt-5 m-1 contentCenter flex6Column'>
                                            {eyeExamsRequired(profit.thirdYearNetTotal)}
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
                                    className={`w-200 mt-10 containerDetail bg-roiOrange pt-5 ${!(isLease) ? 'brdr-yellow color-yellow' : 'color-white'} button p-10`}
                                >
                                    Purchase {(isLease) ? <div className='fl-right mr-10 bg-green w-20 h-20 r-5 p-5'></div> : <div className='fl-right mr-10 w-20 h-20 '>✅</div>}
                                </div>
                                <div
                                    title='Choose Lease'
                                    onClick={() => setIsLease(true)}
                                    className={`w-200 mt-10 containerDetail bg-roiOrange pt-5 ${(isLease) ? 'brdr-yellow color-yellow' : 'color-white'} button p-10`}
                                >
                                    Lease {(isLease) ? <div className='fl-right mr-10 w-20 h-20'>✅</div> : <div className='fl-right mr-10 bg-green w-20 h-20 r-5 p-5'></div>}
                                </div>
                                <div className={`color-white flex3Column p-10 size15`}>(Choose one)</div>
                            </div>
                            <div className='containerDetail brdr-ROIGreen mb-1 size15'>
                                <div className={`containerDetail pl-10 pb-10 pt-10 contentLeft color-roiOrange bold size25`}>
                                    MGrx System { (isLease) ? 'Lease' : 'Purchase' }
                                </div>
                                <div className='containerDetail'>
                                    <div className='flexContainer bg-roiGreen bold brdr-dark'>
                                        <div className='flex6Column pb-10 pt-10 pl-10 text-align-top contentLeft brdr-dark'>
                                            Category
                                        </div>
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
                                                MGrx System { (isLease) ? 'Lease Payment' : 'Purchase' }
                                            </div>
                                            <div>
                                                <input
                                                    type='text'
                                                    value={`$${(isLease) ? `-${Number(MGRX_SYSTEM_LEASE).toLocaleString('en-US')}` : Number(MGRX_SYSTEM_COST).toLocaleString('en-US')}`}
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
                                            <div className='size15 i pt-10'>
                                                (Input { (isLease) ? 'Lease Payment' : 'Purchase Price' })
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (isLease)
                                        ? <div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Payment</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{formatCurrency(-profit.MGRX_LEASE_PAYMENT)}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyLease}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Monthly Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.monthlyProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.secondYearProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.thirdYearProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'></div>
                                            </div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>Net Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.monthlyNetProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.yearlyNetProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.secondYearNetProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.thirdYearNetProfit}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark color-roiOrange size12 contentLeft pl-10'></div>
                                            </div>
                                        </div>
                                        : <div>
                                            <div className='flexContainer bg-lite'>
                                                <div className='flex6Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>Net Profit</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.SYSTEM_FIRST_YEAR_PROFIT}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.SYSTEM_SECOND_YEAR_PROFIT}</div>
                                                <div className='flex6Column pb-10 pt-10 brdr-dark'>{profit.SYSTEM_THIRD_YEAR_PROFIT}</div>
                                                            <div className='flex6Column pb-10 pt-10 brdr-dark color-roiOrange size12 contentLeft pl-10'>growth of 15% year over year</div>
                                            </div>
                                            <div className='flexContainer'>
                                                <div className='flex5Column pb-10 pt-10 pl-10 contentLeft text-align-top brdr-dark'>ROI in Months</div>
                                                <div className='flex5Column pb-10 pt-10 brdr-dark'>{profit.ROI_MONTHS}</div>
                                                <div className='flex5Column pb-10 pt-10 brdr-dark'></div>
                                                <div className='flex5Column pb-10 pt-10 brdr-dark'></div>
                                                <div className='flex5Column pb-10 pt-10 brdr-dark color-roiOrange'></div>
                                            </div>
                                        </div>
                                    }
                                    <div className='flexContainer pt-10 pb-10 pl-10 color-roiOrange size15'>
                                        <div className={`pt-5 m-1 contentLeft ${ (isLease) ? 'flex6Column' : 'flex5Column' }`}>
                                            Equivalent Number<br/>of Eye Exams:
                                        </div>
                                        {
                                            (isLease)
                                            ? <div className='pt-5 m-1 contentCenter flex6Column'>
                                                {eyeExamsRequired(profit.monthlyNetTotal)}
                                            </div> 
                                            : null 
                                        }
                                        {
                                            (isLease)
                                            ? <div className='pt-5 m-1 contentCenter flex6Column'>
                                                {eyeExamsRequired(profit.yearlyNetTotal)}
                                            </div>
                                            : <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                {eyeExamsRequired(profit.SYSTEM_FIRST_YEAR_TOTAL)}
                                            </div>
                                        }
                                        {
                                            (isLease)
                                            ? <div className='pt-5 m-1 contentCenter flex6Column'>
                                                {eyeExamsRequired(profit.secondYearNetTotal)}
                                            </div>
                                            : <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                {eyeExamsRequired(profit.SYSTEM_SECOND_YEAR_TOTAL)}
                                            </div>
                                        }
                                        {
                                            (isLease)
                                            ? <div className='pt-5 m-1 contentCenter flex6Column'>
                                                {eyeExamsRequired(profit.thirdYearNetTotal)}
                                            </div>
                                            : <div className={`pt-5 m-1 contentCenter ${(isLease) ? 'flex6Column' : 'flex5Column'}`}>
                                                {eyeExamsRequired(profit.SYSTEM_THIRD_YEAR_TOTAL)}
                                            </div>
                                        }
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
                                    Total Estimated:
                                </div>
                                <div className='containerDetail contentLeft flexContainer bg-lite pt-10 pb-10 pl-10'>
                                    <div className='m-1 contentLeft flex5Column size15 color-white'>
                                    </div>
                                    <div className='m-1 contentLeft flex5Column size15 color-white'>
                                        Weekly:<br /> {profit.weeklyProfit}
                                    </div>
                                    <div className='m-1 contentLeft flex5Column size15 color-white'>
                                        Monthly:<br /> {profit.monthlyProfit}
                                    </div>
                                    <div className='m-1 contentLeft flex5Column size15 color-white'>
                                        Yearly:<br /> {profit.yearlyProfit}
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
                                        {eyeExamsRequired(profit.weeklyTotal)}
                                    </div>
                                    <div className='pt-5 m-1 contentLeft flex5Column'>
                                        {eyeExamsRequired(profit.monthlyTotal)}
                                    </div>
                                    <div className='pt-5 m-1 contentLeft flex5Column'>
                                        {eyeExamsRequired(profit.yearlyTotal)}
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