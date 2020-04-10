import csv

benchmarks = []

truepos = 0
falsepos = 0
trueneg = 0
falseneg = 0
total = 0

cwe_used = 0

with open('Benchmark Test Results.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        #print(row)
        if ('File Name' not in row[0]):
            benchmarks.append(row)

#print(benchmarks)
try:
    with open('output.csv') as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        for row in readCSV:
            for line in benchmarks:
                 if line[0] in row[3]:
                     cwe_used = line[1]
                     line[4] = "True"
                     total += 1
                     if line[2] == "TRUE":
                         truepos += 1
                     else:
                         falsepos += 1
except IOError:
    print("'output.csv' file is found or is not accessible")
    raise


for line in benchmarks:
    if line[1] == cwe_used:
        if line[4] == "FALSE" and line[2] == "TRUE":
            falseneg += 1
        else:
            pass
    else:
        trueneg += 1

# print(truepos)
# print(falsepos)
# print(falseneg)
# print(trueneg)
# print(total)

# name of csv file
filename = "scorecard.csv"

tpr = truepos / (truepos+falseneg)
fpr = falsepos / (falsepos + trueneg)
score = tpr - fpr

results = [cwe_used, truepos, falseneg, trueneg, falsepos, total, tpr, fpr, score]
results = [str(i) for i in results]
print(results)
# writing to csv file
with open(filename, 'w') as csvfile:
    # creating a csv writer object
    csvwriter = csv.writer(csvfile)

    # writing the fields
    csvwriter.writerow(['CWE', 'TP', 'FN','TN','FP','Total', 'TPR', 'FPR', 'Score'])

    # writing the data rows
    csvwriter.writerow(results)
