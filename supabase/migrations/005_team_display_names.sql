-- Add short_location and short_name for split display on game cards
ALTER TABLE teams ADD COLUMN short_location text;
ALTER TABLE teams ADD COLUMN short_name text;

UPDATE teams SET short_location = 'Nepean',             short_name = 'Wildcats'       WHERE id = 'bbbb0001-0000-0000-0000-000000000001';
UPDATE teams SET short_location = 'Southpoint',         short_name = 'Stars'           WHERE id = 'bbbb0002-0000-0000-0000-000000000002';
UPDATE teams SET short_location = 'Peterborough',       short_name = 'Ice Kats'        WHERE id = 'bbbb0003-0000-0000-0000-000000000003';
UPDATE teams SET short_location = 'Markham-Stouffville', short_name = 'Stars'          WHERE id = 'bbbb0004-0000-0000-0000-000000000004';
UPDATE teams SET short_location = 'Scarborough',        short_name = 'Sharks'          WHERE id = 'bbbb0005-0000-0000-0000-000000000005';
UPDATE teams SET short_location = 'Toronto Leaside',    short_name = 'Wildcats'        WHERE id = 'bbbb0006-0000-0000-0000-000000000006';
UPDATE teams SET short_location = 'Napanee',            short_name = 'Crunch'          WHERE id = 'bbbb0007-0000-0000-0000-000000000007';
UPDATE teams SET short_location = 'North Bay',          short_name = 'Junior Lakers'   WHERE id = 'bbbb0008-0000-0000-0000-000000000008';
UPDATE teams SET short_location = 'Cornwall',           short_name = 'Typhoons'        WHERE id = 'bbbb0009-0000-0000-0000-000000000009';
UPDATE teams SET short_location = 'Durham West',        short_name = 'Lightning'       WHERE id = 'bbbb0010-0000-0000-0000-000000000010';
UPDATE teams SET short_location = 'Central York',       short_name = 'Panthers'        WHERE id = 'bbbb0011-0000-0000-0000-000000000011';
