const MenuCategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-dark-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-4 space-x-4 scrollbar-hide">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === null
                ? 'bg-primary text-white'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            All Items
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategoryTabs;
