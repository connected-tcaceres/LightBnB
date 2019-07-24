select r.*, p.* , avg(p_r.rating) as average_rating
from property_reviews p_r 
join reservations r on p_r.property_id = r.property_id
join properties p on p_r.property_id = p.id
where r.guest_id = 1 and end_date < now()::date
group by r.id, p.id
order by r.start_date
limit 10;