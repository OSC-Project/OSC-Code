import csv
import os
import sys
import subprocess
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import pandas as pd

def makeGraph(fpr=0, tpr=0, title="Scorecard Graph"):
    x = fpr[0]
    y = tpr[0]
    plt.plot(x, y, marker='o', markerfacecolor='red', markersize=12)
    red_patch = mpatches.Patch(color='red', label='LGTM++')
    x = fpr[1]
    y = tpr[1]
    plt.plot(x, y, marker='o', markerfacecolor='blue', markersize=12)
    blue_patch = mpatches.Patch(color='blue', label='LGTM')
    x=0.66
    y=1
    plt.plot(x, y, marker='o', markerfacecolor='green', markersize=12)
    green_patch = mpatches.Patch(color='green', label='Sink Finder')
    plt.legend(handles=[red_patch, blue_patch, green_patch], loc=4)
    plt.plot([0,1], [0,1], color='black', linestyle='dashed', linewidth = 3)
    plt.xlabel('false positive rate')
    plt.ylabel('true positive rate')
    plt.title(title)
    plt.savefig(title+'.png')

print("Creating scorecard")
#cwes = [94, 89, 78]
map = {"Code injection" : 94}
#print(benchmarks)
xs=[]
ys=[]
for file in ['LGTM++', 'LGTM']:
    benchmarks = []
    total_TP = 0
    total_FN = 0
    total_TN = 0
    total_FP = 0
    total_total = 0
    with open(file+' over Packages'+'.csv', 'w') as csvfile:
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
                    if ('File Name' not in row[1]):
                        benchmarks.append(row)
            for row in benchmarks:
                row.append("FALSE")

            for filename in os.listdir("./Query_Results"):
                if file == 'LGTM++':
                    if 'custom' in filename:
                        with open('./Query_Results/'+filename) as csvfile:
                            try:
                                csv.Sniffer().has_header(csvfile.read(1))
                                readCSV = csv.reader(csvfile, delimiter=',')
                                for row in readCSV:
                                    flag = 0
                                    for line in benchmarks:
                                         if line[1] in row[4] and str(line[4]) == str(row[5]):
                                             line[5] = "TRUE"
                                             truepos += 1
                                             flag = 1
                                    if (flag == 1):
                                        flag = 0
                                    else:
                                        falsepos += 1
                                        flag = 0
                            except:
                                flag = 0
                                for line in benchmarks:
                                    if line[0].replace(".", "-") in filename:
                                        #depot-0.1.6...    vs depot-0-1-6...
                                        if line[5] == "FALSE":
                                            falseneg += 1
                                            flag = 1
                                if flag == 1:
                                    flag = 0
                                else:
                                    trueneg += 1
                                    flag = 0
                else:
                    if '_Code' in filename or '_Eval' in filename:
                        with open('./Query_Results/'+filename) as csvfile:
                            try:
                                csv.Sniffer().has_header(csvfile.read(1))
                                readCSV = csv.reader(csvfile, delimiter=',')
                                for row in readCSV:
                                    flag = 0
                                    for line in benchmarks:
                                         if line[1] in row[4] and str(line[4]) == str(row[5]):
                                             line[5] = "TRUE"
                                             truepos += 1
                                             flag = 1
                                    if (flag == 1):
                                        flag = 0
                                    else:
                                        falsepos += 1
                                        flag = 0
                            except:
                                flag = 0
                                for line in benchmarks:
                                    if line[0].replace(".", "-") in filename:
                                        #depot-0.1.6...    vs depot-0-1-6...
                                        if line[5] == "FALSE":
                                            falseneg += 1
                                            flag = 1
                                if flag == 1:
                                    flag = 0
                                else:
                                    trueneg += 1
                                    flag = 0
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
        xs.append(avg_fpr)
        ys.append(avg_tpr)
makeGraph(xs, ys, 'Tools over Packages')
