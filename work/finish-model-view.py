from pathlib import Path
p=Path('work/apex/dist/lego-car.js');s=p.read_text().replace('for(const part of data.instances){','for(const part of data.instances){\n  if(part.matrix[12]>400)continue; // Separate display plaque and luggage accessory, outside the vehicle.').replace('const scale=4.5/','const scale=4.9/');p.write_text(s)
p=Path('work/apex/dist/experience.js');s=p.read_text().replace('mobile?6:5.2,mobile?4.4:3.4,mobile?-8.5:-6.6','mobile?6.7:6.5,mobile?4.4:3.5,mobile?-8.5:-6.2');p.write_text(s)
