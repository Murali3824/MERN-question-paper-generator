import { useState } from "react";
import { uploadFile } from "../services/api";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setMessage("Please select an Excel file");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadFile(file);
      setMessage(`✅ File uploaded successfully! ${response.data.count} questions processed.`);
      setFile(null);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "❌ File upload failed";
      const missingHeaders = error.response?.data?.missingHeaders;
      
      if (missingHeaders) {
        setMessage(`${errorMessage}: ${missingHeaders.join(', ')}`);
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Question Bank</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Excel File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Uploading...' : 'Upload File'}
      </button>

      {message && (
        <p className={`mt-4 text-sm ${
          message.includes('✅') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default FileUpload;