alter table membership add column numeric_card_number int;
update membership set numeric_card_number = card_number::int where card_number ~ '^\s*[0-9]+\s*$' and card_number <> '0';
update membership set numeric_card_number = 18 where card_number = 'Carte n° 18.';
alter table membership drop column card_number;
alter table membership rename column numeric_card_number to card_number;
