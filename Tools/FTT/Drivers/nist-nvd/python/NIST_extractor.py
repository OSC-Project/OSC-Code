import json
import sys

def get_references_data(cve_item):
    #n = cve_item['references']
    #print(cve_item)

    #print("in REFERENCES")
    out = []
    #print("in REFERENCES2")

    #print("in REFERENCES3")
    x = 1
    #print(x)
    #print(cve_item['cve']['references']['reference_data'][0])
    #print(cve_item['configurations']['nodes'][1])
    #print(len(cve_item['references']['reference_data']))
    for ref_obj in cve_item['cve']['references']['reference_data']:
        out.append({
            'url' : ref_obj['url'],
            'tags' : ref_obj['tags']
        })
    #print("in REFERENCES4")
    return out



def get_non_vul_config(cve_item):
    n = cve_item['configurations']['nodes']
    out = []
    for config_obj in n:
        for match in config_obj['cpe_match']:
            if(match['vulnerable'] == False):
                out.append({
                    'vulnerable' : match['vulnerable'],
                    'cpe23Uri' : match['cpe23Uri']
                })
    return out


def get_vul_config(cve_item):
    n = cve_item['configurations']['nodes']
    out = []
    for config_obj in n:
        for match in config_obj['cpe_match']:
            if(match['vulnerable'] == True):
                out.append({
                    'version' : "",
                    'cpe23Uri' : match['cpe23Uri']
                })
    return out



def parse_entry(cve_item):
    vul_config = get_vul_config(cve_item)
    non_vul_config = get_non_vul_config(cve_item)
    theversion = {'vulnerable' : vul_config, 'safe' : non_vul_config}
    #theversion.append({
    #    'vulnerable' : vul_config,
    #    'safe' : non_vul_config
    #})
    reference_data = get_references_data(cve_item)
    #print("in here6")
    thedict = {
        'cve' : cve_item['cve']['CVE_data_meta']['ID'],
        'cwe' :  cve_item['cve']['problemtype']['problemtype_data'][0]['description'][0]['value'],
        'host' : "N/A",
        'summary' : cve_item['cve']['description']['description_data'][0]['value'],
        'references' : reference_data,
        'versions' : theversion,
    }

    #print(type(thedict))
    #print("goodbye")
    #print('')
    return thedict

if __name__ == "__main__":
    file = sys.argv[1]
    with open(file, "r") as json_file, open('./NIST_res_'+ file, 'w+') as result:
        data = json.load(json_file)
        is_nodejs = False
        first = True
        output = {}
        output['entries'] = []

        #print("yer", data)
        #return None
        #print("meg2")
        #print(data['CVE_Items'][0])
        for entry in data['CVE_Items']:
            try:
                if('cpe_match' in entry['configurations']['nodes'][0]):
                    if(":nodejs" in entry['configurations']['nodes'][0]['cpe_match'][0]['cpe23Uri']):
                        is_nodejs = True
                        if(is_nodejs):
                            #print('link 1')
                            clean_data = parse_entry(entry)
                            #print('END OF link 1')
                            #for x in clean_data:
                                #print(x, clean_data[x])
                            #print("going to append")
                            output['entries'].append(clean_data)
                            #print("appended")
                            #json.dump(clean_data, result, indent = 5)
                            #print(clean_data)

                        is_nodejs = False
                        #print("is_nodejs : ", is_nodejs)
                        #print(entry['configurations']['nodes'][0]['cpe_match'][0]['cpe23Uri'])
                    elif('children' in entry['configurations']['nodes'][0]):
                        if(":nodejs" in entry['configurations']['nodes'][0]['children'][0]['cpe_match'][0]['cpe23Uri']):
                            is_nodejs = True
                            if(is_nodejs):
                                #print('link 2')
                                clean_data = parse_entry(entry)
                                #print(clean_data)
                                output['entries'].append(clean_data)
                                #json.dump(clean_data, result, indent = 5)
                                #print(clean_data)

                            is_nodejs = False
                            #print("is_nodejs : ", is_nodejs)
                            #print(entry['configurations']['nodes'][0]['cpe_match'][0]['cpe23Uri'])
                    else:
                        #print("is_nodejs : ", is_nodejs)
                        continue
            except:
                continue
        #print("")
        #print("my output")
        #print(output)
        json.dump(output, result, indent = 5)
        #print(clean_data)


#main("./EASY_nvdcve-1.1-2019.json")
#main("./nvdcve-1.1-2019.json")
