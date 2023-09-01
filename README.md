# Student Achievement Certificate NFT Project

This project aims to convert student achievement certificates into NFTs (Non-Fungible Tokens). These NFTs do not include personal student information, only a unique code is included to track the certificates. By converting achievement certificates into NFTs, students can potentially earn scholarships by selling these NFTs. Additionally, buyers of these NFTs can showcase the number of scholarships they've awarded to students by publishing these NFTs. If these NFTs are burned, the last owner of the NFT can access the information of the student who received the certificate of achievement.

## Project Components

### React Frontend (client)

The frontend of the project is built using React.js and consists of the following components:

- **App.js:** This component handles routing for the project, including the login page and the CSV upload page.

- **LoginPage.js:** Provides a simple login form for administrators to access the CSV upload functionality.

- **CsvUploader.js:** Handles the CSV file upload, generation of PNG certificates, and interaction with the server to save data in the database. It also includes functionality for finding and updating burned and sold NFTs.

- **StudentInfo.js:** This component allows users to search for student information based on NFT token IDs. It communicates with the server to retrieve student data.

- **App.css:** Contains CSS styling for the frontend components.

### Node.js Backend (server)

The backend of the project is built using Node.js and includes the following key components:

- **server.js:** This is the main server file that handles database operations and serves as the API for various frontend requests. It manages the SQLite database and provides endpoints for inserting, updating, and retrieving data.

### Solidity Smart Contract (NFT.sol)

The Solidity smart contract serves as the backbone for creating and managing NFTs. It's deployed on a blockchain and allows the conversion of certificates into ERC-721 tokens (NFTs). The contract includes features like minting, setting costs, and pausing the contract.

## Getting Started

To run this project locally, follow these steps:

1. Clone this repository to your local machine.

2. Navigate to the `client` directory and run `npm install` to install frontend dependencies.

3. Navigate to the root directory and run `npm install` to install backend dependencies.

4. Ensure you have a running SQLite database and update the database configuration in `server.js` accordingly.

5. Start the backend server with `npm start` from the root directory.

6. Start the frontend development server with `npm start` from the `client` directory.

7. Access the project by opening a web browser and going to `http://localhost:3000`.

## Usage

- Access the project by visiting `http://localhost:3000`.
- Log in as an administrator using the provided credentials.
- Upload a CSV file containing student achievement data to generate NFT certificates.
- Search for student information by entering an NFT token ID in the Student Info section.
- Use the "FIND BURNED" and "FIND SOLD" buttons to find and update burned and sold NFTs.

## Technologies Used

- React.js
- Node.js
- SQLite
- Solidity (for Smart Contract)
- OpenZeppelin (for ERC-721 implementation)

## Contributors

- [Your Name](https://github.com/yourusername)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
