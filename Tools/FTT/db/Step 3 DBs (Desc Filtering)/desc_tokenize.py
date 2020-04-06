import json
import nltk
import csv

#import json db
with open("../Step 2 DBs (Sourceclear)/sourceclear_res_11-12-2019.json") as f:
    data = json.load(f)["entries"]

#string normalizer
def normalize(s):

    #import nltk stemmer
    stemmer = nltk.stem.PorterStemmer()
    #import nltk tokenizer
    tokenizer = nltk.tokenize.wordpunct_tokenize

    #tokenize by punctuation
    words = tokenizer(s.lower().strip())

    #stem and filter
    words = [stemmer.stem(w) for w in words if
                (not any(c in ['.', ',', '%', '-', '(', ')', '_', '*', '&', '+', '@', '`','~','<','>','[',']','\\','|','"',"'"] or c.isdigit() for c in w)
                and w not in ['x', 'the'])]

    return words

#frequency analysis built into nltk
def fdist(wordarray):
    freqs = nltk.probability.FreqDist(w for w in wordarray)

    return freqs

def sample_term_analysis():
    #find relevant cves to us (in this case injection)
    relevant_cves = [cve for cve in data if cve['cwe'] in ["CWE-94", "CWE-95", "CWE-89", "CWE-77", "CWE-78", "CWE-502"]]
    relevant_summary = ""
    for cve in relevant_cves:
        relevant_summary += " "+ cve["summary"]

    #convert them to an nltk FreqDist
    s = normalize(relevant_summary)
    freq_dist = dict(fdist(s))

    #write results to csv file
    with open('term_frequencies.csv', 'w') as f:
        for key in freq_dist.keys():
            f.write("%s,%s\n"%(key,freq_dist[key]))

#find relevant cves to us (in this case everything not labeled as an injection)
relevant_cves = [cve for cve in data if cve['cwe'] not in ["CWE-94", "CWE-95", "CWE-89", "CWE-77", "CWE-78", "CWE-502"]]
hot_terms = ["command", "arbitrari", "inject", "execut", "sql", "code", "sequel", "sqlite", "waterlin", "postgr", "mysql", "shell"]

result = []
for vuln in relevant_cves:
    s = normalize(vuln["summary"])

    #create result data obj
    data = {"cve": vuln["cve"], "cwe": vuln["cwe"], "score": 0}

    for term in hot_terms:
        data[term] = 0
        if term in s:
            #add 1 to total score
            data["score"]+= 1

            #add 1 to frequency table
            data[term] += 1

    #save data obj to result array
    result.append(data)

#export to csv
csv_file = "ranks.csv"
csv_columns = ["cve", "cwe", "score"] + hot_terms

try:
    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in result:
            writer.writerow(data)
except IOError:
    print("I/O error")
