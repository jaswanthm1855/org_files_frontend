import React, { useEffect, useState, useRef } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import './uploadFiles.css';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadButton = (props) => {

    const [orgsList, setOrgsList] = useState()
    const [selectedOrgId, setSelectedOrgId] = useState()
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        function getOrgs() {

            fetch(
                'http://localhost:8000/organisations'
            ).then(
                (resp) => resp.json()
            ).then(
                (result) => {
                    setOrgsList(result['data']);
                    setFileList([]);
                }
            ).catch(
                (error) => {
                    // console.log("errorroo")
                    // console.log(error)
                }
            );
        }

        getOrgs()

    }, [])

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    useEffect(() => {
        
    },[selectedOrgId]) 
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    function handleUpload(file, canReplaceFile = false) {

        const formData = new FormData()
        formData.append('uploaded_file', fileList[0].originFileObj, fileList[0].name);
        fetch(
            `http://localhost:8000/organisations/${selectedOrgId}/files?can_replace_file=${canReplaceFile}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }
        ).then(
            (resp) => resp.json()
        ).then(
            (result) => {
                if (result.status === "success") {
                    props.getOrgFiles()
                    setFileList([])
                    message.success(result.message)
                }
                else {
                    if (result.message === "File already exists") {
                        setOpen(true)
                    }
                    else {
                        setFileList([])
                        message.error(result.message)
                    }
                }
            }
        ).catch(
            (error) => {
                setFileList([])
                message.success('File upload failed')
            }
        );

    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const handleCloseWithReplace = () => {
        setOpen(false)
        handleUpload(fileList[0], true)
        
    }
    const handleCloseWithoutReplace = () => {
        setOpen(false)
        setFileList([])
        setSelectedOrgId()
    }

    const replaceFileDialog = (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                // onClose={handleCloseWithoutReplace}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                File already exists, Do you want to replace it?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseWithReplace} autoFocus>
                        Yes
                    </Button>
                    <Button autoFocus onClick={handleCloseWithoutReplace}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    return (
        <div className='file-upload-view'>
            <div>
                <h1>Upload File</h1>
                <p>You can upload pdf, docx</p>
                <p>Allowed Limit 5MB</p>
            </div>
            <Autocomplete
                disableClearable
                style={{marginBottom: "10px"}}
                options={orgsList}
                getOptionLabel={(options)=>options.name}
                renderInput={(params) => <TextField {...params} label="Organisation" />}
                onChange={(event, value) => (setSelectedOrgId(value['id']))}
                value={selectedOrgId}
            />
            <Upload
                accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={!selectedOrgId}
                customRequest={handleUpload}
                onChange={handleChange}
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            { open ? replaceFileDialog : null }
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
                </Modal>
        </div>
    );
};
export default UploadButton;