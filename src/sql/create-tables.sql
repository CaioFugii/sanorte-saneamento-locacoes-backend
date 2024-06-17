CREATE TABLE completed_services (
  origin varchar(255),
  order_service varchar(255) unique,
  tss varchar(255),
  start_date TIMESTAMP,
  finish_date TIMESTAMP,
  address varchar(255),
  city varchar(255),
  status varchar(255),
  result varchar(255),
  created_at TIMESTAMP
);

CREATE TABLE pending_services (
  origin varchar(255),
  order_service varchar(255) unique,
  tss varchar(255),
  start_date TIMESTAMP,
  address varchar(255),
  city varchar(255),
  status varchar(255),
  created_at TIMESTAMP
);