-- Query 1---
INSERT INTO public.account 
  (account_firstname, account_lastname, account_email, account_password ) 
VALUES 
  ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n' );



--Query 2 ---
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

---Query 3 ---- DELETE Tony Stack from the  Database


--Query 4 -- 
--Replace the phrase in the sentence from 'small interiors' to 'a huge interior' in the 
--invdescription column
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE model = 'GM Hummer';



--Query 5 --  Selecting an object from the diffrent columns from two 
--distinct table using INER JOIN
SELECT inv.inv_make, inv.inv_model, c.classification_name  
FROM public.inventory inv  
INNER JOIN public.classification c  
	ON inv.classification_id = c.classification_id  
WHERE c.classification_name = 'Sport';


---Query 6 ---
--Updating or changing the path of the inventiry image data and thumbils 
-- include a folder call vehicle.
UPDATE public.inventory  
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),  
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');



