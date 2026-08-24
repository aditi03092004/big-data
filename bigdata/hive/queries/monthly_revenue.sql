-- MONTHLY_REVENUE: Summarizes revenue and order volume by month
USE ecommerce_analytics;

SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount) AS revenue
FROM orders
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY year, month;
