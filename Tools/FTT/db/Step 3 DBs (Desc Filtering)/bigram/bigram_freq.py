import json
import nltk
from nltk.collocations import BigramCollocationFinder
import csv

#import json db
with open("../../Step 2 DBs (Sourceclear)/sourceclear_res_11-12-2019.json") as f:
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

def term_freq_analysis(relevant_cves):
    #find relevant cves to us (in this case injection)

    relevant_summary = ""
    for cve in relevant_cves:
        relevant_summary += " "+ cve["summary"]

    #convert them to an nltk FreqDist
    s = normalize(relevant_summary)
    s = nltk.bigrams(s) #include for bigrams

    freq_dist = dict(fdist(s))

    sum_all_occurences = 0
    for term in freq_dist.keys():
        sum_all_occurences+= freq_dist[term]
    for term in freq_dist.keys():
        freq_dist[term] = freq_dist[term] / sum_all_occurences

    return freq_dist

def generate_term_frequencies():
    sample_cves = [cve for cve in data if cve['cwe'] in ["CWE-94", "CWE-95", "CWE-89", "CWE-77", "CWE-78", "CWE-502"]]
    sample_cve_dist = term_freq_analysis(sample_cves)
    total_cve_dist = term_freq_analysis(data)

    for term in sample_cve_dist.keys():
        if term in total_cve_dist.keys():
            sample_cve_dist[term]-= total_cve_dist[term]


    #write results to csv file
    with open('bigram_term_frequencies.csv', 'w') as f:
        f.write("Term, Frequency\n")
        for key in sample_cve_dist.keys():
            f.write("%s %s,%s\n"%(key[0], key[1],sample_cve_dist[key]))


#find relevant cves to us (in this case everything not labeled as an injection)
relevant_cves = [cve for cve in data if cve['cwe'] not in ["CWE-94", "CWE-95", "CWE-89", "CWE-77", "CWE-78", "CWE-502"]]
#hot_terms = ["command", "arbitrari", "inject", "execut", "sql", "code", "sequel", "sqlite", "waterlin", "postgr", "mysql", "shell"]
bigram_terms = [('arbitrari', 'command'), ('command', 'inject'), ('inject','vulner'), ('a','command'), ('inject','in'), ('execut','arbitrari'), ('to','execut'), ('sequel','is'), ('sqlite','and'), ('microsoft','sql'), ('sql','server'), ('arbitrari','code')]

result = []
for vuln in relevant_cves:
    s = normalize(vuln["summary"])
    s = nltk.bigrams(s) #bigrams

    #create result data obj
    data = {"cve": vuln["cve"], "cwe": vuln["cwe"], "score": 0}
    for term in bigram_terms:
        data[term] = 0

    for term in s:
        if term in bigram_terms:
            #add 1 to total score
            data["score"]+= 1

            #add 1 to frequency table
            data[term] += 1

    #save data obj to result array
    result.append(data)

#export to csv
csv_file = "bigram_ranks.csv"
csv_columns = ["cve", "cwe", "score"] + bigram_terms

try:
    with open(csv_file, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
        writer.writeheader()
        for data in result:
            writer.writerow(data)
except IOError:
    print("I/O error")
