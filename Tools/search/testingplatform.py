import os
import sys
import subprocess
import requests
import tarfile
import json

if __name__ == "__main__":
    test = "node syntaxSearchTool_V2.js "
    testDir = os.path.join(os.getcwd(), 'new_package_src')
    os.chdir(testDir)
    cwe_arg = sys.argv[1]
    testToolHere_lst =  []
    try:
        cwe_path = os.path.join(os.getcwd(), cwe_arg)
        os.chdir(cwe_path)
    except:
        print("cannot find path: ",cwe_path)

    # go to every cve folder
    for folder in os.listdir("."):
        os.chdir(folder)

        #go to safe folder & vulnerable folder
        for version in os.listdir("."):
            os.chdir(version)

            #go to every version folder in safe/vulnerable folder
            for item in os.listdir("."):
                if ".tgz" in item:
                    continue
                else:
                    try:
                        argument = os.path.join(os.getcwd(), item)
                        testToolHere_lst.append('\"' + argument +'\"')
                        #examination = test + '\"' + argument +'\"'
                        #subprocess.call(examination, shell=True)
                    except:
                        print("Something went wrong in obtaining argument location")
                        #return 1
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #go back one directory
        os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir))


    os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir))
    os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir))
    for testlocation in testToolHere_lst:
        try:
            print("testing : ", testlocation)
            examination = test + testlocation
            print("\n> ", examination)
            subprocess.call(examination, shell=True)
            print("Completed")
        except:
            print("Something went wrong in running the tool, Location: ", testlocation)
