import React, { useState } from "react";
import CollegeDegreeSection from "./CollegeDegreeSection.js";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../SignIn_SignUp/Sessions";
import crossPic from "../../images/red_cross.png"

function EducationalDetails(props) {
  const navigate = useNavigate();

  const [marksheet_10th, setMarksheet_10th] = useState(null);
  const [marksheet_12th, setMarksheet_12th] = useState(null);
  const [percentage_cgpa_pattern, setPercentageCgpaPattern] = useState(Array.from({length: 5}, ()=>"(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)"));
  
  const [degreesFiles, setDegreesFiles] = useState(Array.from({length: 5},()=> Array.from({length: 2}, () => '')))

  const clearFiles = (row,column) => {
    let copy = [...degreesFiles];
    copy[row][column] = null;
    setDegreesFiles(copy);
  }

  function convertJsonObjectArrayTo2dArray(degrees){
    let result = Array.from({length: 5},()=> Array.from({length: 10}, () => ''))
    for(let i = 0; i<degrees.length; i++){
      let j = 0;
      for(const key in degrees[i]){
        if(key === 'id') continue;
        result[i][j] = degrees[i][key];
        j++;
      }
    }
    return result;
  }

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("degrees", JSON.stringify(convertJsonObjectArrayTo2dArray(props.localDegrees)));

    formData.append("degree_10th", props.localProfileInfo.degree_10th);
    formData.append("board_10th", props.localProfileInfo.board_10th);
    formData.append("percentage_cgpa_format_10th", props.localProfileInfo.percentage_cgpa_format_10th);
    formData.append("percentage_cgpa_value_10th", props.localProfileInfo.percentage_cgpa_value_10th);
    formData.append("year_of_passing_10th", props.localProfileInfo.year_of_passing_10th);
    formData.append("remarks_10th", props.localProfileInfo.remarks_10th);
   

    formData.append("degree_12th", props.localProfileInfo.degree_12th);
    formData.append("board_12th", props.localProfileInfo.board_12th);
    formData.append("percentage_cgpa_format_12th", props.localProfileInfo.percentage_cgpa_format_12th);
    formData.append("percentage_cgpa_value_12th", props.localProfileInfo.percentage_cgpa_value_12th);
    formData.append("year_of_passing_12th", props.localProfileInfo.year_of_passing_12th);
    formData.append("remarks_12th", props.localProfileInfo.remarks_12th);
   

    formData.append("other_remarks", props.localProfileInfo.other_remarks);
    formData.append("is_last_degree_completed", props.localProfileInfo.is_last_degree_completed);

    // Append Files
    formData.append("marksheet_10th_url", marksheet_10th);
    formData.append("marksheet_12th_url", marksheet_12th);
    formData.append("upload_marksheet0", degreesFiles[0][0]);
    formData.append("upload_degree0", degreesFiles[0][1]);
    formData.append("upload_marksheet1", degreesFiles[1][0]);
    formData.append("upload_degree1", degreesFiles[1][1]);
    formData.append("upload_marksheet2", degreesFiles[2][0]);
    formData.append("upload_degree2", degreesFiles[2][1]);
    formData.append("upload_marksheet3", degreesFiles[3][0]);
    formData.append("upload_degree3", degreesFiles[3][1]);
    formData.append("upload_marksheet4", degreesFiles[4][0]);
    formData.append("upload_degree4", degreesFiles[4][1]);

    Axios.post("http://localhost:8080/save-education-details", formData, {
      headers: {
        Authorization: getToken()
      }
    })
      .then(response => {
        if(response.data === 1) {
          navigate("/logout");
        }
        else {
          window.location.reload();
        }
      })
      .catch(err => console.log(err));
  }

  const handleFileSubmitDegree = (e, maxSize, row, column) => {
    const file = e.target.files[0];
    if (file.size > maxSize*1000000){
        e.target.value = null;
        const error = "File size cannot exceed more than " + maxSize.toString() + "MB";
        alert(error);
    }
    else {
      let copy = [...degreesFiles];
      copy[row][column] = file;
      setDegreesFiles(copy);
    }
  }

  const handleFileSubmit = (e, maxSize, setVariable) => {
    const file = e.target.files[0];
    if (file.size > maxSize*1000000){
        e.target.value = null;
        const error = "File size cannot exceed more than " + maxSize.toString() + "MB";
        alert(error);
    }
    else {
        setVariable(file);
    }
  }

  

  const handleSelectChange = (e,index) => {
    let copy = [...percentage_cgpa_pattern]
    if(e.target.value === "Percentage") {
      copy[index] = "(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)";
      setPercentageCgpaPattern(copy);
    }
    else if((e.target.value === "CGPA" )){
      copy[index] = "^(([0-9]{1})|([0-9]{1}\\.\\d{1,2}))|10\\.00|10\\.0|10";
      setPercentageCgpaPattern(copy);
    }
    else if(e.target.value==="10" &&  copy[index]!=="(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)"){
      copy[index] = "^(([0-9]{1})|([0-9]{1}\\.\\d{1,2}))|10\\.00|10\\.0|10";
      setPercentageCgpaPattern(copy);
    }
    else if(copy[index]!=="(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)"){
      copy[index] = "^(([0-3]{1})|([0-3]{1}\\.\\d{1,2}))|4\\.00|4\\.0|4";
      setPercentageCgpaPattern(copy);
    }
    // console.log(percentage_cgpa_pattern);
  }

  function closeEducationDetails () {
    setMarksheet_12th(null);
    setMarksheet_10th(null);
    for(let i = 0;i<5;i++){
      degreesFiles[i][0] = null;
      degreesFiles[i][1] = null;
    }
    props.syncLocalGlobalData();
  }

  return (
    <div id="educationalDetailsModal" aria-hidden="true" className="hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
      <div className="relative object-center overflow-y-auto overflow-x-hidden overscroll-none px-4 w-full max-w-7xl h-5/6">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex justify-between items-start rounded-t border-b dark:border-gray-600">
            <button onClick={closeEducationDetails} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm m-3 p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="educationalDetailsModal">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>  
            </button>
          </div>
          {/* Modal body */}
          
          <div>
            <div className="px-6 py-6 mx-10 bg-[#f3f4f6] ">
              <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="ml-5 mb-2 text-left text-2xl font-medium leading-6 text-gray-900">
                        Educational Details
                      </h3>
                      <p className="ml-5 text-left mt-1 text-gray-600 text-base">
                        Please share your educational details
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={onSubmit}>
                      <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-full sm:col-span-full">
                              <div className="outline rounded outline-[#f3f4f6] px-8 py-8 grid grid-cols-6 gap-6">
                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="degree_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Degree<span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <select
                                    id="degree_10th"
                                    required
                                    name="degree_10th"
                                    defaultValue={props.localProfileInfo.degree_10th}
                                    onChange={(event)=>props.onChange(event, 'degree_10th')}
                                
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="">- Select -</option>
                                    <option value="10th">10th</option>
                                  </select>
                                </div>

                                <div className="col-span-8 sm:col-span-4">
                                  <label
                                    htmlFor="board_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Board<span style={{ color: "#ff0000" }}> *</span>
                                  </label>

                                  <input
                                    type="text"
                                    required
                                    id="board_10th"
                                    name="board_10th"
                                    defaultValue={props.localProfileInfo.board_10th}
                                    onChange={(event)=>props.onChange(event, 'board_10th')}
                                    
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="percentage_cgpa_format_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Percentage/CGPA
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <select
                                    id="percentage_cgpa_format_10th"
                                    required
                                    name="percentage_cgpa_format_10th"
                                    value={props.localProfileInfo.percentage_cgpa_format_10th}
                                    onChange={(event)=>{props.onChange(event, 'percentage_cgpa_format_10th');handleSelectChange(event,0)}}
                                    pattern={percentage_cgpa_pattern}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="">- Select -</option>
                                    <option value="Percentage">Percentage</option>
                                    <option value="CGPA">CGPA</option>
                                  </select>
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="percentage_cgpa_value_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Percentage/CGPA
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    title="Correct Percentage Format: 94.65, Correct CGPA Format: 8.23"
                                    pattern = {percentage_cgpa_pattern[0]}
                                    id="percentage_cgpa_value_10th"
                                    name="percentage_cgpa_value_10th"
                                    defaultValue={props.localProfileInfo.percentage_cgpa_value_10th}
                                    onChange={(event)=>props.onChange(event, 'percentage_cgpa_value_10th')}
                                    
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="year_of_passing_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Year of Passing
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  
                                  <input
                                    type="text"
                                    required
                                    name="year_of_passing_10th"
                                    defaultValue={props.localProfileInfo.year_of_passing_10th}
                                    onChange={(event)=>props.onChange(event, 'year_of_passing_10th')}
                                    id="year_of_passing_10th"
                                    pattern="[1-9]{1}[0-9]{3}"
                                    title="4 Digit Year (Example: 2020)"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-full sm:col-span-full">
                                  <label
                                    htmlFor="remarks_10th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Remarks (if any)
                                  </label>
                                  <div className="mt-1">
                                    <textarea
                                      id="remarks_10th"
                                      rows={2}
                                      name="remarks_10th"
                                      defaultValue={props.localProfileInfo.remarks_10th}
                                      onChange={(event)=>props.onChange(event, 'remarks_10th')}
                                      className="resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                   
                                    />
                                  </div>
                                </div>

                                <div className="col-span-full sm:col-span-full">
                                  <label
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    htmlFor="user_avatar"
                                  >
                                    10th Certificate/Marksheet
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  {(!props.localProfileInfo.marksheet_10th_url && !marksheet_10th)?
                                <>
                                  <input
                                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    aria-describedby="marksheet_10th-desc"
                                    id="marksheet_10th"
                                    name="marksheet_10th"
                                    type="file"
                                    required
                                    accept=".pdf"
                                    onChange={(e) => handleFileSubmit(e, 2, setMarksheet_10th)}
                                    />
                                  <div
                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                    id="profile-picture-desc"
                                  >
                                    <span className="font-semibold">Maximum file size:</span> 2 MB,  <span className="font-semibold">Allowed file formats:</span> .jpg, .png, .jpeg 
                                    <br/>
                                    <div className="mt-1">
                                    <span className="font-semibold">Recommended File Name Format:</span> 
                                    <span> Marksheet10th_&lt;your_email_id&gt; <br/>Example: Marksheet10th_abc@gmail.com</span>
                                    </div>
                                  </div>                             
                                </>
                              
                                :

                                <>
                                  <div className="flex border-2 mt-1 w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    <input
                                      className="border-none block w-full shadow-sm sm:text-sm"
                                      id="profile_picture"
                                      name="profile_picture"
                                      type="text"
                                      defaultValue={marksheet_10th ? marksheet_10th.name : props.localProfileInfo.marksheet_10th_url.substring(props.localProfileInfo.marksheet_10th_url.lastIndexOf('/') + 1, props.localProfileInfo.marksheet_10th_url.lastIndexOf('_'))}
                                      readOnly
                                      />
                                  
                                    <button type="button" className="flex items-center ml-2 mr-2 justify-center" onClick={() => {props.emptyFile('marksheet_10th_url');setMarksheet_10th(null)}}>
                                      <img className="w-6 h-6" src ={crossPic} alt="Cross"></img>
                                    </button>
                                  </div>
                                </>
                              }
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-span-full sm:col-span-full">
                              <div className="outline rounded outline-[#f3f4f6] px-8 py-8 grid grid-cols-6 gap-6">
                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="degree_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Degree<span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <select
                                    id="degree_12th"
                                    required
                                    name="degree_12th"
                                    defaultValue={props.localProfileInfo.degree_12th}
                                    onChange={(event)=>{props.onChange(event, 'degree_12th');}}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="">- Select -</option>
                                    <option>12th</option>
                                  </select>
                                </div>

                                <div className="col-span-8 sm:col-span-4">
                                  <label
                                    htmlFor="board_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Board/University/Institute
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    id="board_12th"
                                    name="board_12th"
                                    defaultValue={props.localProfileInfo.board_12th}
                                    onChange={(event)=>props.onChange(event, 'board_12th')}
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="percentage_cgpa_format_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Percentage/CGPA
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <select
                                    id="percentage_cgpa_format_12th"
                                    required
                                    name="percentage_cgpa_format_12th"
                                    value={props.localProfileInfo.percentage_cgpa_format_12th}
                                    onChange={(event)=>{props.onChange(event, 'percentage_cgpa_format_12th'); handleSelectChange(event, 1);}}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="">- Select -</option>
                                    <option value="Percentage">Percentage</option>
                                    <option value="CGPA">CGPA</option>
                                  </select>
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="percentage_cgpa_value_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Percentage/CGPA
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <input
                                    type="text"
                                    title="Correct Percentage Format: 94.65, Correct CGPA Format: 8.23"
                                    pattern={percentage_cgpa_pattern[1]}
                                    id="percentage_cgpa_value_12th"
                                    name="percentage_cgpa_value_12th"
                                    defaultValue={props.localProfileInfo.percentage_cgpa_value_12th}
                                    onChange={(event)=>props.onChange(event, 'percentage_cgpa_value_12th')}
                                    required
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-4 sm:col-span-2">
                                  <label
                                    htmlFor="year_of_passing_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Year of Passing
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    id="year_of_passing_12th"
                                    name="year_of_passing_12th"
                                    defaultValue={props.localProfileInfo.year_of_passing_12th}
                                    onChange={(event)=>props.onChange(event, 'year_of_passing_12th')}
                                    pattern="[1-9]{1}[0-9]{3}"
                                    title="4 Digit Year (Example: 2020)"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>

                                <div className="col-span-full sm:col-span-full">
                                  <label
                                    htmlFor="remarks_12th"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Remarks (if any)
                                  </label>
                                  <div className="mt-1">
                                    <textarea
                                      id="remarks_12th"
                                      name="remarks_12th"
                                      defaultValue={props.localProfileInfo.remarks_12th}
                                      onChange={(event)=>props.onChange(event, 'remarks_12th')}
                                      rows={2}
                                      className="resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    />
                                  </div>
                                </div>

                                <div className="col-span-full sm:col-span-full">
                                  <label
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    htmlFor="user_avatar"
                                  >
                                    12th Certificate/Marksheet
                                    <span style={{ color: "#ff0000" }}> *</span>
                                  </label>
                                  {/* <input
                                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        aria-describedby="profile-picture-desc"
                                        id="marksheet_12th"
                                        name="marksheet_12th"
                                        type="file"
                                        required
                                        accept=".pdf"
                                        onChange={(e) => handleFileSubmit(e, 2, setMarksheet_12th)}
                                        /> */}

                                {(!props.localProfileInfo.marksheet_12th_url && !marksheet_12th)?
                                <>
                                  <input
                                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    aria-describedby="marksheet_12th-desc"
                                    id="marksheet_12th"
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {handleFileSubmit(e, 2, setMarksheet_12th);}}
                                    />
                                  <div
                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                    id="category-certificate-desc"
                                  >
                                    <span className="font-semibold"> Maximum file size: </span>2 MB
                                  </div>
                                  <div
                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                    id="marksheet_12th-desc"
                                  >
                                    <span className="font-semibold">Allowed file formats:</span> .pdf
                                  </div>
                                  <div
                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                    id="marksheet_12th-desc"
                                  >
                                    <span className="font-semibold">Recommended File Name Format:</span> 
                                    <span> Marksheet12th_&lt;your_email_id&gt;<br/>Example: Marksheet12th_abc@gmail.com</span>
                                  </div>
                                </>
                              
                                :
                              
                                <>
                                  <div className="flex border-2 mt-1 w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                    <input
                                      className="border-none block w-full shadow-sm sm:text-sm"
                                      id="marksheet_12th"
                                      name="marksheet_12th"
                                      type="text"
                                      defaultValue={marksheet_12th ? marksheet_12th.name : props.localProfileInfo.marksheet_12th_url.substring(props.localProfileInfo.marksheet_12th_url.lastIndexOf('/') + 1, props.localProfileInfo.marksheet_12th_url.lastIndexOf('_'))}
                                      readOnly
                                      />
                                  
                                    <button type="button" className="flex items-center ml-2 mr-2 justify-center" onClick={() => {props.emptyFile('marksheet_12th_url');setMarksheet_12th(null)}}>
                                      <img className="w-6 h-6" src ={crossPic} alt="Cross"></img>
                                    </button>
                                  </div>
                                </>
                              }


                                  {/* <div
                                      className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                      id="marksheet_help"
                                    >
                                    <span className="font-semibold">Maximum file size:</span> 2 MB <span className="font-semibold">Allowed file formats:</span> .pdf
                                  </div>

                                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="profile-picture-desc">
                                    <span className="font-semibold">Recommended File Name Format:</span> 
                                    <span> Marksheet12th_&lt;your_email_id&gt; <br/>For Example: Marksheet12th__abc@gmail.com</span>
                                  </div> */}
                                  
                                </div>
                              </div>
                            </div>
                            
                            { [...Array(props.count)].map((_, i) => (
                              <CollegeDegreeSection key={i} id={i} handleChange={props.onChangeDegrees} handleFileSubmit={handleFileSubmitDegree} handleSelectChange={handleSelectChange} percentage_cgpa_pattern={percentage_cgpa_pattern} localDegrees={props.localDegrees} degreesFiles={degreesFiles} emptyFileDegree={props.emptyFileDegree} clearFiles={clearFiles}/>
                            ))}

                            <div className="flex mb-4 col-span-4">
                              {props.count === 5 ? (
                                  <div></div>
                                ) : (<button
                                  type="button"
                                  onClick={() => {props.setCount(props.count + 1)}}
                                  className="border border-teal-500 text-teal-500 block rounded-sm font-bold py-2 px-4 mr-2 items-center hover:bg-teal-500 hover:text-white"
                                >
                                  Add Section
                                </button>)}
                                {props.count === 1 ? (
                                  <div></div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {props.removeLocalDegree(props.count-1);props.setCount(props.count - 1);}}
                                    className="border border-teal-500 text-teal-500 block rounded-sm font-bold py-2 px-4 mr-2 items-center hover:bg-teal-500 hover:text-white"
                                  >
                                    Remove Section
                                  </button>
                                )}
                            </div>
                          </div>
                          
                          <div className="col-span-full sm:col-span-full">
                            <div className="outline rounded outline-[#f3f4f6] px-8 py-8 grid grid-cols-6 gap-6">
                              <div className="col-span-full sm:col-span-full">
                                <label
                                  htmlFor="other_remarks"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Any other educational highlights/information
                                </label>
                                <div className="mt-1">
                                  <textarea
                                    id="other_remarks"
                                    defaultValue={props.localProfileInfo.other_remarks}
                                    onChange={(event)=>props.onChange(event, 'other_remarks')}
                                    rows={3}
                                    className="resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                </p>
                              </div>
                          
                              <div className="col-span-full sm:col-span-full">
                                <label
                                  htmlFor="is_last_degree_completed"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Whether you have completed your last degree: <span style={{ color: "#ff0000" }}> *</span>
                                </label>
                                <select
                                  id="is_last_degree_completed"
                                  required
                                  value={props.localProfileInfo.is_last_degree_completed}
                                  onChange={(event)=>props.onChange(event, 'is_last_degree_completed')}
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                  <option value="">- Select -</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>

                            </div>
                          </div>

                          {/* <div className="my-4 grid grid-cols-6 gap-6">
                          <button
                            type="button"
                            onClick={() => props.decreasePageNumber()}
                            className="col-start-1 col-end-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white justify-center block py-2 px-4 mr-2 items-center bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Back
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => props.increasePageNumber()}
                            className="col-start-6 col-end-7 border border-transparent shadow-sm text-sm font-medium rounded-md text-white justify-center block py-2 px-4 mr-2 items-center bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Next
                            </button>
                          </div> */}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 space-x-2 rounded-b border-gray-200 dark:border-gray-600">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={
                          () => {
                            console.log(props.localProfileInfo)
                            console.log(props.localDegrees)
                            console.log(degreesFiles)
                          }
                        }>Print</button>
                        <button onClick={closeEducationDetails} data-modal-toggle="educationalDetailsModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationalDetails;