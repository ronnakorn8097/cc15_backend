# API Spec
login
[POST] /api/auths/login
headers
- Authorization: Bearer {token}
body null
response
- 200 
  - {
    "message": "Login success",
    "results": {
        "token": "xxx"
    }
  }
- 400
- 401
