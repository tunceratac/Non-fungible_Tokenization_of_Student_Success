import React from 'react';
import { Navigate } from 'react-router-dom';

class LoginPage extends React.Component {
  state = {
    username: '',
    password: '',
    isAuthenticated: false
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    if (username === 'admin' && password === '0000') {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Username or password is incorrect');
    }
  }

  render() {
    if (this.state.isAuthenticated) {
      return <Navigate to='/upload' />
    }

    return (
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">User Name:</label>
          <input type="text" name="username" onChange={this.handleInputChange} required />

          <label htmlFor="password">Password:</label>
          <input type="password" name="password" onChange={this.handleInputChange} required />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginPage;
