const shell = require("shelljs");
const fs = require("fs");
const readlineSync = require("readline-sync");

var tst = 'python -c "import sys; py2, act = 0, 0; py2 = 1 if not hasattr(sys, \'base_prefix\') else 0; act = 1 if py2 == 0 and sys.base_prefix != sys.prefix else 0 if hasattr(sys, \'real_prefix\') == False else 1; print(act)"';
var actVnv = shell.exec(tst, {silent:true, async:false, fatal: true}).stdout.trim();

const package_json = "./package.json";
let file = JSON.parse(fs.readFileSync(package_json, 'utf-8'));

if (actVnv == "0"){
    console.log("PLEASE ACTIVATE your python environment!!!\n");
    process.exit(1);
}

async function commandCalls(){
    const pythonVenvName = readlineSync.question("Please, enter your python virtual Envrionment Name: ");
    await fs.access("./" + pythonVenvName, async function (error) {
        if(!error){
            console.log("Directory exists!");
            shell.exec("python -m pip install pip --upgrade && python -m pip install -r requirements.txt");
            console.log("All python packages are installed!");
            if(process.platform == "win32"){
                file.scripts["start-api"] = pythonVenvName + "\\Scripts\\flask run --no-debugger";
                file.scripts["sa"] = pythonVenvName + "\\Scripts\\flask run";
            }
            else{
                file.scripts["start-api"] = pythonVenvName + "/bin/flask run --no-debugger";
                file.scripts["sa"] = pythonVenvName + "/bin/flask run";
            }
        
            await fs.writeFile(package_json, JSON.stringify(file, null, 2), async function(error){
                if(error){
                    console.log(error);
                }
                else{
                    await shell.exec("npm install");
                    console.log("Install all node packages!");
                }
            });
        }
        else{
            console.log("This directory does not exist in the current working directory!");
            await fs.writeFile(package_json, JSON.stringify(file, null, 2), 'utf-8', function(error, result){
                if(error){
                    console.log(error);
                }
            });
        }
    });
}

commandCalls();