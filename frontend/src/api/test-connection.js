// Test connection utilities

/**
 * Test direct connection to the backend API
 * @returns {Promise<Object>} The API response
 */
export const testDirectConnection = async () => {
  try {
    const response = await fetch('http://173.212.254.228:5000/api/v1/projects/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Direct connection error:', error);
    throw error;
  }
};

/**
 * Test connection through the proxy
 * @returns {Promise<Object>} The API response
 */
export const testProxyConnection = async () => {
  try {
    const response = await fetch('/api/v1/projects/');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Proxy connection error:', error);
    throw error;
  }
};

/**
 * Test connection with CORS headers
 * @returns {Promise<Object>} The API response
 */
export const testCorsConnection = async () => {
  try {
    const response = await fetch('http://173.212.254.228:5000/api/v1/projects/', {
      mode: 'cors',
      headers: {
        'Origin': window.location.origin,
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('CORS connection error:', error);
    throw error;
  }
}; 