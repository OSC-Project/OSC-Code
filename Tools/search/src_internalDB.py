import os
import sys
import subprocess
import tarfile
import json

def getVersion(filename):
    res = [i for i in filename if i.isdigit()]
    index1 = res[0]
    start = filename.find(index1)
    version = filename[start:-4]
    return version

def getNum(version):
    version = version.replace(".", "")
    version = version.translate({ord(i): None for i in 'abcdefghijklmnopqrstuvwxyz-'})
    version = int(version)
    return version

def removeTarballs():
    currentFolder = os.getcwd()
    try:
        for item in os.listdir("."):
            if(".tgz" in item):
                tgzfile = item
                os.remove(tgzfile)
            else:
                pass
        return 0
    except:
        return 1

def extractTarballs(cve, entry):
    cvefolder = os.getcwd()
    packname = get_package_name(cve)
    for fn in os.listdir("."):
        targetDir = fn[0:fn.rfind(".")]
        version = getVersion(fn)
        try:
            tf = tarfile.open(os.path.join(os.getcwd(), fn))
            print("Making folder for: ", targetDir, " in ", os.getcwd())
            extractedPath = make_folder(targetDir)
            os.chdir(extractedPath) #Cve-VersionFolder
        except:
            #dataLog.write("Package Name :"+ packname+ ", Tarfile: "+ fn+ ", Status : Extraction Failed\n")
            version_dict = {"Package Name" : packname, "Version" : version,  "Status" : "Extraction Failed"}
            entry["versions"].append(version_dict.copy())
            continue
        try:
            print("Extracting tarfiles in ",  os.getcwd() )
            tf.extractall()

            #dataLog.write("Package Name :"+ packname+ ", Tarfile: "+ fn+ ", Status : Extraction Success\n")
            version_dict = {"Package Name" : packname, "Version" : version,  "Status" : "Extraction Successful"}
            entry["versions"].append(version_dict.copy())

            print("SUCCESS Extracting tarfiles in ",  os.getcwd())
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #go back 1 directory
        except:
            packname = get_package_name(cve)

            #dataLog.write("Package Name :"+ packname+ ", Tarfile: "+ fn+ ", Status : Extraction Failed\n")
            version_dict = {"Package Name" : packname, "Version" : version,  "Status" : "Extraction Failed"}
            entry["versions"].append(version_dict.copy())

            print("FAILURE Extracting tarfiles in ",  os.getcwd())
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #go back 1 directory
            continue
    return 0

def download_VulnerableTarballs(cve, entry):
    installcve = cve['installString']
    packcve = installcve.replace("install", "pack")
    packname = get_package_name(cve)

    #get first 2 vulnerable versions & last vulnerable version
    i = 0
    end_loop = False
    while(i < len(cve["versions"]["vulnerableRange"])):
        if(i == 3):
            version = cve["versions"]["vulnerableRange"][-1]
            end_loop = True
        else:
            version = cve["versions"]["vulnerableRange"][i]
            i = i + 1

        #download logic
        install = packcve + version
        print("> ", install)
        try:
            output = subprocess.check_output(install, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
            if(end_loop):
                break
        except:
            packname = get_package_name(cve)
            #log[cve][version] = "Download Failed"
            #log[i]

            #dataLog.write("Package Name :"+ packname+ ", Version : "+ version+ ", Status : Download Failed\n")
            version_dict = {"Package Name" : packname, "Version" : version,  "Status" : "Download Failed"}
            entry["versions"].append(version_dict.copy())
            print("something went wrong in downloading ", packname, version)
            if(end_loop):
                break
            else:
                continue
    return 0

def calculate_SafeTarballs(cve):
    safe_V1 = None
    safe_V2 = None
    safe_V3 = None
    safe_V4 = None

    #get safe versions
    if(len(cve["versions"]["safeRange"]) == 0):
        pass
    elif(len(cve["versions"]["safeRange"]) < 2):
        safe_V1 = cve["versions"]["safeRange"][0]
    else:
        safe_V1 = cve["versions"]["safeRange"][0]
        safe_V2 = cve["versions"]["safeRange"][-1]

    #try and get an extra 3rd and 4th safe version
    try:
        if(cve["versions"]["safeRange"][1] != cve["versions"]["safeRange"][-1]):
            safe_V3 = cve["versions"]["safeRange"][1]
    except:
        safe_V3 = None

    try:
        if(cve["versions"]["safeRange"][-2] != cve["versions"]["safeRange"][0]):
            safe_V4 = cve["versions"]["safeRange"][-2]
    except:
        safe_V4 = None

    safe_version_LST = [safe_V1, safe_V2, safe_V3, safe_V4]
    safe_before_lst = []
    safe_after_lst = []
    for version in safe_version_LST:
        if(version == None):
            continue
        else:
            int_version = getNum(version)
            fvulnerable = getNum(cve['versions']['vulnerableRange'][0])
            if(int_version < fvulnerable):
                safe_before_lst.append(version)
            elif(fvulnerable < int_version):
                safe_after_lst.append(version)

    before_And_After = [safe_before_lst, safe_after_lst]
    return before_And_After

def download_SafeTarballs(cve, entry, safe_lst):
    installcve = cve['installString']
    packcve = installcve.replace("install", "pack")


    for version in safe_lst:
        if(version == None):
            continue
        else:
            install = packcve + version
            print("> ", install)
            try:
                output = subprocess.check_output(install, stderr=subprocess.STDOUT, shell=True).decode().split("\n")
            except:
                packname = get_package_name(cve)

                #dataLog.write("Package Name :"+ packname+ ", Version : "+ version+ ", Status : Download Failed\n")
                version_dict = {"Package Name" : packname, "Version" : version,  "Status" : "Download Failed"}

                entry["versions"].append(version_dict.copy())
                print("something went wrong in downloading ", packname, version)
                continue
    return 0

def make_folder(folder_name):
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

    new_path = os.path.join(os.getcwd(), folder_name)
    #print(new_path)

    if not os.path.exists(new_path):
        #print("Finalizing folder path: ", new_path)
        os.mkdir(new_path)
        return new_path
    else:
        return new_path

def get_package_name(cve):
    installcve = cve['installString']
    package = installcve.split(" ")
    package = package[3].split(".")
    packagename = package[0]
    packagename = packagename.replace("@", "")
    print("got package name: ", packagename)
    return packagename

if __name__ == "__main__":
    DownloadFold = os.path.join(os.getcwd(), 'new_package_src')
    if not os.path.exists(DownloadFold):
        os.mkdir(DownloadFold)

    jfile = sys.argv[1]
    with open(jfile, 'r') as json_file:
        data = json.load(json_file)
        os.chdir(DownloadFold)
        log = {}
        log["Entries"] = []
        i = 0
        while i < len(data['entries']):
            #dataLog.write("-----------------------------------------------------\n")
            #try:
            #dataLog.write("CVE: "+ data['entries'][i]['cve']+ "\n")

            entry = {}
            entry["cve"] =  data['entries'][i]['cve']
            entry["versions"] = []


            #Make/go to CWE Folder
            CWE = data['entries'][i]['cwe']
            print("\nMaking Folder For :", CWE)
            CWE_Path = make_folder(CWE)
            os.chdir(CWE_Path) #.../new_package_src3/CWEXX

            #Make/go to Package Folder
            packagename = get_package_name(data['entries'][i])
            print("Making Folder For :", data['entries'][i]['cve'])
            entryPath = make_folder(packagename)
            os.chdir(entryPath) #.../new_package_src3/CWEXX/packagename

            #Write short json file for package folder
            packageData = {}
            packageData["cve"] =  data['entries'][i]['cve']
            packageData['summary'] = data['entries'][i]['summary']
            packageData["references"] = []
            for item in data['entries'][i]["references"]:
                packageData["references"].append(item)
            with open('cve_info.json', 'w+') as outfile:
                json.dump(packageData, outfile)
                outfile.close()


            #calculate safe versions before and after vulnerability
            before_and_after = calculate_SafeTarballs( data['entries'][i])


            #Make Safe-before Folder
            safe_Before_EntryPath = make_folder("SafeBefore")
            os.chdir(safe_Before_EntryPath) #.../new_package_src3/CWEXX/packagename/SafeBefore

            #download Safe-before version
            print("\nIN safe-before Folder of ", data['entries'][i]['cve'], "Going to Download .tgz files")
            safe_download_status = download_SafeTarballs(data['entries'][i], entry, before_and_after[0])

            #extract tarballs Safe-before version
            print("Extracting .tgz in ", os.getcwd())
            extract_status = extractTarballs(data['entries'][i], entry)

            print("Folders created, deleting .tgz in ", os.getcwd())
            delete_tgz_status = removeTarballs()
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../new_package_src3/CWEXX/packagename/


#------------------------------------------------------------
            #Make Safe-After Folder
            safe_Before_EntryPath = make_folder("SafeAfter")
            os.chdir(safe_Before_EntryPath) #.../new_package_src3/CWEXX/packagename/SafeAfter

            #download Safe-After version
            print("\nIN safe-before Folder of ", data['entries'][i]['cve'], "Going to Download .tgz files")
            safe_download_status = download_SafeTarballs(data['entries'][i], entry, before_and_after[1])

            #extract tarballs Safe-before version
            print("Extracting .tgz in ", os.getcwd())
            extract_status = extractTarballs(data['entries'][i], entry)

            print("Folders created, deleting .tgz in ", os.getcwd())
            delete_tgz_status = removeTarballs()
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../new_package_src3/CWEXX/packagename/
#------------------------------------------------------------
            #Make Safe Folder + Download Safe versions + extraction
            vulnerable_EntryPath = make_folder("Vulnerable")
            os.chdir(vulnerable_EntryPath) #.../new_package_src3/CWEXX/packagename/Vulnerable

            print("\nIN vulnerable Folder of ", data['entries'][i]['cve'], "Going to Download .tgz files")
            safe_download_status = download_VulnerableTarballs(data['entries'][i], entry)

            print("Extracting .tgz in ", os.getcwd())
            extract_status = extractTarballs(data['entries'][i], entry)

            print("Folders created, deleting .tgz in ", os.getcwd())
            delete_tgz_status = removeTarballs()

            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../new_package_src3/CWEXX/packagename/
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../new_package_src3/CWEXX/
            os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../new_package_src3/

            log["Entries"].append(entry.copy())
            #log["Entries"][i]["Status"] =  "Success"

            #except:
            #print("Something went wrong, caught in main, crashed on i = ", i)
            #dataLog.write("CVE: "+ data['entries'][i]['cve']+  "Entry# "+ str(i) +"Status: Unknown Error\n")
            #os.chdir(DownloadFold)
                #i = i + 1
                #log["Entries"][i]["Status"] =  "Unknown Error in Main"
            i = i + 1

            #dataLog.write("-----------------------------------------------------\n")

        #problem is entry 12, entry 26flintcms broken
        json_file.close()
        #os.chdir(os.path.normpath(os.getcwd() + os.sep + os.pardir)) #.../
        with open('src_internalDB_log.json', 'a') as dataLog:
            json.dump(log, dataLog)
            outfile.close()

        #dataLog.close()
