import requests
import os

BASE_URL = "http://localhost:8000/api/v1"
PROJECT_ID = "E2E Test Project2"  # Using an existing project

def test_connection():
    """Tests the base endpoint to check if the backend is running."""
    print("--- Testing Connection ---")
    try:
        response = requests.get(f"{BASE_URL}/")
        response.raise_for_status()
        print("Connection Successful!")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Connection Failed: {e}")
        return False

def test_list_projects():
    """Tests listing all available projects."""
    print("\n--- Testing List Projects ---")
    try:
        response = requests.get(f"{BASE_URL}/projects/")
        response.raise_for_status()
        projects = response.json()
        print("List Projects Successful!")
        print(f"Projects: {projects}")
        return projects
    except requests.exceptions.RequestException as e:
        print(f"List Projects Failed: {e}")
        return None

def test_file_upload(project_id, file_path):
    """Tests uploading a file to a specific project."""
    print(f"\n--- Testing File Upload for project '{project_id}' ---")
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return False

    try:
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f, 'text/plain')}
            response = requests.post(f"{BASE_URL}/data/upload/{project_id}", files=files)
            response.raise_for_status()
            print("File Upload Successful!")
            print(f"Response: {response.json()}")
            return True
    except requests.exceptions.RequestException as e:
        print(f"File Upload Failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text}")
        return False

def test_process_files(project_id):
    """Tests processing uploaded files for a project."""
    print(f"\n--- Testing Process Files for project '{project_id}' ---")
    try:
        # We send do_reset=1 to clear any previous failed processing attempts
        payload = {"do_reset": 1}
        response = requests.post(f"{BASE_URL}/data/process/{project_id}", json=payload)
        response.raise_for_status()
        print("Process Files Successful!")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Process Files Failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text}")
        return False

def test_search(project_id, query):
    """Tests searching the indexed data for a project."""
    print(f"\n--- Testing Search for project '{project_id}' with query '{query}' ---")
    try:
        payload = {"text": query, "limit": 3}
        response = requests.post(f"{BASE_URL}/nlp/index/search/{project_id}", json=payload)
        response.raise_for_status()
        print("Search Successful!")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Search Failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text}")
        return False

def test_answer(project_id, query):
    """Tests the RAG answer endpoint."""
    print(f"\n--- Testing Answer for project '{project_id}' with query '{query}' ---")
    try:
        payload = {"text": query, "limit": 3}
        response = requests.post(f"{BASE_URL}/nlp/index/answer/{project_id}", json=payload)
        response.raise_for_status()
        print("Answer Successful!")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Answer Failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text}")
        return False

if __name__ == "__main__":
    if test_connection():
        projects_data = test_list_projects()
        project_id_to_use = None
        if projects_data and projects_data.get('signal') == 'success':
            for project in projects_data.get('projects', []):
                if project.get('name') == PROJECT_ID:
                    project_id_to_use = project.get('id')
                    break
        
        if project_id_to_use is None:
            print(f"Could not find project with name '{PROJECT_ID}'")
        else:
            print(f"\nFound project '{PROJECT_ID}' with ID: {project_id_to_use}\n")
            # Path to the test file we created earlier
            test_file = "test_document.txt"
            
            if test_file_upload(project_id_to_use, test_file):
                if test_process_files(project_id_to_use):
                    test_search(project_id_to_use, "quick brown fox") 