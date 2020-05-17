## Step 1: Clone the repo to your local system
```
git clone https://github.com/mktom/Reccomender-DART
```

## Step 2: Install NodeJS on local system

1. Download Node.js: https://nodejs.org/en/download/
2. Download Yarn:  
    - For Windows users: Download Choco: https://chocolatey.org/ 
        ```
        choco install yarn 
        ```
    - For MacOS users: 
        ```
        brew install yarn
        ```

**NOTE**: Windows users must make NodeJs and Choco as Global Environment variables
**NOTE 2**: Working Directory: dart (Change directory here)

## Step 3: Install NPM dependencies
```
npm install
```

## Step 4: Install Python Environment and dependencies
Ensure python version is: Python >=3.6.10 https://www.python.org/downloads/

1. Windows:
    ```
    python -m venv <Your-Environment-Name>
    <Your-Environment-Name>\Scripts\activate.bat OR <Your-Environment-Name>\Scripts\activate
    pip install -r requirements.txt
    ```

    In *package.json* file, in the scripts object, change:
    ```
    "start-api": "<Your-Environment-Name>\\Scripts\\flask run --no-debugger"
    ```
2. MacOS:
    ```
    python -m venv <Your-Environment-Name>
    source <Your-Environment-Name>/bin/activate
    pip install -r requirements.txt
    ```

    In *package.json* file, in the scripts object, change:
    ```
    "start-api": "<Your-Environment-Name>/bin/flask run --no-debugger"
    ```
## Step 5: Install Python torch dependecy
```
python -m pip install torch==1.3.1 -f https://download.pytorch.org/whl/torch_stable.html
```

## Step 6: Port availability
Make sure that port 5000 is available in your system.
**IF NOT**, then:
1. In *.flaskenv*, change FLASK_RUN_PORT = [Your-Flask-Port]
2. In *package.json*, in the proxy variable, change "proxy": "https://localhost:[Your-Flask-Port]" 

## Step 7: MongoDB Install
Ensure Mongo version is: MongoDB Community Server 4.2.5 https://www.mongodb.com/download-center/community?tck=docs_server

Install instructions for:
1. Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   
   Then to start the server:
    ```
    mongod --dbpath "C:\Program Files\MongoDB\Server\4.2\data" --bind_ip 127.0.0.1 --port 27017
    ```

2. MacOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

    Then to start the server:
    ```
    mongod --dbpath "/data/db" --bind_ip 127.0.0.1 --port 27017
    ```

## Step 8: To start the app
```
npm run build-wbpk ##Creates the bundle.js file
```

```
npm run start-api ##Starts the flask-server
```

Open a browser of your choice and enter the URL:
```
https://localhost:[Your-Flask-Port] 
OR
[Absolute Path of Project]\dart\index.html
```

## Note 1:
Please refer to your "https://localhost:[Your-Flask-Port]/doco" for futher documentation or Refer to the final Project Report.

## Note 2:
For your convenience you can use *'npm run upgrade'* to install both node and python packages, as well as specify your python environment in *package.json*. If you choose to, please, **FIRST** install:

    npm install --save shelljs readline-sync

## Note 3:
To make sure any previous instances of MongoDB are no longer running:
1. Windows:
```
net stop MongoDB ##If you installed it as a service 
OR
taskkill /f /im mongod.exe ##Otherwise
```

2. MacOS:
```
top ## to find the PID of the mongod process

kill <mongod process ID> 
OR
kill -2 <mongod process ID> ## -2 flag is for SIGINT
```

## Note 4:
Make sure that mongod is running for flask to connect to the database. You can make sure that the server is running by connecting to "http://localhost:27017" in the MongoDB Compass Community app.

**Note** The URL will not work in the browser unless you enable http interface which appears to be depreciated in preference to the MongoDB Compass app.