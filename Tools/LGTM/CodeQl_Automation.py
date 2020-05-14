import os
import sys
import subprocess
import tarfile
import json
from pathlib import Path
import shutil


def getCodeQLCommandMapping():

    # CodeQL Commands
    createDB = "./codeql/codeql database create --language=javascript --source-root {} {}"
    upgradeDB = "./codeql/codeql database upgrade {}"
    runQuery = "./codeql/codeql database analyze {} {} --format=csv --output={}"

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
    ext_js_src = os.path.join(StartingDirectory, "ext_JS_src")
    OSC_CodeQueries = os.path.join(StartingDirectory, "OSC_CodeQueries")
    DB_Storage = os.path.join(StartingDirectory, "DB_Storage")
    ql = os.path.join(StartingDirectory, "ql")
    QueryResults = os.path.join(StartingDirectory, "Query_Results")

    # Directory Mapping (usage: os.chdir(dir[1]) = os.chdir(codeQLCLI)
    dirMap = {
        0 : StartingDirectory,
        1 : codeQLCLI,
        2 : ext_js_src,
        3 : OSC_CodeQueries,
        4 : DB_Storage,
        5 : ql,
        6 : QueryResults
    }
    return dirMap


def getCustomDirectoryMapping(jsPath, queryPath):

    # Directories
    codeQLCLI = str(Path(os.getcwd()).parents[0])
    StartingDirectory = os.path.normpath(os.getcwd())
    ext_js_src = os.path.join(StartingDirectory, "ext_JS_src")
    OSC_CodeQueries = os.path.join(StartingDirectory, "OSC_CodeQueries")
    DB_Storage = os.path.join(StartingDirectory, "DB_Storage")
    ql = os.path.join(StartingDirectory, "ql")
    QueryResults = os.path.join(StartingDirectory, "Query_Results")

    if(jsPath != ""):
        ext_js_src = jsPath


    if(queryPath != ""):
        OSC_CodeQueries = queryPath

    # Directory Mapping (usage: os.chdir(dir[1]) = os.chdir(codeQLCLI)
    dirMap = {
        0 : StartingDirectory,
        1 : codeQLCLI,
        2 : ext_js_src,
        3 : OSC_CodeQueries,
        4 : DB_Storage,
        5 : ql,
        6 : QueryResults
    }
    return dirMap

def make_folder(folder_name, location):
    folder_name = folder_name.replace("%", "")
    folder_name = folder_name.replace("?", "")
    folder_name = folder_name.replace("/", "")
    folder_name = folder_name.replace("\\", "")
    folder_name = folder_name.replace("*", "")
    folder_name = folder_name.replace(":", "")
    folder_name = folder_name.replace("<", "")
    folder_name = folder_name.replace(">", "")
    folder_name = folder_name.replace("|", "")
    #folder_name = folder_name.replace(".", "")

    new_path = os.path.join(location, folder_name)
    #print(new_path)

    if not os.path.exists(new_path):
        #print("Finalizing folder path: ", new_path)
        os.mkdir(new_path)
        return new_path
    else:
        return new_path

class NPMextractor:
    def __init__(self, location):
        self.dir = location
        self.NPMcommand = "npm pack {}"



    def get(self, JSpackage):
        #baseJSDir = ''.join([i for i in JSpackage if((not i.isdigit()) or (i != "." ))])
        os.chdir(self.dir)
        make_folder(JSpackage, self.dir)

        notHeadVersion =  self.hasNumbers(JSpackage) # if there are no numbers we will pack the latest version

        if(not notHeadVersion): # we are packing the latest version
            getPackageCommand = self.NPMcommand.format(JSpackage)
        else:
            index = len(JSpackage)
            for c in reversed(JSpackage):
                if((not c.isdigit()) and (c != "." )):
                    break
                index = index - 1

            JSpackageFormatted = JSpackage[:index] + "@" + JSpackage[index:]
            getPackageCommand = self.NPMcommand.format(JSpackageFormatted)

        print(getPackageCommand)
        pack = subprocess.check_output(getPackageCommand, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
        self.extractTar()
        self.removeTar()



    def extractTar(self):
        for root, dirs, files in os.walk(".", topdown=True):
                for name in files:
                    if(".tgz" in name):
                        tf = tarfile.open(name)
                        extractionDir = (name.replace("-", "")).replace(".tgz", "")
                        tf.extractall(extractionDir)
                    else:
                        pass
                tf.close()

    def removeTar(self):
        for item in os.listdir("."):
            if(".tgz" in item):
                tgzfile = item
                os.remove(tgzfile)
            else:
                pass

    def hasNumbers(self, inputString):
        return any(char.isdigit() for char in inputString)


class Automation:

    def __init__(self, JSFolder, qlFile):
        self.js_src = JSFolder
        self.queries = qlFile
        self.status = 0
        self.configuredMap(JSFolder, qlFile)
        self.dbName = (self.js_src + "DB").replace(".", "-")
        self.csvName = (self.dbName + "_" + self.queries + ".csv" ).replace(".ql", "")
        #self.dirMap = getDirectoryMapping()
        self.QLCommands = getCodeQLCommandMapping()
        self.npmTool = NPMextractor(self.dirMap[2])

    def configuredMap(self, JSFolder, qlFile):
        jsDirectory = ""
        #Argument is seperate JS directory location (not implemented)
        #if(os.path.exists(JSFolder)):
            #print("true")
            #print(os.path.basename(fn))
            #print(os.path.split(fn)[0])
        #else:
            #print("false")
        if((os.path.exists(qlFile)) and (".q" in os.path.split(qlFile)[1])):
            queryDirectory = os.path.split(qlFile)[0]
            self.queries = os.path.split(qlFile)[1]
            self.dirMap = getCustomDirectoryMapping(jsDirectory, queryDirectory)
        else:
            self.dirMap = getDirectoryMapping()

    def defaultMap(self):
        self.dirMap = getDirectoryMapping()

    def getAutomationData(self):
        return [self.js_src, self.queries, self.status]

    def printAutomationData(self):
        print("AUTOMATION DATA:")
        print("JavaScript Source: " + str(self.js_src) + ", Query(ies): " + str(self.queries) + ", Status: " + str(self.status))
        print("DirMap:")
        for i in range(len(self.dirMap)):
            print(i, self.dirMap[i])
    def checkForJSFolder(self):
        os.chdir(self.dirMap[0])
        os.chdir(self.dirMap[2])
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in dirs:
                    if(name == self.js_src):
                        return True

            return False
        except:
            print("Error in Automation - Check For JS folder")
            return False

    def checkForCodeDB(self):
        os.chdir(self.dirMap[0])
        os.chdir(self.dirMap[4])
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in dirs:
                    if(name == self.dbName):
                        return True
            return False
        except:
            print("Error in Automation - Check For CodeDB")
            return False

    def checkForQueries(self):
        os.chdir(self.dirMap[0])
        os.chdir(self.dirMap[3])
        try:
            for root, dirs, files in os.walk(".", topdown=True):
                for name in files:
                    if(name == self.queries):
                        return True

            return False
        except:
            print("Error in Automation - Check For Query(ies)")
            return False

    def verifyDirectoryLayout(self):
        os.chdir(self.dirMap[0])
        make_folder("ext_JS_src", self.dirMap[0])
        make_folder("DB_Storage", self.dirMap[0])
        make_folder("Query_Results", self.dirMap[0])

    def clean(self): # CAUTION deletes created directory and contents from verifyDirectoryLayout() CAUTION
        os.chdir(self.dirMap[0])
        shutil.rmtree(self.dirMap[2])
        shutil.rmtree(self.dirMap[4])


    def run(self):
        self.verifyDirectoryLayout()
        #self.printAutomationData()
        jsExist = self.checkForJSFolder()
        queryExist = self.checkForQueries()
        dbExist = self.checkForCodeDB()

        #print("Check for JS Folder: " + str(jsExist))
        #print("Check for Queries: " + str(queryExist))
        #print("test for Check for CodeDB: " + str(dbExist))


        if(not jsExist):   #delegate to src.py to get the JS package

            print("NO Javascript found with the name: " + self.js_src)
            print("Attempting to install JS package ")
            self.npmTool.get(self.js_src)



        if(not queryExist):
            print("NO query(ies) found with the name: " + self.queries)
            return False

        if(dbExist):
            print("warning: CodeQL Database for  " + self.js_src + " already exist")
            #shutil.rmtree(os.path.join(self.dirMap[4], self.dbName)) #delete old DB in order to make a new CodeQL Database instance
            pass

        # Step 2: formatting the commands to our arguments
        os.chdir(self.dirMap[0])

        js_src_location = "\"" + os.path.join(self.dirMap[2], self.js_src) + "\""
        db_location = "\"" + os.path.join(self.dirMap[4], self.dbName) + "\""
        query_location = "\"" + os.path.join(self.dirMap[3], self.queries) + "\""
        results_location = "\"" + os.path.join(self.dirMap[6], self.csvName) + "\""


        create = self.QLCommands[0].format(js_src_location, db_location)
        upgrade = self.QLCommands[1].format(db_location)
        runQueries = self.QLCommands[2].format(db_location, query_location, results_location)
        print()
        #print("COPY COMMAND BELOW")
        #print(runQueries)
        #print()
        #print()

        #print(create)

        # Step 3: Running commands
        if(not dbExist):
            print("Creating CodeQL Database")
            outputCreate = subprocess.check_output(create, stderr=subprocess.STDOUT, shell=True).decode().split("\n")

        print("Upgrading CodeQL Database")
        #print(upgrade)
        outputUpgrade = subprocess.check_output(upgrade, stderr=subprocess.STDOUT, shell=True).decode().split("\n")

        print("Running Query(ies)")
        outputRunQueries = subprocess.check_output(runQueries, stderr=subprocess.STDOUT, shell=True).decode().split("\n")

        print("Success!")
        print("")
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


    # fn = sys.argv[1]
    # if os.path.exists(fn):
    #     print("true")
    #     #print(os.path.basename(fn))
    #     print(os.path.split(fn)[0])

    # else:
    #     print("false")
    #sys.exit()


    if(len(sys.argv) == 2):
        autom = Automation("x", "x")
        if(sys.argv[1] == "clean"):
            autom.clean()
            sys.exit()
        elif(sys.argv[1] == "setup"):
            autom.verifyDirectoryLayout()
            sys.exit()
        else:
            sys.exit()

    elif(len(sys.argv) != 3):
        print("ERROR: Wrong amount of arguments! Please enter a JS package and query")
        print("Example: >CodeQL_Automation.py myPackage1.0.0 customCodeInjection2.ql")
        sys.exit()

    elif(".json" in sys.argv[1]): #if package arg is json
        #packages = json.loads(sys.argv[1])
        with open(str(sys.argv[1])) as packagesArg:
            packagesJson = packagesArg.read()
            packages = json.loads(packagesJson)
            #print(json.dumps(packages))


            if(".json" in sys.argv[2]): #if query arg is json
                with open(str(sys.argv[2])) as queriesArg:
                    queriesJson = queriesArg.read()
                    queries = json.loads(queriesJson)
                    #print(json.dumps(queries))


                    for package in packages["entries"]:
                        for query in queries["queries"]:
                            autom = Automation(package["package"], query["name"])
                            autom.run()
                    sys.exit()
            else:        #only package arg is json
                for package in packages["entries"]:
                    autom = Automation(package["package"], sys.argv[2])
                    autom.run()
                sys.exit()

    elif(".json" in sys.argv[2]): #only query arg is json
        with open(str(sys.argv[2])) as queriesArg:
            queriesJson = queriesArg.read()
            queries = json.loads(queriesJson)
            #print(json.dumps(queries))
            for query in queries["queries"]:
                autom = Automation(sys.argv[1], query["name"])
                autom.run()
            sys.exit()

    else: #none are json
        # Automation Process
        autom = Automation(sys.argv[1], sys.argv[2])
        #autom = Automation("prototype0.0.5", "customCodeInjection2.ql")
        autom.run()
        sys.exit()
