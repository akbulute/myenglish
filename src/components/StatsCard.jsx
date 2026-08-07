const StatsCard = ({ title, count, colorClass, bgClass, icon: Icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-all group ${bgClass}`}
    >
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <p className={`text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`}>{title}</p>
          <h3 className={`text-3xl font-bold text-gray-900 dark:text-white`}>{count}</h3>
        </div>
        <div className={`p-3 rounded-full bg-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
    </div>
  );
};

export default StatsCard;
