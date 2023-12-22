import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ onFoodItemsReceived }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      // Create a FormData object and append the image file
      const formData = new FormData();
      console.log(file, file.name)
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
      const recognizedText = response.data.recognized_text;

      // Handle the recognized text as needed
      console.log('Recognized Text:', recognizedText);

      // You may want to extract food items from the recognized text
      // and pass them to onFoodItemsReceived function
      const foodItems = extractFoodItemsFromRecognizedText(recognizedText);
      onFoodItemsReceived(foodItems);

      // Set the uploaded image for display
      setUploadedImage(file);
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
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>
      {uploadedImage && <img src={URL.createObjectURL(uploadedImage)} alt="Uploaded" style={imageStyle} />}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #ccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const imageStyle = {
  marginTop: '20px',
  maxWidth: '100%',
};

// Placeholder function to extract food items from recognized text
const extractFoodItemsFromRecognizedText = (recognizedText) => {
  // Implement your logic to extract food items from recognized text
  // This will depend on the structure of the recognized text
  // Return an array of food items
  return [];
};

export default ImageUploader;
