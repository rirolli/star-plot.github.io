import json 
import random
from random import uniform
data = {}
labels = ['Cactus', 'Gelsomino', 'Margherita', 'Pianta del caffè', 'Menta', 'Pesco', 'Limone', 'Podocarpus', 'Ornitogallo', 'Asterisco marittimo']
for i in range(10):
    data[labels[i]] = {'acqua': uniform(0, 100),'sole': uniform(0, 100), 'fertilizzazione': uniform(0, 100), 'umidità': uniform(0, 100), 'resistenza': uniform(0, 100)}
    

print(data)

with open('data/data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)