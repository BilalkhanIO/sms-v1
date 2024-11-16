import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ title, value, trend, icon: Icon, color = 'indigo' }) => {
  const isPositive = trend >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(trend)}% from last month</span>
          </div>
        </div>
      )}
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.number,
  icon: PropTypes.elementType,
  color: PropTypes.string,
};

export default StatsCard; 