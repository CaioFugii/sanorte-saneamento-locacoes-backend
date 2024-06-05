CREATE TABLE completed_services (
  origin varchar(255),
  order_service varchar(255) unique,
  start_date Date,
  finish_date Date,
  address varchar(255),
  city varchar(255),
  status varchar(255),
  result varchar(255),
  created_at Date
);