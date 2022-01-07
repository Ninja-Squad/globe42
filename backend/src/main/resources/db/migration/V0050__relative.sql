alter table child rename to relative;
alter sequence child_seq rename to relative_seq;
alter table relative add column type varchar;
update relative set type = 'CHILD';
alter table relative alter type set not null;
