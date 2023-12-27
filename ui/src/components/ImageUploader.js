import React from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FcUpload } from 'react-icons/fc';

/**
 * ImageUploader component allows users to upload an image and sends it to the server
 * for processing using Google Vision API.
 *
 * @param {Object} props - The component properties.
 * @param {Function} props.onFoodItemsReceived - Callback function to handle received food items.
 * @returns {React.ReactNode} The ImageUploader component.
 */
const ImageUploader = ({ onFoodItemsReceived }) => {
  /**
   * Handles the dropped image file, sends it to the server, and receives recognized food items.
   *
   * @param {Array} acceptedFiles - Array of accepted dropped files.
   */
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      // Create a FormData object and append the image file
      const formData = new FormData();
      formData.append("image", file);

      // Log FormData entries for debugging
      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
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

  // useDropzone hook for handling drag-and-drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div>
      {/* Dropzone area with file input */}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {/* Upload icon */}
        <FcUpload size={35}/>
      </div>
    </div>
  );
};

export default ImageUploader;
