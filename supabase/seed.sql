-- ============================================================================
-- 532 — Seed data (run AFTER schema.sql + rls.sql)
-- The Next.js app ships with the full dataset in src/data/*.ts; this seed mirrors
-- the 16 host cities, fan hubs, and sample businesses for a live Supabase backend.
-- ============================================================================

insert into public.cities (slug, name, country, country_code, flag, tagline, stadium_name, stadium_capacity, stadium_neighborhood, match_count, timezone, currency, language, lat, lng) values
('toronto','Toronto','Canada','CA','🇨🇦','Canada''s host on the lake.','Toronto Stadium (BMO Field)',45000,'Exhibition Place',6,'America/Toronto','CAD','English / French',43.6332,-79.4185),
('vancouver','Vancouver','Canada','CA','🇨🇦','Mountains, ocean, and football.','BC Place',54500,'Downtown / Stadium-Chinatown',7,'America/Vancouver','CAD','English',49.2768,-123.1119),
('new-york-new-jersey','New York / New Jersey','United States','US','🇺🇸','The Final lives here.','MetLife Stadium',82500,'East Rutherford, NJ',8,'America/New_York','USD','English',40.8135,-74.0745),
('los-angeles','Los Angeles','United States','US','🇺🇸','Sun, stars, and the beautiful game.','SoFi Stadium',70000,'Inglewood',8,'America/Los_Angeles','USD','English / Spanish',33.9535,-118.3392),
('dallas','Dallas','United States','US','🇺🇸','Everything''s bigger.','AT&T Stadium',80000,'Arlington',9,'America/Chicago','USD','English / Spanish',32.7473,-97.0945),
('houston','Houston','United States','US','🇺🇸','Space City turns football city.','NRG Stadium',72000,'South Main / NRG Park',7,'America/Chicago','USD','English / Spanish',29.6847,-95.4107),
('atlanta','Atlanta','United States','US','🇺🇸','The South''s soccer capital.','Mercedes-Benz Stadium',75000,'Downtown',8,'America/New_York','USD','English',33.7554,-84.4008),
('miami','Miami','United States','US','🇺🇸','Where the world''s fans party.','Hard Rock Stadium',65000,'Miami Gardens',7,'America/New_York','USD','English / Spanish',25.9580,-80.2389),
('boston','Boston','United States','US','🇺🇸','Historic city, modern football.','Gillette Stadium',65000,'Foxborough',7,'America/New_York','USD','English',42.0909,-71.2643),
('philadelphia','Philadelphia','United States','US','🇺🇸','Brotherly love meets the game.','Lincoln Financial Field',69000,'South Philadelphia',6,'America/New_York','USD','English',39.9008,-75.1675),
('seattle','Seattle','United States','US','🇺🇸','Emerald City, electric crowds.','Lumen Field',69000,'SoDo / Downtown',6,'America/Los_Angeles','USD','English',47.5952,-122.3316),
('san-francisco-bay-area','San Francisco Bay Area','United States','US','🇺🇸','Tech capital, world stage.','Levi''s Stadium',68500,'Santa Clara',6,'America/Los_Angeles','USD','English / Spanish',37.4030,-121.9700),
('kansas-city','Kansas City','United States','US','🇺🇸','Heartland heat, world-class welcome.','Arrowhead Stadium',76000,'Truman Sports Complex',6,'America/Chicago','USD','English',39.0489,-94.4839),
('mexico-city','Mexico City','Mexico','MX','🇲🇽','The opening roar.','Estadio Azteca',87000,'Santa Úrsula, Coyoacán',5,'America/Mexico_City','MXN','Spanish',19.3029,-99.1505),
('guadalajara','Guadalajara','Mexico','MX','🇲🇽','Tequila country, football soul.','Estadio Akron',48000,'Zapopan',4,'America/Mexico_City','MXN','Spanish',20.6818,-103.4626),
('monterrey','Monterrey','Mexico','MX','🇲🇽','Mountains, industry, football fire.','Estadio BBVA',53500,'Guadalupe',4,'America/Mexico_City','MXN','Spanish',25.6690,-100.2443)
on conflict (slug) do nothing;

insert into public.fan_hubs (slug, country, flag, city_slug, members, description, vibe) values
('brazil-toronto','Brazil','🇧🇷','toronto',4820,'The largest Brazilian supporters'' community in Toronto.','Loud, joyful, all-ages'),
('mexico-los-angeles','Mexico','🇲🇽','los-angeles',9140,'El Tri''s heartland away from home.','Passionate, family-strong'),
('argentina-miami','Argentina','🇦🇷','miami',7330,'Albiceleste fans take over South Florida.','Electric, chant-heavy'),
('nigeria-vancouver','Nigeria','🇳🇬','vancouver',2210,'Super Eagles supporters in the Pacific Northwest.','Vibrant, welcoming'),
('england-new-york-new-jersey','England','🏴','new-york-new-jersey',6050,'Three Lions supporters across the boroughs.','Pub culture, banter'),
('germany-atlanta','Germany','🇩🇪','atlanta',1980,'Die Mannschaft fans gather in the South.','Organized, festive'),
('france-dallas','France','🇫🇷','dallas',2540,'Les Bleus supporters in the metroplex.','Stylish, spirited'),
('japan-seattle','Japan','🇯🇵','seattle',1670,'Samurai Blue fans in the Emerald City.','Respectful, colorful'),
('portugal-boston','Portugal','🇵🇹','boston',3120,'New England''s Portuguese community out in force.','Proud, deep-rooted'),
('colombia-houston','Colombia','🇨🇴','houston',2880,'Los Cafeteros fans bring cumbia to Space City.','Dancing, joyful')
on conflict (slug) do nothing;

-- Sample verified businesses (the full generated catalog lives in the app data layer)
insert into public.businesses (slug, name, category, city_slug, description, address, phone, email, hours, verification, plan, featured, rating, review_count, price_level, distance_from_stadium_km, tags) values
('golazo-cantina-toronto','Golazo Cantina Toronto','restaurants','toronto','532-verified restaurant near BMO Field with match-day specials.','120 King St, Toronto','+1 416-555-0142','hello@golazo.example.com','Daily 8:00 AM – 2:00 AM','verified','premium',true,4.7,612,2,0.9,'{Halal options,Open late,Match-day specials}'),
('verified-ride-co-vancouver','Verified Ride Co. Vancouver','safe-rides','vancouver','Background-checked drivers with live tracking and fixed pricing.','BC Place pickup zone, Vancouver','+1 604-555-0199','hello@verifiedride.example.com','24/7','verified','featured',true,4.8,341,2,0.4,'{Background-checked,Live tracking,Post-match pickup}'),
('fairrate-exchange-mexico-city','FairRate Exchange CDMX','currency-exchange','mexico-city','Licensed currency exchange with transparent live rates.','Centro Histórico, CDMX','+52 55-5555-0188','hello@fairrate.example.com','Mon–Sun 9:00 AM – 9:00 PM','verified','featured',true,4.6,208,1,2.3,'{Licensed,No hidden fees,Live rates}')
on conflict (slug) do nothing;

insert into public.alerts (city_slug, level, message, active) values
('toronto','warning','Heavy congestion expected near Gate 3 after the match. Use the north pickup zone.', true),
('mexico-city','info','Tren Ligero is running extra service for the opening match.', true)
on conflict do nothing;
