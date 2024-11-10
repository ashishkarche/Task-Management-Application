import React, { useState, useEffect } from 'react';
import './SearchFilterBar.css';

const SearchFilterBar = ({ onSearch = () => {}, onFilterChange = () => {} }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    priority: '',
    deadline: '',
  });

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const updatedValue = selectedFilters[filterType] === value ? '' : value;
    const updatedFilters = { ...selectedFilters, [filterType]: updatedValue };
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Utility function to render filter options
  const renderFilterOption = (filterType, value, label) => {
    const isSelected = selectedFilters[filterType] === value;
    return (
      <div
        className={`filter-option ${isSelected ? 'selected' : ''}`}
        onClick={() => handleFilterChange(filterType, value)}
      >
        {label}
      </div>
    );
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-btn') && dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search Project"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <button
        className={`filter-btn ${dropdownOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
      >
        <span className="filter-icon">⚙️</span>
        Filter
        {dropdownOpen && (
          <div className="filter-dropdown">
            {renderFilterOption('status', 'To Do', 'Status: To Do')}
            {renderFilterOption('status', 'In Progress', 'Status: In Progress')}
            {renderFilterOption('priority', 'High', 'Priority: High')}
            {renderFilterOption('priority', 'Low', 'Priority: Low')}
            {renderFilterOption('deadline', 'Today', 'Deadline: Today')}
            {renderFilterOption('deadline', 'This Week', 'Deadline: This Week')}
          </div>
        )}
      </button>
    </div>
  );
};

export default SearchFilterBar;
