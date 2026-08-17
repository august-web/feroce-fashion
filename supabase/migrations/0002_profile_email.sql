-- Expose the auth email on public.profiles (auth.users.email is not readable via PostgREST),
-- so the admin customers view can display contact emails without the service role.
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,first_name,last_name,email) values(new.id,new.raw_user_meta_data->>'first_name',new.raw_user_meta_data->>'last_name',new.email); return new; end $$;

-- Keep the denormalized email in sync if a user changes their auth email.
create or replace function public.sync_profile_email() returns trigger language plpgsql security definer set search_path=public
as $$ begin update public.profiles set email = new.email where id = new.id; return new; end $$;
drop trigger if exists on_auth_user_email_update on auth.users;
create trigger on_auth_user_email_update after update of email on auth.users for each row execute procedure public.sync_profile_email();
