import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();

    console.log('a' > ' b');

    this.state = {
      tableData: [],
      tableColumns: [],
      sortBy: {
        columnName: 'sur_name',
        direction: 'asc'
      }
    };

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleSortBy = this.handleSortBy.bind(this);    
  }

  handleFileUpload(event) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      this.setUploadData(fileReader.result);
    }
    
    fileReader.readAsBinaryString(event.target.files[0]);
  }

  handleSortBy(columnName) {
    const direction = (this.state.sortBy.direction === 'asc') ? 'desc' : 'asc';
    const data = this.sortBy([...this.state.tableData], columnName, direction);
    this.setState({
      tableData: data,
      sortBy: {
        columnName,
        direction
      }
    });
  }

  setUploadData(content) {
    const lines = content.split('\n');
    const [columnNames, ...data] = lines;
    const columnNamesArray = columnNames.split(';');

    const dataStructured = data.map((line, lineKey) => {
      const lineSplitted = line.split(';');
      let lineStructured = {};

      columnNamesArray.forEach((column, columnKey) => {
        lineStructured[column] = lineSplitted[columnKey];
      });
      return lineStructured;
    });

    const {columnName, direction} = this.state.sortBy;
    const dataSorted = this.sortBy(dataStructured, columnName, direction);
    this.setState({
      tableData: dataSorted,
      tableColumns: columnNamesArray
    });
  }

  sortBy(data, columnName, direction = 'asc') {
    data.sort((a, b) => {
      if (a[columnName] > b[columnName]) {
        return (direction === 'asc') ? 1 : -1;
      }
      if (a[columnName] < b[columnName]) {
        return (direction === 'asc') ? -1 : 1;
      }

      return 0;
    });

    return data;
  }

  render() {
    const tableColumns = [...this.state.tableColumns];
    const tableHeaders = tableColumns.map((column, key) => (<th scope="col" key={key} onClick={() => this.handleSortBy(column)}>{column}</th>));
    const tableRows = this.state.tableData.map((rowData, rowIndex) => {
      const columns = tableColumns.map((columnName, columnKey) => {
        return(<td key={columnKey}>{rowData[columnName]}</td>);
      });
      return (
        <tr key={rowIndex}>
          {columns}
        </tr>
      );
    });
    
    return (
        <div>
            <h1>Issue Counter</h1>
            <div className="upload-container">
              <input type="file" onChange={this.handleFileUpload} />
              <hr />
            </div>
            <table className="table table-dark">
              <thead>
                <tr>
                  {tableHeaders}
                </tr>
              </thead>
              <tbody>
                {tableRows}
              </tbody>
            </table>
        </div>
    );
  }
}

export default App;
