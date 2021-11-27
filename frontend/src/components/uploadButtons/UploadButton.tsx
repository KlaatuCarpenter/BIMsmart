import React from "react"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import UploadButtonInterface from "../../interfaces/UploadButtonInterface"



const Input = styled('input')({
    display: 'none',
});

export const UploadButton = ({ file, label, changeHandler }: UploadButtonInterface) => {
    return (
        <div>{file ? (
            <div className="d-flex justify-content-between mt-2 mb-2">
                <div>{file.name}</div>
                <div>
                    <label htmlFor={label.replace(/\s/g, "")}>
                        <Input id={label.replace(/\s/g, "")} type="file" onChange={changeHandler} />
                        <Button variant="contained" component="span" >
                            Change
                        </Button>
                    </label>
                </div>
            </div>

        ) : (
            <label className="w-100 mt-2 mb-2" htmlFor={label.replace(/\s/g, "")}>
                <Input id={label.replace(/\s/g, "")} type="file" onChange={changeHandler} />
                <Button fullWidth variant="contained" component="span">
                    {label}
                </Button>
            </label>
        )}
        </div>


    )

}


// <Input id={label.replace(/\s/g, "")} type="file" onChange={changeHandler} />