import json
from selenium import webdriver
import os
import time
import configparser

class sourceClearBot:
    def __init__(self, DB):
        self.db = DB
        self.driver = webdriver.Chrome('chromedriver.exe')
        self.base_url = ""
    def getScreenshot():
        self.driver.save_screenshot('screenshot.png ')
    def searchCVE(self, cve):
        self.base_url = 'https://www.sourceclear.com/vulnerability-database/search#query='+cve
        self.driver.get(self.base_url)
        time.sleep(1)
    def getFirstGrid(self):
        time.sleep(2)
        self.driver.find_element_by_css_selector("a[href*='security']").click();
    def getInstallationCommand(self):
        time.sleep(3)

        # clicks on "Only Vulnerable Version" checkbox
        self.driver.find_elements_by_xpath('.//span[@class = "react--checkbox"]')[0].click()

        x = self.driver.find_elements_by_xpath("/html[@class='nodarken gr__sourceclear_com']/body/div[@id='app']/div[@class='false']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[1]/div[@class='col-1-1 bo-b--1 border-color--muted-light pb+ mb-']/div[@class='grid grid--full ph']/div[@class='col-1-1']/div[@class='grid grid--narrower']/div[@class='grid__item col-1-1 pb-']/div[2]/div[@class='grid__item col-1-1 pt']/div[@class='grid']/div[@class='grid__item col-1-4 phone--col-1-1']/div[@class='grid grid--full col-1-1']/div[@class='grid__item col-1-1 mt-']/form[@class='grid max-height--400']/div[@class='grid__item col-1-1 phone--col-1-3'][15]/label[@class='label--radio']")
        print(x)
        # gets the package manager name next to the safe version segment of the web doc
        PM_str = self.driver.find_elements_by_xpath('.//div[@class = "font--h6 text--bold"]')[1].text

        # npm is written as "npm / yarn" so I split it to get npm only
        PM_list = PM_str.split()
        package_manager = PM_list[0]

        print('package manager:', package_manager)

        install_content = self.driver.find_elements_by_xpath("//div[contains(text(), '{}')]".format(package_manager))[0].text
        print('my content', install_content)
        #x = self.driver.find_elements_by_class_name('//class[contains(col-1-1 ph pv--- font-family--code bg-color--deleted')[0].text
        #print(x)



if __name__ == "__main__":
    with open('./combined_list.json', 'r') as json_file, open('./sourceClear_res', 'w+') as result:
        data = json.load(json_file)
        retrieval = False
        output = {}
        output['safeV'] = []
        bot = sourceClearBot("SourceClear")
        cve = data['entries'][0]['cve']
        bot.searchCVE(cve)
        bot.getFirstGrid()
        bot.getInstallationCommand()
        #for entry in data['entries']:
        #    cve = entry['cve']
        #    bot.searchCVE(cve)
