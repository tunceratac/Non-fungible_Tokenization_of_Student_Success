import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import axios from 'axios';

import iyteBackground from './iyte.png'; 

export default function CsvUploader() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState(null);

    const handleFileChange = (evt) => {
        let file = evt.target.files[0];
        if (file) {
            setFilename(file.name);
            setFile(file);
        } else {
            setFilename(null);
            setFile(null);
        }
    };

    const handleImport = () => {
        if (!file) {
            alert("Please select a CSV file first.");
            return;
        }
        let reader = new FileReader();
        reader.onload = async function(e) {
            const rows = e.target.result.split('\n');
            const fields = ["Honor", "CENG415", "CENG416"]; 
            for(let i=0; i<rows.length; i++) {
                const cells = rows[i].split(',');
                if (cells.length > 0) {
                    const ogrNo = cells[0].trim();
                    for(let j=1; j<cells.length; j++) {
                        if(cells[j].trim() === '1') {
                            await createAndDownloadImage(fields[j-1], i+1, ogrNo);
                        }
                    }
                }
            }
            numb = 0;
        };
        reader.readAsText(file);
    };

    let numb = 0;
    const createAndDownloadImage = async (fieldName, index, ogrNo) => {
        const containerNode = document.createElement("div");
        containerNode.style.position = 'relative';
        containerNode.style.width = '360px';
        containerNode.style.height = '360px';
        containerNode.style.display = 'flex';
        containerNode.style.justifyContent = 'center';
        containerNode.style.alignItems = 'center';

        const backgroundNode = document.createElement("div");
        backgroundNode.style.position = 'absolute';
        backgroundNode.style.top = '0';
        backgroundNode.style.left = '0';
        backgroundNode.style.width = '100%';
        backgroundNode.style.height = '100%';
        backgroundNode.style.opacity = '0.2';
        backgroundNode.style.backgroundImage = `url(${iyteBackground})`;
        backgroundNode.style.backgroundSize = 'cover';
        backgroundNode.style.backgroundPosition = 'center';
        backgroundNode.style.backgroundRepeat = 'no-repeat';
        numb = numb + 1;
        const textNode = document.createElement("div");
        let text = "";
        switch(fieldName) {
            case "Honor":
                text = "Honor Certificate";
                await postDataToAPI(`${numb}`, 'HONOR', ogrNo); 
                break;
            case "CENG415":
                text = "CENG415 Certificate";
                await postDataToAPI(`${numb}`, 'CENG415', ogrNo); 
                break;
            case "CENG416":
                text = "CENG416 Certificate";
                await postDataToAPI(`${numb}`, 'CENG416', ogrNo); 
                break;
            default:
                text = "";
        }
        textNode.innerHTML = text;
        textNode.style.color = 'black';
        textNode.style.padding = '10px';

        containerNode.appendChild(backgroundNode);
        containerNode.appendChild(textNode);
        document.body.appendChild(containerNode);

        const dataUrl = await toPng(containerNode, { width: 360, height: 360 });
        document.body.removeChild(containerNode);
        
        const filename = `${numb}.png`;
        console.log(numb);
        download(dataUrl, filename);
    };

    const postDataToAPI = async (token, certificate, ogrNo) => {
        try {
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1; 
            const year = currentDate.getFullYear();
            const response = await fetch('http://localhost:3001/api/NFT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    a: token,
                    b: `${month}/${year}`,
                    c: certificate,
                    d: ogrNo,
                }),
            });
            
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleBurned = () => {
        const fiveDayAgo = Math.floor((Date.now() - (3 * 60 * 60 * 1000)) / 1000);
        axios
            .get(
                `https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=0x328b03f67391721ade95496bd2ab4abbc20b9605&address=0x0086EdCDA92B9ed4067E42D9FEDE20bfE79b4031&page=1&offset=100&sort=asc&apikey=X3FYEN437GCSNDAVFG8P4PRBU5A41ZAX88`
            )
            .then((response) => {
                const pastYearTransactions = response.data.result.filter(
                    (transaction) => transaction.timeStamp >= fiveDayAgo && transaction.to === '0x0086edcda92b9ed4067e42d9fede20bfe79b4031' && transaction.from !== '0x0000000000000000000000000000000000000000'
                );
                pastYearTransactions.forEach(transaction => {
                    console.log(`Token ID: ${transaction.tokenID}`);
                    console.log(`Token Name: ${transaction.tokenName}`);
                    console.log('BURNED');
                    axios
                        .post(
                            'http://localhost:3001/api/updateBurn', 
                            {
                                semester: transaction.tokenName,
                                tokenId: transaction.tokenID
                            }
                        )
                        .catch((error) => console.error(`Error: ${error}`));
                });
            })
            .catch((error) => console.error(`Error: ${error}`));
    };

const handleSold = () => {
    const fiveDayAgo = Math.floor((Date.now() - (3 * 60 * 60 * 1000)) / 1000);
    axios
        .get(
            `https://api-testnet.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=0x328b03f67391721ade95496bd2ab4abbc20b9605&address=0x0086EdCDA92B9ed4067E42D9FEDE20bfE79b4031&page=1&offset=100&sort=asc&apikey=X3FYEN437GCSNDAVFG8P4PRBU5A41ZAX88`
        )
        .then((response) => {
            const pastYearTransactions = response.data.result.filter(
                (transaction) => transaction.timeStamp >= fiveDayAgo && transaction.from === '0x0086edcda92b9ed4067e42d9fede20bfe79b4031'
            );
            pastYearTransactions.forEach(transaction => {
                console.log(`Token ID: ${transaction.tokenID}`);
                console.log(`Token Name: ${transaction.tokenName}`);
                console.log('---------------------');
                axios
                    .post(
                        'http://localhost:3001/api/updateStudentValue', 
                        {
                            semester: transaction.tokenName,
                            tokenId: transaction.tokenID
                        }
                    )
                    .catch((error) => console.error(`Error: ${error}`));
            });
        })
        .catch((error) => console.error(`Error: ${error}`));
};

    return (
        <div style={{marginTop: '100px'}}>
            <h1>CSV UPLOAD</h1>
            <input type="file" id="csvFile" accept=".csv" style={{display: 'none'}} onChange={handleFileChange} />
            <button onClick={() => document.getElementById('csvFile').click()}>Select CSV File</button>
            <label>{filename ? "Selected File: " + filename : "No File Selected"}</label>
            <br />
            <button onClick={handleImport}>CSV Import</button>
            <br />
            <h1 style={{marginTop: '50px'}}>BURNED</h1>
            <button onClick={handleBurned}>FIND BURNED</button>
            <br/>
            <h1 style={{marginTop: '50px'}}>SOLD</h1>
            <button onClick={handleSold}>FIND SOLD</button>
            <br/>
        </div>
    );
}