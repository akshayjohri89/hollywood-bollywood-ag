/**
 * Bollywood-Hollywood Movie Database
 * Categorized by difficulty levels (1 to 20)
 * Level 1-5: Novice (Mega-blockbusters, simple/popular titles)
 * Level 6-10: Intermediate (Modern classics, medium length)
 * Level 11-15: Advanced (Cult classics, distinctive words, longer titles)
 * Level 16-20: Cinephile / Expert (Classic cinema, tricky spelling, intricate titles)
 */

const MOVIE_DATABASE = {
  bollywood: [
    // Level 1: Super Iconic & Short
    { title: "SHOLAY", year: 1975, genre: "Action/Drama", hint: "Kitne aadmi the?", level: 1 },
    { title: "DON", year: 2006, genre: "Action/Thriller", hint: "Don ko pakadna mushkil hi nahi...", level: 1 },
    { title: "DHOOM", year: 2004, genre: "Action", hint: "Fast bikes and cops", level: 1 },
    { title: "PK", year: 2014, genre: "Comedy/Drama", hint: "An alien stranded on Earth", level: 1 },
    { title: "KRRISH", year: 2006, genre: "Sci-Fi/Superhero", hint: "India's masked superhero", level: 1 },

    // Level 2: Very Popular Blockbusters
    { title: "QUEEN", year: 2014, genre: "Comedy/Drama", hint: "Solo honeymoon trip to Paris", level: 2 },
    { title: "DANGAL", year: 2016, genre: "Sports/Biopic", hint: "Mhari chhoriyan chhoron se kam hain ke?", level: 2 },
    { title: "GHAJINI", year: 2008, genre: "Action/Thriller", hint: "Short-term memory loss revenge", level: 2 },
    { title: "BARFI", year: 2012, genre: "Romance/Comedy", hint: "Charming mute & deaf protagonist", level: 2 },
    { title: "WAR", year: 2019, genre: "Action", hint: "Two super-agents face off", level: 2 },

    // Level 3: Beloved Hits
    { title: "3 IDIOTS", year: 2009, genre: "Comedy/Drama", hint: "All Izz Well at ICE engineering college", level: 3 },
    { title: "LAGAAN", year: 2001, genre: "Sports/Period", hint: "Villagers play cricket against the British", level: 3 },
    { title: "SWADES", year: 2004, genre: "Drama", hint: "NASA scientist brings electricity to village", level: 3 },
    { title: "STREE", year: 2018, genre: "Horror/Comedy", hint: "O Stree Kal Aana", level: 3 },
    { title: "RAAZI", year: 2018, genre: "Espionage/Thriller", hint: "Undercover Indian spy in Pakistan", level: 3 },

    // Level 4: Famous Romantic / Drama Classics
    { title: "KABIR SINGH", year: 2019, genre: "Romance/Drama", hint: "Intense surgeon with anger issues", level: 4 },
    { title: "CHAK DE INDIA", year: 2007, genre: "Sports/Drama", hint: "70 minute coach motivational speech", level: 4 },
    { title: "ROCKSTAR", year: 2011, genre: "Musical/Romance", hint: "Jordan's journey from Janardhan to rock icon", level: 4 },
    { title: "DEV D", year: 2009, genre: "Romance/Drama", hint: "Modern psychedelic Devdas adaptation", level: 4 },
    { title: "VICKY DONOR", year: 2012, genre: "Romance/Comedy", hint: "Unconventional sperm donor story", level: 4 },

    // Level 5: Milestone Hits
    { title: "DIL CHAHTA HAI", year: 2001, genre: "Coming-of-Age", hint: "Three college friends trip to Goa", level: 5 },
    { title: "ANDHADHUN", year: 2018, genre: "Black Comedy/Thriller", hint: "A pianist pretends to be blind", level: 5 },
    { title: "BADHAAI HO", year: 2018, genre: "Comedy/Drama", hint: "Middle-aged parents announce unexpected pregnancy", level: 5 },
    { title: "KAHANI", year: 2012, genre: "Mystery/Thriller", hint: "Pregnant woman searches Kolkata for husband", level: 5 },
    { title: "DRISHYAM", year: 2015, genre: "Crime/Thriller", hint: "2nd October family trip alibi", level: 5 },

    // Level 6: Medium Famous & Longer
    { title: "ZINDAGI NA MILEGI DOBARA", year: 2011, genre: "Adventure/Drama", hint: "Spain road trip with scuba diving and Tomatina", level: 6 },
    { title: "BAJRANGI BHAIJAAN", year: 2015, genre: "Drama/Adventure", hint: "Escorting Munni back across border", level: 6 },
    { title: "TAARE ZAMEEN PAR", year: 2007, genre: "Drama", hint: "Every child is special; art teacher Ram Shankar", level: 6 },
    { title: "GULLY BOY", year: 2019, genre: "Musical/Drama", hint: "Apna Time Aayega underground Mumbai rap", level: 6 },
    { title: "JAB WE MET", year: 2007, genre: "Romance/Comedy", hint: "Geet meets Aditya on a train", level: 6 },

    // Level 7: Thrillers & Action
    { title: "SPECIAL 26", year: 2013, genre: "Heist/Thriller", hint: "Fake CBI officers execute fake income tax raids", level: 7 },
    { title: "TALVAR", year: 2015, genre: "Crime/Drama", hint: "Investigation based on the Noida double murder case", level: 7 },
    { title: "BABY", year: 2015, genre: "Action/Spy", hint: "Counter-intelligence unit prevents terror attack", level: 7 },
    { title: "TUMBBAD", year: 2018, genre: "Mythological/Horror", hint: "Hastar, the god of greed and gold", level: 7 },
    { title: "ARTICLE 15", year: 2019, genre: "Crime/Drama", hint: "IPS officer probes caste-based atrocity in UP", level: 7 },

    // Level 8: Cult Favorites
    { title: "HERA PHERI", year: 2000, genre: "Comedy", hint: "Baburao, Raju, and Shyam get a wrong phone call", level: 8 },
    { title: "GANGS OF WASSEYPUR", year: 2012, genre: "Crime/Action", hint: "Baap ka, bhai ka, sabka badla lega re tera Faizal", level: 8 },
    { title: "MUNNA BHAI MBBS", year: 2003, genre: "Comedy/Drama", hint: "Jadu ki jhappi in medical college", level: 8 },
    { title: "UDTA PUNJAB", year: 2016, genre: "Crime/Drama", hint: "Substance abuse crisis in northern India", level: 8 },
    { title: "OMKARA", year: 2006, genre: "Crime/Drama", hint: "Vishal Bhardwaj's adaptation of Othello", level: 8 },

    // Level 9: Intricate Narratives
    { title: "HAIDER", year: 2014, genre: "Tragedy/Drama", hint: "Hamlet set against Kashmir backdrop", level: 9 },
    { title: "DEEWHAAR", year: 1975, genre: "Drama/Crime", hint: "Mere paas maa hai", level: 9 },
    { title: "BLACK FRIDAY", year: 2004, genre: "Docudrama/Crime", hint: "Anurag Kashyap film on 1993 Bombay bombings", level: 9 },
    { title: "LOOTERA", year: 2013, genre: "Romance/Period", hint: "Inspired by O. Henry's The Last Leaf", level: 9 },
    { title: "UGLY", year: 2013, genre: "Neo-noir/Thriller", hint: "Disappearance of a young girl reveals dark human nature", level: 9 },

    // Level 10: Iconic Epics & Dramas
    { title: "DILWALE DULHANIA LE JAYENGE", year: 1995, genre: "Romance", hint: "Bade bade deshon mein aisi choti choti baatein...", level: 10 },
    { title: "MUGHAL E AZAM", year: 1960, genre: "Epic/Historical", hint: "Pyaar kiya to darna kya; Salim and Anarkali", level: 10 },
    { title: "KAHAANI 2", year: 2016, genre: "Mystery/Thriller", hint: "Durga Rani Singh mystery", level: 10 },
    { title: "BADLAPUR", year: 2015, genre: "Neo-noir/Revenge", hint: "Don't miss the beginning, raghu seeks vengeance", level: 10 },
    { title: "SARDAR UDHAM", year: 2021, genre: "Biopic/Historical", hint: "Revolutionary seeks justice for Jallianwala Bagh", level: 10 },

    // Level 11: Distinctive Words & Spacing
    { title: "BHAAG MILKHA BHAAG", year: 2013, genre: "Sports/Biopic", hint: "The Flying Sikh's biographical journey", level: 11 },
    { title: "NEWTON", year: 2017, genre: "Black Comedy/Drama", hint: "Conducting fair elections in conflict-ridden jungle", level: 11 },
    { title: "NH10", year: 2015, genre: "Thriller/Action", hint: "A road trip turns into survival nightmare", level: 11 },
    { title: "ALIGARH", year: 2015, genre: "Biographical/Drama", hint: "Professor Ramchandra Siras's poignant fight for privacy", level: 11 },
    { title: "OCTOBER", year: 2018, genre: "Drama/Romance", hint: "Hotel management trainee's silent devotion to Shiuli", level: 11 },

    // Level 12: Complex Phrasing
    { title: "JAANE BHI DO YAARO", year: 1983, genre: "Satire/Comedy", hint: "Two photographers and a corrupt municipal drama", level: 12 },
    { title: "MAQBOOL", year: 2003, genre: "Crime/Drama", hint: "Macbeth adapted to Mumbai underworld", level: 12 },
    { title: "MASOOM", year: 1983, genre: "Drama", hint: "Tujhse naraaz nahi zindagi hairan hoon main", level: 12 },
    { title: "GUZAARISH", year: 2010, genre: "Drama", hint: "Paralyzed magician files petition for euthanasia", level: 12 },
    { title: "ANAND", year: 1971, genre: "Drama", hint: "Zindagi badi honi chahiye, lambi nahi", level: 12 },

    // Level 13: Tougher Classics & Indie Gems
    { title: "CHUPKE CHUPKE", year: 1975, genre: "Comedy", hint: "Professor plays driver Pyaremohan in disguise", level: 13 },
    { title: "SHIP OF THESEUS", year: 2012, genre: "Philosophical/Drama", hint: "Anand Gandhi's philosophical masterpiece", level: 13 },
    { title: "SHATRANJ KE KHILARI", year: 1977, genre: "Historical/Drama", hint: "Satyajit Ray's Hindi film on Awadh chess players", level: 13 },
    { title: "COURT", year: 2014, genre: "Legal/Drama", hint: "Folk singer accused of abetting suicide", level: 13 },
    { title: "DHOBI GHAT", year: 2010, genre: "Drama", hint: "Four individuals interconnected across Mumbai", level: 13 },

    // Level 14: Legendary Vintage
    { title: "PYAASA", year: 1957, genre: "Musical/Drama", hint: "Guru Dutt's struggling poet Vijay in an unfeeling city", level: 14 },
    { title: "KAAGAZ KE PHOOL", year: 1959, genre: "Drama", hint: "Film director Suresh Sinha's rise and tragic fall", level: 14 },
    { title: "DO BIGHA ZAMIN", year: 1953, genre: "Neorealist/Drama", hint: "Bimal Roy's farmer Shambhu struggles to save his land", level: 14 },
    { title: "SAHIB BIWI AUR GHULAM", year: 1962, genre: "Period/Drama", hint: "Chhoti Bahu's tragic plight in aristocratic decline", level: 14 },
    { title: "GARAM HAWA", year: 1974, genre: "Historical/Drama", hint: "Post-partition plight of a Muslim family in Agra", level: 14 },

    // Level 15: Mind-Benders & Twists
    { title: "MANORAMA SIX FEET UNDER", year: 2007, genre: "Neo-noir/Mystery", hint: "Small-town amateur detective inspired by Chinatown", level: 15 },
    { title: "NO SMOKING", year: 2007, genre: "Psychological/Surreal", hint: "Baba Bengali's extreme rehabilitation center", level: 15 },
    { title: "JOHNNY GADDAR", year: 2007, genre: "Neo-noir/Heist", hint: "Vikram double-crosses his gang for love and money", level: 15 },
    { title: "TITLI", year: 2014, genre: "Neo-noir/Crime", hint: "Youngest brother seeks escape from car-jacking family", level: 15 },
    { title: "TRAPPED", year: 2016, genre: "Survival/Drama", hint: "Man locked in an uninhabited Mumbai high-rise apartment", level: 15 },

    // Level 16: Tricky Spelling & Niche
    { title: "AGNEEPATH", year: 1990, genre: "Action/Drama", hint: "Vijay Dinanath Chauhan, poora naam", level: 16 },
    { title: "BOMBAY VELVET", year: 2015, genre: "Period/Crime", hint: "Johnny Balraj's ambition in 1960s Bombay jazz clubs", level: 16 },
    { title: "CHIDYAKHAR", year: 1967, genre: "Mystery", hint: "Byomkesh Bakshi investigates a mysterious settlement", level: 16 },
    { title: "MITHYA", year: 2008, genre: "Dark Comedy/Crime", hint: "Struggling actor mistaken for an underworld don", level: 16 },
    { title: "SALAAM BOMBAY", year: 1988, genre: "Drama", hint: "Mira Nair's street children of Mumbai; Krishna/Chaipau", level: 16 },

    // Level 17: Rare & Artistic Words
    { title: "MIRCH MASALA", year: 1987, genre: "Drama/Thriller", hint: "Women defend spice factory with red chili powder", level: 17 },
    { title: "CHAMELEE", year: 2004, genre: "Drama", hint: "Investment banker and a courtesan stranded in Mumbai rain", level: 17 },
    { title: "ANKUR", year: 1974, genre: "Social/Drama", hint: "Shyam Benegal's debut featuring Lakshmi and Surya", level: 17 },
    { title: "ROJA", year: 1992, genre: "Romantic/Thriller", hint: "A cryptographer kidnapped by terrorists in Kashmir", level: 17 },
    { title: "MASAAN", year: 2015, genre: "Drama", hint: "Fly away solo along the ghats of Varanasi", level: 17 },

    // Level 18: Long Title Challenge
    { title: "KABHI KHUSHI KABHIE GHAM", year: 2001, genre: "Drama/Romance", hint: "It's all about loving your parents", level: 18 },
    { title: "HUM DIL DE CHUKE SANAM", year: 1999, genre: "Romance/Musical", hint: "Husband takes wife to Italy to find her first love", level: 18 },
    { title: "HAZAARON KHWAHISHEIN AISI", year: 2003, genre: "Political/Drama", hint: "Three young people during the Indian Emergency", level: 18 },
    { title: "CHUPKE CHUPKE PYAR HO GAYA", year: 1980, genre: "Romance", hint: "Classic retro melodic romance", level: 18 },
    { title: "BAAZIGAR O BAAZIGAR", year: 1993, genre: "Thriller/Musical", hint: "Haar kar jeetne wale ko baazigar kehte hain", level: 18 },

    // Level 19: Obscure Cult Masterpieces
    { title: "AAKROSH", year: 1980, genre: "Social/Thriller", hint: "Mute tribal Lahanya Bhiku accused of murder", level: 19 },
    { title: "SPARSH", year: 1980, genre: "Drama/Romance", hint: "Visually impaired school principal Aniruddh and Kavita", level: 19 },
    { title: "EK RUKA HUA FAISLA", year: 1986, genre: "Drama", hint: "Indian remake of Twelve Angry Men", level: 19 },
    { title: "DROHKAAL", year: 1994, genre: "Crime/Drama", hint: "Govind Nihalani's psychological war against undercover cops", level: 19 },
    { title: "OM DAR B DAR", year: 1988, genre: "Surreal/Postmodern", hint: "Cult postmodern avant-garde cinematic experiment in Ajmer", level: 19 },

    // Level 20: Ultimate Cinephile Boss Level
    { title: "ALBERT PINTO KO GUSSA KYOON AATA HAI", year: 1980, genre: "Drama", hint: "Saeed Mirza's disgruntled car mechanic in Mumbai", level: 20 },
    { title: "ARVIND DESAI KI AJEEB DASTAAN", year: 1978, genre: "Drama", hint: "Existential crisis of a wealthy merchant's son", level: 20 },
    { title: "KHAMOSH PANI", year: 2003, genre: "Period/Drama", hint: "Silent Waters in a 1979 Punjab village", level: 20 },
    { title: "BULLBUL", year: 2020, genre: "Supernatural/Period", hint: "Twisted feet and a protector of women in colonial Bengal", level: 20 },
    { title: "SALIM LANGDE PE MAT RO", year: 1989, genre: "Social/Crime", hint: "A lame petty thief dreams of dignity in Dongri", level: 20 }
  ],

  hollywood: [
    // Level 1: Global Mega-Blockbusters
    { title: "TITANIC", year: 1997, genre: "Romance/Disaster", hint: "I'm the king of the world!", level: 1 },
    { title: "AVATAR", year: 2009, genre: "Sci-Fi/Action", hint: "Blue Na'vi inhabitants on moon Pandora", level: 1 },
    { title: "JAWS", year: 1975, genre: "Thriller/Adventure", hint: "You're gonna need a bigger boat", level: 1 },
    { title: "GLADIATOR", year: 2000, genre: "Epic/Action", hint: "Are you not entertained? Maximus Decimus", level: 1 },
    { title: "THE MATRIX", year: 1999, genre: "Sci-Fi/Action", hint: "Red pill or blue pill?", level: 1 },

    // Level 2: Super Famous Hits
    { title: "INCEPTION", year: 2010, genre: "Sci-Fi/Action", hint: "Dream within a dream with a spinning top", level: 2 },
    { title: "JURASSIC PARK", year: 1993, genre: "Sci-Fi/Adventure", hint: "Life finds a way with cloned dinosaurs", level: 2 },
    { title: "STAR WARS", year: 1977, genre: "Sci-Fi/Fantasy", hint: "May the Force be with you", level: 2 },
    { title: "ROCKY", year: 1976, genre: "Sports/Drama", hint: "Italian Stallion boxing champion", level: 2 },
    { title: "THE LION KING", year: 1994, genre: "Animation/Drama", hint: "Hakuna Matata in the Pride Lands", level: 2 },

    // Level 3: Critically Acclaimed Standards
    { title: "INTERSTELLAR", year: 2014, genre: "Sci-Fi/Drama", hint: "Traveling through wormhole near Saturn", level: 3 },
    { title: "THE DARK KNIGHT", year: 2008, genre: "Action/Superhero", hint: "Why so serious? Gotham's caped crusader", level: 3 },
    { title: "FORREST GUMP", year: 1994, genre: "Comedy/Drama", hint: "Life was like a box of chocolates", level: 3 },
    { title: "FIGHT CLUB", year: 1999, genre: "Drama/Thriller", hint: "The first rule is you do not talk about it", level: 3 },
    { title: "BACK TO THE FUTURE", year: 1985, genre: "Sci-Fi/Comedy", hint: "DeLorean time machine with Doc and Marty", level: 3 },

    // Level 4: Famous Masterpieces
    { title: "PULP FICTION", year: 1994, genre: "Crime/Drama", hint: "Royale with cheese; Vincent and Jules", level: 4 },
    { title: "THE GODFATHER", year: 1972, genre: "Crime/Drama", hint: "An offer he can't refuse; Corleone family", level: 4 },
    { title: "SEVEN", year: 1995, genre: "Crime/Mystery", hint: "What's in the box? Seven deadly sins", level: 4 },
    { title: "THE PRESTIGE", year: 2006, genre: "Drama/Mystery", hint: "Rival magicians obsessed with teleportation illusion", level: 4 },
    { title: "GOODFELLAS", year: 1990, genre: "Biographical/Crime", hint: "As far back as I can remember I wanted to be a gangster", level: 4 },

    // Level 5: Cinematic Landmarks
    { title: "THE SHAWSHANK REDEMPTION", year: 1994, genre: "Drama", hint: "Hope is a good thing; Andy Dufresne escapes", level: 5 },
    { title: "CASABLANCA", year: 1942, genre: "Romance/Drama", hint: "Here's looking at you, kid; Rick's Café", level: 5 },
    { title: "PSYCHO", year: 1960, genre: "Horror/Thriller", hint: "Bates Motel shower scene; Norman Bates", level: 5 },
    { title: "THE DEPARTED", year: 2006, genre: "Crime/Thriller", hint: "Undercover cop vs mole in Boston Irish mob", level: 5 },
    { title: "WHIPLASH", year: 2014, genre: "Drama/Music", hint: "Not quite my tempo! Ferocious jazz drumming", level: 5 },

    // Level 6: Modern Marvels
    { title: "BLADE RUNNER", year: 1982, genre: "Sci-Fi/Neo-noir", hint: "Tears in rain; Deckard hunts Replicants", level: 6 },
    { title: "APOCALYPSE NOW", year: 1979, genre: "War/Drama", hint: "I love the smell of napalm in the morning", level: 6 },
    { title: "MAD MAX FURY ROAD", year: 2015, genre: "Action/Sci-Fi", hint: "Witness me! Immortan Joe across wasteland", level: 6 },
    { title: "THE SILENCE OF THE LAMBS", year: 1991, genre: "Thriller/Horror", hint: "Dr. Hannibal Lecter and Clarice Starling", level: 6 },
    { title: "TAXI DRIVER", year: 1976, genre: "Crime/Drama", hint: "You talkin' to me? Travis Bickle in NYC", level: 6 },

    // Level 7: High-Tension Drama
    { title: "NO COUNTRY FOR OLD MEN", year: 2007, genre: "Crime/Thriller", hint: "Anton Chigurh and his coin toss", level: 7 },
    { title: "THERE WILL BE BLOOD", year: 2007, genre: "Drama/Period", hint: "I drink your milkshake! Daniel Plainview oil baron", level: 7 },
    { title: "INGLOURIOUS BASTERDS", year: 2009, genre: "War/Drama", hint: "Lt. Aldo Raine scalping Nazi hunters", level: 7 },
    { title: "RESERVOIR DOGS", year: 1992, genre: "Crime/Thriller", hint: "Color-coded jewel thieves stuck in a warehouse", level: 7 },
    { title: "THE TRUMAN SHOW", year: 1998, genre: "Comedy/Drama", hint: "Man discovers his entire life is a 24/7 TV broadcast", level: 7 },

    // Level 8: Atmospheric Classics
    { title: "THE SHINING", year: 1980, genre: "Horror/Psychological", hint: "Here's Johnny! Overlook Hotel winter caretaker", level: 8 },
    { title: "FARGO", year: 1996, genre: "Crime/Thriller", hint: "Kidnapping goes terribly wrong in freezing Minnesota", level: 8 },
    { title: "MEMENTO", year: 2000, genre: "Mystery/Thriller", hint: "Short-term memory tattoos told in reverse", level: 8 },
    { title: "THE USUAL SUSPECTS", year: 1995, genre: "Crime/Mystery", hint: "Who is Keyser Söze?", level: 8 },
    { title: "12 ANGRY MEN", year: 1957, genre: "Legal/Drama", hint: "One juror holds out against a unanimous guilty verdict", level: 8 },

    // Level 9: Distinctive Masterworks
    { title: "ETERNAL SUNSHINE OF THE SPOTLESS MIND", year: 2004, genre: "Romance/Sci-Fi", hint: "Erasing memories of an ex-lover with Lacuna Inc", level: 9 },
    { title: "THE GRAND BUDAPEST HOTEL", year: 2014, genre: "Comedy/Drama", hint: "Monsieur Gustave H. and Zero the lobby boy", level: 9 },
    { title: "BIRDMAN", year: 2014, genre: "Comedy/Drama", hint: "Washed-up superhero actor mounts a Broadway play", level: 9 },
    { title: "PARASITE", year: 2019, genre: "Thriller/Comedy", hint: "Impoverished Kim family infiltrates wealthy household", level: 9 },
    { title: "HER", year: 2013, genre: "Romance/Sci-Fi", hint: "Lonely writer falls in love with his AI OS Samantha", level: 9 },

    // Level 10: Legendary Cinema
    { title: "CITIZEN KANE", year: 1941, genre: "Drama/Mystery", hint: "Dying media tycoon whispers 'Rosebud'", level: 10 },
    { title: "2001 A SPACE ODYSSEY", year: 1968, genre: "Sci-Fi", hint: "HAL 9000: I'm sorry Dave, I'm afraid I can't do that", level: 10 },
    { title: "SUNSET BOULEVARD", year: 1950, genre: "Film-Noir/Drama", hint: "All right Mr. DeMille, I'm ready for my close-up", level: 10 },
    { title: "A CLOCKWORK ORANGE", year: 1971, genre: "Sci-Fi/Crime", hint: "Alex DeLarge and the Ludovico technique", level: 10 },
    { title: "CHINATOWN", year: 1974, genre: "Mystery/Neo-noir", hint: "Forget it Jake, it's Chinatown; LA water scandal", level: 10 },

    // Level 11: Longer Distinct Titles
    { title: "PAN'S LABYRINTH", year: 2006, genre: "Dark Fantasy/War", hint: "Ofelia completes three tasks in postwar fascist Spain", level: 11 },
    { title: "REQUIEM FOR A DREAM", year: 2000, genre: "Psychological/Drama", hint: "Devastating spiral of substance and addiction", level: 11 },
    { title: "PRISONERS", year: 2013, genre: "Thriller/Crime", hint: "Desperate father takes law into his own hands", level: 11 },
    { title: "SNATCH", year: 2000, genre: "Comedy/Crime", hint: "Bare-knuckle boxing gypsy Mickey O'Neil", level: 11 },
    { title: "DONNIE DARKO", year: 2001, genre: "Sci-Fi/Psychological", hint: "Frank the giant rabbit predicts the end of the world", level: 11 },

    // Level 12: Mind-Benders & Twists
    { title: "MULHOLLAND DRIVE", year: 2001, genre: "Surrealist/Mystery", hint: "David Lynch's dreamscape of an amnesiac woman in Hollywood", level: 12 },
    { title: "SHUTTER ISLAND", year: 2010, genre: "Psychological/Thriller", hint: "U.S. Marshal investigates escapee at Ashecliffe hospital", level: 12 },
    { title: "CHILDREN OF MEN", year: 2006, genre: "Sci-Fi/Dystopian", hint: "World where women have become infertile; Kee's pregnancy", level: 12 },
    { title: "BLOW UP", year: 1966, genre: "Mystery/Drama", hint: "Fashion photographer unwittingly captures murder in park", level: 12 },
    { title: "THE BIG LEBOWSKI", year: 1998, genre: "Comedy/Crime", hint: "The Dude abides; that rug really tied the room together", level: 12 },

    // Level 13: Tougher Classics & Epics
    { title: "SINGIN IN THE RAIN", year: 1952, genre: "Musical/Comedy", hint: "Transition from silent movies to 'talkies'", level: 13 },
    { title: "LAWRENCE OF ARABIA", year: 1962, genre: "Adventure/Biopic", hint: "T.E. Lawrence unites Arab tribes across the desert", level: 13 },
    { title: "REAR WINDOW", year: 1954, genre: "Mystery/Thriller", hint: "Wheelchair-bound photographer spies on neighbours", level: 13 },
    { title: "VERTIGO", year: 1958, genre: "Psychological/Mystery", hint: "Detective with acrophobia obsessed with Madeleine", level: 13 },
    { title: "SOME LIKE IT HOT", year: 1959, genre: "Comedy/Music", hint: "Musicians disguise themselves as women in all-female band", level: 13 },

    // Level 14: Cult Classics
    { title: "THE THIRD MAN", year: 1949, genre: "Film-Noir", hint: "Harry Lime cuckoo clock speech in ruined postwar Vienna", level: 14 },
    { title: "TOUCH OF EVIL", year: 1958, genre: "Film-Noir/Crime", hint: "Orson Welles' corrupt police captain Hank Quinlan", level: 14 },
    { title: "BARRY LYNDON", year: 1975, genre: "Period/Drama", hint: "Stanley Kubrick shot entirely with natural candle light", level: 14 },
    { title: "RAGING BULL", year: 1980, genre: "Biographical/Sports", hint: "Jake LaMotta's violent boxing rise and self-destruction", level: 14 },
    { title: "ALL ABOUT EVE", year: 1950, genre: "Drama", hint: "Fasten your seatbelts, it's going to be a bumpy night", level: 14 },

    // Level 15: Obscure & Complex Letters
    { title: "NETWORK", year: 1976, genre: "Satire/Drama", hint: "I'm as mad as hell and I'm not going to take this anymore!", level: 15 },
    { title: "NIGHTCRAWLER", year: 2014, genre: "Thriller/Crime", hint: "Lou Bloom films violent crimes for TV news", level: 15 },
    { title: "STALKER", year: 1979, genre: "Sci-Fi/Art", hint: "Tarkovsky's guide leads two men into the mysterious Zone", level: 15 },
    { title: "DR STRANGELOVE", year: 1964, genre: "Political Satire", hint: "How I Learned to Stop Worrying and Love the Bomb", level: 15 },
    { title: "THE MALTESE FALCON", year: 1941, genre: "Film-Noir", hint: "The stuff that dreams are made of; Sam Spade", level: 15 },

    // Level 16: Unique Spelling & Hard Letter Combos
    { title: "METROPOLIS", year: 1927, genre: "Sci-Fi/Dystopian", hint: "Fritz Lang's silent masterpiece with robot Maria", level: 16 },
    { title: "SYNECDOCHE NEW YORK", year: 2008, genre: "Drama/Psychological", hint: "Theater director creates life-sized replica of NY in warehouse", level: 16 },
    { title: "BLADE RUNNER 2049", year: 2017, genre: "Sci-Fi/Neo-noir", hint: "Officer K discovers a long-buried secret about replicants", level: 16 },
    { title: "BRAZIL", year: 1985, genre: "Dystopian/Satire", hint: "Terry Gilliam's bureaucratic nightmare caused by a bug", level: 16 },
    { title: "RASHOMON", year: 1950, genre: "Psychological/Crime", hint: "Contradictory accounts of the same event by different witnesses", level: 16 },

    // Level 17: Long Art-House Epics
    { title: "THE BICYCLE THIEVES", year: 1948, genre: "Neorealist/Drama", hint: "Father and son search Rome for stolen work bicycle", level: 17 },
    { title: "SEVENTH SEAL", year: 1957, genre: "Fantasy/Drama", hint: "Knight plays chess with Death during the Black Plague", level: 17 },
    { title: "THE WILD BUNCH", year: 1969, genre: "Western", hint: "Aging outlaws make one final bloody stand on Mexico border", level: 17 },
    { title: "PERSONA", year: 1966, genre: "Psychological/Drama", hint: "Mute actress and young nurse merge identities on island", level: 17 },
    { title: "SOLARIS", year: 1972, genre: "Sci-Fi/Mystery", hint: "Psychologist confronts manifestations of grief on oceanic planet", level: 17 },

    // Level 18: Very Long & Multi-Word Titles
    { title: "THE TREASURE OF THE SIERRA MADRE", year: 1948, genre: "Adventure/Western", hint: "Badges? We ain't got no badges! Gold prospecting paranoia", level: 18 },
    { title: "THERE IS NO COUNTRY FOR OLD MEN", year: 2007, genre: "Drama", hint: "Full poetic title variation of the Coen Brothers classic", level: 18 },
    { title: "THREE BILLBOARDS OUTSIDE EBBING MISSOURI", year: 2017, genre: "Crime/Drama", hint: "Mother rents three signs demanding justice for daughter", level: 18 },
    { title: "BEAU TRAVAIL", year: 1999, genre: "Drama/Art", hint: "French Foreign Legionnaires in Djibouti desert; Claire Denis", level: 18 },
    { title: "THE ASSASSINATION OF JESSE JAMES", year: 2007, genre: "Western/Biopic", hint: "By the Coward Robert Ford; poetic cinematography", level: 18 },

    // Level 19: Obscure Classics & Deep Cinephile
    { title: "DOG DAY AFTERNOON", year: 1975, genre: "Crime/Drama", hint: "Attica! Attica! Bank robbery for gender reassignment surgery", level: 19 },
    { title: "AGUIRRE THE WRATH OF GOD", year: 1972, genre: "Historical/Adventure", hint: "Mad Spanish conquistador searches Amazon for El Dorado", level: 19 },
    { title: "WILD STRAWBERRIES", year: 1957, genre: "Drama", hint: "Aging professor reflects on his past during a car journey", level: 19 },
    { title: "THE 400 BLOWS", year: 1959, genre: "French New Wave", hint: "Antoine Doinel's troubled youth in Paris; Truffaut", level: 19 },
    { title: "LA DOLCE VITA", year: 1960, genre: "Comedy/Drama", hint: "Marcello Rubini navigates the high society of Rome", level: 19 },

    // Level 20: Ultimate Boss Level (Long, Rare, or Tricky)
    { title: "EVERYTHING EVERYWHERE ALL AT ONCE", year: 2022, genre: "Sci-Fi/Multiverse", hint: "Laundromat owner jumps universes with hotdog fingers", level: 20 },
    { title: "THE PASSION OF JOAN OF ARC", year: 1928, genre: "Historical/Drama", hint: "Carl Theodor Dreyer's silent close-up masterpiece of trial", level: 20 },
    { title: "THE COOK THE THIEF HIS WIFE AND HER LOVER", year: 1989, genre: "Drama/Dark Comedy", hint: "Peter Greenaway's decadent, color-coded revenge banquet", level: 20 },
    { title: "CLOSE ENCOUNTERS OF THE THIRD KIND", year: 1977, genre: "Sci-Fi", hint: "Five musical tones and Devil's Tower alien communication", level: 20 },
    { title: "ONCE UPON A TIME IN THE WEST", year: 1968, genre: "Spaghetti Western", hint: "Harmonica player and Frank clash over railway water land", level: 20 }
  ]
};

// Expose globally
if (typeof window !== "undefined") {
  window.MOVIE_DATABASE = MOVIE_DATABASE;
}
