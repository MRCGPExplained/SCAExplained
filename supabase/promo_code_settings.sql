insert into settings (key, value) values ('PROMO_CODE_VALUE', '') on conflict (key) do nothing;
insert into settings (key, value) values ('PROMO_CODE_ACTIVE', 'false') on conflict (key) do nothing;
insert into settings (key, value) values ('PROMO_CODE_EXPIRY', '') on conflict (key) do nothing;
insert into settings (key, value) values ('PROMO_CODE_MAX_USES', '10') on conflict (key) do nothing;
insert into settings (key, value) values ('PROMO_CODE_USES', '0') on conflict (key) do nothing;
