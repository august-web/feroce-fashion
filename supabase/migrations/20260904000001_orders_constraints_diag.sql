-- TEMPORARY diagnostic (2/2): snapshot CHECK constraints on orders/order_items.
-- Dropped by the following migration once verified.
CREATE TABLE IF NOT EXISTS _orders_constraints_diag AS
SELECT conrelid::regclass::text AS table_name, conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid IN ('public.orders'::regclass, 'public.order_items'::regclass)
AND contype = 'c';
