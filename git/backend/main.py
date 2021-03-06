from fastapi import Depends, FastAPI , HTTPException, status, Security
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import pyrebase
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


class UserIN(BaseModel):
    email       : str
    password    : str

origins = [
    "http://0.0.0.0:8000/",
    "http://127.0.0.1:8000/",
    "*",   
            
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hola"}

firebaseConfig = {
  "apiKey": "AIzaSyBoM8UTB3QctzA873CuWBDWM_y7bGoo0bk",
  "authDomain": "fastapi-c5049.firebaseapp.com",
  "databaseURL": "https://fastapi-c5049-default-rtdb.firebaseio.com",
  "projectId": "fastapi-c5049",
  "storageBucket": "fastapi-c5049.appspot.com",
  "messagingSenderId": "552147332644",
  "appId": "1:552147332644:web:e04ce0f5335be5616832b1"
};

firebase = pyrebase.initialize_app(firebaseConfig)

securityBasic  = HTTPBasic()
securityBearer = HTTPBearer()

@app.post(
    "/users/token",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un token para el usuario",
    description="Consigue un token para el usuario",
    tags=["auth"],
)

async def post_token(credentials: HTTPBasicCredentials = Depends(securityBasic)):
    try:
        email = credentials.username
        password = credentials.password
        auth = firebase.auth()
        user = auth.sign_in_with_email_and_password(email, password)
        #response=user
        response = {
            "token": user["idToken"]
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )

@app.get(
    "/users/",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Consigue un usuario",
    description="Consigue un usuario",
    tags=["auth"]
)

async def get_user(credentials: HTTPAuthorizationCredentials = Depends(securityBearer)):
    try:
        #token = credentials.credentials
        auth = firebase.auth()
        user = auth.get_account_info(credentials.credentials)
        uid = user["users"][0]["localId"]

        db=firebase.database()
        user_data = db.child("users").child(uid).get().val()

        response = {
            #"user": user,
            "user_data" : user_data
        }
        return response
    except Exception as error:
        print(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED           
        )
        


@app.post(  "/users/",  
    status_code=status.HTTP_202_ACCEPTED, 
    summary="Crea un usuario",
    description="Crea un usuario", 
    tags=["auth"]
)

async def create_user(usuario: UserIN ):
    try:
        auth = firebase.auth()
        db=firebase.database()
        user = auth.create_user_with_email_and_password(usuario.email, usuario.password)
        uid = user["localId"]
        db.child("users").child(uid).set({"email": usuario.email, "level": 1 })
        response = {"Usuario Agregado"}
        return response
    except Exception as error:
        print(f"Error: {error}")
        return(f"Error: {error}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client exist",
        )
        
        