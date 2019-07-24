select p.city as city, count(r.*) as total_reservations
from reservations r
join properties p on r.property_id = p.id
group by p.city
order by total_reservations DESC;