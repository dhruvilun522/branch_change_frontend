import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Base64 } from 'js-base64';

//import axios from 'axios';
//import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

//const url = process.env.APIURL;
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/b/bf/IIT_%28ISM%29_Dhanbad.jpg'
const Pg2 = ({data}) => {
    const status=data[data.length-1];                   //reading status
    const data1 = data.slice(0, data.length - 1);       //removing status part
    
    
    //generate receipt for branch change
    const handleDownloadPDF = async () => {
        const read = JSON.parse(localStorage.getItem('userData'));
        const doc = new jsPDF();
        let allign=(status==='approved')?'center':'left';
        let header=(status==='approved')?'ALLOTED BRANCH':'BRANCH';
        doc.setFont('Times-Bold', 'normal');
        doc.setFontSize(17);
        doc.text('INDIAN INSTITUTE OF TECHNOLOGY DHANBAD', 55, 12);
        doc.text('DHANBAD-826004', 90, 20);
        doc.setFontSize(14);
        doc.text('BRANCH CHANGE RECEIPT', 83, 34);
        doc.setFont('Times', 'normal');
        doc.setFontSize(11);
        doc.text('Admn No. : ',21,46);
        doc.text(read[0].id,41,46);
        doc.text('Name : ',21,54);
        doc.text(read[0].user_name,41,54);
        doc.text('Dept : ',21,62);
        doc.text(read[0].dept_name,41,62);
        doc.text('Status : ',21,70);
        doc.text(status,41,70);
        try {
            const img = await fetch(imageUrl)
              .then(response => response.blob())
              .then(blob => URL.createObjectURL(blob));
            const imgData = await fetch(img)
              .then(response => response.blob())
              .then(blob => URL.createObjectURL(blob));
            const imgBase64 = await fetch(imgData)
              .then(response => response.arrayBuffer())
              .then(buffer => `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`);
            
              doc.addImage(imgBase64, 'JPEG', 30, 5, 18, 18);
          } catch (error) {
            console.error('Failed to load the image:', error);
          }
        
        
        doc.autoTable({
            startY: 80,
            theme: 'striped',
            margin: { left: 20, right: 10, top: 20, bottom: 30 },
            head: [['ID', header]],
            headStyles: {
                fillColor: [255, 255,0 ],
                textColor: [0,0,0],
                halign:'center',
                valign:'middle',
                minCellWidth:10,
                minCellHeight: 10,
                fontSize: 12,
                
                },
                bodyStyles: {
                    halign:allign,
                    valign:'middle',
                    minCellWidth: 10,
                    //minCellHeight: 12,
                    fontSize: 10,
                    cellPadding:3
                },
            body: data1.map(item => [item.p_id, item.course_type+" in "+ item.priority])
            });
           
            doc.save(read[0].id+"_branchchangereceipt.pdf");
            };
       
    


  

    return (
        <div>
                <div>
                    
                    <h3>Already Applied...</h3>
                    <h4>status : {status}</h4>
                    <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>{(status==='approved')?'ALLOTED BRANCH':'BRANCH'}</th>
                        
                    </tr>
                </thead>
                <tbody>
                {data1.map((row, index) => (
                            <tr key={index}>
                                <td>{row.p_id}</td>
                                <td>{row.course_type+" in "+row.priority}</td>
                            </tr>
                        ))}
                </tbody>
                    </table>
                    
                    <button onClick={handleDownloadPDF}>Download PDF</button>
                </div>

        </div>
    );
};

export default Pg2;