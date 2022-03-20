import React, { useState, useEffect } from 'react';
import DashboardNavBar from './DashboardNavBar';
import {Link} from "react-router-dom";
// import DownloadIcon from '@mui/icons-material/Download';
// import Tooltip from '@mui/material/Tooltip';
import axios from 'axios'
import { getToken } from "../SignIn_SignUp/Sessions"
import { useNavigate } from "react-router-dom"

function MyApplications(props) {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/get-applications", {
          headers: {
            Authorization: getToken()
          }
        })
        .then(response => {
            if(response.data === 1) {
              navigate("/logout");
            }
            else {
                console.log(response.data);
                setApplications(response.data);
            }
          })
        .catch(err => console.log(err));
      },[]);

    return(
        <>
            <DashboardNavBar currentFlag={1}/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <header className="bg-white">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-0">
                            <h1 className="text-3xl font-bold text-gray-900">Submitted Applications</h1>
                        </div>
                    </header>
                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Department
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Specialization
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {/* View */}
                                                </th>
                                            </tr>
                                        </thead>

                                        {applications.length === 0 && 
                                            <tbody>
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">No submitted applications!</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        }
                                        
                                        {applications.length !== 0 && 
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {applications.map((application) => (
                                                    <tr key={application.application_id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{application.department}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{application.specialization}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Active
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                            <Link to={"/view/" + application.application_id} className="text-indigo-600 hover:text-indigo-900">
                                                                View
                                                            </Link>
                                                        </td>
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                                            <button to="/apply" className="text-indigo-600 hover:text-indigo-900">
                                                                <Tooltip 
                                                                    title="Download" 
                                                                    arrow>
                                                                        <DownloadIcon></DownloadIcon>
                                                                </Tooltip>
                                                            </button>
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyApplications;