import React, { useState} from 'react';
import axios from 'axios';



const url = process.env.APIURL;

//to preview before final submit
function ConfirmationModal({ priorities, onClose, onConfirm }) {
    //css for preview div
    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '60%',
        height: '78%',
        width: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid black',
        zIndex: '1000' ,
        display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
      };

    //css for button div 
    const buttonContainerStyle = {
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center' 
      };


    return (
      <div className="modal" style={modalStyle}>
        <div className="modal-content">
          <h2 style={buttonContainerStyle}>Confirm Priorities</h2>
          <table>                          {/*showing all filled priorities*/}
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Branch</th>
                        
                    </tr>
                </thead>
                <tbody>
                {priorities.map((row, index) => (
                            <tr key={index}>
                                <td>{row.priority}</td>
                                <td>{row.course+" in "+row.branch}</td>
                            </tr>
                        ))}
                </tbody>
                    </table>
                
           <div  style={buttonContainerStyle}>
           <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
            </div>     
          
        </div>
      </div>
    );
  }
  

const Pg1 = ({data}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);   //state defined to enable or disable preview
    const read = JSON.parse(localStorage.getItem('userData'));         //reading userdata from local storage 
    const [rows, setRows] = useState([{ priority: 1, course: '', branch: '' }]);    //state defined to store filled priorities
    

    const branch1=data;               //data is list of branch and it is stored in branch1
    
    // to add new priority
    const handleAddRow = () => {
        
        if(rows.length==5){
            alert("you can add only 5 priorities");    
        }
        else{
        const newRow = {
            priority: rows.length + 1,
            course: 'select one',
            branch: 'select one'
        };
        setRows([...rows, newRow]);
    }
    };

    // to show preview
    const handleSave = () => {
        setShowConfirmation(true);
      };
    

    //to disable preview
    const handleCancel = () => {
        setShowConfirmation(false);
      };

    //deleting a priority from list
    const handleRemoveRow = (indexToRemove) => {
        const updatedRows = rows.filter((row, index) => index !== indexToRemove);
        const updatedRowsWithPriority = updatedRows.map((row, index) => ({
            ...row,
            priority: index + 1
        }));
        setRows(updatedRowsWithPriority);
    };

    //to update values of row
    const handleChange = (idx, val, name) => {
        
        if (name === 'course') {
            
            const updatedRows = rows.map((row, rowIndex) => {
                if (rowIndex === idx) {
                    return {
                        ...row,
                        [name]: val,
                        branch:''
                        
                    };
                }
                return row;
            });

            setRows(updatedRows);
        } else {
         
    const rowExists = rows.some(row => JSON.stringify(row) === JSON.stringify({...row, [name]: val }));   //check if same priority is already filled
            
    if (!rowExists) {
            const updatedRows = rows.map((row, rowIndex) => {
                if (rowIndex === idx) {
                    return {
                        ...row,
                        [name]: val
                    };
                }
                return row;
            });
            setRows(updatedRows);
        }
        else{
            alert("cant add same branch")
        }
        }
    };


    //to submit data to database
    const handleSubmit = async () => {
        try {
            const newobj={priority:0,course:read[0].id,branch:''};
            rows.push(newobj);
            
            await axios.post(url + 'storepref', rows).then(async response => {
                console.log(response.data);})

        } catch (error) {
            console.log(error);
            // if (error.response.status === 401 && error.response.data.responseCode === 999) {
            //     toast.error("Session Expired. Please login again..");
            //     window.location.replace("/");
            // }
        }
        
        window.location.reload();
    };

    //css for main div
   const mainContentStyle = {
    filter: showConfirmation ? 'blur(4px)' : 'none',
    pointerEvents: showConfirmation ? 'none' : 'auto'
  };

    return (
        <div style={{ position: 'relative' }}>
            <div  style={mainContentStyle}>

            
            <table>          {/* main div that allows user to fill their priorities*/}
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Choose Course</th>
                        <th>Choose Branch</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.priority}</td>
                            <td>
                                <select value={row.course} onChange={(e) => handleChange(index, e.target.value, 'course')}>
                                    <option value=''>select one</option>
                                    <option value="Bachelor of Technology">Bachelor of Technology</option>
                                    <option value="Integrated Master of Technology">Master of Technology</option>
                                </select>
                            </td>
                            <td>
                                <select value={row.branch} onChange={(e) => handleChange(index, e.target.value, 'branch')}>
                                    
                                    <option value=''>select one</option>
                                    {branch1
                                        .filter(item => item.type === row.course)
                                        .map((item, idx) => (
                                            <option key={idx} value={item.name}>{item.name}</option>
                                        ))}
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleRemoveRow(index)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAddRow} disabled={showConfirmation}>Add More</button>
            {/* <button onClick={handleSubmit}>Submit My Response</button> */}
            
            <button onClick={handleSave} disabled={showConfirmation}>Submit</button>
            </div>
            
            {/* preview  */}
            {showConfirmation && (
        <ConfirmationModal
          priorities={rows.map(item => ({
            priority: item.priority,
            course: item.course,
            branch: item.branch
          }))}
          onClose={handleCancel}
          onConfirm={handleSubmit}
        />
      )}
      
        </div>
    );
};

export default Pg1;