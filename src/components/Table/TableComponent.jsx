import React from 'react';
import './TableComponent.css';

const TableComponent = ({ headers, data, renderRow }) => {
  return (
    <table className="management-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>{renderRow(item)}</tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
