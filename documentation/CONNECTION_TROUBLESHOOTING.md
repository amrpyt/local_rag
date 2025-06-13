# Backend Connection Troubleshooting Guide

## Current Connection Issues

We're experiencing connection problems between our frontend application running on `http://localhost:3002` and the remote backend server at `http://173.212.254.228:3001/api/v1`. The main symptoms are:

- Frontend API requests fail with "Network Error"
- Browser console shows "ERR_CONNECTION_REFUSED" errors
- Terminal curl requests to the same endpoints succeed
- Proxy configuration in Vite is not resolving the issue

## Diagnostic Steps

### 1. Verify Server Accessibility

```bash
# Test basic connectivity
curl -v http://173.212.254.228:3001/api/v1/projects/

# Test with OPTIONS request (CORS preflight)
curl -v -X OPTIONS http://173.212.254.228:3001/api/v1/projects/ \
  -H "Origin: http://localhost:3002" \
  -H "Access-Control-Request-Method: GET"
```

**Expected result**: Server should respond with proper CORS headers including:
```
Access-Control-Allow-Origin: http://localhost:3002
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### 2. Check Network Firewall and Routing

- Verify no firewall rules are blocking connections
- Check if the server IP can be reached from the development environment
- Try accessing from a different network to rule out local network restrictions

### 3. Inspect Server CORS Configuration

The backend FastAPI server needs proper CORS configuration. Check `main.py` for:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Solution Approaches

### Approach 1: Fix Server CORS Configuration

1. SSH into the backend server:
   ```bash
   ssh user@173.212.254.228
   ```

2. Edit the FastAPI application's `main.py`:
   ```bash
   nano /path/to/app/main.py
   ```

3. Add or update the CORS middleware configuration as shown above

4. Restart the FastAPI service:
   ```bash
   sudo systemctl restart app_service  # or equivalent command
   ```

### Approach 2: Local Development Proxy

If unable to modify the backend server directly, set up a local proxy:

1. Install a CORS proxy:
   ```bash
   npm install -g local-cors-proxy
   ```

2. Run the proxy:
   ```bash
   lcp --proxyUrl http://173.212.254.228:3001
   ```

3. Update the frontend API client to use the proxy:
   ```typescript
   const apiClient = axios.create({
     baseURL: 'http://localhost:8010/proxy/api/v1',
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

### Approach 3: Cloud-Based CORS Proxy

Use a public CORS proxy service for temporary development:

1. Update API client to use a service like CORS Anywhere:
   ```typescript
   const apiClient = axios.create({
     baseURL: 'https://cors-anywhere.herokuapp.com/http://173.212.254.228:3001/api/v1',
     headers: {
       'Content-Type': 'application/json',
       'Origin': 'http://localhost:3002'
     },
   });
   ```

2. Request temporary access to the CORS proxy service if required

### Approach 4: Run a Local Backend

If the remote backend is consistently inaccessible:

1. Clone the backend repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with appropriate settings
   ```
4. Run the local server:
   ```bash
   uvicorn main:app --reload --port 3001
   ```
5. Update frontend to use local backend:
   ```typescript
   const apiClient = axios.create({
     baseURL: 'http://localhost:3001/api/v1',
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```

## Testing After Changes

After implementing any solution, test the connection:

1. Check browser console for CORS or connection errors
2. Use the application's built-in "Test API" feature
3. Monitor network requests in browser developer tools
4. Verify successful project loading and creation

## Common Pitfalls

1. **Missing CORS headers**: All API endpoints must return proper CORS headers
2. **Incorrect Origin URLs**: Ensure the exact frontend URL is in the allowed origins list
3. **Proxy misconfiguration**: Check for typos in proxy URL settings
4. **Backend authentication**: Some endpoints might require authentication headers
5. **Network security**: Corporate networks might block connections to external servers

## Next Steps if Issues Persist

1. Deploy the frontend to the same domain as the backend
2. Set up a dedicated API gateway with proper CORS handling
3. Configure a reverse proxy server (Nginx, Apache) with CORS headers
4. Contact the backend server administrator for assistance 