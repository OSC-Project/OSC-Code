import os
import sys
import subprocess
import tarfile
import json
from pathlib import Path

def getCodeQLCommandMapping():
    
    # CodeQL Commands
    createDB = "codeql database create --language=javascript --source-root {} {}"
    upgradeDB = "database upgrade {}"
    runQuery = "codeql database analyze {} {} --format=csv --output={}"

    # command Mapping (must remember to fill in the format)
    commandMap = {
        0 : createDB,         
        1 : upgradeDB,
        2 : runQuery,
    }
    return commandMap 

## must be run in directory OSC_PythonScript
def getDirectoryMapping():
    
    # Directories
    codeQLCLI = str(Path(os.getcwd()).parents[0]) 
    StartingDirectory = os.path.normpath(os.getcwd())
    ext_js_src = os.path.join(codeqlCLI, "ext_JS_src")
    OSC_CodeQueries = os.path.join(codeqlCLI, "OSC_CodeQueries")
    DB_Storage = os.path.join(codeqlCLI, "DB_Storage")
    ql = os.path.join(codeqlCLI, "ql")
    queryResults = os.path.join(codeqlCLI, "queryResults")
    
    # Directory Mapping (usage: os.chdir(dir[1]) = os.chdir(codeQLCLI)
    dirMap = {
        0 : StartingDirectory,         
        1 : codeQLCLI,
        2 : ext_js_src,
        3 : OSC_CodeQueries,
        4 : DB_Storage,
        5 : ql,
        6 : queryResults
    }
    return dirMap 


class Automation:

    def __init__(self, JSFolder, qlFile):
        self.js_src = JSFolder
        self.queries = qlFile
        self.status = 0
        self.dbName = ""
        self.csvName = ""
        self.dirMap = getDirectoryMapping() 
        self.QLCommands = getCodeQLCommandMapping() 

    def getAutomationData(self):
        return [self.js_src, self.queries, self.status]
    
    def printAutomationData(self):
        print(" JavaScript Source: " + self.js_src + ", Query(ies): " + self.queries + ", Status: " + self.status)

    def checkForJSFolder(self):
        os.chdir(self.dirMap[0]) 
        os.chdir(self.dirMap[2])
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in dirs:
                    if(name == self.js_src){
                        return True 
                    }
            return False
        except:
            print("Error in Automation - Check For JS folder")
            return False
        
    def checkForCodeDB(self):
        os.chdir(self.dirMap[0]) 
        os.chdir(self.dirMap[4])
        DBname = self.js_src + "DB"
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in dirs:
                    if(name == DBname){
                        return True 
                    }
            return False
        except:
            print("Error in Automation - Check For JS folder")
            return False

    def checkForQueries(self):
        os.chdir(self.dirMap[0]) 
        os.chdir(self.dirMap[3])
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in files:
                    if(name == self.queries){
                        return True 
                    }
            return False
        except:
            print("Error in Automation - Check For Query(ies)")
            return False
    
    def run(self):
        test1 = self.checkForJSFolder()
        test2 = self.checkForQueries()
        test3 = self.checkForCodeDB()

        if(!test1):   #delegate to src.py to get the JS package
            pass 

        if(!test2): 
            print("NO query(ies) found with the name: " + self.queries)
            return False 
            
        if(test3):
            pass:     #delete old DB and make a new CodeQL Database instance 
        
        # Begining executing the CodeQL Commands
        os.chdir(self.dirMap[0])
        os.chdir(self.dirMap[1])
        self.csvName = self.js_src + "DB" + "-" + self.queries + ".csv"

        create = self.QLCommands[0].format(self.js_src, self.js_src + "DB")
        upgrade = self.QLCommands[1].format(self.js_src + "DB")
        runQueries = self.QLCommands[2].format(self.js_src + "DB", self.queries, self.csvName)


        try:
            outputCreate = subprocess.check_output(create, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
        except:
            print("Create CodeQL Database Failed!")
            return False

        try:
            outputUpgrade = subprocess.check_output(upgrade, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
        except:
            print("Upgrade CodeQL Database Failed!")
            return False

        try:
            outputRunQueries = subprocess.check_output(runQueries, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
        except:
            print("Run Queries Failed")
            return False
        
        print("Success!")
        return True 

    # Delegate this to src_internalDB later
    def downloadJSFolder(self):
        pass 

    # can possibly entend to automation of multiple JS folders - make class 'live' and 'responsive'
    def changeJSFolder(self, JSFolder):
        self.js_src = JSFolder 




if __name__ == "__main__":
    # External files
    download_script = "src_internalDB.py"
    db_file = "cwe94.json"

    # Automation Process 
    autom = Automation("prototype0.0.1", "customCodeInjection2.ql")
    autom.run()
