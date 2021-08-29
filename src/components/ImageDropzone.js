import { IconButton } from '@material-ui/core';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import DeleteIcon from '@material-ui/icons/Delete';

export default function ImageDropzone({setImageToUpload}) {
    const [currFile, setCurrFile] = useState({ isEmpty: true });
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: "image/*",
        minSize: 0,
        maxSize: 1048576,
        onDrop: (acceptedFiles, fileRejections) => {
            if(acceptedFiles.length){
                setCurrFile({ isEmpty: false, preview: URL.createObjectURL(acceptedFiles[0]) });
                setImageToUpload(acceptedFiles[0]);
            } else if(fileRejections.length > 1){
                setImageToUpload({ error: "tooManyFiles" });
            } else if(fileRejections.length === 1){
                setImageToUpload({ error: "wrongInput" });
            }
        }
    });

    const cancelImage = () => {
        URL.revokeObjectURL(currFile.preview);
        setCurrFile({ isEmpty: true, preview: "" });
        setImageToUpload({});
    };

    return(
        <div style={{ width: "90vw", maxWidth: 400 }}>
            {currFile.isEmpty ?
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p><FormattedMessage id="createcollection-page.dropzone" /></p>
                </div> : 
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <IconButton onClick={cancelImage} style={{ color: "black", width: 32, height: 32 }}>
                        <DeleteIcon />
                    </IconButton>
                    <img src={currFile.preview} style={{ maxWidth: 200, maxHeight: 200, marginBottom: 8 }}/>
                </div>
            }
        </div>
    );
}