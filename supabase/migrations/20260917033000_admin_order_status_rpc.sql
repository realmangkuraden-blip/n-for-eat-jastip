create or replace function public.admin_update_order_status(p_order_id uuid, p_status public.order_status, p_note text default null)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_old public.order_status;
  v_order_number text;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.admin_users where user_id=v_user and is_active=true) then raise exception 'Active admin required'; end if;
  select status, order_number into v_old, v_order_number from public.orders where id=p_order_id for update;
  if v_order_number is null then raise exception 'Order not found'; end if;
  if v_old = p_status then return jsonb_build_object('order_id',p_order_id,'order_number',v_order_number,'status',p_status); end if;
  update public.orders
    set status=p_status,
        updated_at=now(),
        completed_at=case when p_status='completed' then coalesce(completed_at,now()) else completed_at end,
        cancelled_at=case when p_status='cancelled' then coalesce(cancelled_at,now()) else cancelled_at end
    where id=p_order_id;
  insert into public.order_status_history(order_id,status,note,changed_by)
    values (p_order_id,p_status,coalesce(p_note,'Status diubah dari dashboard admin'),v_user);
  return jsonb_build_object('order_id',p_order_id,'order_number',v_order_number,'status',p_status);
end;
$$;

grant execute on function public.admin_update_order_status(uuid, public.order_status, text) to authenticated;
