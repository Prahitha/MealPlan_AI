import React from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FcUpload } from 'react-icons/fc';

const ImageUploader = ({ onFoodItemsReceived }) => {
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      // Create a FormData object and append the image file
      const formData = new FormData();
      formData.append("image", file);
      
      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1])
    }

      // Send the image to the server for Google Vision API processing
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the server responds with the recognized text
      onFoodItemsReceived(response.data);

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <FcUpload size={35}/>
      </div>
    </div>
  );
};

export default ImageUploader;
