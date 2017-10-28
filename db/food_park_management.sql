CREATE TABLE public.food_park_manegement
(
    id SERIAL PRIMARY KEY,
    id_food_park integer NOT NULL,
    id_unit integer NOT NULL,
    FOREIGN KEY (id_food_park)
        REFERENCES public.food_parks (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_unit)
        REFERENCES public.units (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.food_park_manegement
    OWNER to sfez_rw;
COMMENT ON TABLE public.food_park_manegement
    IS 'This table represent the relationship that food parks are enable to see orders from units';
