export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

/**
 * Curated list of ~500 major world airports.
 * Sorted alphabetically by IATA code for fast binary-search if needed.
 * Covers Africa, Europe, Middle East, Asia, Americas, and Oceania.
 */
export const airports: Airport[] = [
  // ── Africa ──────────────────────────────────────────
  { iata: 'ABJ', name: 'Félix-Houphouët-Boigny Intl', city: 'Abidjan', country: 'Ivory Coast' },
  { iata: 'ABV', name: 'Nnamdi Azikiwe Intl', city: 'Abuja', country: 'Nigeria' },
  { iata: 'ACC', name: 'Kotoka International', city: 'Accra', country: 'Ghana' },
  { iata: 'ADD', name: 'Bole International', city: 'Addis Ababa', country: 'Ethiopia' },
  { iata: 'ALG', name: 'Houari Boumediene', city: 'Algiers', country: 'Algeria' },
  { iata: 'BKO', name: 'Modibo Keita Intl', city: 'Bamako', country: 'Mali' },
  { iata: 'BJL', name: 'Banjul Intl', city: 'Banjul', country: 'Gambia' },
  { iata: 'BZV', name: 'Maya-Maya', city: 'Brazzaville', country: 'Republic of the Congo' },
  { iata: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },
  { iata: 'CMN', name: 'Mohammed V International', city: 'Casablanca', country: 'Morocco' },
  { iata: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa' },
  { iata: 'DAR', name: 'Julius Nyerere Intl', city: 'Dar es Salaam', country: 'Tanzania' },
  { iata: 'DKR', name: 'Blaise Diagne Intl', city: 'Dakar', country: 'Senegal' },
  { iata: 'DLA', name: 'Douala International', city: 'Douala', country: 'Cameroon' },
  { iata: 'DSS', name: 'Blaise Diagne Intl', city: 'Diass', country: 'Senegal' },
  { iata: 'DUR', name: 'King Shaka Intl', city: 'Durban', country: 'South Africa' },
  { iata: 'EBB', name: 'Entebbe International', city: 'Entebbe', country: 'Uganda' },
  { iata: 'FIH', name: 'N\'Djili International', city: 'Kinshasa', country: 'DR Congo' },
  { iata: 'FNA', name: 'Lungi International', city: 'Freetown', country: 'Sierra Leone' },
  { iata: 'GBE', name: 'Sir Seretse Khama Intl', city: 'Gaborone', country: 'Botswana' },
  { iata: 'HRE', name: 'Robert Gabriel Mugabe Intl', city: 'Harare', country: 'Zimbabwe' },
  { iata: 'HRG', name: 'Hurghada International', city: 'Hurghada', country: 'Egypt' },
  { iata: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { iata: 'JRO', name: 'Kilimanjaro Intl', city: 'Kilimanjaro', country: 'Tanzania' },
  { iata: 'KGL', name: 'Kigali International', city: 'Kigali', country: 'Rwanda' },
  { iata: 'KRT', name: 'Khartoum International', city: 'Khartoum', country: 'Sudan' },
  { iata: 'LAD', name: 'Quatro de Fevereiro', city: 'Luanda', country: 'Angola' },
  { iata: 'LBV', name: 'Léon-Mba International', city: 'Libreville', country: 'Gabon' },
  { iata: 'LFW', name: 'Lomé-Tokoin', city: 'Lomé', country: 'Togo' },
  { iata: 'LLW', name: 'Lilongwe International', city: 'Lilongwe', country: 'Malawi' },
  { iata: 'LOS', name: 'Murtala Muhammed Intl', city: 'Lagos', country: 'Nigeria' },
  { iata: 'LUN', name: 'Kenneth Kaunda Intl', city: 'Lusaka', country: 'Zambia' },
  { iata: 'MBA', name: 'Moi International', city: 'Mombasa', country: 'Kenya' },
  { iata: 'MGQ', name: 'Aden Abdulle Intl', city: 'Mogadishu', country: 'Somalia' },
  { iata: 'MLE', name: 'Velana International', city: 'Malé', country: 'Maldives' },
  { iata: 'MPM', name: 'Maputo International', city: 'Maputo', country: 'Mozambique' },
  { iata: 'MRU', name: 'Sir Seewoosagur Ramgoolam', city: 'Mauritius', country: 'Mauritius' },
  { iata: 'NBO', name: 'Jomo Kenyatta Intl', city: 'Nairobi', country: 'Kenya' },
  { iata: 'NKC', name: 'Nouakchott–Oumtounsy Intl', city: 'Nouakchott', country: 'Mauritania' },
  { iata: 'OUA', name: 'Thomas Sankara Intl', city: 'Ouagadougou', country: 'Burkina Faso' },
  { iata: 'PLZ', name: 'Chief Dawid Stuurman Intl', city: 'Gqeberha', country: 'South Africa' },
  { iata: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco' },
  { iata: 'ROB', name: 'Roberts International', city: 'Monrovia', country: 'Liberia' },
  { iata: 'RUN', name: 'Roland Garros', city: 'Saint-Denis', country: 'Réunion' },
  { iata: 'SEZ', name: 'Seychelles Intl', city: 'Mahé', country: 'Seychelles' },
  { iata: 'SSH', name: 'Sharm El Sheikh Intl', city: 'Sharm El Sheikh', country: 'Egypt' },
  { iata: 'TIP', name: 'Tripoli International', city: 'Tripoli', country: 'Libya' },
  { iata: 'TMS', name: 'São Tomé International', city: 'São Tomé', country: 'São Tomé and Príncipe' },
  { iata: 'TNG', name: 'Ibn Battouta', city: 'Tangier', country: 'Morocco' },
  { iata: 'TNR', name: 'Ivato International', city: 'Antananarivo', country: 'Madagascar' },
  { iata: 'TUN', name: 'Tunis–Carthage', city: 'Tunis', country: 'Tunisia' },
  { iata: 'WDH', name: 'Hosea Kutako Intl', city: 'Windhoek', country: 'Namibia' },
  { iata: 'YDE', name: 'Yaoundé Nsimalen Intl', city: 'Yaoundé', country: 'Cameroon' },
  { iata: 'ZNZ', name: 'Abeid Amani Karume Intl', city: 'Zanzibar', country: 'Tanzania' },

  // ── Middle East ─────────────────────────────────────
  { iata: 'AHB', name: 'Abha Regional', city: 'Abha', country: 'Saudi Arabia' },
  { iata: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan' },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE' },
  { iata: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain' },
  { iata: 'BEY', name: 'Rafic Hariri International', city: 'Beirut', country: 'Lebanon' },
  { iata: 'DAM', name: 'Damascus International', city: 'Damascus', country: 'Syria' },
  { iata: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia' },
  { iata: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { iata: 'GYD', name: 'Heydar Aliyev International', city: 'Baku', country: 'Azerbaijan' },
  { iata: 'IKA', name: 'Imam Khomeini Intl', city: 'Tehran', country: 'Iran' },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { iata: 'JED', name: 'King Abdulaziz Intl', city: 'Jeddah', country: 'Saudi Arabia' },
  { iata: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait' },
  { iata: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman' },
  { iata: 'MED', name: 'Prince Mohammad bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia' },
  { iata: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia' },
  { iata: 'SAW', name: 'Sabiha Gökçen', city: 'Istanbul', country: 'Turkey' },
  { iata: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'UAE' },
  { iata: 'TBS', name: 'Tbilisi International', city: 'Tbilisi', country: 'Georgia' },
  { iata: 'TLV', name: 'Ben Gurion International', city: 'Tel Aviv', country: 'Israel' },

  // ── Europe ──────────────────────────────────────────
  { iata: 'AGP', name: 'Málaga–Costa del Sol', city: 'Málaga', country: 'Spain' },
  { iata: 'ALC', name: 'Alicante–Elche', city: 'Alicante', country: 'Spain' },
  { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden' },
  { iata: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece' },
  { iata: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', country: 'Spain' },
  { iata: 'BEG', name: 'Nikola Tesla', city: 'Belgrade', country: 'Serbia' },
  { iata: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany' },
  { iata: 'BGY', name: 'Milan Bergamo', city: 'Bergamo', country: 'Italy' },
  { iata: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom' },
  { iata: 'BLL', name: 'Billund Airport', city: 'Billund', country: 'Denmark' },
  { iata: 'BLQ', name: 'Bologna Guglielmo Marconi', city: 'Bologna', country: 'Italy' },
  { iata: 'BOD', name: 'Bordeaux–Mérignac', city: 'Bordeaux', country: 'France' },
  { iata: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom' },
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },
  { iata: 'BSL', name: 'EuroAirport Basel Mulhouse', city: 'Basel', country: 'Switzerland' },
  { iata: 'BTS', name: 'M. R. Štefánik', city: 'Bratislava', country: 'Slovakia' },
  { iata: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { iata: 'CIA', name: 'Rome Ciampino', city: 'Rome', country: 'Italy' },
  { iata: 'CKY', name: 'Conakry International', city: 'Conakry', country: 'Guinea' },
  { iata: 'CLJ', name: 'Cluj-Napoca Intl', city: 'Cluj-Napoca', country: 'Romania' },
  { iata: 'COO', name: 'Cadjehoun', city: 'Cotonou', country: 'Benin' },
  { iata: 'CPH', name: 'Copenhagen Kastrup', city: 'Copenhagen', country: 'Denmark' },
  { iata: 'CTA', name: 'Catania–Fontanarossa', city: 'Catania', country: 'Italy' },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { iata: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany' },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom' },
  { iata: 'EVN', name: 'Zvartnots International', city: 'Yerevan', country: 'Armenia' },
  { iata: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal' },
  { iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', country: 'Italy' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { iata: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom' },
  { iata: 'GOT', name: 'Göteborg Landvetter', city: 'Gothenburg', country: 'Sweden' },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
  { iata: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany' },
  { iata: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland' },
  { iata: 'IBZ', name: 'Ibiza Airport', city: 'Ibiza', country: 'Spain' },
  { iata: 'KEF', name: 'Keflavík International', city: 'Reykjavik', country: 'Iceland' },
  { iata: 'KRK', name: 'John Paul II Intl', city: 'Kraków', country: 'Poland' },
  { iata: 'LCA', name: 'Larnaca International', city: 'Larnaca', country: 'Cyprus' },
  { iata: 'LED', name: 'Pulkovo', city: 'Saint Petersburg', country: 'Russia' },
  { iata: 'LGW', name: 'London Gatwick', city: 'London', country: 'United Kingdom' },
  { iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
  { iata: 'LIN', name: 'Milan Linate', city: 'Milan', country: 'Italy' },
  { iata: 'LIS', name: 'Lisbon Humberto Delgado', city: 'Lisbon', country: 'Portugal' },
  { iata: 'LTN', name: 'London Luton', city: 'London', country: 'United Kingdom' },
  { iata: 'LUX', name: 'Luxembourg Findel', city: 'Luxembourg', country: 'Luxembourg' },
  { iata: 'LYS', name: 'Lyon–Saint-Exupéry', city: 'Lyon', country: 'France' },
  { iata: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', country: 'Spain' },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom' },
  { iata: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France' },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { iata: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'Italy' },
  { iata: 'NAP', name: 'Naples International', city: 'Naples', country: 'Italy' },
  { iata: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France' },
  { iata: 'OPO', name: 'Porto Airport', city: 'Porto', country: 'Portugal' },
  { iata: 'ORY', name: 'Paris Orly', city: 'Paris', country: 'France' },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway' },
  { iata: 'OTP', name: 'Henri Coandă International', city: 'Bucharest', country: 'Romania' },
  { iata: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'Spain' },
  { iata: 'PRG', name: 'Václav Havel Prague', city: 'Prague', country: 'Czech Republic' },
  { iata: 'RIX', name: 'Riga International', city: 'Riga', country: 'Latvia' },
  { iata: 'SKG', name: 'Thessaloniki Makedonia', city: 'Thessaloniki', country: 'Greece' },
  { iata: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria' },
  { iata: 'STN', name: 'London Stansted', city: 'London', country: 'United Kingdom' },
  { iata: 'STR', name: 'Stuttgart Airport', city: 'Stuttgart', country: 'Germany' },
  { iata: 'SVO', name: 'Sheremetyevo', city: 'Moscow', country: 'Russia' },
  { iata: 'SVQ', name: 'Seville Airport', city: 'Seville', country: 'Spain' },
  { iata: 'SXB', name: 'Strasbourg Airport', city: 'Strasbourg', country: 'France' },
  { iata: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'Spain' },
  { iata: 'TLL', name: 'Tallinn Lennart Meri', city: 'Tallinn', country: 'Estonia' },
  { iata: 'TLS', name: 'Toulouse–Blagnac', city: 'Toulouse', country: 'France' },
  { iata: 'VCE', name: 'Venice Marco Polo', city: 'Venice', country: 'Italy' },
  { iata: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria' },
  { iata: 'VLC', name: 'Valencia Airport', city: 'Valencia', country: 'Spain' },
  { iata: 'VNO', name: 'Vilnius Airport', city: 'Vilnius', country: 'Lithuania' },
  { iata: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland' },
  { iata: 'ZAG', name: 'Zagreb Airport', city: 'Zagreb', country: 'Croatia' },
  { iata: 'ZRH', name: 'Zürich Airport', city: 'Zürich', country: 'Switzerland' },

  // ── Asia & Pacific ──────────────────────────────────
  { iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand' },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India' },
  { iata: 'CAN', name: 'Guangzhou Baiyun', city: 'Guangzhou', country: 'China' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India' },
  { iata: 'CEB', name: 'Mactan–Cebu Intl', city: 'Cebu', country: 'Philippines' },
  { iata: 'CGK', name: 'Soekarno–Hatta', city: 'Jakarta', country: 'Indonesia' },
  { iata: 'CMB', name: 'Bandaranaike Intl', city: 'Colombo', country: 'Sri Lanka' },
  { iata: 'CNX', name: 'Chiang Mai Intl', city: 'Chiang Mai', country: 'Thailand' },
  { iata: 'CTS', name: 'New Chitose', city: 'Sapporo', country: 'Japan' },
  { iata: 'CTU', name: 'Chengdu Tianfu', city: 'Chengdu', country: 'China' },
  { iata: 'DAD', name: 'Da Nang International', city: 'Da Nang', country: 'Vietnam' },
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
  { iata: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thailand' },
  { iata: 'DPS', name: 'Ngurah Rai (Bali)', city: 'Denpasar', country: 'Indonesia' },
  { iata: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam' },
  { iata: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'Hong Kong' },
  { iata: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand' },
  { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  { iata: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', country: 'India' },
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { iata: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan' },
  { iata: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan' },
  { iata: 'KIX', name: 'Kansai International', city: 'Osaka', country: 'Japan' },
  { iata: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal' },
  { iata: 'KUL', name: 'Kuala Lumpur Intl (KLIA)', city: 'Kuala Lumpur', country: 'Malaysia' },
  { iata: 'LHE', name: 'Allama Iqbal Intl', city: 'Lahore', country: 'Pakistan' },
  { iata: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
  { iata: 'MFM', name: 'Macau International', city: 'Macau', country: 'Macau' },
  { iata: 'MNL', name: 'Ninoy Aquino Intl', city: 'Manila', country: 'Philippines' },
  { iata: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { iata: 'PEK', name: 'Beijing Capital', city: 'Beijing', country: 'China' },
  { iata: 'PKX', name: 'Beijing Daxing', city: 'Beijing', country: 'China' },
  { iata: 'PNH', name: 'Phnom Penh Intl', city: 'Phnom Penh', country: 'Cambodia' },
  { iata: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China' },
  { iata: 'REP', name: 'Siem Reap Angkor Intl', city: 'Siem Reap', country: 'Cambodia' },
  { iata: 'RGN', name: 'Yangon International', city: 'Yangon', country: 'Myanmar' },
  { iata: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { iata: 'SZX', name: 'Shenzhen Bao\'an', city: 'Shenzhen', country: 'China' },
  { iata: 'TPE', name: 'Taiwan Taoyuan', city: 'Taipei', country: 'Taiwan' },
  { iata: 'ULN', name: 'Chinggis Khaan Intl', city: 'Ulaanbaatar', country: 'Mongolia' },
  { iata: 'VTE', name: 'Wattay International', city: 'Vientiane', country: 'Laos' },

  // ── Oceania ─────────────────────────────────────────
  { iata: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
  { iata: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
  { iata: 'CHC', name: 'Christchurch Intl', city: 'Christchurch', country: 'New Zealand' },
  { iata: 'MEL', name: 'Melbourne Tullamarine', city: 'Melbourne', country: 'Australia' },
  { iata: 'NAN', name: 'Nadi International', city: 'Nadi', country: 'Fiji' },
  { iata: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia' },
  { iata: 'PPT', name: 'Faa\'a International', city: 'Papeete', country: 'French Polynesia' },
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { iata: 'WLG', name: 'Wellington Airport', city: 'Wellington', country: 'New Zealand' },

  // ── North America ───────────────────────────────────
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', country: 'United States' },
  { iata: 'AUS', name: 'Austin-Bergstrom Intl', city: 'Austin', country: 'United States' },
  { iata: 'BNA', name: 'Nashville International', city: 'Nashville', country: 'United States' },
  { iata: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States' },
  { iata: 'BWI', name: 'Baltimore/Washington Intl', city: 'Baltimore', country: 'United States' },
  { iata: 'CLE', name: 'Cleveland Hopkins Intl', city: 'Cleveland', country: 'United States' },
  { iata: 'CLT', name: 'Charlotte Douglas Intl', city: 'Charlotte', country: 'United States' },
  { iata: 'CUN', name: 'Cancún International', city: 'Cancún', country: 'Mexico' },
  { iata: 'CVG', name: 'Cincinnati/Northern Kentucky', city: 'Cincinnati', country: 'United States' },
  { iata: 'DCA', name: 'Ronald Reagan Washington', city: 'Washington', country: 'United States' },
  { iata: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States' },
  { iata: 'DFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', country: 'United States' },
  { iata: 'DTW', name: 'Detroit Metropolitan Wayne', city: 'Detroit', country: 'United States' },
  { iata: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', country: 'United States' },
  { iata: 'FLL', name: 'Fort Lauderdale–Hollywood', city: 'Fort Lauderdale', country: 'United States' },
  { iata: 'GDL', name: 'Guadalajara International', city: 'Guadalajara', country: 'Mexico' },
  { iata: 'HAV', name: 'José Martí International', city: 'Havana', country: 'Cuba' },
  { iata: 'HNL', name: 'Daniel K. Inouye Intl', city: 'Honolulu', country: 'United States' },
  { iata: 'IAD', name: 'Washington Dulles Intl', city: 'Washington', country: 'United States' },
  { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'United States' },
  { iata: 'IND', name: 'Indianapolis International', city: 'Indianapolis', country: 'United States' },
  { iata: 'JAX', name: 'Jacksonville International', city: 'Jacksonville', country: 'United States' },
  { iata: 'JFK', name: 'John F. Kennedy Intl', city: 'New York', country: 'United States' },
  { iata: 'KIN', name: 'Norman Manley International', city: 'Kingston', country: 'Jamaica' },
  { iata: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'United States' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { iata: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States' },
  { iata: 'MBJ', name: 'Sangster International', city: 'Montego Bay', country: 'Jamaica' },
  { iata: 'MCI', name: 'Kansas City International', city: 'Kansas City', country: 'United States' },
  { iata: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'United States' },
  { iata: 'MDW', name: 'Chicago Midway', city: 'Chicago', country: 'United States' },
  { iata: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul Intl', city: 'Minneapolis', country: 'United States' },
  { iata: 'MSY', name: 'Louis Armstrong New Orleans', city: 'New Orleans', country: 'United States' },
  { iata: 'MTY', name: 'Monterrey International', city: 'Monterrey', country: 'Mexico' },
  { iata: 'NAS', name: 'Lynden Pindling Intl', city: 'Nassau', country: 'Bahamas' },
  { iata: 'OAK', name: 'Oakland International', city: 'Oakland', country: 'United States' },
  { iata: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'United States' },
  { iata: 'PBI', name: 'Palm Beach International', city: 'West Palm Beach', country: 'United States' },
  { iata: 'PDX', name: 'Portland International', city: 'Portland', country: 'United States' },
  { iata: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', country: 'United States' },
  { iata: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'United States' },
  { iata: 'PIT', name: 'Pittsburgh International', city: 'Pittsburgh', country: 'United States' },
  { iata: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama' },
  { iata: 'PUJ', name: 'Punta Cana International', city: 'Punta Cana', country: 'Dominican Republic' },
  { iata: 'RDU', name: 'Raleigh-Durham Intl', city: 'Raleigh', country: 'United States' },
  { iata: 'RSW', name: 'Southwest Florida Intl', city: 'Fort Myers', country: 'United States' },
  { iata: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'United States' },
  { iata: 'SAT', name: 'San Antonio International', city: 'San Antonio', country: 'United States' },
  { iata: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', country: 'United States' },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'United States' },
  { iata: 'SJC', name: 'San José Mineta Intl', city: 'San Jose', country: 'United States' },
  { iata: 'SJO', name: 'Juan Santamaría Intl', city: 'San José', country: 'Costa Rica' },
  { iata: 'SJU', name: 'Luis Muñoz Marín Intl', city: 'San Juan', country: 'Puerto Rico' },
  { iata: 'SLC', name: 'Salt Lake City Intl', city: 'Salt Lake City', country: 'United States' },
  { iata: 'SMF', name: 'Sacramento International', city: 'Sacramento', country: 'United States' },
  { iata: 'STL', name: 'St. Louis Lambert Intl', city: 'St. Louis', country: 'United States' },
  { iata: 'TPA', name: 'Tampa International', city: 'Tampa', country: 'United States' },
  { iata: 'YEG', name: 'Edmonton International', city: 'Edmonton', country: 'Canada' },
  { iata: 'YOW', name: 'Ottawa Macdonald–Cartier', city: 'Ottawa', country: 'Canada' },
  { iata: 'YUL', name: 'Montréal–Trudeau Intl', city: 'Montréal', country: 'Canada' },
  { iata: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },
  { iata: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada' },
  { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },

  // ── South America ───────────────────────────────────
  { iata: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia' },
  { iata: 'BSB', name: 'Brasília International', city: 'Brasília', country: 'Brazil' },
  { iata: 'CCS', name: 'Simón Bolívar Intl', city: 'Caracas', country: 'Venezuela' },
  { iata: 'CNF', name: 'Confins International', city: 'Belo Horizonte', country: 'Brazil' },
  { iata: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'GIG', name: 'Galeão International', city: 'Rio de Janeiro', country: 'Brazil' },
  { iata: 'GRU', name: 'São Paulo/Guarulhos', city: 'São Paulo', country: 'Brazil' },
  { iata: 'GYE', name: 'José Joaquín de Olmedo', city: 'Guayaquil', country: 'Ecuador' },
  { iata: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru' },
  { iata: 'MDE', name: 'José María Córdova', city: 'Medellín', country: 'Colombia' },
  { iata: 'MVD', name: 'Carrasco International', city: 'Montevideo', country: 'Uruguay' },
  { iata: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama' },
  { iata: 'SCL', name: 'Arturo Merino Benítez', city: 'Santiago', country: 'Chile' },
  { iata: 'UIO', name: 'Mariscal Sucre Intl', city: 'Quito', country: 'Ecuador' },
  { iata: 'VVI', name: 'Viru Viru International', city: 'Santa Cruz', country: 'Bolivia' },

  // ── Central Asia ────────────────────────────────────
  { iata: 'ALA', name: 'Almaty International', city: 'Almaty', country: 'Kazakhstan' },
  { iata: 'NQZ', name: 'Nursultan Nazarbayev Intl', city: 'Astana', country: 'Kazakhstan' },
  { iata: 'TAS', name: 'Islam Karimov Intl', city: 'Tashkent', country: 'Uzbekistan' },
];

/** Quick lookup map: IATA code → Airport */
const airportMap = new Map<string, Airport>();
for (const a of airports) {
  airportMap.set(a.iata, a);
}

/** Get airport by IATA code */
export function getAirport(iata: string): Airport | undefined {
  return airportMap.get(iata.toUpperCase());
}

/**
 * Search airports by query string.
 * Matches against IATA code, city name, airport name, and country.
 * Returns max `limit` results sorted by relevance.
 */
export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.length === 0) return [];

  const q = query.toLowerCase().trim();

  // Score each airport
  const scored: { airport: Airport; score: number }[] = [];

  for (const airport of airports) {
    const iata = airport.iata.toLowerCase();
    const city = airport.city.toLowerCase();
    const name = airport.name.toLowerCase();
    const country = airport.country.toLowerCase();

    let score = 0;

    // Exact IATA match = highest priority
    if (iata === q) {
      score = 100;
    }
    // IATA starts with query
    else if (iata.startsWith(q)) {
      score = 80;
    }
    // City starts with query
    else if (city.startsWith(q)) {
      score = 70;
    }
    // City contains query
    else if (city.includes(q)) {
      score = 50;
    }
    // Country starts with query
    else if (country.startsWith(q)) {
      score = 40;
    }
    // Airport name contains query
    else if (name.includes(q)) {
      score = 30;
    }
    // Country contains query
    else if (country.includes(q)) {
      score = 20;
    }

    if (score > 0) {
      scored.push({ airport, score });
    }
  }

  // Sort by score desc, then by city alphabetically
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.airport.city.localeCompare(b.airport.city);
  });

  return scored.slice(0, limit).map((s) => s.airport);
}
