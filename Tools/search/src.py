from package_downloader import TarDownloader

OSCs = ["depot" ,"angular-resource" ,"backbone-localstorage" ,"angular-mocks" ,"prototype" ,"require.js" ,"jsdiff" ,"ember-data" ,"flot" ,"twitter-bootstrap" ,
        "jquery-ui-bootstrap" ,"Director" ,"history.js" ,"jade" ,"alt" ,"simple-peer" ,"aws-sign2" ,"es5-shim" ,"delayed-stream" ,"is-promise" ,"jquery-migrate",
        "pako" ,"string_decoder" ,"setprototypeof" ,"tweetnacl" ,"process-nextick-args" ,"should" ,"sizzle" ,"jquery-validate" ,"backbone" ,"is-fullwidth-code-point" ,
        "getpass" ,"caseless" ,"bcrypt-pbkdf" ,"clone" ,"forever-agent" ,"node-uuid" ,"moment-timezone" ,"angular" ,"isstream" ,"tunnel-agent" ,"jquery" ,"asynckit" ,
        "jasmine" ,"vis" ,"mocha" ,"ecc-jsbn" ,"fast-json-stable-stringify" ,"uglify-to-browserify"]


pd = TarDownloader("packages_src")
choices = []
print()
print("1 - Download All 50")
print("2 - Select Packages to Download")
print("3 - Download Specific Package")
option = input("--> ")
if option == "1": pd.download(OSCs)
elif option == "2":
    print(OSCs)
    while(True):
        print("\nSelect a package:")
        choice = input("--> ").lower()
        print()
        if (choice in OSCs) or (choice == ''):
            if choice != '': choices.append(choice)
            print("1 - Enter More Packages")
            print("2 - Download Current Choice(s)")
            print("3 - View/Remove Choice(s)")
            print("4 - Exit")
            option = input("--> ")
            if option == "2":
                if len(choices) > 0:
                    pd.download(choices)
                    break
                else:
                    print("No Selections Made")
            elif(option == "3"):
                print(choices)
                selection = input("Enter name of package to remove or hit enter to return: ")
                if selection in choices: choices.remove(selection)
            elif option == "4":
                break
        else:
            print("Not a package name. Try again.")
elif option == "3":
    print("Enter package name:")
    pd.download([str(input("--> "))])
else:
    print("Not a valid option")
