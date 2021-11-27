interface UploadButtonInterface {
    file: File | undefined,
    label: string, 
    changeHandler: React.ChangeEventHandler<HTMLInputElement>
}

export default UploadButtonInterface;