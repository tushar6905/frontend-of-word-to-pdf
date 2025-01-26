import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa";
import axios from 'axios'


const Home = () => {
    const [selectedFile,setSelectedFile]=useState(null)
    const [convert,setConvert]=useState('')
    const [downloadError,setDownloadError]=useState('')
    const handleFileChange=(e)=>{
        //  console.log(e.target.files[0].name)
        setSelectedFile(e.target.files[0])
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(!selectedFile){
            setConvert("Please select a file")
            return ;
        }
        const formData= new FormData()
        formData.append('file',selectedFile)
        try {
           const response= await axios.post('https://backend-of-word-to-pdf.onrender.com/convertFile',formData,{
                responseType:'blob',  
            })
            const url=window.URL.createObjectURL(new Blob([response.data]))
            const link=document.createElement('a')
            link.href=url;
            link.setAttribute('download',selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf")
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            setSelectedFile(null)
            setDownloadError('')
            
        } catch (error) {
            if(error.response && error.response.status===400){
                console.log(error.response.data.message)
                setDownloadError('Error downloading file')
            }else {
                setConvert('')
            }
        }
    }
  return (
    <>
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 ">
        <div className="flex h-screen justify-center items-center ">
          <div className="border-2 border-dashed rounded-xl px-4 py-2 md:px-8 md:py-6 border-indigo-400 shadow-lg ">
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word to PDF
            </h1>
            <p className="text-sm text-center mb-5">
              Easily convert Word documents to PDF format online, without
              installing any software
            </p>
          
          <div className="flex flex-col space-y-4 justify-center items-center">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="FileInput"
            />
            <label
              htmlFor="FileInput"
              className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg border-blue-300 cursor-pointer hover:bg-blue-700 duration-300 hover:text-white"
            ><FaFileWord className="text-3xl mr-3 hover:text-white" /> <span className="text-3xl mr-2 hover:text-white">{selectedFile ? selectedFile.name : 'Choose File'}</span></label>
            <button onClick={handleSubmit} disabled={!selectedFile} className="text-white disabled:bg-gray-400 disabled:pointer-events-none bg-blue-500 hover:bg-blue-700 duration-100 py-2 px-4 font-bold rounded-sm">Covert File</button>
            {convert && <p className='text-green-500'>{convert}</p>}
            {downloadError && <p className='text-red-500'>{downloadError}</p>}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
