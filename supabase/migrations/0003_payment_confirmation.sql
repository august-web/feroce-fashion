-- Atomic order/payment confirmation used by the verified checkout webhook (service role only).
-- Idempotent: a payment already marked paid is a no-op, so webhook replays are safe.
create or replace function public.confirm_order_payment(p_payment_id uuid)
returns uuid -- the confirmed order id, or null when already handled / unknown
language plpgsql security definer set search_path=public
as $$
declare v_order_id uuid;
begin
  update public.payments
     set status = 'paid'
   where id = p_payment_id and status = 'pending'
   returning order_id into v_order_id;

  if v_order_id is null then
    return null;
  end if;

  update public.orders set status = 'paid' where id = v_order_id;

  update public.product_variants pv
     set inventory = greatest(0, pv.inventory - oi.quantity)
    from public.order_items oi
   where oi.order_id = v_order_id
     and oi.variant_id = pv.id;

  return v_order_id;
end $$;
revoke all on function public.confirm_order_payment(uuid) from public;
grant execute on function public.confirm_order_payment(uuid) to service_role;

-- Cancels a still-pending payment/order (e.g. expired provider session).
create or replace function public.cancel_order_payment(p_payment_id uuid)
returns uuid
language plpgsql security definer set search_path=public
as $$
declare v_order_id uuid;
begin
  update public.payments
     set status = 'cancelled'
   where id = p_payment_id and status = 'pending'
   returning order_id into v_order_id;

  if v_order_id is not null then
    update public.orders set status = 'cancelled' where id = v_order_id and status = 'pending';
  end if;

  return v_order_id;
end $$;
revoke all on function public.cancel_order_payment(uuid) from public;
grant execute on function public.cancel_order_payment(uuid) to service_role;
