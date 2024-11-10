import React, { useState, useEffect } from 'react';
import TaskBoard from './components/TaskBoard';
import SearchFilterBar from './components/SearchFilterBar';
import Loader from './components/Loader';  
import './App.css';

function App() {
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);  

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false); 
    }, 2000);
  }, []);

  return (
    <div className="App">
      {isLoading ? <Loader /> : (
        <>
          <SearchFilterBar onFilterChange={handleFilterChange} />
          <TaskBoard filter={filter} />
        </>
      )}
    </div>
  );
}

export default App;
