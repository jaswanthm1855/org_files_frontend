import React, { useEffect, useState } from "react";
// import { Select } from "antd";
import './organisationFiles.css'
import UploadButton from "../uploadFile/uploadFiles";

// const { Option } = Select

const OrganisationFiles = () => {

    const [orgFilesList, setOrgFilesList] = useState([])

    useEffect(() => {
        getOrgFiles()
    }, [])


    const getOrgFiles=()=> {

        fetch(
            'http://localhost:8000/organisations/files'
        ).then(
            (resp) => resp.json()
        ).then(
            (result) => {
                setOrgFilesList(result['data']);
                console.log("succes", result)
            }
        ).catch(
            (error) => {
                console.log("errorroo")
                console.log(error)
            }
        );
    }

    return (
        <div class="main-div">
        <div className="org-list-view">
            <h1>File Data</h1>
            <ul> {
                orgFilesList.map((org) => (
                    <li key={org['id']}>
                        <big>{org['name']}</big>
                        <ul>
                    {org.files.map((file) => (<li key={file['id']}>{file['file_name']}</li>))}
                </ul>
                    </li>
            ))}
            </ul>
            </div>
            <div class='upload-files-comnponent' style={{ marginLeft: "5px" }}><UploadButton getOrgFiles={getOrgFiles} /></div>
        </div>

    )

    // return (
    //     <div className="org-list-view">
    //         <h1>File Data</h1>
    //         {orgFilesList.map((eachOrg) =>
    //             <Select key={eachOrg['id']} placeholder={eachOrg['name']}>
    //                 {
    //                     eachOrg.files.map((eachFile) => <Option key={eachFile['id']}>{eachFile['file_name']}</Option>)
    //                 }
    //             </Select>
    //         )}
    //     </div>
    // )

};
export default OrganisationFiles;
