/*
# Re-add on_auth_user_created trigger

Re-create the trigger that auto-creates a profile row when a new
auth user signs up. It was temporarily dropped to allow the edge
function to seed demo users via the Admin API.
*/

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
