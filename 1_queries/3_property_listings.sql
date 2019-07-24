select p.*, avg(p_r.rating) as average_rating
from properties p
join property_reviews p_r on p.id = p_r.property_id
group by p.id
having avg(p_r.rating) >= 4
order by p.cost_per_night
LIMIT 10;