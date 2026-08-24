-- ORDERS_BY_LOCATION: Groups order activity by customer location
USE ecommerce_analytics;

SELECT location, COUNT(*) AS orders
FROM orders
GROUP BY location
ORDER BY orders DESC;
