CREATE EXTENSION IF NOT EXISTS pgcrypto;


DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;


# Database schema for restaurant reservation system

# users table
CREATE TABLE public.users (
  id uuid NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['customer'::text, 'owner'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

# restaurants table
CREATE TABLE public.restaurants (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  owner_id uuid NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  cuisine_type text NOT NULL,
  description text,
  phone text,
  opening_hours text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  city text,
  rating integer,
  CONSTRAINT restaurants_pkey PRIMARY KEY (id),
  CONSTRAINT restaurants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);

# reservations table
CREATE TABLE public.reservations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  restaurant_id bigint NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time without time zone NOT NULL,
  party_size integer NOT NULL CHECK (party_size > 0),
  status text NOT NULL DEFAULT 'booked'::text CHECK (status = ANY (ARRAY['booked'::text, 'cancelled'::text, 'completed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reservations_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id)
);

# reviews table
CREATE TABLE public.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  restaurant_id bigint NOT NULL,
  reservation_id bigint UNIQUE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT reviews_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
  CONSTRAINT reviews_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id)
);


# insert sample data into users table
INSERT INTO public.users (id, full_name, role) VALUES
INSERT INTO public.users (id, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Alice Johnson', 'customer'),
('22222222-2222-2222-2222-222222222222', 'Brian Lee', 'customer'),
('33333333-3333-3333-3333-333333333333', 'Catherine Nguyen', 'customer'),
('44444444-4444-4444-4444-444444444444', 'David Patel', 'customer'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Olivia Martinez', 'owner'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Noah Rivera', 'owner'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sophia Chen', 'owner');

# insert sample data into restaurants table
INSERT INTO public.restaurants (
  owner_id, name, address, cuisine_type,
  description, phone, opening_hours, image_url, city, rating
)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sunset Grill',
 '123 Main St, Tempe', 'American',
 'Casual dining and burgers',
 '480-111-1111', '10:00-22:00',
 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee',
 'Tempe', 4),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bella Roma',
 '45 University Dr, Tempe', 'Italian',
 'Authentic pasta and pizza',
 '480-222-2222', '11:00-23:00',
 'https://images.unsplash.com/photo-1521305916504-4a1121188589',
 'Tempe', 5),

('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Dragon Bowl',
 '78 Apache Blvd, Tempe', 'Chinese',
 'Traditional Chinese cuisine',
 '480-333-3333', '10:30-21:30',
 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
 'Tempe', 4),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Taco Fiesta',
 '19 Broadway Rd, Tempe', 'Mexican',
 'Street tacos and drinks',
 '480-444-4444', '09:00-21:00',
 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
 'Tempe', 4);


# insert sample data into reservations table
INSERT INTO public.reservations (
  user_id, restaurant_id,
  reservation_date, reservation_time,
  party_size, status
)
VALUES
('11111111-1111-1111-1111-111111111111', 1,
 '2026-04-05', '18:30', 2, 'booked'),

('22222222-2222-2222-2222-222222222222', 2,
 '2026-04-06', '19:00', 4, 'completed'),

('33333333-3333-3333-3333-333333333333', 3,
 '2026-04-07', '12:30', 3, 'completed'),

('44444444-4444-4444-4444-444444444444', 1,
 '2026-04-08', '20:00', 2, 'cancelled');

# insert sample data into reviews table
INSERT INTO public.reviews (
  user_id, restaurant_id, reservation_id,
  rating, comment, review_date
)
VALUES
('22222222-2222-2222-2222-222222222222', 2, 2,
 5, 'Amazing Italian food!', '2026-04-06'),

('33333333-3333-3333-3333-333333333333', 3, 3,
 4, 'Very authentic flavors.', '2026-04-07');