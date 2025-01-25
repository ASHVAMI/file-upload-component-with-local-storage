import React, { useState, useEffect } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Load saved files from localStorage on component mount
    const savedFiles = JSON.parse(localStorage.getItem('savedFiles') || '[]');
    setFiles(savedFiles);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        data: e.target.result,
        uploadDate: new Date().toISOString()
      };

      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
      setSelectedFile(null);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">File Upload Demo</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <input
            type="file"
            onChange={handleFileSelect}
            className="mb-4 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-md text-white ${
              selectedFile ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
            }`}
          >
            Upload File
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold p-6 border-b">Stored Files</h2>
          <div className="divide-y">
            {files.map(file => (
              <div key={file.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={file.data}
                    download={file.name}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <p className="p-6 text-gray-500 text-center">No files uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;