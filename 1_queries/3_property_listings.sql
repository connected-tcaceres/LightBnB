SELECT
  p.*,
  avg(p_r.rating) AS average_rating
FROM
  properties p
  JOIN property_reviews p_r ON p.id = p_r.property_id
GROUP BY
  p.id
HAVING
  avg(p_r.rating) >= 4
ORDER BY
  p.cost_per_night
LIMIT 10;

