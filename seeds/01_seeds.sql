INSERT INTO users (name, email, PASSWORD)
    VALUES
    ('tyler', 'tyler@gmail.com', 'password'),
    ('selin', 'selin@gmail.com', 'password'),
    ('anchen', 'anchen@gmail.com', 'password');
 
INSERT INTO properties (owner_id, title, description, cost_per_night, country, street, city, province, post_code)
    VALUES
    (1, 'tylers place', 'description', 100, 'country', 'street', 'city', 'province', 'postal code'),
    (2, 'selins place', 'description2', 200, 'country2', 'street2', 'city2', 'province2', 'postal code2'),
    (3, 'anchens place', 'description3', 300, 'country3', 'street3', 'city3', 'province3', 'postal code3');

INSERT INTO reservations (start_date, end_date, property_id,guest_id)
    VALUES
    ('2019-09-09','2019-09-10',1,1),
    ('2019-08-09','2019-08-10',2,2),
    ('2019-07-09','2019-07-10',3,3),
    ('2019-09-09','2019-07-10',3,3);

INSERT INTO property_reviews (guest_id, reservation_id, property_id, rating,message)
    VALUES
    (1,1,1,1,'good 1'),
    (2,2,2,2,'good 2'),
    (3,3,3,3,'good 3'),
    (3,3,3,6,'good 3');

