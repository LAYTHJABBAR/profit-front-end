import React, { useEffect, useState } from 'react';
import './App.css';
import data from './components/data';
import DataTable from './components/table';

function App() {
 
  
 return (
    <div className="App">
      <header className="App-header">
 <DashboardDataTable />      
      </header>
    </div>
  );
}

export default App;
