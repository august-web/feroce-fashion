-- TEMPORARY diagnostic: snapshot orders/order_items column definitions
-- so the exact legacy schema can be inspected. Dropped after diagnosis.
CREATE TABLE IF NOT EXISTS _orders_columns_diag AS
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('orders', 'order_items');
