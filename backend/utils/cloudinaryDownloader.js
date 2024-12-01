const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

async function downloadFileFromCloudinary(cloudinaryUrl, fileType) {
  try {
    const response = await axios({
      url: cloudinaryUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const filePath = path.resolve(__dirname, `../downloads/temp.${fileType}`);

    try {
      await fs.writeFile(filePath, response.data);
      return filePath; // Return path to downloaded file
    } catch (writeError) {
      return `Error writing file: ${writeError.message}`;
    }
  } catch (axiosError) {
    return `Error downloading file: ${axiosError.message}`;
  }
}

module.exports = { 
    downloadFileFromCloudinary 
};
