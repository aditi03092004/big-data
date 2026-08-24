-- REVENUE_BY_CATEGORY: Aggregates sales revenue across product categories
USE ecommerce_analytics;

SELECT p.category, SUM(o.amount) AS revenue
FROM orders o JOIN products p ON o.product_id = p.product_id
GROUP BY p.category
ORDER BY revenue DESC;
