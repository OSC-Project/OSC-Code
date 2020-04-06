import os
import subprocess
import tarfile
import time

class TarDownloader():
    def __init__(self, folder):
        self.baseDir = ""
        self.folder = folder

    def targetFolderName(self, folder=""):
        if folder=="": folder = self.folder
        try:
            os.mkdir(os.getcwd()+"/"+folder)
        except FileExistsError:
            pass

        os.chdir(os.getcwd()+"/"+folder)
        self.baseDir = os.getcwd()

    def downloadTar(self, selected=[]):
        for osc in selected:
            osc = osc.lower()
            out = subprocess.Popen(['npm', 'pack', osc], stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

    def extract(self):
        for fn in os.listdir("."):
            if fn.endswith('.tgz'):
                targetDir = fn[0:fn.rfind(".")]
                try:
                    os.mkdir(self.baseDir+"/"+targetDir)
                except FileExistsError:
                    pass
                tf = tarfile.open(self.baseDir+"/"+fn)
                os.chdir(self.baseDir+"/"+targetDir)
                tf.extractall()
        os.chdir(self.baseDir)

    def cleanup(self):
        for file in os.listdir("."):
            if file.endswith('.tgz'):
                os.remove(file)

    def download(self, selected=[]):
        if(self.baseDir == ""): self.targetFolderName()
        self.downloadTar(selected)
        time.sleep(2)
        self.extract()
        self.cleanup()
        print("Finished")
