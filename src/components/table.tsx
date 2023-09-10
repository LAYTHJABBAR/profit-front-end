// src/DataTable.tsx
import React, { useState, ChangeEvent } from "react";

const DataTable: React.FC<any> = () => {
  const [filteredCity, setFilteredCity] = useState<string>("");

  // const handleCityFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   setFilteredCity(event.target.value);
  // };

  // const filteredData = filteredCity
  //   ? data.filter((row: any) => row.city === filteredCity)
  //   : data;

  return (
    <div>
      <label htmlFor="cityFilter">Filter by City:</label>
      <select id="cityFilter" onChange={handleCityFilterChange}>
        <option value="">All</option>
        {/* Add options for unique cities in your dataset */}
        {/* Example: <option value="Calgary">Calgary</option> */}
      </select>
      <table>
        <thead>
          <tr>
            <th>Postal Code FSA</th>
            <th>City</th>
            <th>Completed # of Jobs</th>
            <th>Completed Revenue</th>
            <th>Average Revenue Per Job</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row: any, index: number) => (
            <tr key={index}>
              <td>{row.postalCode}</td>
              <td>{row.city}</td>
              <td>{row.completedJobs}</td>
              <td>{row.completedRevenue}</td>
              <td>{row.averageRevenuePerJob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
