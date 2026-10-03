-- Lets customers pay by bank transfer as well as Paystack.
alter table public.orders
  add column if not exists payment_method text not null default 'paystack'
  check (payment_method in ('paystack', 'bank_transfer'));
