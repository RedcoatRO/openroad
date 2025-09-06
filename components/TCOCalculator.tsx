import React, { useState, useMemo } from 'react';

// Tipuri pentru starea formularului
interface PurchaseInputs {
    price: string;
    downPayment: string;
    loanTerm: string;
    interestRate: string;
    insurance: string;
    maintenance: string;
    fuelConsumption: string;
    fuelPrice: string;
    kmPerMonth: string;
}

interface LeaseInputs {
    monthlyRate: string;
    kmPerMonth: string;
    fuelConsumption: string;
    fuelPrice: string;
}

const TCOCalculator: React.FC = () => {
    // Starea pentru input-urile de achiziție
    const [purchase, setPurchase] = useState<PurchaseInputs>({
        price: '30000', downPayment: '6000', loanTerm: '60', interestRate: '8',
        insurance: '100', maintenance: '40', fuelConsumption: '7',
        fuelPrice: '7.5', kmPerMonth: '1500',
    });
    // Starea pentru input-urile de leasing
    const [lease, setLease] = useState<LeaseInputs>({
        monthlyRate: '550', kmPerMonth: '1500', fuelConsumption: '7', fuelPrice: '7.5',
    });

    const handlePurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPurchase({ ...purchase, [e.target.name]: e.target.value });
    };

    const handleLeaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLease({ ...lease, [e.target.name]: e.target.value });
    };

    // Calcularea rezultatelor folosind useMemo pentru a evita recalcularea la fiecare render
    const results = useMemo(() => {
        // Parsează input-urile ca numere, cu fallback la 0
        const p = Object.fromEntries(Object.entries(purchase).map(([k, v]) => [k, parseFloat(v) || 0])) as Record<keyof PurchaseInputs, number>;
        const l = Object.fromEntries(Object.entries(lease).map(([k, v]) => [k, parseFloat(v) || 0])) as Record<keyof LeaseInputs, number>;

        // Calcul pentru Achiziție Directă
        const loanAmount = p.price - p.downPayment;
        const monthlyInterestRate = p.interestRate / 100 / 12;
        const loanPayment = loanAmount > 0 && monthlyInterestRate > 0
            ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, p.loanTerm)) / (Math.pow(1 + monthlyInterestRate, p.loanTerm) - 1)
            : (loanAmount / p.loanTerm || 0);
        const purchaseFuelCost = (p.kmPerMonth / 100) * p.fuelConsumption * p.fuelPrice;
        const purchaseMonthlyTotal = loanPayment + p.insurance + p.maintenance + purchaseFuelCost;
        const purchaseTotalCost = (loanPayment * p.loanTerm) + p.downPayment + ((p.insurance + p.maintenance + purchaseFuelCost) * p.loanTerm);

        // Calcul pentru Leasing Operațional
        const leaseFuelCost = (l.kmPerMonth / 100) * l.fuelConsumption * l.fuelPrice;
        const leaseMonthlyTotal = l.monthlyRate + leaseFuelCost;
        const leaseTotalCost = leaseMonthlyTotal * p.loanTerm; // Folosim același termen pentru comparație

        return {
            purchase: { monthly: purchaseMonthlyTotal, total: purchaseTotalCost, loan: loanPayment },
            lease: { monthly: leaseMonthlyTotal, total: leaseTotalCost, fuel: leaseFuelCost },
            term: p.loanTerm
        };
    }, [purchase, lease]);

    const formatCurrency = (value: number) => `€${value.toFixed(2)}`;

    const inputClass = "w-full p-2 border border-border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm";
    const labelClass = "block text-xs font-medium text-muted dark:text-gray-400 mb-1";

    return (
        <div className="bg-white dark:bg-gray-900/50 p-6 sm:p-8 rounded-card shadow-md max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coloana de input-uri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input-uri Achiziție */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="font-bold text-lg text-text-main dark:text-white">Detalii Achiziție Directă</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label className={labelClass}>Preț vehicul (€)</label><input type="number" name="price" value={purchase.price} onChange={handlePurchaseChange} className={inputClass} /></div>
                           <div><label className={labelClass}>Avans (€)</label><input type="number" name="downPayment" value={purchase.downPayment} onChange={handlePurchaseChange} className={inputClass} /></div>
                           <div><label className={labelClass}>Perioadă credit (luni)</label><input type="number" name="loanTerm" value={purchase.loanTerm} onChange={handlePurchaseChange} className={inputClass} /></div>
                           <div><label className={labelClass}>Dobândă anuală (%)</label><input type="number" name="interestRate" value={purchase.interestRate} onChange={handlePurchaseChange} className={inputClass} /></div>
                           <div><label className={labelClass}>Asigurare lunară (€)</label><input type="number" name="insurance" value={purchase.insurance} onChange={handlePurchaseChange} className={inputClass} /></div>
                           <div><label className={labelClass}>Mentenanță lunară (€)</label><input type="number" name="maintenance" value={purchase.maintenance} onChange={handlePurchaseChange} className={inputClass} /></div>
                        </div>
                    </div>
                     {/* Input-uri Leasing */}
                    <div className="space-y-4 md:col-span-2">
                         <h3 className="font-bold text-lg text-text-main dark:text-white">Detalii Leasing Operațional</h3>
                        <div><label className={labelClass}>Rată lunară (€)</label><input type="number" name="monthlyRate" value={lease.monthlyRate} onChange={handleLeaseChange} className={inputClass} /></div>
                    </div>
                     {/* Input-uri Comune */}
                    <div className="space-y-4 md:col-span-2">
                         <h3 className="font-bold text-lg text-text-main dark:text-white">Detalii Comune (Estimare combustibil)</h3>
                         <div className="grid grid-cols-3 gap-4">
                            <div><label className={labelClass}>Consum (L/100km)</label><input type="number" step="0.1" name="fuelConsumption" value={lease.fuelConsumption} onChange={e => { handlePurchaseChange(e); handleLeaseChange(e); }} className={inputClass} /></div>
                            <div><label className={labelClass}>Preț combustibil (€/L)</label><input type="number" step="0.1" name="fuelPrice" value={lease.fuelPrice} onChange={e => { handlePurchaseChange(e); handleLeaseChange(e); }} className={inputClass} /></div>
                            <div><label className={labelClass}>Km / lună</label><input type="number" name="kmPerMonth" value={lease.kmPerMonth} onChange={e => { handlePurchaseChange(e); handleLeaseChange(e); }} className={inputClass} /></div>
                        </div>
                    </div>
                </div>

                {/* Coloana de rezultate */}
                <div className="bg-bg-alt dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="font-bold text-xl text-text-main dark:text-white mb-4 text-center">Sumar Costuri</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Rezultate Achiziție */}
                        <div className="text-center p-4">
                            <h4 className="font-semibold text-text-main dark:text-white">Achiziție Directă</h4>
                            <p className="text-3xl font-bold text-text-main dark:text-white mt-2">{formatCurrency(results.purchase.monthly)}</p>
                            <p className="text-sm text-muted dark:text-gray-400">cost lunar</p>
                            <p className="text-sm text-muted dark:text-gray-400 mt-4">Cost total pe {results.term} luni: <strong className="text-text-main dark:text-white">{formatCurrency(results.purchase.total)}</strong></p>
                        </div>
                        {/* Rezultate Leasing */}
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-semibold text-primary">Leasing Operațional</h4>
                            <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(results.lease.monthly)}</p>
                            <p className="text-sm text-blue-800 dark:text-blue-200">cost lunar</p>
                             <p className="text-sm text-blue-800 dark:text-blue-200 mt-4">Cost total pe {results.term} luni: <strong>{formatCurrency(results.lease.total)}</strong></p>
                        </div>
                    </div>
                    {results.purchase.total > results.lease.total && (
                        <div className="mt-6 text-center bg-green-100 dark:bg-green-900/50 p-4 rounded-lg">
                             <p className="font-bold text-lg text-green-800 dark:text-green-200">
                                Economisești {formatCurrency(results.purchase.total - results.lease.total)} pe întreaga perioadă!
                             </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TCOCalculator;
