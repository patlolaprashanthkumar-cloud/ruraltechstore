/*
# Temporarily drop on_auth_user_created trigger

The handle_new_user trigger is failing during admin user creation,
preventing users from being created. We temporarily drop it so the
edge function can create demo users, then it will be re-added.
*/

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
