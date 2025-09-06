
import React from 'react';

interface KPICardProps {
    title: string;
    value: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-soft">
            <h3 className="text-sm font-medium text-muted">{title}</h3>
            <p className="text-3xl font-semibold text-text-main mt-1">{value}</p>
        </div>
    );
};

export default KPICard;
