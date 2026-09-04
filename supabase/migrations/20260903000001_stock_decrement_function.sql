-- Atomic stock decrement function (products track stock in the `stock` column)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id
    AND stock >= p_quantity
    AND active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$ LANGUAGE plpgsql;
-- Grant execute to authenticated users (they'll call via Edge Function with service role)
GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INTEGER) TO service_role;
