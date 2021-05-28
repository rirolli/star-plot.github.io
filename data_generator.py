import json 
import random
from random import uniform
data = []
for i in range(10):
    data.append({'foo': uniform(0, 100),'bar': uniform(0, 100), 'baz': uniform(0, 100), 'poo': uniform(0, 100), 'moo': uniform(0, 100)})
    

print(data)

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)