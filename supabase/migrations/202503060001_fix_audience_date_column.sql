-- Ensure date_audience column exists on audiences table
alter table public.audiences
  add column if not exists date_audience timestamptz;

update public.audiences
set date_audience = coalesce(date_audience, now())
where date_audience is null;

alter table public.audiences
  alter column date_audience set not null;
