import csv
import os
import sys
import subprocess
import shutil
import matplotlib.pyplot as plt

new_path = os.path.join("./", "LGTM_Results")
if not os.path.exists(new_path):
    os.mkdir(new_path)
else:
    shutil.rmtree(new_path)
    os.mkdir(new_path)
create = "../Tools/LGTM/codeql/codeql database create --language=javascript --source-root {} {}"
upgrade = "../Tools/LGTM/codeql/codeql database upgrade {}"
runQuery = "../Tools/LGTM/codeql/codeql database analyze ./LGTM_Results/benchmarkDB ../Tools/LGTM/ql/javascript/ql/src/OSC_CodeQueries/customCodeInjection2.ql --format=csv --output=./LGTM_Results/customCodeInjection2results.csv"
print("Creating CodeQL Database")
outputCreate = subprocess.check_output(create.format("./", "./LGTM_Results/benchmarkDB"), stderr=subprocess.STDOUT, shell=True).decode().split("\n")
print("Upgrading CodeQL Database")
outputUpgrade = subprocess.check_output(upgrade.format("./LGTM_Results/benchmarkDB"), stderr=subprocess.STDOUT, shell=True).decode().split("\n")
print("Running Query(ies)")
outputRunQueries = subprocess.check_output(runQuery, stderr=subprocess.STDOUT, shell=True).decode().split("\n")

def makeGraph(fpr=0, tpr=0, title="Scorecard Graph"):
    x = fpr
    y = tpr
    plt.plot(x, y, marker='o', markerfacecolor='red', markersize=12)
    plt.plot([0,1], [0,1], color='black', linestyle='dashed', linewidth = 3)
    plt.xlabel('false positive rate')
    plt.ylabel('true positive rate')
    plt.title(title)
    plt.savefig(title+'.png')


print("Creating scorecard")
benchmarks = []
#cwes = [94, 89, 78]
map = {"Code injection" : 94}
total_TP = 0
total_FN = 0
total_TN = 0
total_FP = 0
total_total = 0
#print(benchmarks)

# name of csv file
filename = "scorecard.csv"
# writing to csv file
with open('customCodeInjection2 over benchmark'+'.csv', 'w') as csvfile:
    # creating a csv writer object
    csvwriter = csv.writer(csvfile)

    # writing the fields
    csvwriter.writerow(['CWE', 'TP', 'FN','TN','FP','Total', 'TPR', 'FPR', 'Score'])
    #print(benchmarks)
    for cwe in map:
        truepos = 0
        falsepos = 0
        trueneg = 0
        falseneg = 0
        total = 0
        with open('index.csv') as csvfile:
            readCSV = csv.reader(csvfile, delimiter=',')
            for row in readCSV:
                #print(row)
                if ('File Name' not in row[0]):
                    benchmarks.append(row)
        for row in benchmarks:
            row.append("FALSE")
        try:
            with open('./LGTM_Results/customCodeInjection2results.csv') as csvfile:
                readCSV = csv.reader(csvfile, delimiter=',')
                for row in readCSV:
                    for line in benchmarks:
                         if line[0] in row[4] and cwe in row[0]:
                             #cwe_used = line[1]
                             line[4] = "TRUE"
                             if line[2] == "TRUE":
                                 truepos += 1
                             else:
                                 falsepos += 1
        except IOError:
            print("'output.csv' file is found or is not accessible")
            raise

        for line in benchmarks:
            if line[1] == str(map[cwe]):
                if line[4] == "FALSE" and line[2] == "TRUE":
                    falseneg += 1
                else:
                    pass
            else:
                trueneg += 1
        total = truepos + trueneg + falsepos + falseneg
        tpr = truepos / (truepos+falseneg)
        fpr = falsepos / (falsepos + trueneg)
        score = tpr - fpr

        results = [str(map[cwe])+":"+cwe, truepos, falseneg, trueneg, falsepos, total, tpr, fpr, score]
        results = [str(i) for i in results]
        #print(results)

        total_TP += truepos
        total_FN += falseneg
        total_TN += trueneg
        total_FP += falsepos
        total_total += total
        # writing the data rows
        csvwriter.writerow(results)
    avg_tpr = total_TP / (total_TP+total_FN)
    avg_fpr = total_FP / (total_FP + total_TN)
    avg_score = avg_tpr - avg_fpr
    csvwriter.writerow(["", "Total TP:\n" + str(total_TP), "Total FN:\n" + str(total_FN), "Total TN:\n" + str(total_TN), "Total FP:\n" + str(total_FP), "Total Test Cases:\n" + str(total_total), "Average TPR:\n" + str(avg_tpr), "Average FPR:\n" + str(avg_fpr), "Average Score:\n" + str(avg_score)])
    makeGraph(avg_fpr, avg_tpr, 'customCodeInjection2 over benchmark')

shutil.rmtree(new_path)
