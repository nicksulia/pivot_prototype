const fs = require('fs');
const path = require('path');
const fileFormat = "utf8";
if (fs.existsSync(path.resolve(__dirname, `./public/anotherMockData/tree.json`))) {
    fs.unlinkSync(path.resolve(__dirname, `./public/anotherMockData/tree.json`));
    fs.rmdirSync(path.resolve(__dirname, './public/anotherMockData'));
}
fs.mkdirSync(path.resolve(__dirname, './public/anotherMockData'));

var dataSample = [];
var occupations = ["Construction project manager", "Project builder", "Engineering manager", "Production Manager (Mining)", "Child Care centre manager", "Medical administrator", "Nursing clinical director", "Primary health organisation manager", "Welfare centre manager", "Accountant (general)", "Management accountant", "Taxation accountant", "External auditor", "Internal auditor", "Actuary", "Land economist", "Ship's engineer", "Ship's master", "Ship's officer", "Architect", "Landscape architect", "Cartographer", "Other Spatial Scientist", "Surveyor", "Chemical engineer"];
var names = ["Aaran", "Aaren", "Aarez", "Aarman", "Aaron", "Aaron-James", "Aarron", "Aaryan", "Aaryn", "Aayan", "Aazaan", "Abaan", "Abbas", "Abdallah", "Abdalroof", "Abdihakim", "Abdirahman", "Abdisalam", "Abdul", "Abdul-Aziz", "Abdulbasir", "Abdulkadir", "Abdulkarem", "Abdulkhader", "Abdullah", "Abdul-Majeed", "Abdulmalik", "Abdul-Rehman", "Abdur", "Abdurraheem", "Abdur-Rahman", "Abdur-Rehmaan", "Abel", "Abhinav", "Abhisumant", "Abid", "Abir", "Abraham", "Abu", "Abubakar", "Ace", "Adain", "Adam", "Adam-James", "Addison", "Addisson", "Adegbola", "Adegbolahan", "Aden", "Adenn", "Adie", "Adil", "Aditya", "Adnan", "Adrian", "Adrien", "Aedan", "Aedin", "Aedyn", "Aeron", "Afonso", "Ahmad", "Ahmed", "Ahmed-Aziz", "Ahoua", "Ahtasham", "Aiadan", "Aidan", "Aiden", "Aiden-Jack", "Aiden-Vee", "Aidian", "Aidy", "Ailin", "Aiman", "Ainsley", "Ainslie", "Airen", "Airidas", "Airlie", "AJ", "Ajay", "A-Jay", "Ajayraj", "Akan", "Akram", "Al", "Ala", "Alan", "Alanas", "Alasdair", "Alastair", "Alber", "Albert", "Albie", "Aldred", "Alec", "Aled", "Aleem", "Aleksandar", "Aleksander", "Aleksandr", "Aleksandrs", "Alekzander", "Alessandro", "Alessio", "Alex", "Alexander", "Alexei", "Alexx", "Alexzander", "Alf", "Alfee", "Alfie", "Alfred", "Alfy", "Alhaji", "Al-Hassan", "Ali", "Aliekber", "Alieu", "Alihaider", "Alisdair", "Alishan", "Alistair", "Alistar", "Alister", "Aliyaan", "Allan", "Allan-Laiton", "Allen", "Allesandro", "Allister", "Ally", "Alphonse", "Altyiab", "Alum", "Alvern", "Alvin", "Alyas", "Amaan", "Aman", "Amani", "Ambanimoh", "Ameer", "Amgad", "Ami", "Amin", "Amir", "Ammaar", "Ammar", "Ammer", "Amolpreet", "Amos", "Amrinder", "Amrit", "Amro", "Anay", "Andrea", "Andreas", "Andrei", "Andrejs", "Andrew", "Andy", "Anees", "Anesu", "Angel", "Angelo", "Angus", "Anir", "Anis", "Anish", "Anmolpreet", "Annan", "Anndra", "Anselm", "Anthony", "Anthony-John", "Antoine", "Anton", "Antoni", "Antonio", "Antony", "Antonyo", "Anubhav", "Aodhan", "Aon", "Aonghus", "Apisai", "Arafat", "Aran", "Arandeep", "Arann", "Aray", "Arayan", "Archibald", "Archie", "Arda", "Ardal", "Ardeshir", "Areeb", "Areez", "Aref", "Arfin", "Argyle", "Argyll", "Ari", "Aria", "Arian", "Arihant", "Aristomenis", "Aristotelis", "Arjuna", "Arlo", "Armaan", "Arman", "Armen", "Arnab", "Arnav", "Arnold", "Aron", "Aronas", "Arran", "Arrham", "Arron", "Arryn", "Arsalan", "Artem", "Arthur", "Artur", "Arturo", "Arun", "Arunas", "Arved", "Arya", "Aryan", "Aryankhan", "Aryian", "Aryn", "Asa", "Asfhan", "Ash", "Ashlee-jay", "Ashley", "Ashton", "Ashton-Lloyd", "Ashtyn", "Ashwin", "Asif", "Asim", "Aslam", "Asrar", "Ata", "Atal", "Atapattu", "Ateeq", "Athol", "Athon", "Athos-Carlos", "Atli", "Atom", "Attila", "Aulay", "Aun", "Austen", "Austin", "Avani", "Averon", "Avi", "Avinash", "Avraham", "Awais", "Awwal", "Axel", "Ayaan", "Ayan", "Aydan", "Ayden", "Aydin", "Aydon", "Ayman", "Ayomide", "Ayren", "Ayrton", "Aytug", "Ayub", "Ayyub", "Azaan", "Azedine", "Azeem", "Azim", "Aziz", "Azlan", "Azzam", "Azzedine", "Babatunmise", "Babur", "Bader", "Badr", "Badsha", "Bailee", "Bailey", "Bailie", "Bailley", "Baillie", "Baley", "Balian", "Banan", "Barath", "Barkley", "Barney", "Baron", "Barrie", "Barry", "Bartlomiej", "Bartosz", "Basher", "Basile", "Baxter", "Baye", "Bayley", "Beau", "Beinn", "Bekim", "Believe", "Ben", "Bendeguz", "Benedict", "Benjamin", "Benjamyn", "Benji", "Benn", "Bennett", "Benny", "Benoit", "Bentley", "Berkay", "Bernard", "Bertie", "Bevin", "Bezalel", "Bhaaldeen", "Bharath", "Bilal", "Bill", "Billy", "Binod", "Bjorn", "Blaike", "Blaine", "Blair", "Blaire", "Blake", "Blazej", "Blazey", "Blessing", "Blue", "Blyth", "Bo", "Boab", "Bob", "Bobby", "Bobby-Lee", "Bodhan", "Boedyn", "Bogdan", "Bohbi", "Bony", "Bowen", "Bowie", "Boyd", "Bracken", "Brad", "Bradan", "Braden", "Bradley", "Bradlie", "Bradly", "Brady", "Bradyn", "Braeden", "Braiden", "Brajan", "Brandan", "Branden", "Brandon", "Brandonlee", "Brandon-Lee", "Brandyn", "Brannan", "Brayden", "Braydon", "Braydyn", "Breandan", "Brehme", "Brendan", "Brendon", "Brendyn", "Breogan", "Bret", "Brett", "Briaddon", "Brian", "Brodi", "Brodie", "Brody", "Brogan", "Broghan", "Brooke", "Brooklin", "Brooklyn", "Bruce", "Bruin", "Bruno", "Brunon", "Bryan", "Bryce", "Bryden", "Brydon", "Brydon-Craig", "Bryn", "Brynmor", "Bryson", "Buddy", "Bully", "Burak", "Burhan", "Butali", "Butchi", "Byron", "Cabhan", "Cadan", "Cade", "Caden", "Cadon", "Cadyn", "Caedan", "Caedyn", "Cael", "Caelan", "Caelen", "Caethan", "Cahl", "Cahlum", "Cai", "Caidan", "Caiden", "Caiden-Paul", "Caidyn", "Caie", "Cailaen", "Cailean", "Caileb-John", "Cailin", "Cain", "Caine", "Cairn", "Cal", "Calan", "Calder", "Cale", "Calean", "Caleb", "Calen", "Caley", "Calib", "Calin", "Callahan", "Callan", "Callan-Adam", "Calley", "Callie", "Callin", "Callum", "Callun", "Callyn", "Calum", "Calum-James", "Calvin", "Cambell", "Camerin", "Cameron", "Campbel", "Campbell", "Camron", "Caolain", "Caolan", "Carl", "Carlo", "Carlos", "Carrich", "Carrick", "Carson", "Carter", "Carwyn", "Casey", "Casper", "Cassy", "Cathal", "Cator"];
var last_names = [
    'Abbott',
    'Acevedo',
    'Acosta',
    'Adams',
    'Adkins',
    'Aguilar',
    'Aguirre',
    'Albert',
    'Alexander',
    'Alford',
    'Allen',
    'Allison',
    'Alston',
    'Alvarado',
    'Alvarez',
    'Anderson',
    'Andrews',
    'Anthony',
    'Armstrong',
    'Arnold',
    'Ashley',
    'Atkins',
    'Atkinson',
    'Austin',
    'Avery',
    'Avila',
    'Ayala',
    'Ayers',
    'Bailey',
    'Baird',
    'Baker',
    'Baldwin',
    'Ball',
    'Ballard',
    'Banks',
    'Barber',
    'Barker',
    'Barlow',
    'Barnes',
    'Barnett',
    'Barr',
    'Barrera',
    'Barrett',
    'Barron',
    'Barry',
    'Bartlett',
    'Barton',
    'Bass',
    'Bates',
    'Battle',
    'Bauer',
    'Baxter',
    'Beach',
    'Bean',
    'Beard',
    'Beasley',
    'Beck',
    'Becker',
    'Bell',
    'Bender',
    'Benjamin',
    'Bennett',
    'Benson',
    'Bentley',
    'Benton',
    'Berg',
    'Berger',
    'Bernard',
    'Berry',
    'Best',
    'Bird',
    'Bishop',
    'Black',
    'Blackburn',
    'Blackwell',
    'Blair',
    'Blake',
    'Blanchard',
    'Blankenship',
    'Blevins',
    'Bolton',
    'Bond',
    'Bonner',
    'Booker',
    'Boone',
    'Booth',
    'Bowen',
    'Bowers',
    'Bowman',
    'Boyd',
    'Boyer',
    'Boyle',
    'Bradford',
    'Bradley',
    'Bradshaw',
    'Brady',
    'Branch',
    'Bray',
    'Brennan',
    'Brewer'];
let j = 0;
let k = 0;
for (let i = 0; i < occupations.length; i++) {
    dataSample[i] = {};
    dataSample[i]["value"] = occupations[i];
    dataSample[i]["children"] = [];
    for (let t = 0; t < 4; t++, j++) {
        dataSample[i]["children"][t] = {};
        dataSample[i]["children"][t]["value"] = last_names[j];
        dataSample[i]["children"][t]["children"] = [];
        for (let s = 0; s < 5; s++, k++) {
            dataSample[i]["children"][t]["children"][s] = {};
            dataSample[i]["children"][t]["children"][s]["value"] = names[k];
        }
    }
}
console.log(j, k)

fs.writeFileSync(path.resolve(__dirname, `./public/anotherMockData/tree.json`), JSON.stringify(dataSample), fileFormat);