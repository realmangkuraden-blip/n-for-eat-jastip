insert into public.products (category_id,name,slug,description,cost_price,selling_price,jastip_fee,stock,is_available,is_featured,is_bestseller,is_promo,prep_minutes)
values
('594875d5-383c-435c-8fad-502d070c3774','Nasi Ayam Crispy','nasi-ayam-crispy','Ayam crispy, nasi hangat, sambal dan lalapan.',18000,22000,5000,20,true,true,true,false,15),
('594875d5-383c-435c-8fad-502d070c3774','Seblak Komplit','seblak-komplit','Seblak gurih pedas dengan topping lengkap.',15000,19000,5000,20,true,true,false,false,15),
('d7f9fcd2-416f-4bca-b9ef-a11ffda98589','Kentang Goreng','kentang-goreng','Kentang goreng renyah dengan saus pilihan.',12000,15000,3000,30,true,false,false,false,10),
('1b1fe95b-a94e-45f6-ba7d-6173f4fc5623','Dessert Box Cokelat','dessert-box-cokelat','Dessert box cokelat creamy.',18000,23000,5000,15,true,true,false,true,5),
('aec14df9-1734-4eb9-9d9c-ee6df2dcfa4b','Es Kopi Susu','es-kopi-susu','Kopi susu creamy, dingin dan fresh.',14000,18000,4000,25,true,false,true,false,5),
('aec14df9-1734-4eb9-9d9c-ee6df2dcfa4b','Thai Tea','thai-tea','Thai tea creamy dengan rasa khas.',12000,16000,4000,25,true,false,false,false,5),
('483180b6-0c21-4ffc-9b0e-060cf0780b82','Paket Hemat Ayam + Es','paket-hemat-ayam-es','Paket nasi ayam crispy dan es minuman.',28000,34000,6000,10,true,true,false,true,15)
on conflict (slug) do update set description=excluded.description,selling_price=excluded.selling_price,jastip_fee=excluded.jastip_fee,stock=excluded.stock,is_available=true,is_featured=excluded.is_featured,is_bestseller=excluded.is_bestseller,is_promo=excluded.is_promo,updated_at=now();
