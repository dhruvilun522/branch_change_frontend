import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pg1 from './components/Pg1.jsx';
import Pg2 from './components/Pg2.jsx';

const url = process.env.APIURL;

const Page = () => {
    
    const [branch, setBranch] = useState([]);

    const read = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(url + 'check', read[0]);
                setBranch(response.data);
                
            } catch (error) {
                if (error.response.status === 401 && error.response.data.responseCode === 999) {
                    toast.error("Session Expired. Please login again..");
                    window.location.replace("/");
                }
            }
        }
        fetchData();
    }, []);
   
    const type1=branch["type"];
    delete branch["type"];
    const branch1=Object.values(branch);
    

   

    return (
        
        <div>
            {
                type1==="eligible"?(<Pg1 data= {branch1} />):(type1==="already applied"?(<Pg2 data={branch1}/>):(<div>not eligible</div>))
            }
            
        </div>
    );
 };

export default Page;