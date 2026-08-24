-- CANCELLED_ORDERS: Tracks cancellation volume over time
USE ecommerce_analytics;

SELECT DATE(order_date) AS day, COUNT(*) AS cancelled
FROM orders
WHERE status = 'cancelled'
GROUP BY DATE(order_date)
ORDER BY day;
