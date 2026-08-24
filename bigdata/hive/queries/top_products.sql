-- TOP_PRODUCTS: Ranks products by revenue and quantity sold
USE ecommerce_analytics;

SELECT product_id, SUM(amount) AS revenue, COUNT(*) AS units
FROM orders
GROUP BY product_id
ORDER BY revenue DESC
LIMIT 10;
