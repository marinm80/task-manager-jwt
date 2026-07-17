-- Seed: cuenta admin y usuario de prueba
-- Los hashes fueron generados con bcrypt (10 rounds), nunca se guarda texto plano.

INSERT INTO "User" ("email", "password", "name", "role") VALUES
('euclidesm195@gmail.com', '$2b$10$Qgy9FArSIazGiXROBo6CEunZPFP4AoLm.a0zhXxa.sCVQ6csFE8rW', 'Euclides Marin', 'ADMIN'),
('guest@taskly.com', '$2b$10$DG7SEoZnT/6bFRDUoO2Rwu3G/her5WnNDp.C7NCJPgb6lwTJJYb3W', 'Guest', 'USER')
ON CONFLICT ("email") DO NOTHING;
