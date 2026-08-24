-- AVERAGE_DELIVERY_TIME: Calculates average delivery time by location
USE ecommerce_analytics;

SELECT o.location, AVG(d.delivery_days) AS avg_delivery_days
FROM orders o JOIN delivery d ON o.order_id = d.order_id
WHERE o.status = 'delivered'
GROUP BY o.location;
