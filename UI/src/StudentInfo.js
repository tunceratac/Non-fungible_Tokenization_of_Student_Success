import React from 'react';
import axios from 'axios';

class StudentInfo extends React.Component {
  state = {
    token: '',
    studentData: null,
  };

  handleInputChange = (event) => {
    this.setState({
      token: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  
    axios.get(`http://localhost:3001/api/Student/${this.state.token}`)
      .then(response => {
        this.setState({ studentData: response.data }, () => {
          if (!this.state.studentData) {
            alert("This NFT does not exist or has not been burned.");
          }
        });
      })
      .catch(error => {
        if (error.response) {
          console.error("Error fetching student data", error.response.data, error.response.status, error.response.headers);
        } else if (error.request) {
          console.error("No response received", error.request);
        } else {
          console.error("Error", error.message);
        }
      });
  }
  
  

  componentDidCatch(error, info) {
    console.error("Error in component:", error, "Info:", info);
  }

  render() {
    const { studentData } = this.state;

    return (
      <div className="content">
        <h1>Student Information</h1>
        <input type="text" className="input-text" placeholder="Enter Token ID" onChange={this.handleInputChange} />
        <button className="button" onClick={this.handleSubmit}>SEND</button>

        {studentData && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Mail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{studentData.ID}</td>
                <td>{studentData.Name} {studentData.LastName} </td>
                <td>{studentData.Phone}</td>
                <td>{studentData.Mail}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default StudentInfo;