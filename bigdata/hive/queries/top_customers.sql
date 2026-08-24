-- TOP_CUSTOMERS: Finds high-value customers by lifetime spend
USE ecommerce_analytics;

SELECT customer_id, SUM(amount) AS spending, COUNT(*) AS orders
FROM orders
GROUP BY customer_id
ORDER BY spending DESC
LIMIT 10;
